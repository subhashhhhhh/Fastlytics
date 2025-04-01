// Collection of racing-related terms for username generation
const racingPrefixes = [
  'Speed', 'Turbo', 'Nitro', 'Apex', 'Boost', 'Drift', 'Race', 'Circuit', 'Track', 'Pit',
  'Grid', 'Pace', 'Pole', 'Gear', 'Aero', 'Slick', 'Torque', 'Throttle', 'Downforce', 'Podium',
  'Champ', 'Rally', 'Sprint', 'Curve', 'Chicane', 'Slipstream', 'DRS', 'Fuel', 'Pace', 'Qualify',
  'Overtake', 'Ignition', 'Clutch', 'Hybrid', 'Tarmac', 'Helmet', 'Brake', 'Steer', 'Carbon', 'Harness'
];

const racingNouns = [
  'Racer', 'Driver', 'Pilot', 'Mechanic', 'Champion', 'Legend', 'Master', 'Crew', 'Team', 'Engine',
  'Formula', 'Wheel', 'Tire', 'Cockpit', 'Paddock', 'Garage', 'Trophy', 'Winner', 'Challenger', 'Competitor',
  'Speedster', 'Navigator', 'Rider', 'Ferrari', 'McLaren', 'Mercedes', 'RedBull', 'Lotus', 'Porsche', 'Alpine',
  'Laps', 'Finish', 'Straights', 'Points', 'Corners', 'Podium', 'Victory', 'Flag', 'Streak', 'Pursuit'
];

// F1 specific terms
const f1Terms = [
  'F1', 'Formula', 'GP', 'Grand', 'Prix', 'Pole', 'Box', 'Pits', 'Monaco', 'Monza',
  'Spa', 'Silverstone', 'Suzuka', 'Interlagos', 'Baku', 'Imola', 'Jeddah', 'Sakhir', 'Melbourne', 'Vegas'
];

// Racing driver last names for inspiration
const driverNames = [
  'Hamilton', 'Verstappen', 'Leclerc', 'Prost', 'Senna', 'Schumacher', 'Vettel', 'Alonso', 'Norris', 'Russell',
  'Sainz', 'Perez', 'Hunt', 'Lauda', 'Clark', 'Stewart', 'Hakkinen', 'Raikkonen', 'Button', 'Ricciardo'
];

/**
 * Generates a random racing-themed username
 * @returns {string} A randomly generated racing-themed username
 */
export const generateRacingUsername = (): string => {
  const randomNum = Math.floor(Math.random() * 1000);
  
  // Randomly decide which pattern to use
  const pattern = Math.floor(Math.random() * 5);
  
  let username = '';
  
  switch (pattern) {
    case 0:
      // Prefix + Noun (e.g., ApexRacer, TurboDriver)
      username = getRandomElement(racingPrefixes) + getRandomElement(racingNouns);
      break;
    case 1:
      // Prefix + Number (e.g., Speed44, Nitro27)
      username = getRandomElement(racingPrefixes) + randomNum;
      break;
    case 2:
      // F1Term + DriverName (e.g., F1Hamilton, FormulaVettel)
      username = getRandomElement(f1Terms) + getRandomElement(driverNames);
      break;
    case 3:
      // The + Prefix + Noun (e.g., TheApexRacer, TheBoostChampion)
      username = 'The' + getRandomElement(racingPrefixes) + getRandomElement(racingNouns);
      break;
    case 4:
      // DriverName + Noun (e.g., HamiltonRacer, VettelEngine)
      username = getRandomElement(driverNames) + getRandomElement(racingNouns);
      break;
    default:
      // Default fallback
      username = getRandomElement(racingPrefixes) + getRandomElement(racingNouns) + randomNum;
  }
  
  return username;
};

/**
 * Helper function to get a random element from an array
 */
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
} 