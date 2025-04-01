// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
// API Key from environment variable (Vite specific)
const API_KEY = import.meta.env.VITE_FASTLYTICS_API_KEY;
const API_KEY_HEADER = 'X-API-Key';

// --- Helper to get headers ---
const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (API_KEY) {
        headers[API_KEY_HEADER] = API_KEY;
    } else {
        console.warn("VITE_FASTLYTICS_API_KEY is not set. API requests will be sent without authentication.");
    }
    return headers;
};

// --- Data Structures (Exported) ---
export interface LapTimeDataPoint {
    LapNumber: number;
    [driverCode: string]: number | null; // Allow null for missed laps
}
export interface SpeedDataPoint { Distance: number; Speed: number; }
export interface GearMapDataPoint { X: number; Y: number; nGear: number; }
export interface TireStint { compound: string; startLap: number; endLap: number; lapCount: number; }
export interface DriverStrategy { driver: string; stints: TireStint[]; }
export interface SessionDriver { code: string; name: string; team: string; }
export interface DriverStanding { rank: number; code: string; name: string; team: string; points: number; wins: number; podiums: number; points_change?: number; teamColor?: string; } // Use points_change?
export interface TeamStanding { rank: number; team: string; points: number; wins: number; podiums: number; points_change?: number; teamColor?: string; shortName?: string; } // Use points_change?
export interface RaceResult { year: number; event: string; round: number; driver: string; team: string; teamColor: string; date?: string; location?: string; } // Added date and location
export interface DetailedRaceResult {
    position: number | null;
    driverCode: string;
    fullName: string;
    team: string;
    points: number;
    status: string;
    gridPosition?: number | null; // Optional for non-race/sprint
    teamColor: string;
    isFastestLap?: boolean; // Optional, mainly for Race/Sprint
    // Fields for specific session types
    fastestLapTime?: string | null; // For Practice
    lapsCompleted?: number | null; // For Practice
    q1Time?: string | null; // For Qualifying
    q2Time?: string | null; // For Qualifying
    q3Time?: string | null; // For Qualifying
}
export interface LapPositionDataPoint {
    LapNumber: number;
    [driverCode: string]: number | null; // Position for each driver, null if DNF/not available
}

export interface AvailableSession {
    name: string;
    type: string;
    startTime: string; // Note: This might not be directly available from the schedule endpoint
}

// --- Schedule Interface ---
export interface ScheduleEvent {
    RoundNumber: number;
    Country: string;
    Location: string;
    EventName: string;
    EventDate: string; // ISO Date string
    EventFormat: string;
    Session1: string;
    Session1Date: string; // ISO Date string
    Session2: string;
    Session2Date: string; // ISO Date string
    Session3: string;
    Session3Date: string; // ISO Date string
    Session4: string | null; // Can be null
    Session4Date: string | null; // Can be null
    Session5: string | null; // Can be null
    Session5Date: string | null; // Can be null
    F1ApiSupport: boolean;
}


// --- Driver/Team Detail Interfaces ---
export interface DriverDetails {
  driverId: string; // Usually the 3-letter code
  name: string;
  nationality: string;
  dateOfBirth: string; // ISO string format ideally
  bio?: string; // Optional
  imageUrl?: string; // Optional URL for the large photo
  careerStats?: { // Optional stats block
    wins?: number;
    podiums?: number;
    poles?: number;
    championships?: number;
  };
  // Add other relevant fields from backend if available
}

export interface TeamDetails {
  teamId: string; // Usually the full team name used as ID
  name: string;
  nationality: string;
  base?: string; // Optional
  firstEntry?: number; // Optional
  bio?: string; // Optional
  imageUrl?: string; // Optional URL for the large photo/logo
  careerStats?: { // Optional stats block
    wins?: number;
    podiums?: number;
    poles?: number;
    constructorsChampionships?: number;
    driversChampionships?: number;
  };
  // Add other relevant fields (e.g., current drivers) if available
}

// --- Track Evolution Interfaces ---
export interface RollingLapDataPoint {
  lap: number;
  time: number | null; // Rolling average time in seconds
}

export interface DriverEvolutionData {
  code: string;
  color: string;
  rollingAverageLaps: RollingLapDataPoint[];
}

export interface TrackTemperatureDataPoint {
  lap: number;
  temp: number | null; // Track temperature in Celsius
}

export interface TrackEvolutionResponse {
  drivers: DriverEvolutionData[];
  trackTemperature: TrackTemperatureDataPoint[];
  // TODO: Add interfaces for stint/compound analysis if implemented later
}


// --- API Fetch Functions ---

