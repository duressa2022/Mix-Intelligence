import { WeatherCollector } from '../lib/services/collectors/weather-collector';
import { SatelliteCollector } from '../lib/services/collectors/satellite-collector';
import { SocioeconomicCollector } from '../lib/services/collectors/socioeconomic-collector';

async function testCollectors() {
    console.log('--- Testing Weather Collector ---');
    const weatherCollector = new WeatherCollector();
    const weatherResult = await weatherCollector.collect();
    console.log('Success:', weatherResult.success);
    if (weatherResult.success && weatherResult.data) {
        console.log('Data Point:', weatherResult.data[0]);
    } else {
        console.error('Errors:', weatherResult.errors);
    }

    console.log('\n--- Testing Satellite Collector (Mock) ---');
    const satCollector = new SatelliteCollector();
    const satResult = await satCollector.collect();
    console.log('Success:', satResult.success);
    if (satResult.success && satResult.data) {
        console.log('Data Point:', satResult.data[0]);
    }

    console.log('\n--- Testing Socioeconomic Collector (Mock) ---');
    const socCollector = new SocioeconomicCollector();
    const socResult = await socCollector.collect();
    console.log('Success:', socResult.success);
    if (socResult.success && socResult.data) {
        console.log('Data Point:', socResult.data[0]);
    }
}

testCollectors().catch(console.error);
