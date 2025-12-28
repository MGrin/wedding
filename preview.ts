import { serve } from "bun";
import path from "path";

const DIST_DIR = path.join(process.cwd(), "dist");

const server = serve({
  port: 4173,
  async fetch(req) {
    const url = new URL(req.url);
    let filePath = path.join(DIST_DIR, url.pathname);

    // Default to index.html for SPA routing or root
    if (url.pathname === "/" || !path.extname(filePath)) {
      filePath = path.join(DIST_DIR, "index.html");
    }

    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }

    // Fallback to index.html for SPA
    return new Response(Bun.file(path.join(DIST_DIR, "index.html")));
  },
});

console.log(`🌐 Preview server running at ${server.url}`);
