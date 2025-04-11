import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { StintAnalysisData, fetchStintAnalysis } from '@/lib/api';
import { driverColor } from '@/lib/driverColor'; // Assuming this exists for colors
import { CompoundColors, getCompoundColor } from '@/lib/utils'; // Corrected import path
import LoadingSpinnerF1 from './ui/LoadingSpinnerF1';
import { AlertCircle, ArrowUpDown, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import { SparkLineChart } from '@tremor/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; // Use Card for layout
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

// Helper function to format seconds into MM:SS.mmm
const formatLapTime = (totalSeconds: number | null | undefined): string => {
  if (totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)) {
    return 'N/A';
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds.toFixed(3).padStart(6, '0');
  return `${minutes}:${formattedSeconds}`;
};

// Helper function to calculate standard deviation
const calculateStdDev = (arr: number[]): number | null => {
  if (!arr || arr.length < 2) return null;
  const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
  const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
};

// Helper function to calculate degradation (simple first 3 vs last 3 laps)
const calculateDegradation = (lapTimes: number[]): number | null => {
  // Exclude first lap (outlap) and potentially last lap (inlap) for cleaner analysis
  const validLaps = lapTimes.length > 2 ? lapTimes.slice(1) : lapTimes;
  if (validLaps.length < 6) return null; // Need at least 6 laps for first 3 / last 3 comparison

  const firstThree = validLaps.slice(0, 3);
  const lastThree = validLaps.slice(-3);

  const avgFirstThree = firstThree.reduce((a, b) => a + b, 0) / 3;
  const avgLastThree = lastThree.reduce((a, b) => a + b, 0) / 3;

  return avgLastThree - avgFirstThree; // Positive value indicates degradation (slower times)
};

// Define the structure for processed stint data used in the table
interface ProcessedStint extends StintAnalysisData {
  id: string; // Unique ID for React key
  stintLength: number;
  avgLapTime: number | null;
  fastestLap: number | null;
  consistency: number | null; // Std Dev
  degradation: number | null;
  driverColor: string;
  compoundColor: string;
}

interface StintAnalysisTableProps {
  year: number;
  event: string;
  session: string;
}

const StintAnalysisTable: React.FC<StintAnalysisTableProps> = ({ year, event, session }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: rawStintData, isLoading, error, isError } = useQuery<StintAnalysisData[]>({
    queryKey: ['stintAnalysis', year, event, session],
    queryFn: () => fetchStintAnalysis(year, event, session),
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    gcTime: 1000 * 60 * 30,
    retry: 1,
    enabled: !!year && !!event && !!session,
  });

  // Process the raw data to calculate metrics
  const processedData = useMemo((): ProcessedStint[] => {
    if (!rawStintData) return [];
    return rawStintData.map((stint) => {
      const validLapTimes = stint.lapTimes.filter(t => t !== null && !isNaN(t));
      const avgLapTime = validLapTimes.length > 0 ? validLapTimes.reduce((a, b) => a + b, 0) / validLapTimes.length : null;
      const fastestLap = validLapTimes.length > 0 ? Math.min(...validLapTimes) : null;
      const consistency = calculateStdDev(validLapTimes);
      const degradation = calculateDegradation(validLapTimes);
      const dColor = driverColor(stint.driverCode, year); // Assuming driverColor exists
      const cColor = getCompoundColor(stint.compound); // Assuming getCompoundColor exists

      return {
        ...stint,
        id: `${stint.driverCode}-${stint.stintNumber}`,
        stintLength: stint.endLap - stint.startLap + 1,
        avgLapTime,
        fastestLap,
        consistency,
        degradation,
        driverColor: dColor,
        compoundColor: cColor,
      };
    }).sort((a, b) => {
      // Default sort: Driver A-Z, then Stint Number
      if (a.driverCode < b.driverCode) return -1;
      if (a.driverCode > b.driverCode) return 1;
      return a.stintNumber - b.stintNumber;
    });
  }, [rawStintData, year]);

  // Define table columns
  const columns = useMemo<ColumnDef<ProcessedStint>[]>(() => {
    const baseColumns: ColumnDef<ProcessedStint>[] = [
        {
          accessorKey: "driverCode",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-gray-700/50"
            >
              Driver
              <ArrowUpDown className="ml-1.5 h-3 w-3" />
            </Button>
          ),
          cell: ({ row }) => <span style={{ color: row.original.driverColor }}>{row.original.driverCode}</span>,
          sortingFn: 'alphanumeric',
          enableSorting: true,
        },
        {
          accessorKey: "stintNumber",
          header: "Stint",
          cell: ({ row }) => <span className="text-center block">{row.original.stintNumber}</span>,
          enableSorting: false,
        },
        {
          accessorKey: "compound",
          header: "Compound",
          cell: ({ row }) => (
            <div className="flex items-center justify-center">
              <span
                className="w-4 h-4 rounded-full inline-block mr-1.5 border border-black/20"
                style={{ backgroundColor: row.original.compoundColor }}
                title={row.original.compound}
              ></span>
              <span className="hidden md:inline">{row.original.compound}</span>
            </div>
          ),
          enableSorting: false,
        },
        {
          accessorKey: "stintLength",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-gray-700/50"
            >
              Length
              <ArrowUpDown className="ml-1.5 h-3 w-3" />
            </Button>
          ),
          cell: ({ row }) => `${row.original.stintLength} Laps (${row.original.startLap}-${row.original.endLap})`,
          sortingFn: 'basic',
          enableSorting: true,
        },
        {
          accessorKey: "fastestLap",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-gray-700/50"
            >
              Fastest
              <ArrowUpDown className="ml-1.5 h-3 w-3" />
            </Button>
          ),
          cell: ({ row }) => formatLapTime(row.original.fastestLap),
          sortingFn: 'basic',
          enableSorting: true,
        },
        {
          accessorKey: "avgLapTime",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="p-0 hover:bg-gray-700/50"
            >
              Average
              <ArrowUpDown className="ml-1.5 h-3 w-3" />
            </Button>
          ),
          cell: ({ row }) => formatLapTime(row.original.avgLapTime),
          sortingFn: 'basic',
          enableSorting: true,
        },
    ];

    const raceSpecificColumns: ColumnDef<ProcessedStint>[] = [
        {
            accessorKey: "consistency",
            header: ({ column }) => (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 hover:bg-gray-700/50"
                >
                Consist. (σ)
                <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => row.original.consistency?.toFixed(3) ?? 'N/A',
            sortingFn: 'basic',
            enableSorting: true,
        },
        {
            accessorKey: "degradation",
            header: ({ column }) => (
                <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="p-0 hover:bg-gray-700/50"
                >
                Degr. (Δ)
                <ArrowUpDown className="ml-1.5 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const deg = row.original.degradation;
                if (deg === null || deg === undefined) return 'N/A';
                const color = deg > 0.1 ? 'text-red-400' : deg < -0.1 ? 'text-green-400' : 'text-gray-400';
                const Icon = deg > 0.1 ? TrendingUp : deg < -0.1 ? TrendingDown : TrendingUp;
                return (
                <span className={`flex items-center ${color}`}>
                    <Icon className={`mr-1 h-3 w-3 ${deg === 0 ? 'opacity-50' : ''}`} />
                    {deg.toFixed(2)}s
                </span>
                );
            },
            sortingFn: 'basic',
            enableSorting: true,
        },
    ];

    // Conditionally add race-specific columns
    if (session === 'R' || session === 'Sprint') {
      return [...baseColumns, ...raceSpecificColumns];
    } else {
      return baseColumns;
    }
  }, [year, session]); // Dependency array includes session now

  const table = useReactTable({
    data: processedData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // --- Render States ---
  if (isLoading) {
    return (
      <Card className="mt-6 bg-gray-900/70 border border-gray-700/80">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2"><LineChart /> Stint Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <LoadingSpinnerF1 />
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="mt-6 bg-red-900/20 border-red-500/50 text-red-300">
        <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2"><AlertCircle /> Error Loading Stint Analysis</CardTitle>
        </CardHeader>
        <CardContent>
             <p>{(error as Error)?.message || 'Could not fetch stint analysis data.'}</p>
        </CardContent>
      </Card>
    );
  }

  if (!processedData || processedData.length === 0) {
    return (
        <Card className="mt-6 bg-gray-900/50 border-gray-700">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center gap-2"><LineChart /> Stint Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
                 <p className="text-gray-400">No stint data available for analysis in this session.</p>
            </CardContent>
        </Card>
    );
  }

  // --- Render Table ---
  return (
    <Card className="mt-6 bg-gray-900/70 border border-gray-700/80 overflow-hidden">
       <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2"><LineChart /> Stint Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
            <div className="overflow-x-auto">
                <Table className="min-w-full">
                <TableHeader className="bg-gray-800/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-gray-700 hover:bg-gray-700/30">
                        {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="px-3 py-2 text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        ))}
                    </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors duration-100"
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="px-3 py-1.5 text-sm text-gray-300 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                        No stint data available.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            {/* Add Explanation Section Below Table */}
            <div className="px-4 py-3 mt-2 border-t border-gray-700/60">
                <h4 className="text-sm font-semibold text-gray-200 mb-2">Column Explanations:</h4>
                <ul className="space-y-1.5 text-xs text-gray-400 list-disc pl-4">
                    <li className={cn((session !== 'R' && session !== 'Sprint') && 'text-gray-500 italic')}> 
                        <strong>Consist. (σ):</strong> Standard Deviation of lap times within the stint. Lower is more consistent. 
                        {(session !== 'R' && session !== 'Sprint') && <em>(Race/Sprint only)</em>}
                    </li>
                    <li className={cn((session !== 'R' && session !== 'Sprint') && 'text-gray-500 italic')}> 
                        <strong>Degr. (Δ):</strong> Estimated lap time difference (in seconds) between the end and start of the stint (avg. last 3 laps vs avg. first 3, excluding outlap). Positive means degradation (slower). 
                        {(session !== 'R' && session !== 'Sprint') && <em>(Race/Sprint only)</em>}
                    </li>
                </ul>
            </div>
        </CardContent>
    </Card>
  );
};

export default StintAnalysisTable; 