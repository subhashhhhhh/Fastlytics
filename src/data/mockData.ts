
// Lap times data for different drivers
export const lapTimesData = [
  { lap: 1, verstappen: 92.4, hamilton: 93.1, leclerc: 92.8 },
  { lap: 2, verstappen: 91.8, hamilton: 92.5, leclerc: 92.2 },
  { lap: 3, verstappen: 91.5, hamilton: 92.3, leclerc: 92.0 },
  { lap: 4, verstappen: 91.3, hamilton: 92.0, leclerc: 91.9 },
  { lap: 5, verstappen: 91.4, hamilton: 91.8, leclerc: 91.7 },
  { lap: 6, verstappen: 91.6, hamilton: 91.7, leclerc: 91.6 },
  { lap: 7, verstappen: 91.8, hamilton: 91.5, leclerc: 91.7 },
  { lap: 8, verstappen: 92.0, hamilton: 91.4, leclerc: 91.9 },
  { lap: 9, verstappen: 91.9, hamilton: 91.3, leclerc: 92.1 },
  { lap: 10, verstappen: 91.7, hamilton: 91.2, leclerc: 92.0 },
  { lap: 11, verstappen: 91.5, hamilton: 91.4, leclerc: 91.8 },
  { lap: 12, verstappen: 91.3, hamilton: 91.6, leclerc: 91.5 },
  { lap: 13, verstappen: 91.1, hamilton: 91.8, leclerc: 91.3 },
  { lap: 14, verstappen: 91.0, hamilton: 91.7, leclerc: 91.1 },
  { lap: 15, verstappen: 90.9, hamilton: 91.5, leclerc: 90.9 },
];

// Tire strategy data
export const tireStrategyData = [
  { driver: 'Verstappen', soft: 20, medium: 30, hard: 20 },
  { driver: 'Hamilton', soft: 15, medium: 35, hard: 20 },
  { driver: 'Leclerc', soft: 25, medium: 25, hard: 20 },
  { driver: 'Norris', soft: 18, medium: 32, hard: 20 },
  { driver: 'Sainz', soft: 22, medium: 28, hard: 20 },
];

// Driver performance comparison
export const driverComparisonData = [
  { attribute: 'Race Pace', verstappen: 95, hamilton: 92, leclerc: 90 },
  { attribute: 'Qualifying', verstappen: 94, hamilton: 93, leclerc: 95 },
  { attribute: 'Tire Management', verstappen: 90, hamilton: 94, leclerc: 89 },
  { attribute: 'Wet Condition', verstappen: 96, hamilton: 95, leclerc: 87 },
  { attribute: 'Overtaking', verstappen: 93, hamilton: 90, leclerc: 88 },
  { attribute: 'Consistency', verstappen: 92, hamilton: 93, leclerc: 89 },
];

// Top speeds data
export const topSpeedsData = [
  { track: 'Monza', verstappen: 348.4, hamilton: 345.1, leclerc: 347.8 },
  { track: 'Baku', verstappen: 341.2, hamilton: 339.5, leclerc: 340.6 },
  { track: 'Spa', verstappen: 339.8, hamilton: 338.2, leclerc: 340.1 },
  { track: 'Jeddah', verstappen: 337.5, hamilton: 336.9, leclerc: 338.0 },
  { track: 'Mexico', verstappen: 335.1, hamilton: 334.8, leclerc: 333.9 },
];

// Race results
export const raceResultsData = [
  { 
    event: 'Chinese GP', 
    position: 1, 
    driver: 'Oscar Piastri', 
    team: 'mclaren',
    change: 25
  },
  { 
    event: 'Australian GP', 
    position: 1, 
    driver: 'Lando Norris', 
    team: 'mclaren',
    change: 25
  },
  { 
    event: 'Abu Dhabi GP', 
    position: 1, 
    driver: 'Max Verstappen', 
    team: 'redbull',
    change: 25
  },
  { 
    event: 'Qatar GP', 
    position: 1, 
    driver: 'Max Verstappen', 
    team: 'redbull',
    change: 25
  }
];

// Team performance
export const teamPerformanceData = [
  { 
    team: 'McLaren', 
    shortName: 'MCL',
    points: 78, 
    teamColor: 'mclaren',
    change: 51
  },
  { 
    team: 'Mercedes', 
    shortName: 'MER',
    points: 57, 
    teamColor: 'mercedes',
    change: 30
  },
  { 
    team: 'Red Bull Racing', 
    shortName: 'RBR',
    points: 36, 
    teamColor: 'redbull',
    change: 18
  },
  { 
    team: 'Williams', 
    shortName: 'WIL',
    points: 17, 
    teamColor: 'williams',
    change: 7
  }
];
