// Base URL for your backend API
// Use environment variable for flexibility, default to localhost:8000 for dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// --- Data Structures ---
interface LapTimeDataPoint {
    LapNumber: number;
    [driverCode: string]: number; // Lap time in seconds
}

interface SpeedDataPoint {
    Distance: number;
    Speed: number;
}

interface GearMapDataPoint {
    X: number;
    Y: number;
    nGear: number;
}

interface TireStint {
    compound: string;
    startLap: number;
    endLap: number;
    lapCount: number;
}

interface DriverStrategy {
    driver: string;
    stints: TireStint[];
}

// New interface for session driver list - Export it
export interface SessionDriver {
    code: string; // 3-letter code
    name: string; // Last name or full name
    team: string; // Team name
}


// --- API Fetch Functions ---

/** Fetches the list of drivers for a given session. */
export const fetchSessionDrivers = async (
    year: number, event: string, session: string
): Promise<SessionDriver[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session });
    const url = `${API_BASE_URL}/api/session/drivers?${params.toString()}`;
    console.log(`Fetching session drivers from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: SessionDriver[] = await response.json();
        console.log(`Successfully fetched ${data.length} session drivers.`);
        return data;
    } catch (error) {
        console.error("Error fetching session drivers:", error);
        throw error;
    }
};


/** Fetches lap time comparison data for multiple drivers (2 or 3). */
export const fetchLapTimes = async (
    year: number, event: string, session: string, drivers: string[] // Accept array of drivers
): Promise<LapTimeDataPoint[]> => {
    // Construct query parameters - FastAPI expects list params like ?drivers=VER&drivers=LEC
    const params = new URLSearchParams();
    params.append('year', year.toString());
    params.append('event', event);
    params.append('session', session);
    drivers.forEach(driver => params.append('drivers', driver)); // Append each driver

    const url = `${API_BASE_URL}/api/laptimes?${params.toString()}`;
    console.log(`Fetching lap times from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: LapTimeDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} lap time records for ${drivers.join(', ')}.`);
        return data;
    } catch (error) {
        console.error("Error fetching lap times:", error);
        throw error;
    }
};

/** Fetches speed telemetry data for a specific lap. */
export const fetchTelemetrySpeed = async (
    year: number, event: string, session: string, driver: string, lap: string | number
): Promise<SpeedDataPoint[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session, driver, lap: String(lap) });
    const url = `${API_BASE_URL}/api/telemetry/speed?${params.toString()}`;
    console.log(`Fetching speed telemetry from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: SpeedDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} speed telemetry records.`);
        return data;
    } catch (error) {
        console.error("Error fetching speed telemetry:", error);
        throw error;
    }
};

/** Fetches gear shift telemetry data (X, Y, nGear) for a specific lap. */
export const fetchTelemetryGear = async (
    year: number, event: string, session: string, driver: string, lap: string | number
): Promise<GearMapDataPoint[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session, driver, lap: String(lap) });
    const url = `${API_BASE_URL}/api/telemetry/gear?${params.toString()}`;
    console.log(`Fetching gear telemetry from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: GearMapDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} gear telemetry records.`);
        return data;
    } catch (error) {
        console.error("Error fetching gear telemetry:", error);
        throw error;
    }
};

/** Fetches tire strategy data for all drivers in a session. */
export const fetchTireStrategy = async (
    year: number, event: string, session: string
): Promise<DriverStrategy[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session });
    const url = `${API_BASE_URL}/api/strategy/tires?${params.toString()}`;
    console.log(`Fetching tire strategy from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: DriverStrategy[] = await response.json();
        console.log(`Successfully fetched tire strategy for ${data.length} drivers.`);
        return data;
    } catch (error) {
        console.error("Error fetching tire strategy:", error);
        throw error;
    }
};
