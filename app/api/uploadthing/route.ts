import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

/**
 * UploadThing API Route Handler
 *
 * Handles GET and POST requests for file uploads
 * Endpoint: /api/uploadthing
 */

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Optional config
  config: {
    // Log all uploads to console
    logLevel: "Info",
  },
});
