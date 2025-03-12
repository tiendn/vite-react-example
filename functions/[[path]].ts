import * as ReactDOMServer from "react-dom/server.browser";
import * as ReactRouterDOM from "react-router-dom/server";
import * as React from "react";
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
		// Use the full URL to fetch the asset
		const assetUrl = new URL("/index.html", url.origin);
		const html = await env.ASSETS.fetch(new Request(assetUrl)).then((res: Response) =>
			res.text()
		);

		// Create the React element
		const element = React.createElement(
			ReactRouterDOM.StaticRouter,
			{ location: url.pathname },
			React.createElement(App)
		);

		// Render the app using renderToReadableStream
		const stream = await ReactDOMServer.renderToReadableStream(element);
		const appHtml = await new Response(stream).text();

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
