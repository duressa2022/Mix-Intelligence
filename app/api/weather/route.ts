import { NextRequest, NextResponse } from 'next/server';
import { fetchRealTimeWeather } from '@/lib/services/weather';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');

    if (!latParam || !lonParam) {
        return NextResponse.json({ error: 'Missing lat or lon parameters' }, { status: 400 });
    }

    const lat = parseFloat(latParam);
    const lon = parseFloat(lonParam);

    if (isNaN(lat) || isNaN(lon)) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    const weather = await fetchRealTimeWeather(lat, lon);

    if (!weather) {
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }

    return NextResponse.json(weather);
}
