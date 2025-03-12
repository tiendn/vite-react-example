import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  let vite;
  if (!isProduction) {
    // Create Vite server in middleware mode and configure the app type as
    // 'custom', disabling Vite's own HTML serving logic so parent server
    // can take control
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist/client')));
  }

  app.use("*", async (req, res) => {
    const url = req.originalUrl;

    try {
      let template;
      let render;
      
      if (!isProduction) {
        // 1. Read index.html
        template = fs.readFileSync(
          path.resolve(__dirname, "index.html"),
          "utf-8"
        );

        // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
        //    and also applies HTML transforms from Vite plugins
        template = await vite.transformIndexHtml(url, template);

        // 3. Load the server entry. ssrLoadModule automatically transforms
        //    ESM source code to be usable in Node.js
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(
          path.resolve(__dirname, 'dist/client/index.html'),
          'utf-8'
        );
        render = (await import('./dist/server/entry-server.js')).render;
      }

      // 4. render the app HTML
      const { html: appHtml } = await render(url);

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (!isProduction && vite) {
        // If an error is caught, let Vite fix the stack trace so it maps back
        // to your actual source code.
        vite.ssrFixStacktrace(e);
      }
      console.error(e);
      res.status(500).end(e.stack);
    }
  });

  app.listen(5173, () => {
    console.log("Server running at http://localhost:5173");
  });
}

createServer(); 