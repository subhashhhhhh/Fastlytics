// Helper function to get a consistent color for a driver
// This is a basic example, you might want to map directly to team colors
// or use a more sophisticated color generation/mapping library

// Import team colors if you want to use them directly
// import { teamPerformanceData } from '@/data/mockData'; // Assuming team data has colors

// Basic color palette (add more as needed)
const defaultColors = [
    '#EF4444', // Red (Accent)
    '#3B82F6', // Blue
    '#22C55E', // Green
    '#EAB308', // Yellow
    '#A855F7', // Purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#14B8A6', // Teal
    '#6366F1', // Indigo
    '#84CC16', // Lime
];

// Simple mapping (expand this or use team data)
const driverColorMap: { [key: string]: string } = {
    'VER': '#1E41FF', // Red Bull Blue
    'PER': '#1E41FF',
    'HAM': '#6CD3BF', // Mercedes Teal (approx)
    'RUS': '#6CD3BF',
    'LEC': '#FF2800', // Ferrari Red
    'SAI': '#FF2800',
    'NOR': '#FF8700', // McLaren Orange
    'PIA': '#FF8700',
    'ALO': '#00594F', // Aston Martin Green
    'STR': '#00594F',
    'OCO': '#0090FF', // Alpine Blue
    'GAS': '#0090FF',
    'ALB': '#00A3E0', // Williams Blue (approx)
    'SAR': '#00A3E0', // Assuming Sargeant for Williams
    'TSU': '#4E7C9B', // AlphaTauri/RB Blue
    'RIC': '#4E7C9B', // Assuming Ricciardo for RB
    'BOT': '#900000', // Alfa Romeo/Sauber Red
    'ZHO': '#900000',
    'MAG': '#B6BABD', // Haas Gray/White (approx)
    'HUL': '#B6BABD',
    // Add mappings for new 2025 drivers if needed, or use fallback
    'ANT': '#6CD3BF', // Antonelli -> Mercedes
    'BEA': '#B6BABD', // Bearman -> Haas
    'HAD': '#4E7C9B', // Hadjar -> RB
    'LAW': '#1E41FF', // Lawson -> Red Bull (Reserve?)
    'DOO': '#0090FF', // Doohan -> Alpine (Reserve?)
    'BOR': '#900000', // Bortoleto -> Sauber (Reserve?)
};

let colorIndex = 0;

export const driverColor = (driverCode: string): string => {
    if (driverColorMap[driverCode]) {
        return driverColorMap[driverCode];
    }
    // Fallback: cycle through default colors if no specific mapping exists
    const color = defaultColors[colorIndex % defaultColors.length];
    colorIndex++;
    return color;
};

// --- Alternative using team data (if mockData includes driver-team mapping) ---
/*
import { driverStandingsData } from "@/data/mockData"; // Assuming driver data has teamColor

const driverTeamColorMap = driverStandingsData.reduce((acc, driver) => {
    acc[driver.shortName] = `var(--f1-${driver.teamColor})`; // Or use hex codes directly
    return acc;
}, {} as Record<string, string>);

export const driverColor = (driverCode: string): string => {
    return driverTeamColorMap[driverCode] || defaultColors[Math.floor(Math.random() * defaultColors.length)]; // Random fallback
};
*/
