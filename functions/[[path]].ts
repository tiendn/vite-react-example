import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../src/App";

interface Env {
	ASSETS: {
		fetch: (req: Request) => Promise<Response>;
	};
}

interface Context {
	request: Request;
	env: Env;
}

export async function onRequest(context: Context) {
	const { request, env } = context;
	const url = new URL(request.url);

	try {
		// Read the index.html template
		const assetUrl = new URL("/index.html", url.origin);
		const html = await env.ASSETS.fetch(new Request(assetUrl)).then((res: Response) =>
			res.text()
		);

		// Create the React element
		const element = React.createElement(
			StaticRouter,
			{ location: url.pathname },
			React.createElement(App)
		);

		// Render the app
		const appHtml = ReactDOMServer.renderToString(element);

		// Insert the rendered app into the template
		const finalHtml = html.replace("<!--ssr-outlet-->", appHtml);

		return new Response(finalHtml, {
			headers: { "content-type": "text/html;charset=UTF-8" },
		});
	} catch (error: unknown) {
		console.error("SSR Error:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
		return new Response(`Server Error: ${errorMessage}`, {
			status: 500,
			headers: { "content-type": "text/plain;charset=UTF-8" },
		});
	}
}