/** Fetches available sessions for a given event */
export const fetchAvailableSessions = async (year: number, event: string): Promise<AvailableSession[]> => {
    const params = new URLSearchParams({ year: year.toString(), event });
    const url = `${API_BASE_URL}/api/sessions?${params.toString()}`;
    console.log(`Fetching available sessions from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: AvailableSession[] = await response.json();
        console.log(`Successfully fetched ${data.length} available sessions.`);
        return data;
    } catch (error) { console.error("Error fetching available sessions:", error); throw error; }
};

/** Fetches the list of drivers for a given session. */
export const fetchSessionDrivers = async (year: number, event: string, session: string): Promise<SessionDriver[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session });
    const url = `${API_BASE_URL}/api/session/drivers?${params.toString()}`;
    console.log(`Fetching session drivers from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: SessionDriver[] = await response.json();
        console.log(`Successfully fetched ${data.length} session drivers.`);
        return data;
    } catch (error) { console.error("Error fetching session drivers:", error); throw error; }
};

/** Fetches lap time comparison data for multiple drivers (2 or 3). */
export const fetchLapTimes = async (year: number, event: string, session: string, drivers: string[]): Promise<LapTimeDataPoint[]> => {
    const params = new URLSearchParams();
    params.append('year', year.toString()); params.append('event', event); params.append('session', session);
    drivers.forEach(driver => params.append('drivers', driver));
    const url = `${API_BASE_URL}/api/laptimes?${params.toString()}`;
    console.log(`Fetching lap times from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: LapTimeDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} lap time records for ${drivers.join(', ')}.`);
        return data;
    } catch (error) { console.error("Error fetching lap times:", error); throw error; }
};

/** Fetches speed telemetry data for a specific lap. */
export const fetchTelemetrySpeed = async (year: number, event: string, session: string, driver: string, lap: string | number): Promise<SpeedDataPoint[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session, driver, lap: String(lap) });
    const url = `${API_BASE_URL}/api/telemetry/speed?${params.toString()}`;
    console.log(`Fetching speed telemetry from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: SpeedDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} speed telemetry records.`);
        return data;
    } catch (error) { console.error("Error fetching speed telemetry:", error); throw error; }
};

/** Fetches gear shift telemetry data (X, Y, nGear) for a specific lap. */
export const fetchTelemetryGear = async (year: number, event: string, session: string, driver: string, lap: string | number): Promise<GearMapDataPoint[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session, driver, lap: String(lap) });
    const url = `${API_BASE_URL}/api/telemetry/gear?${params.toString()}`;
    console.log(`Fetching gear telemetry from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: GearMapDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} gear telemetry records.`);
        return data;
    } catch (error) { console.error("Error fetching gear telemetry:", error); throw error; }
};

/** Fetches tire strategy data for all drivers in a session. */
export const fetchTireStrategy = async (year: number, event: string, session: string): Promise<DriverStrategy[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session });
    const url = `${API_BASE_URL}/api/strategy/tires?${params.toString()}`;
    console.log(`Fetching tire strategy from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: DriverStrategy[] = await response.json();
        console.log(`Successfully fetched tire strategy for ${data.length} drivers.`);
        return data;
    } catch (error) { console.error("Error fetching tire strategy:", error); throw error; }
};

/** Fetches driver standings for a given year. */
export const fetchDriverStandings = async (year: number): Promise<DriverStanding[]> => {
    const params = new URLSearchParams({ year: year.toString() });
    const url = `${API_BASE_URL}/api/standings/drivers?${params.toString()}`;
    console.log(`Fetching driver standings from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: DriverStanding[] = await response.json();
        console.log(`Successfully fetched driver standings for ${year}.`);
        return data;
    } catch (error) { console.error(`Error fetching driver standings for ${year}:`, error); throw error; }
};

/** Fetches team standings for a given year. */
export const fetchTeamStandings = async (year: number): Promise<TeamStanding[]> => {
    const params = new URLSearchParams({ year: year.toString() });
    const url = `${API_BASE_URL}/api/standings/teams?${params.toString()}`;
    console.log(`Fetching team standings from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: TeamStanding[] = await response.json();
        console.log(`Successfully fetched team standings for ${year}.`);
        return data;
    } catch (error) { console.error(`Error fetching team standings for ${year}:`, error); throw error; }
};

/** Fetches race results summary (winners) for a given year. */
export const fetchRaceResults = async (year: number): Promise<RaceResult[]> => {
    const params = new URLSearchParams({ year: year.toString() });
    const url = `${API_BASE_URL}/api/results/races?${params.toString()}`;
    console.log(`Fetching race results summary from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: RaceResult[] = await response.json();
        console.log(`Successfully fetched ${data.length} race results summary for ${year}.`);
        return data;
    } catch (error) { console.error(`Error fetching race results for ${year}:`, error); throw error; }
};

