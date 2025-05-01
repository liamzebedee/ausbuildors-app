
import { Model, useController, AsyncResult } from "@liamzebedee/stateman.js";

interface AppState {
  lumaLink: string;
  eventName: string;
  startAt: string;
  location: string;
  scrapeState: AsyncResult<null>
}

export class AppController extends Model<AppState> {
  constructor() {
    super({
      lumaLink: "",
      eventName: "",
      startAt: "",
      location: "",
      scrapeState: {
        status: "idle",
        error: null,
        data: null,
      }
    });
  }

  async scrapeEventData(lumaLink: string) {
    this.state.scrapeState.status = "pending";
    const response = await fetch('/api/scrape-luma-event?link=' + encodeURIComponent(lumaLink));
    if (!response.ok) {
      throw new Error('Failed to fetch event data');
    }
    
    const data = await response.json();
    const eventName = data.title;
    const startAt = data.startAt;

    this.state.lumaLink = lumaLink;
    this.state.eventName = eventName;
    this.state.startAt = startAt;
    this.state.scrapeState.status = "idle";
  }

  generateTweet(): string {
    const startAt = new Date(this.state.startAt);
    const locations = ['SYDNEY', 'BRISBANE'];

    // get location from event name
    let location = this.state.eventName.toUpperCase().split(' ').find(word => locations.includes(word));
    if (!location) {
      // assume sydney
      location = 'SYDNEY';
    }

    this.state.location = location;

    const year = startAt.getFullYear();
    const month = startAt.toLocaleString('default', { month: 'long' });
    const day = startAt.getDate();

    // Thursday, March 27
    const exactDate = `${day} ${month} ${year}`

    const template = `Ausbuildors ${this.state.location} ${month} ${year} Edition
Date: ${exactDate}

Lineup:
- @user presenting on @project

Bants & Beers & Project saloon as usual

RSVP ${this.state.lumaLink}`;

    return template;
  }
}
