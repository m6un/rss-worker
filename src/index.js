/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { DOMParser } from 'xmldom';

export default {
	async fetch(request) {
		try {
			const data = await parseFeed('https://blog.samaltman.com/posts.atom');
			return new Response(JSON.stringify(data), {
				headers: { 'Content-Type': 'application/json' }
			});
		} catch (err) {
			return new Response(err.message, { status: 500 });
		}
	},
};

async function parseFeed(url) {
	const response = await fetch(url);
	const text = await response.text();
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(text, "application/xml");

	if (xmlDoc.getElementsByTagName("rss").length) {
		const items = xmlDoc.getElementsByTagName("item");
		return Array.from(items).map(item => ({
			title: item.getElementsByTagName("title")[0]?.textContent || "No Title",
			link: item.getElementsByTagName("link")[0]?.textContent,
			pubDate: item.getElementsByTagName("pubDate")[0]?.textContent,
			guid: item.getElementsByTagName("guid")[0]?.textContent
		})).filter(item => )
	} else if (xmlDoc.getElementsByTagName("feed").length) {
		const entries = xmlDoc.getElementsByTagName("entry");
		return Array.from(entries).map(entry => ({
			title: entry.getElementsByTagName("title")[0]?.textContent || "No Title",
			link: entry.getElementsByTagName("link")[0]?.getAttribute("href"),
			pubDate: entry.getElementsByTagName("updated")[0]?.textContent,
			id: entry.getElementsByTagName("id")[0]?.textContent
		}));
	}
	throw new Error("Unsupported feed format");
}
