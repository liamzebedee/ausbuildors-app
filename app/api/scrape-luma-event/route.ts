import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lumaLink = searchParams.get('link');

  if (!lumaLink) {
    return NextResponse.json({ error: 'Luma link is required' }, { status: 400 });
  }

  try {
    const response = await fetch(lumaLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();

    // Extract the JSON data from the __NEXT_DATA__ script tag
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    if (!nextDataMatch) {
      throw new Error('Could not find event data');
    }

    const nextData = JSON.parse(nextDataMatch[1]);
    const pageProps = nextData.props.pageProps;
    console.log(pageProps.initialData.data)

    return NextResponse.json({
      // pageProps,
      startAt: pageProps.initialData.data.start_at,
      title: pageProps.initialData.data.event.name,
    });
  } catch (error) {
    console.error('Error scraping Luma event:', error);
    return NextResponse.json(
      { error: 'Failed to scrape Luma event' },
      { status: 500 }
    );
  }
} 