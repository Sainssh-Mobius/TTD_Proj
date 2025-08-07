import React, { useState, useEffect } from 'react';
import { Car, MapPin, AlertTriangle, Bus, Camera, Activity, Navigation, Zap, Play, Settings, TrendingUp, BarChart3, Sliders } from 'lucide-react';

const TrafficConsole: React.FC = () => {
  const [vehicleCount, setVehicleCount] = useState(1247);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [whatIfScenario, setWhatIfScenario] = useState('normal');
  const [simulationResults, setSimulationResults] = useState<any>(null);
  
  const [parkingData, setParkingData] = useState([
    { id: 1, name: 'Parking Lot A', capacity: 500, occupied: 420, zone: 'Main Temple' },
    { id: 2, name: 'Parking Lot B', capacity: 300, occupied: 180, zone: 'Alipiri Base' },
    { id: 3, name: 'VIP Parking', capacity: 100, occupied: 85, zone: 'Special' },
    { id: 4, name: 'Bus Terminal', capacity: 50, occupied: 32, zone: 'Transport' }
  ]);
  
  const [trafficParameters, setTrafficParameters] = useState({
    peakHourMultiplier: 2.5,
    weatherImpact: 1.0,
    eventDayMultiplier: 3.0,
    emergencyVehicles: 3,
    roadCapacity: 1500,
    averageSpeed: 25
  });

  const [incidents, setIncidents] = useState([
    { id: 1, type: 'Traffic Jam', location: 'Ghat Road KM 15', severity: 'high', time: '10:30 AM' },
    { id: 2, type: 'Breakdown', location: 'Alipiri Junction', severity: 'medium', time: '11:15 AM' },
    { id: 3, type: 'Emergency Vehicle', location: 'Main Gate', severity: 'critical', time: '11:45 AM' }
  ]);

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Operations', multiplier: 1.0, description: 'Standard traffic flow' },
    { id: 'festival', name: 'Festival Day', multiplier: 3.5, description: '250% increase in vehicles' },
    { id: 'weather', name: 'Heavy Rain', multiplier: 0.6, description: '40% reduction due to weather' },
    { id: 'emergency', name: 'Emergency Closure', multiplier: 0.1, description: 'Road closure scenario' },
    { id: 'vip', name: 'VIP Visit', multiplier: 1.8, description: 'Increased security protocols' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time vehicle count updates
      const baseChange = Math.floor(Math.random() * 10) - 5;
      const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
      const simulationMultiplier = simulationMode ? simulationSpeed : 1;
      
      setVehicleCount(prev => Math.max(0, prev + (baseChange * scenarioMultiplier * simulationMultiplier)));
      
      // Update parking data
      setParkingData(prev => prev.map(lot => ({
        ...lot,
        occupied: Math.max(0, Math.min(lot.capacity, 
          lot.occupied + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier * simulationMultiplier)))
      })));
    }, simulationMode ? 1000 / simulationSpeed : 3000);

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, whatIfScenario]);

  const runWhatIfAnalysis = () => {
    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);
    const projectedVehicles = Math.floor(vehicleCount * scenario!.multiplier);
    const projectedCongestion = Math.min(100, (projectedVehicles / trafficParameters.roadCapacity) * 100);
    const estimatedDelay = Math.max(0, (projectedCongestion - 70) * 2);
    
    setSimulationResults({
      scenario: scenario!.name,
      projectedVehicles,
      congestionLevel: projectedCongestion,
      estimatedDelay,
      recommendedActions: getRecommendations(projectedCongestion, estimatedDelay)
    });
  };

  const getRecommendations = (congestion: number, delay: number) => {
    const recommendations = [];
    if (congestion > 80) recommendations.push('Activate alternate routes');
    if (congestion > 90) recommendations.push('Deploy additional traffic personnel');
    if (delay > 30) recommendations.push('Implement shuttle frequency increase');
    if (delay > 60) recommendations.push('Consider temporary parking restrictions');
    return recommendations;
  };

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Simulation Control Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-xl text-white">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Traffic Simulation & What-If Analysis</h3>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSimulationMode(!simulationMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                simulationMode 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>{simulationMode ? 'Stop Simulation' : 'Start Simulation'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Parameters */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Simulation Parameters</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Simulation Speed</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">{simulationSpeed}x speed</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Road Capacity</label>
              <input
                type="number"
                value={trafficParameters.roadCapacity}
                onChange={(e) => setTrafficParameters(prev => ({...prev, roadCapacity: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weather Impact</label>
              <select
                value={trafficParameters.weatherImpact}
                onChange={(e) => setTrafficParameters(prev => ({...prev, weatherImpact: parseFloat(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1.0">Clear Weather</option>
                <option value="0.8">Light Rain</option>
                <option value="0.6">Heavy Rain</option>
                <option value="0.4">Storm</option>
              </select>
            </div>
          </div>

          {/* What-If Scenarios */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">What-If Scenarios</h4>
            
            <div className="space-y-2">
              {whatIfScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  onClick={() => setWhatIfScenario(scenario.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    whatIfScenario === scenario.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800">{scenario.name}</div>
                  <div className="text-xs text-gray-600">{scenario.description}</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Impact: {scenario.multiplier > 1 ? '+' : ''}{((scenario.multiplier - 1) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={runWhatIfAnalysis}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Run Analysis
            </button>
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Analysis Results</h4>
            
            {simulationResults ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Scenario: {simulationResults.scenario}</div>
                  <div className="text-lg font-bold text-blue-600">{simulationResults.projectedVehicles.toLocaleString()} vehicles</div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Congestion Level</div>
                  <div className="text-lg font-bold text-yellow-600">{simulationResults.congestionLevel.toFixed(1)}%</div>
                </div>
                
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">Estimated Delay</div>
                  <div className="text-lg font-bold text-red-600">{simulationResults.estimatedDelay} minutes</div>
                </div>

                {simulationResults.recommendedActions.length > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Recommendations</div>
                    <ul className="text-xs text-green-800 space-y-1">
                      {simulationResults.recommendedActions.map((action: string, index: number) => (
                        <li key={index}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Run analysis to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Vehicles {simulationMode && '(Simulated)'}</p>
              <p className="text-3xl font-bold text-blue-600">{vehicleCount.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Car className={`w-8 h-8 text-blue-600 ${simulationMode ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">
              {simulationMode ? `Scenario: ${whatIfScenarios.find(s => s.id === whatIfScenario)?.name}` : '+5.2% from yesterday'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Emergency Vehicles</p>
              <p className="text-3xl font-bold text-red-600">3</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <Zap className="w-8 h-8 text-red-600 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-600">Priority routing active</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Bus Services</p>
              <p className="text-3xl font-bold text-green-600">24</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Bus className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-green-600">All routes operational</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">CCTV Feeds</p>
              <p className="text-3xl font-bold text-purple-600">156</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-600">AI monitoring active</div>
        </div>
      </div>

      {/* Parking Heatmap */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Smart Parking Management</h3>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            Optimize Routes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {parkingData.map(lot => {
            const occupancyPercentage = (lot.occupied / lot.capacity) * 100;
            return (
              <div key={lot.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{lot.name}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{lot.zone}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Occupied</span>
                    <span className="font-semibold">{lot.occupied}/{lot.capacity}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(lot.occupied, lot.capacity)}`}
                      style={{width: `${occupancyPercentage}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{occupancyPercentage.toFixed(1)}% Full</span>
                    <span>{lot.capacity - lot.occupied} Available</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Live Incidents</h3>
          </div>

          <div className="space-y-3">
            {incidents.map(incident => (
              <div key={incident.id} className={`border-l-4 p-4 rounded-lg ${getSeverityColor(incident.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{incident.type}</span>
                  <span className="text-xs">{incident.time}</span>
                </div>
                <div className="text-sm opacity-80">{incident.location}</div>
                <div className="mt-2 flex space-x-2">
                  <button className="text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded transition-colors">
                    Dispatch Unit
                  </button>
                  <button className="text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded transition-colors">
                    Update Route
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Create New Incident Report
          </button>
        </div>

        {/* Bus Scheduler */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Bus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Bus Schedule Control</h3>
          </div>

          <div className="space-y-4">
            {[
              { route: 'Alipiri - Tirumala Express', status: 'On Time', next: '12:15 PM', capacity: '85%' },
              { route: 'Tirupati - Alipiri Local', status: 'Delayed 5min', next: '12:20 PM', capacity: '60%' },
              { route: 'VIP Shuttle Service', status: 'Available', next: '12:30 PM', capacity: '40%' }
            ].map((bus, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{bus.route}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    bus.status.includes('Delayed') ? 'bg-yellow-100 text-yellow-800' :
                    bus.status === 'On Time' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {bus.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Next Departure: <span className="font-semibold">{bus.next}</span></div>
                  <div>Capacity: <span className="font-semibold">{bus.capacity}</span></div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded transition-colors">
                    Manual Override
                  </button>
                  <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors">
                    View Route
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Auto-Optimize Schedule
          </button>
        </div>
      </div>

      {/* Live Map View */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <Navigation className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Live Traffic Map</h3>
        </div>

        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <Navigation className="w-12 h-12 mx-auto mb-2 animate-spin" />
            <p>Real-time traffic visualization loading...</p>
            <p className="text-sm mt-2">Integrating with Google Maps & Drone feeds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficConsole;