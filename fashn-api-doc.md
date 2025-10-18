IntroductionWelcome to the FASHN API
FASHN is an AI-first company specializing in human-centric generative image models tailored for fashion applications. The API provides developers and product teams with access to endpoints for image generation, virtual try-on, model creation, editing, background manipulation, and reframing functionalities.
Core Features
🪞 Clothing Virtual Try-OnOur in-house virtual try-on model, built from the ground up and periodically updated with improvements.📦 Product to ModelTransform product-only images into realistic visuals of people wearing those products🛠️ Developer FriendlySimple REST API with comprehensive guides and multiple language examples🔒 Enterprise GradeSecure, scalable infrastructure with robust data privacy controls
Our flagship Virtual Try-On (VTON) model allows users to see how clothing would look on a person without physically wearing it. Using AI, our API takes a photo of a person and a garment, then generates a realistic image showing how the clothing would appear on that person.
The FASHN API also includes several other powerful fashion-oriented generative endpoints:
👤 Model CreateGenerate realistic fashion models using simple textual prompts or reference images🎭 Face to ModelTransform face images into try-on ready upper-body avatars for virtual try-on applications🎬 Image to VideoCreate short videos from a single image with tasteful camera work and model movements tailored for fashion.🔄 Model SwapReplace existing models in images while preserving garments📐 ReframeAutomatically expand or reformat image composition, with directional or aspect-ratio-based reframing🖼️ Background ChangeReplace image backgrounds while preserving foreground subjects with natural harmonization

FASHN Virtual Try-On v1.6Virtual Try-On v1.6 enables realistic garment visualization using just a single photo of a person and a garment. It’s our most advanced AI model for try-on experiences, designed to deliver high-quality, detailed results with minimal setup.
Model Specifications
Model Name: tryon-v1.6
Lifecycle: stable
Processing Resolution: 864×1296 pixels
Processing Time:

Performance: 5 seconds
Balanced: 8 seconds
Quality: 12–17 seconds (variable depending on input resolution)


Credits: 1 per image

