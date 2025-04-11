import React from 'react';
import { useQueries, UseQueryOptions } from '@tanstack/react-query';
import {
    fetchLapPositions,
    fetchSpecificRaceResults,
    fetchSessionIncidents,
    LapPositionDataPoint,
    DetailedRaceResult,
    SessionIncident,
} from '@/lib/api';
import PositionChart from './PositionChart'; // Assume this will be modified to accept props
import LoadingSpinnerF1 from './ui/LoadingSpinnerF1';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton'; // Added Skeleton import
import PositionsSummaryTable from './PositionsSummaryTable'; // Add this import
import KeyMomentsHighlight from './KeyMomentsHighlight'; // Add this import

// New Components (will create these later)
// import PositionsSummaryTable from './PositionsSummaryTable';
// import KeyMomentsHighlight from './KeyMomentsHighlight';
// import PitStopImpact from './PitStopImpact';

interface PositionsTabContentProps {
    year: number;
    event: string;
    session: string;
}

// Define Query Keys type for clarity
type PositionQueryKey = [string, number, string, string];

const PositionsTabContent: React.FC<PositionsTabContentProps> = ({ year, event, session }) => {
    // Define queries without StintAnalysis
    const queries: Readonly<[
        UseQueryOptions<LapPositionDataPoint[], Error, LapPositionDataPoint[], PositionQueryKey>,
        UseQueryOptions<DetailedRaceResult[], Error, DetailedRaceResult[], PositionQueryKey>,
        UseQueryOptions<SessionIncident[], Error, SessionIncident[], PositionQueryKey>
    ]> = [
        {
            queryKey: ['lapPositions', year, event, session],
            queryFn: () => fetchLapPositions(year, event, session),
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            enabled: !!year && !!event && !!session && (session === 'R' || session === 'Sprint'),
        },
        {
            queryKey: ['sessionResults', year, event, session],
            queryFn: () => fetchSpecificRaceResults(year, event, session),
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            enabled: !!year && !!event && !!session && (session === 'R' || session === 'Sprint'),
        },
        {
            queryKey: ['sessionIncidents', year, event, session],
            queryFn: () => fetchSessionIncidents(year, event, session),
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            enabled: !!year && !!event && !!session && (session === 'R' || session === 'Sprint'),
        },
    ];

    // Fetch data using useQueries
    const results = useQueries({ queries });

    // Extract data, loading, and error states
    const lapPositionsData = results[0]?.data as LapPositionDataPoint[] | undefined;
    const sessionResultsData = results[1]?.data as DetailedRaceResult[] | undefined;
    const incidentsData = results[2]?.data as SessionIncident[] | undefined;

    const isLoading = results.some(r => r.isLoading);
    const isError = results.some(query => query.isError);
    const combinedError = results.find(query => query.isError)?.error as Error | null;

    // --- Render States ---
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-[400px] w-full bg-gray-700/50" />
                <Skeleton className="h-[100px] w-full bg-gray-700/50" />
                <Skeleton className="h-[250px] w-full bg-gray-700/50" />
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="bg-red-900/20 border-red-500/50 text-red-300 mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertCircle /> Error Loading Position Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{combinedError?.message || 'Could not fetch all necessary data for the positions tab.'}</p>
                </CardContent>
            </Card>
        );
    }

    if (!lapPositionsData || lapPositionsData.length === 0) {
        return (
            <Card className="bg-gray-900/50 border-gray-700 mt-6">
                <CardHeader>
                    <CardTitle>No Position Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-400">No lap-by-lap position data found for this session.</p>
                </CardContent>
            </Card>
        );
    }

    // --- Render Actual Content ---
    return (
        <div className="space-y-4">
            { (isLoading || isError) && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            )}

            { (isError) && (
                <div className="text-center text-red-400 p-4 bg-red-900/30 rounded border border-red-700">
                    Error loading position data: {combinedError?.message}
                </div>
            )}

            { !isLoading && !isError && lapPositionsData && sessionResultsData && (
                <>
                    <PositionChart
                        lapData={lapPositionsData}
                        incidents={incidentsData}
                        sessionResults={sessionResultsData}
                        year={year}
                    />
                    <KeyMomentsHighlight lapData={lapPositionsData} />
                    <PositionsSummaryTable sessionResults={sessionResultsData} year={year} />
                </>
            )}
        </div>
    );
};

export default PositionsTabContent; 