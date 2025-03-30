import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DriverComparison from '@/components/DriverComparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { driverComparisonData } from '@/data/mockData';
import { User, Users } from 'lucide-react';

const drivers = [
  { id: 'verstappen', name: 'Max Verstappen', team: 'redbull' },
  { id: 'hamilton', name: 'Lewis Hamilton', team: 'mercedes' },
  { id: 'leclerc', name: 'Charles Leclerc', team: 'ferrari' },
  { id: 'norris', name: 'Lando Norris', team: 'mclaren' },
  { id: 'russell', name: 'George Russell', team: 'mercedes' },
  { id: 'sainz', name: 'Carlos Sainz', team: 'ferrari' },
  { id: 'piastri', name: 'Oscar Piastri', team: 'mclaren' },
  { id: 'perez', name: 'Sergio Perez', team: 'redbull' },
];

const Drivers = () => {
  const [driver1, setDriver1] = useState('verstappen');
  const [driver2, setDriver2] = useState('hamilton');
  
  // Clone the data and filter to only include the selected drivers
  const filteredData = driverComparisonData.map(item => {
    const newItem = { ...item };
    
    // Only keep the selected drivers in the data
    Object.keys(newItem).forEach(key => {
      if (key !== 'attribute' && key !== driver1 && key !== driver2) {
        delete newItem[key];
      }
    });
    
    return newItem;
  });
  
  return (
    <div className="min-h-screen bg-background carbon-fiber-bg">
      <Navbar />
      
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Driver Comparison</h1>
          <p className="text-muted-foreground">Compare performance metrics between any two Formula 1 drivers</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Select Drivers to Compare
            </CardTitle>
            <CardDescription>
              Choose any two drivers to see how they match up across different performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4 text-f1-redbull" />
                  Driver 1
                </label>
                <Select value={driver1} onValueChange={setDriver1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map(driver => (
                      <SelectItem 
                        key={driver.id} 
                        value={driver.id}
                        className={`text-f1-${driver.team}`}
                      >
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4 text-f1-mercedes" />
                  Driver 2
                </label>
                <Select value={driver2} onValueChange={setDriver2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map(driver => (
                      <SelectItem 
                        key={driver.id} 
                        value={driver.id}
                        className={`text-f1-${driver.team}`}
                      >
                        {driver.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <DriverComparison 
          data={filteredData} 
          className="mb-8"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Breakdown</CardTitle>
              <CardDescription>Detailed analysis of driver strengths and weaknesses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This radar chart compares drivers across multiple performance metrics including 
                qualifying pace, race pace, tire management, wet weather performance, and more.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Higher values indicate better performance</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Data is normalized across the grid</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Based on the current season's performance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Methodology</CardTitle>
              <CardDescription>How we calculate driver performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our driver performance metrics are calculated using a combination of 
                telemetry data, race results, and advanced statistical modeling.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Qualifying Pace: Gap to pole position</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Race Pace: Average lap time delta</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Tire Management: Degradation rates</span>
                </li>
                <li className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                  <span>Consistency: Lap time variance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Drivers;