Request
Generate a virtual try-on by submitting your model and garment images to the universal /v1/run endpoint:
POSThttps://api.fashn.ai/v1/runRequest ExamplescURLJavaScriptPythoncurl -X POST https://api.fashn.ai/v1/run \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -d '{
           "model_name": "tryon-v1.6",
           "inputs": {
             "model_image": "http://example.com/path/to/model.jpg",
             "garment_image": "http://example.com/path/to/garment.jpg"
           }
         }'Response200Returns a prediction ID for status polling:Response{
  "id": "123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1",
  "error": null
}
Request Parameters
Required Parameters
model_imageRequiredimage URL | base64Primary image of the person on whom the virtual try-on will be performed.Models Studio users can use their saved models by passing saved:<model_name>.
garment_imageRequiredimage URL | base64Reference image of the clothing item to be tried on the model_image.
Base64 FormatBase64 images must include the proper prefix (e.g., data:image/jpg;base64,<YOUR_BASE64>)
Optional Parameters
category'auto' | 'tops' | 'bottoms' | 'one-pieces'Use auto to enable automatic classification of the garment type. For flat-lay or ghost mannequin images, the system detects the garment type automatically. For on-model images, full-body shots default to a full outfit swap. For focused shots (upper or lower body), the system selects the most likely garment type (tops or bottoms).Default: auto
segmentation_freebooleanDirect garment fitting without clothing segmentation, enabling bulkier garment try-ons with improved preservation of body shape and skin texture. Set to false if original garments are not removed properly.Default: true
moderation_level'conservative' | 'permissive' | 'none'Sets the content moderation level for garment images.-conservative enforces stricter modesty standards suitable for culturally sensitive contexts. Blocks underwear, swimwear, and revealing outfits.
-permissive allows swimwear, underwear, and revealing garments, while still blocking explicit nudity.-none disables all content moderationDefault: permissive
Responsible Use NoticeThis technology is designed for ethical virtual try-on applications. Misuse—such as generating inappropriate imagery without consent—violates our Terms of Service.Setting moderation_level: none does not remove your responsibility for ethical and lawful use. Violations may result in service denial.
garment_photo_typeauto | flat-lay | modelSpecifies the type of garment photo to optimize internal parameters for better performance. 'model' is for photos of garments on a model, 'flat-lay' is for flat-lay or ghost mannequin images, and 'auto' attempts to automatically detect the photo type.Default: auto
modeperformance | balanced | qualitySpecifies the mode of operation.-performance mode is faster but may compromise quality
-balanced mode is a perfect middle ground between speed and quality-quality mode is slower, but delivers the highest quality results.Default: balanced
seedintSets random operations to a fixed state. Use the same seed to reproduce
results with the same inputs, or different seed to force different results.Default: 42Min: 0 Max: 2^32 - 1
num_samplesintNumber of images to generate in a single run. Image generation has a random
element in it, so trying multiple images at once increases the chances of
getting a good result.Default: 1 Min: 1 Max: 4
output_format'png' | 'jpeg'Specifies the desired output image format.-png: Delivers the highest quality image, ideal for use cases such as content creation where quality is paramount.
-jpeg: Provides a faster response with a slightly compressed image, more suitable for real-time applications like consumer virtual try-on experiences.Default: png
return_base64booleanWhen set to true, the API will return the generated image as a base64-encoded string instead of a CDN URL. The base64 string will be prefixed according to the output_format (e.g., data:image/png;base64,... or data:image/jpeg;base64,...).This option offers enhanced privacy as user-generated outputs are not stored on our servers when return_base64 is enabled.Default: false
Response Polling
After submitting your request, poll the status endpoint using the returned prediction ID. See API Fundamentals for complete polling details.
Successful Response
When your virtual try-on completes successfully, the status endpoint will return:
{
  "id": "123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1",
  "status": "completed",
  "output": [
    "https://cdn.fashn.ai/123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1/output_0.png"
  ],
  "error": null
}
The output array contains URLs to your generated try-on images showing the model wearing the specified garment. The number of images depends on the num_samples parameter (default: 1).
Runtime Errors
If an error occurs during inference (while running the model), the API will return a 200 status code with a prediction status: failed.
Additionally, an error object will be included under the error key in the response.
NameCauseSolutionImageLoadErrorThe pipeline was unable to load the model or garment image from the provided inputs.For Image URLs: Ensure the URL is publicly accessible and not restricted by permissions.Verify that the Content-Type header specifies the correct image format (e.g., image/jpeg, image/png).For Base64-encoded images: Prefix the string with data:image/format;base64, where format is the image type (e.g., jpeg, png).ContentModerationErrorProhibited content detected in the provided garment image based on your current moderation settings.If your use case allows, adjust moderation_level to permissive or none.Setting moderation_level: none disables content moderation but does not remove your responsibility to ensure ethical and lawful use, as outlined in our Terms of Service.Misuse of this technology—such as generating inappropriate imagery of individuals without consent—may result in service denial.PoseErrorThe pipeline was unable to detect a body pose in either the model image or the garment image (if the garment_photo_type is set to model).Improve the quality of the model or garment image by following our model photo guidelines.PipelineErrorAn unexpected error occurred during the execution of the pipeline.Retry the request (you will not be charged for failed attempts). If the issue persists, please reach out to us at support@fashn.ai and include the prediction ID from the failed attempt to help us locate and address the issue promptly.ThirdPartyErrorA third-party processor failed or refused to handle the request.Most likely caused by content restrictions enforced by supporting services (e.g., image captioning). If that’s the case, try modifying your image inputs. If the issue persists across different inputs, contact support@fashn.ai with the prediction ID.
The Error Object
{
  "error": {
    "name": "PipelineError",
    "message": "The error message"
  }
}
Example of an error when polling the /status endpoint:
{
  "id": "123a87r9-4129-4bb3-be18-9c9fb5bd7fc1-u1",
  "status": "failed",
  "error": {
    "name": "ImageLoadError",
    "message": "Error loading model image: The URL's Content-Type is not an image. Content-Type: text/plain;charset=UTF-8"
  }
}

------

Try-On JavaScript QuickstartBelow is a minimal JavaScript snippet to demonstrate how to:

POST to the /run endpoint with your input data.
Poll the /status/<ID> endpoint until the prediction is completed.
Retrieve the final results from the "output" field.

