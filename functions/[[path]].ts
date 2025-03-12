import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import React from "react";
import App from "../src/App";

export async function onRequest(context: any) {
	const { request } = context;
	const url = new URL(request.url);

	try {
		// Read the index.html template
		const html = await context.env.ASSETS.fetch(new Request("index.html")).then(
			(res: Response) => res.text()
		);

		// Create the React element
		const element = React.createElement(
			StaticRouter,
			{ location: url.pathname },
			React.createElement(App)
		);

		// Render the app
		const appHtml = renderToString(element);

		// Insert the rendered app into the template
		const finalHtml = html.replace("<!--ssr-outlet-->", appHtml);

		return new Response(finalHtml, {
			headers: { "content-type": "text/html;charset=UTF-8" },
		});
	} catch (error: any) {
		return new Response(`Error: ${error.message}`, { status: 500 });
	}
}
