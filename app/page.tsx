"use client";
import { useState, useEffect } from "react";
import { Model, useController, AsyncResult } from "@liamzebedee/stateman.js";
import { AppController } from "./controller";

let appController = new AppController();



export default function Home() {
  const controller = useController(appController);
  const [lumaLink, setLumaLink] = useState("");
  const [tweet, setTweet] = useState("");

  const handleGenerateTweet = async () => {
    if (lumaLink) {
      await controller.scrapeEventData(lumaLink);
      const tweet = controller.generateTweet();
      setTweet(tweet);
    }
  };

  const handlePostTweet = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(tweetUrl, '_blank');
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-white">
      <h1 className="text-2xl font-bold mb-2 text-black">Luma Event Tweet Generator</h1>
      
      <div className="w-full max-w-xl space-y-4">
        <div>
          <label htmlFor="lumaLink" className="block text-sm font-medium mb-2 text-black">
            Luma Event Link
          </label>
          <input
            id="lumaLink"
            type="text"
            value={lumaLink}
            onChange={(e) => setLumaLink(e.target.value)}
            placeholder="Enter your Luma event link"
            className="w-full p-3 border rounded text-black h-12 text-lg"
          />
        </div>

        <button
          onClick={handleGenerateTweet}
          className="w-full bg-blue-500 text-white py-4 px-6 rounded hover:bg-blue-600 text-lg font-medium mt-4"
          disabled={controller.state.scrapeState.status === "pending"}
        >
          {controller.state.scrapeState.status === "pending" ? "Scraping..." : "Scrape and Generate Tweet"}
        </button>

        <div>
          <strong>{controller.state.eventName}</strong>
        </div>
        <div>
          <strong>{controller.state.location}</strong>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-black">Generated Tweet</label>
          <textarea
            value={tweet}
            readOnly
            className="w-full p-3 border rounded text-black h-64 text-lg"
            rows={12}
          />
        </div>

        <button
          onClick={handlePostTweet}
          className="w-full bg-green-500 text-white py-4 px-6 rounded hover:bg-green-600 text-lg font-medium"
        >
          Post Tweet
        </button>
      </div>
    </div>
  );
}