For detailed documentation (including advanced parameters and usage), please refer to:

Virtual Try-On v1.6 Documentation
tryon-nextjs-app (interactive Next.js example)


Minimal JavaScript Example
This snippet demonstrates a basic request using model and garment image URLs. You can also adapt the code to send local images in Base64 format.
// 1. Set up the API key and base URL
const API_KEY = process.env.FASHN_API_KEY;
if (!API_KEY) {
    throw new Error("Please set the FASHN_API_KEY environment variable.");
}
const BASE_URL = "https://api.fashn.ai/v1";
 
// 2. POST request to /run
const inputData = {
    model_name: "tryon-v1.6",
    inputs: {
        model_image: "http://example.com/path/to/model.jpg",
        garment_image: "http://example.com/path/to/garment.jpg"
    }
};
 
const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
};
 
async function runPrediction() {
    try {
        // Make the initial run request
        const runResponse = await fetch(`${BASE_URL}/run`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(inputData)
        });
        const runData = await runResponse.json();
        const predictionId = runData.id;
        console.log("Prediction started, ID:", predictionId);
 
        // Poll for status
        while (true) {
            const statusResponse = await fetch(`${BASE_URL}/status/${predictionId}`, {
                headers: headers
            });
            const statusData = await statusResponse.json();
 
            if (statusData.status === "completed") {
                console.log("Prediction completed.");
                console.log(statusData.output);
                break;
            } else if (["starting", "in_queue", "processing"].includes(statusData.status)) {
                console.log("Prediction status:", statusData.status);
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                console.log("Prediction failed:", statusData.error);
                break;
            }
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}
 
// Run the prediction
runPrediction();


------

Image Preprocessing Best PracticesTo ensure optimal performance and consistent outputs when using the FASHN API, it’s important to preprocess your images. By following these guidelines, you can prevent issues like large payloads or inconsistent results.

Recommended Steps


Resize

If your image height exceeds 2000px, reduce it to 2000px or less.
Maintain aspect ratio to avoid distortion.
Use a quality-preserving downsampling technique (e.g., LANCZOS or INTER AREA) for best results.



Convert to JPEG

Use a quality setting of around 95 to balance file size and image clarity.



Upload to a CDN

Instead of embedding large base64 strings in your request, upload the processed image to a CDN, and provide the image URL in your API request




Following these best practices helps ensure that your requests reach our servers without issues, leading to faster response times and more consistent results with the FASHN Web App.

-----


Try-On ParametersModel Image
image URL | base64
model_image is the primary image of the person on whom the virtual try-on will be performed. You can provide the image as a publicly accessible URL or a base64 string.

💡 Mode TipsUse mode: performance to quickly test and find model and garment combinations that work well. Once you're satisfied, switch to mode: quality to produce a final high-quality result ready for publishing.
*Tips for selecting the best model image and avoiding common issues.
Garment Image
image URL | base64
garment_image is the reference image of the clothing item to be tried on the model_image. The image can be provided as a URL or a base64 string. FASHN supports a variety of garment photo types, as shown below:

*Infographic displaying supported garment image types ranked from best (left)
to worst (right).
💡 Image Handling TipsRead Image Preprocessing Best Practices to ensure your requests reach our servers fast and without issues
Common Image IssuesFor Image URLs:
Ensure the URL is publicly accessible without permission restrictions.
Confirm the Content-Type header matches the image format (e.g., image/jpeg, image/png).
For Base64 Images:
Prefix the string with data:image/<format>;base64, where <format> is the image type (e.g., jpeg, png).

Category
'auto' | 'tops' | 'bottoms' | 'one-pieces'
Specifies the type of garment in the garment_image to apply to the model_image. If the garment image includes multiple items (e.g., a t-shirt and jeans), use this parameter to select which item to apply.

auto (recommended): Automatically determines the garment category. For flat-lay or ghost mannequin images, garment type detection is automatic. For on-model images, full-body shots default to swapping the entire outfit, and focused shots (upper or lower body) select the most likely garment type (tops or bottoms).
tops: Specifies garments for the upper body (e.g., shirts, blouses).
bottoms: Specifies garments for the lower body (e.g., pants, skirts).
one-pieces: Specifies single-piece garments or full-body garments (e.g., dresses, jumpsuits).


*Examples of try-on results for categories 'tops', 'bottoms', and
'one-pieces'.
Mode
performance | balanced | quality
The mode parameter determines the trade-off between processing speed and output quality:

performance: Fastest, with reduced image quality.
balanced: A middle ground, offering a good balance between speed and quality.
quality: Slowest, delivering the highest-quality results.


*Side-by-side comparison of results for 'performance', 'balanced', and
'quality' modes.
💡 Mode TipsUse mode: performance to quickly test and find model and garment combinations that work well. Once you're satisfied, switch to mode: quality to produce a final high-quality result ready for publishing.
Garment Photo Type
auto | model | flat-lay
Defines the garment photo type for optimal performance:

model: Photos of garments on a model.
flat-lay: Flat-lay or ghost mannequin images.
auto: Automatically detects the photo type.

flat-lay is required for precise handling of flat-lay images where elements like back neck labels or size tags should be excluded.

*Comparison of 'flat-lay' and 'model' configurations with flat-lay input.
Number of Samples
integer
The num_samples parameter specifies how many images to generate in a single run. By increasing num_samples, you can explore multiple variations simultaneously, improving the likelihood of achieving a desirable result.
Because num_samples introduces diversity within a batch, its practical effect is similar to running multiple trials with different seeds. However, when used with the same seed value, the results remain reproducible for a given num_samples count.
💡 FASHN TipGreat try-on results might just be a seed change away! Conversely, a poor outcome doesn't necessarily mean the input combination won't work—sometimes a simple seed change can make all the difference. Use num_samples: 2-4 along with mode: performance to quickly test multiple seeds and assess how sensitive your inputs are to seed variation.
Seed
integer
Default: 42
Min: 0, Max: 2^32 - 1
The seed parameter is used to set the random operations within the image generation process to a fixed state. This is crucial for reproducibility:

Use the same seed value with the same inputs to consistently generate the exact same try-on result.
Use a different seed value with the same inputs to force different variations of the try-on result. This is useful for exploring different aesthetic outcomes without changing your core model_image or garment_image.

Segmentation Free
boolean
Default: true
When set to true, this parameter enables direct garment fitting without requiring explicit clothing segmentation from the input images. This is particularly useful for achieving a more natural look with bulkier garments, as it aims to preserve the model's body shape and skin texture more effectively. If you observe issues where the original garments are not properly removed in the try-on result, and it is critical for your use-case, set this to false.
Moderation Level
'conservative' | 'permissive' | 'none'
Default: permissive
This parameter allows you to set the content moderation standards for the garment images processed by the API.

conservative: Enforces stricter modesty standards, suitable for culturally sensitive contexts. It is designed to block images of underwear, swimwear, and revealing outfits.
permissive: This is the default setting. It allows images of swimwear, underwear, and revealing garments, but still blocks explicit nudity.
none: Disables all content moderation.

Responsible Use NoticeThis technology is designed for ethical and appropriate virtual try-on applications. Misuse—such as generating inappropriate imagery of individuals without consent—violates our Terms of Service.Setting moderation_level: none does not absolve users from their responsibility to ensure ethical and lawful use. Violations may result in service denial.
Output Format
'png' | 'jpeg'
Default: png
This parameter specifies the desired format of the generated output image:

png: Delivers the highest quality image, making it ideal for use cases where image fidelity is paramount, such as content creation, marketing materials, or high-resolution displays.
jpeg: Provides a faster response time with a slightly compressed image. This format is more suitable for real-time applications like consumer-facing virtual try-on experiences where speed is a priority over uncompressed quality.

Return Base64
boolean
Default: false
When set to true, the API will return the generated image directly as a base64-encoded string in the response body, instead of providing a CDN (Content Delivery Network) URL. The base64 string will be appropriately prefixed according to the chosen output_format (e.g., data:image/png;base64,... or data:image/jpeg;base64,...).
This option offers enhanced privacy, as it means user-generated outputs are not stored on Fashn.ai's servers when return_base64 is enabled, giving users more control over their data.