/** Fetches detailed race results for a specific event. */
export const fetchSpecificRaceResults = async (year: number, eventSlug: string, session?: string): Promise<DetailedRaceResult[]> => {
    const url = `${API_BASE_URL}/api/results/race/${year}/${eventSlug}`;
    console.log(`Fetching detailed race results from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: DetailedRaceResult[] = await response.json();
        console.log(`Successfully fetched detailed results for ${year} ${eventSlug}.`);
        return data;
    } catch (error) {
        console.error(`Error fetching detailed race results for ${year} ${eventSlug}:`, error);
        throw error;
    }
};

/** Fetches track evolution analysis data for a given session. */
export const fetchTrackEvolution = async (year: number, event: string, session: string): Promise<TrackEvolutionResponse> => {
    const params = new URLSearchParams({ year: year.toString(), event, session });
    const url = `${API_BASE_URL}/api/analysis/track-evolution?${params.toString()}`;
    console.log(`Fetching track evolution data from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error fetching track evolution for ${year} ${event} ${session}: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: TrackEvolutionResponse = await response.json();
        console.log(`Successfully fetched track evolution data for ${year} ${event} ${session}.`);
        return data;
    } catch (error) {
        console.error(`Error fetching track evolution data for ${year} ${event} ${session}:`, error);
        throw error;
    }
};

/** Fetches the event schedule for a given year. */
export const fetchSchedule = async (year: number): Promise<ScheduleEvent[]> => {
    const url = `${API_BASE_URL}/api/schedule/${year}`;
    console.log(`Fetching schedule from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error fetching schedule for ${year}: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: ScheduleEvent[] = await response.json();
        console.log(`Successfully fetched schedule for ${year} with ${data.length} events.`);
        return data;
    } catch (error) {
        console.error(`Error fetching schedule for ${year}:`, error);
        throw error;
    }
};

/** Fetches lap-by-lap position data for a race session. */
export const fetchLapPositions = async (year: number, event: string, session: string): Promise<LapPositionDataPoint[]> => {
    const params = new URLSearchParams({ year: year.toString(), event, session });
    const url = `${API_BASE_URL}/api/lapdata/positions?${params.toString()}`;
    console.log(`Fetching lap positions from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: LapPositionDataPoint[] = await response.json();
        console.log(`Successfully fetched ${data.length} lap position records.`);
        return data;
    } catch (error) { console.error("Error fetching lap positions:", error); throw error; }
};

/** Fetches detailed information for a specific driver. */
export const getDriverDetails = async (driverId: string): Promise<DriverDetails> => {
    const url = `${API_BASE_URL}/api/driver/${driverId}`;
    console.log(`Fetching driver details from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error fetching driver ${driverId}: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: DriverDetails = await response.json();
        console.log(`Successfully fetched details for driver ${driverId}.`);
        // TODO: Potentially add mock data here if API returns 404 during development
        // if (!data && MOCK_ENABLED) return MOCK_DRIVER_DETAILS[driverId];
        return data;
    } catch (error) {
        console.error(`Error fetching driver details for ${driverId}:`, error);
        // TODO: Potentially return mock data on error during development
        // if (MOCK_ENABLED) return MOCK_DRIVER_DETAILS[driverId];
        throw error;
    }
};

/** Fetches detailed information for a specific team. */
export const getTeamDetails = async (teamId: string): Promise<TeamDetails> => {
    // Team ID might contain spaces or special chars, ensure it's encoded for the URL path part
    const encodedTeamId = encodeURIComponent(teamId);
    const url = `${API_BASE_URL}/api/team/${encodedTeamId}`;
    console.log(`Fetching team details from: ${url}`);
    try {
        const response = await fetch(url, { headers: getHeaders() });
        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try { const errorData = await response.json(); errorDetail = errorData.detail || errorDetail; } catch (e) { /* Ignore */ }
            console.error(`API Error fetching team ${teamId}: ${errorDetail}`);
            throw new Error(errorDetail);
        }
        const data: TeamDetails = await response.json();
        console.log(`Successfully fetched details for team ${teamId}.`);
        // TODO: Potentially add mock data here if API returns 404 during development
        return data;
    } catch (error) {
        console.error(`Error fetching team details for ${teamId}:`, error);
        // TODO: Potentially return mock data on error during development
        throw error;
    }
};
