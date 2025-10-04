import { NextResponse } from 'next/server'

interface TraccarPosition {
  deviceId: number;
  latitude: number;
  longitude: number;
  // Add other properties as needed
}

export async function POST(request: Request) {
  try {
    const { deviceIds } = await request.json()

    const traccarUrl = `${process.env.NEXT_PUBLIC_TRACCAR_API_URL}/api/positions`;
    const traccarUsername = process.env.NEXT_PUBLIC_TRACCAR_USERNAME;
    const traccarPassword = process.env.NEXT_PUBLIC_TRACCAR_PASSWORD;

    const positions = await Promise.all(
      deviceIds.map(async (deviceId: number) => {
        const traccarRes = await fetch(`${traccarUrl}?deviceId=${deviceId}`, {
          headers: {
            'Authorization': 'Basic ' + btoa(traccarUsername + ':' + traccarPassword),
            'Accept': 'application/json'
          }
        });
        if (!traccarRes.ok) {
          console.error(`Traccar API request failed for deviceId ${deviceId}:`, traccarRes.status, await traccarRes.text());
          return null;
        }
        const data = await traccarRes.json();
        console.log(`Response for deviceId ${deviceId}:`, data);
        return data.length > 0 ? data[0] : null;
      })
    );

    const validPositions = positions.filter(Boolean);

    return NextResponse.json(validPositions);

  } catch (err) {
    if (err instanceof Error) {
      console.error('Error in get-location API route:', err.message);
      return new Response(err.message, { status: 500 })
    }
    return new Response('An unknown error occurred', { status: 500 })
  }
}