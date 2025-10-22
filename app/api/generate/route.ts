import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Fashn API v1.6 integration with polling
async function generateWithFashn(
  personImageUrl: string,
  garmentImageUrl: string,
  category: string,
  mode: string
) {
  // Step 1: Submit the generation request
  const runResponse = await fetch(`${process.env.FASHN_API_ENDPOINT}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
    },
    body: JSON.stringify({
      model_name: 'tryon-v1.6',
      inputs: {
        model_image: personImageUrl,
        garment_image: garmentImageUrl,
        category: category.toLowerCase(), // 'tops', 'bottoms', 'one-pieces'
        mode: mode, // 'performance', 'balanced', 'quality'
        segmentation_free: true,
        moderation_level: 'permissive',
        garment_photo_type: 'auto',
        num_samples: 1,
        output_format: 'jpeg', // Faster for web
      },
    }),
  });

  if (!runResponse.ok) {
    const error = await runResponse.json();
    throw new Error(error.message || 'Failed to start try-on generation');
  }

  const runData = await runResponse.json();
  const predictionId = runData.id;

  if (!predictionId) {
    throw new Error('No prediction ID returned from Fashn API');
  }

  // Step 2: Poll for completion
  const maxAttempts = 40; // 40 attempts * 3 seconds = 2 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

    const statusResponse = await fetch(
      `${process.env.FASHN_API_ENDPOINT}/status/${predictionId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.FASHN_API_KEY}`,
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error('Failed to check generation status');
    }

    const statusData = await statusResponse.json();

    if (statusData.status === 'completed') {
      if (!statusData.output || statusData.output.length === 0) {
        throw new Error('Generation completed but no output received');
      }
      return {
        id: predictionId,
        output: statusData.output, // Array of URLs
        status: 'completed',
      };
    } else if (statusData.status === 'failed') {
      // Handle Fashn-specific errors
      const errorName = statusData.error?.name || 'Unknown';
      const errorMessage = statusData.error?.message || 'Generation failed';
      throw new Error(`${errorName}: ${errorMessage}`);
    } else if (!['starting', 'in_queue', 'processing'].includes(statusData.status)) {
      throw new Error(`Unexpected status: ${statusData.status}`);
    }

    attempts++;
  }

  throw new Error('Generation timeout - please try again');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Verify payment was successful
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Extract metadata
    const { mode, personImageUrl, garmentImageUrl, category } = session.metadata as {
      mode: string;
      personImageUrl: string;
      garmentImageUrl: string;
      category: string;
    };

    // Validate inputs
    if (!mode || !personImageUrl || !garmentImageUrl || !category) {
      return NextResponse.json(
        { error: 'Missing required generation parameters' },
        { status: 400 }
      );
    }

    // Generate try-on using Fashn API v1.6
    const result = await generateWithFashn(
      personImageUrl,
      garmentImageUrl,
      category,
      mode
    );

    return NextResponse.json({
      success: true,
      output_url: result.output[0], // First image URL
      output: result.output, // All output URLs (for multiple samples)
      id: result.id,
    });
  } catch (error: any) {
    console.error('Generation error:', error);

    // Return user-friendly error messages
    let errorMessage = 'Failed to generate try-on';

    if (error.message.includes('ImageLoadError')) {
      errorMessage = 'Could not load images. Please ensure they are accessible.';
    } else if (error.message.includes('ContentModerationError')) {
      errorMessage = 'Content moderation check failed. Please use appropriate images.';
    } else if (error.message.includes('PoseError')) {
      errorMessage = 'Could not detect pose. Please use a clear full-body photo.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Generation is taking longer than expected. Please try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
