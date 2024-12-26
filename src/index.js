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

/**
 * Exports the default Worker logic
 */
export default {
	async fetch(request, env) {
		// Query the feeds table for user_id=1
		const { results } = await env.DB
			.prepare("SELECT url, last_parsed FROM feeds WHERE user_id=?")
			.bind(1)
			.all();

		// Parse all feeds in parallel, passing last_parsed to parseFeed.
		const feedsData = await Promise.all(
			results.map(row => parseFeed(row.url, row.last_parsed, env))
		);
		return new Response(JSON.stringify(feedsData), {
			headers: { 'Content-Type': 'application/json' }
		});
	},
};

/**
 * parseFeed fetches and parses RSS or Atom feeds using xmldom
 */
async function parseFeed(url, lastParsed, env) {
	const response = await fetch(url);
	const text = await response.text();
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(text, "application/xml");

	// Check for RSS
	if (xmlDoc.getElementsByTagName("rss").length) {
		var items = Array.from(xmlDoc.getElementsByTagName("item")).map(item => ({
			title: item.getElementsByTagName("title")[0]?.textContent || "No Title",
			link: item.getElementsByTagName("link")[0]?.textContent,
			pubDate: item.getElementsByTagName("pubDate")[0]?.textContent,
			guid: item.getElementsByTagName("guid")[0]?.textContent,
			content: item.getElementsByTagName("description")[0]?.textContent || ""
		}));
	}
	// Check for Atom
	else if (xmlDoc.getElementsByTagName("feed").length) {
		var items = Array.from(xmlDoc.getElementsByTagName("entry")).map(entry => ({
			title: entry.getElementsByTagName("title")[0]?.textContent || "No Title",
			link: entry.getElementsByTagName("link")[0]?.getAttribute("href"),
			pubDate: entry.getElementsByTagName("updated")[0]?.textContent,
			id: entry.getElementsByTagName("id")[0]?.textContent,
			content: entry.getElementsByTagName("content")[0]?.textContent || ""
		}));
	} else {
		throw new Error("Unsupported feed format");
	}

	// Filter out items older than last_parsed
	if (lastParsed) {
		items = items.filter(item => {
			// Use 'pubDate' or fallback to 'updated' if needed
			const dateStr = item.pubDate || item.updated;
			return new Date(dateStr) > new Date(lastParsed);
		});
	}

	// Summarize each item's content in no more than 30 words
	items = await Promise.all(
		items.map(async item => {
			item.summary = await getSummaryViaAi(item.content, env);
			return item;
		})
	);

	return items;
}

// AI summarizer function
async function getSummaryViaAi(content, env) {
	const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
		messages: [
			{ role: 'system', content: 'Summarize the text in 30 words or fewer. Only provide the summary. No disclaimers, no references to the user or text, and no mention of word count. Output only the summary.' },
			{ role: 'user', content }
		]
	});
	return response.response;
}
