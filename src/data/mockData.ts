// Mock data for demonstration purposes

// Updated Team Performance Data for 2025
export const teamPerformanceData = [
  { team: 'McLaren', shortName: 'MCL', points: 78, change: 51, wins: 2, podiums: 3, teamColor: 'mclaren' },
  { team: 'Mercedes', shortName: 'MER', points: 57, change: 30, wins: 0, podiums: 2, teamColor: 'mercedes' },
  { team: 'Red Bull Racing', shortName: 'RBR', points: 36, change: 18, wins: 0, podiums: 2, teamColor: 'redbull' },
  { team: 'Williams', shortName: 'WIL', points: 17, change: 5, wins: 0, podiums: 1, teamColor: 'williams' }, // Updated points/change based on driver sum
  { team: 'Ferrari', shortName: 'FER', points: 17, change: 12, wins: 0, podiums: 0, teamColor: 'ferrari' },
  { team: 'Haas', shortName: 'HAA', points: 14, change: 14, wins: 0, podiums: 0, teamColor: 'haas' },
  { team: 'Aston Martin', shortName: 'AST', points: 10, change: 2, wins: 0, podiums: 0, teamColor: 'astonmartin' },
  { team: 'Kick Sauber', shortName: 'SAU', points: 6, change: 0, wins: 0, podiums: 0, teamColor: 'alfaromeo' }, // Assuming Kick Sauber uses alfaromeo color
  { team: 'Racing Bulls', shortName: 'RB', points: 3, change: 3, wins: 0, podiums: 0, teamColor: 'alphatauri' }, // Assuming RB uses alphatauri color
  { team: 'Alpine', shortName: 'ALP', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'alpine' },
];

// New Driver Standings Data for 2025
export const driverStandingsData = [
  { rank: 1, name: 'Lando Norris', shortName: 'NOR', team: 'McLaren', points: 44, change: 19, wins: 1, podiums: 2, teamColor: 'mclaren' },
  { rank: 2, name: 'Max Verstappen', shortName: 'VER', team: 'Red Bull', points: 36, change: 18, wins: 0, podiums: 2, teamColor: 'redbull' },
  { rank: 3, name: 'George Russell', shortName: 'RUS', team: 'Mercedes', points: 35, change: 20, wins: 0, podiums: 2, teamColor: 'mercedes' },
  { rank: 4, name: 'Oscar Piastri', shortName: 'PIA', team: 'McLaren', points: 34, change: 22, wins: 1, podiums: 1, teamColor: 'mclaren' },
  { rank: 5, name: 'Andrea Kimi Antonelli', shortName: 'ANT', team: 'Mercedes', points: 22, change: 12, wins: 0, podiums: 0, teamColor: 'mercedes' },
  { rank: 6, name: 'Alexander Albon', shortName: 'ALB', team: 'Williams', points: 16, change: 10, wins: 0, podiums: 1, teamColor: 'williams' },
  { rank: 7, name: 'Esteban Ocon', shortName: 'OCO', team: 'Haas', points: 10, change: 10, wins: 0, podiums: 0, teamColor: 'haas' },
  { rank: 8, name: 'Lance Stroll', shortName: 'STR', team: 'Aston Martin', points: 10, change: 2, wins: 0, podiums: 0, teamColor: 'astonmartin' },
  { rank: 9, name: 'Lewis Hamilton', shortName: 'HAM', team: 'Ferrari', points: 9, change: 8, wins: 0, podiums: 0, teamColor: 'ferrari' },
  { rank: 10, name: 'Charles Leclerc', shortName: 'LEC', team: 'Ferrari', points: 8, change: 4, wins: 0, podiums: 0, teamColor: 'ferrari' },
  { rank: 11, name: 'Nico Hulkenberg', shortName: 'HUL', team: 'Kick Sauber', points: 6, change: 6, wins: 0, podiums: 0, teamColor: 'alfaromeo' },
  { rank: 12, name: 'Oliver Bearman', shortName: 'BEA', team: 'Haas', points: 4, change: 4, wins: 0, podiums: 0, teamColor: 'haas' },
  { rank: 13, name: 'Yuki Tsunoda', shortName: 'TSU', team: 'Racing Bulls', points: 3, change: 3, wins: 0, podiums: 0, teamColor: 'alphatauri' },
  { rank: 14, name: 'Carlos Sainz', shortName: 'SAI', team: 'Williams', points: 1, change: 1, wins: 0, podiums: 0, teamColor: 'williams' },
  { rank: 15, name: 'Pierre Gasly', shortName: 'GAS', team: 'Alpine', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'alpine' },
  { rank: 16, name: 'Isack Hadjar', shortName: 'HAD', team: 'Racing Bulls', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'alphatauri' },
  { rank: 17, name: 'Liam Lawson', shortName: 'LAW', team: 'Red Bull', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'redbull' },
  { rank: 18, name: 'Jack Doohan', shortName: 'DOO', team: 'Alpine', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'alpine' },
  { rank: 19, name: 'Gabriel Bortoleto', shortName: 'BOR', team: 'Kick Sauber', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'alfaromeo' },
  { rank: 20, name: 'Fernando Alonso', shortName: 'ALO', team: 'Aston Martin', points: 0, change: 0, wins: 0, podiums: 0, teamColor: 'astonmartin' },
];


// Mock data for race results
export const raceResultsData = [
  { event: 'Bahrain Grand Prix', driver: 'Max Verstappen', team: 'redbull', change: 5 },
  { event: 'Saudi Arabian Grand Prix', driver: 'Sergio Perez', team: 'redbull', change: -2 },
  { event: 'Australian Grand Prix', driver: 'Charles Leclerc', team: 'ferrari', change: 8 },
  { event: 'Emilia Romagna Grand Prix', driver: 'Max Verstappen', team: 'redbull', change: 3 },
];

// Mock data for lap times comparison (example)
export const lapTimesData = [
  { lap: 1, driverA: 95.5, driverB: 96.1 },
  { lap: 2, driverA: 94.8, driverB: 95.2 },
  { lap: 3, driverA: 94.5, driverB: 94.9 },
  // ... more laps
];

// Mock data for tire strategy (example)
export const tireStrategyData = [
  { driver: 'VER', stints: [{ compound: 'Medium', laps: 18 }, { compound: 'Hard', laps: 40 }] },
  { driver: 'HAM', stints: [{ compound: 'Medium', laps: 20 }, { compound: 'Hard', laps: 38 }] },
  // ... more drivers
];

// Mock data for driver comparison radar chart (example)
export const driverComparisonData = [
    { attribute: 'Qualifying Pace', verstappen: 95, hamilton: 92 },
    { attribute: 'Race Pace', verstappen: 98, hamilton: 96 },
    { attribute: 'Consistency', verstappen: 90, hamilton: 94 },
    { attribute: 'Tire Management', verstappen: 88, hamilton: 95 },
    { attribute: 'Overtaking', verstappen: 96, hamilton: 93 },
    { attribute: 'Wet Weather', verstappen: 92, hamilton: 97 },
];
