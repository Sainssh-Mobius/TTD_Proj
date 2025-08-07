import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, Eye, Shield, BarChart3, Brain, Clock, Play, Settings, Sliders, Target, Zap } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [whatIfScenario, setWhatIfScenario] = useState('normal');
  const [simulationResults, setSimulationResults] = useState<any>(null);
  
  const [footfallData, setFootfallData] = useState({
    current: 45632,
    predicted: 52000,
    peak: 68000
  });

  const [crowdParameters, setCrowdParameters] = useState({
    maxCapacity: 75000,
    safetyThreshold: 60000,
    emergencyThreshold: 70000,
    darshanSlotsPerHour: 2000,
    averageStayDuration: 45, // minutes
    weatherImpact: 1.0,
    festivalMultiplier: 2.5
  });

  const [crowdZones, setCrowdZones] = useState([
    { id: 1, name: 'Main Temple', density: 85, capacity: 5000, status: 'high' },
    { id: 2, name: 'Queue Area A', density: 92, capacity: 3000, status: 'critical' },
    { id: 3, name: 'Alipiri Base', density: 45, capacity: 2000, status: 'normal' },
    { id: 4, name: 'Parking Zones', density: 67, capacity: 8000, status: 'moderate' }
  ]);

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Day', multiplier: 1.0, description: 'Standard operations' },
    { id: 'festival', name: 'Major Festival', multiplier: 3.0, description: 'Brahmotsavam level crowds' },
    { id: 'weekend', name: 'Weekend Rush', multiplier: 1.8, description: 'Saturday/Sunday peak' },
    { id: 'emergency', name: 'Emergency Evacuation', multiplier: 0.1, description: 'Crowd evacuation scenario' },
    { id: 'vip', name: 'VIP Darshan', multiplier: 0.6, description: 'Restricted access period' },
    { id: 'weather', name: 'Adverse Weather', multiplier: 0.4, description: 'Heavy rain/storm impact' }
  ];

  const [emergencyAlerts, setEmergencyAlerts] = useState([
    { id: 1, type: 'Medical', location: 'Queue Zone B', priority: 'high', time: '11:45 AM', status: 'responding' },
    { id: 2, type: 'Lost Child', location: 'Main Temple', priority: 'medium', time: '11:30 AM', status: 'resolved' },
    { id: 3, type: 'Fire Drill', location: 'Admin Block', priority: 'low', time: '10:15 AM', status: 'completed' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const baseChange = Math.floor(Math.random() * 100) - 50;
      const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
      const simulationMultiplier = simulationMode ? simulationSpeed : 1;
      
      setFootfallData(prev => ({
        ...prev,
        current: Math.max(0, Math.min(crowdParameters.maxCapacity, 
          prev.current + (baseChange * scenarioMultiplier * simulationMultiplier)))
      }));

      setCrowdZones(prev => prev.map(zone => ({
        ...zone,
        density: Math.max(20, Math.min(100, 
          zone.density + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier * simulationMultiplier)))
      })));
    }, simulationMode ? 1000 / simulationSpeed : 5000);

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, whatIfScenario, crowdParameters.maxCapacity]);

  const runCrowdAnalysis = () => {
    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);
    const projectedCrowd = Math.floor(footfallData.current * scenario!.multiplier);
    const capacityUtilization = (projectedCrowd / crowdParameters.maxCapacity) * 100;
    const safetyRisk = projectedCrowd > crowdParameters.safetyThreshold ? 'High' : 
                      projectedCrowd > crowdParameters.safetyThreshold * 0.8 ? 'Medium' : 'Low';
    const requiredSlots = Math.ceil(projectedCrowd / crowdParameters.darshanSlotsPerHour);
    const estimatedWaitTime = Math.max(0, (projectedCrowd - crowdParameters.safetyThreshold) / 100);
    
    setSimulationResults({
      scenario: scenario!.name,
      projectedCrowd,
      capacityUtilization,
      safetyRisk,
      requiredSlots,
      estimatedWaitTime,
      recommendations: getCrowdRecommendations(projectedCrowd, safetyRisk, capacityUtilization)
    });
  };

  const getCrowdRecommendations = (crowd: number, risk: string, utilization: number) => {
    const recommendations = [];
    if (risk === 'High') recommendations.push('Activate emergency protocols');
    if (utilization > 90) recommendations.push('Implement crowd control measures');
    if (utilization > 80) recommendations.push('Increase darshan slot frequency');
    if (crowd > crowdParameters.safetyThreshold) recommendations.push('Deploy additional volunteers');
    if (utilization > 95) recommendations.push('Consider temporary entry restrictions');
    return recommendations;
  };

  const getDensityColor = (density: number) => {
    if (density >= 90) return 'bg-red-500';
    if (density >= 70) return 'bg-yellow-500';
    if (density >= 50) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Crowd Simulation & What-If Analysis */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">AI Pilgrim Flow Simulation & Predictive Analysis</h3>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Crowd Parameters */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Crowd Parameters</span>
            </h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
              <input
                type="number"
                value={crowdParameters.maxCapacity}
                onChange={(e) => setCrowdParameters(prev => ({...prev, maxCapacity: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Safety Threshold</label>
              <input
                type="number"
                value={crowdParameters.safetyThreshold}
                onChange={(e) => setCrowdParameters(prev => ({...prev, safetyThreshold: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Darshan Slots/Hour</label>
              <input
                type="number"
                value={crowdParameters.darshanSlotsPerHour}
                onChange={(e) => setCrowdParameters(prev => ({...prev, darshanSlotsPerHour: parseInt(e.target.value)}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

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
          </div>

          {/* What-If Scenarios */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>What-If Scenarios</span>
            </h4>
            
            <div className="space-y-2">
              {whatIfScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  onClick={() => setWhatIfScenario(scenario.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    whatIfScenario === scenario.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-800 text-sm">{scenario.name}</div>
                  <div className="text-xs text-gray-600">{scenario.description}</div>
                  <div className="text-xs text-purple-600 mt-1">
                    Impact: {scenario.multiplier > 1 ? '+' : ''}{((scenario.multiplier - 1) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={runCrowdAnalysis}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Run Crowd Analysis
            </button>
          </div>

          {/* Analysis Results */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analysis Results</span>
            </h4>
            
            {simulationResults ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700">Scenario</div>
                  <div className="text-sm font-bold text-purple-600">{simulationResults.scenario}</div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700">Projected Crowd</div>
                  <div className="text-sm font-bold text-blue-600">{simulationResults.projectedCrowd.toLocaleString()}</div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700">Capacity Utilization</div>
                  <div className="text-sm font-bold text-yellow-600">{simulationResults.capacityUtilization.toFixed(1)}%</div>
                </div>
                
                <div className={`p-3 rounded-lg ${
                  simulationResults.safetyRisk === 'High' ? 'bg-red-50' :
                  simulationResults.safetyRisk === 'Medium' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                  <div className="text-xs font-medium text-gray-700">Safety Risk</div>
                  <div className={`text-sm font-bold ${
                    simulationResults.safetyRisk === 'High' ? 'text-red-600' :
                    simulationResults.safetyRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                  }`}>{simulationResults.safetyRisk}</div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="text-xs font-medium text-gray-700">Required Slots</div>
                  <div className="text-sm font-bold text-indigo-600">{simulationResults.requiredSlots}/hour</div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Run analysis to see predictions</p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>AI Recommendations</span>
            </h4>
            
            {simulationResults?.recommendations ? (
              <div className="space-y-2">
                {simulationResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xs text-green-800 font-medium">• {rec}</div>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-xs font-medium text-amber-800 mb-1">Estimated Wait Time</div>
                  <div className="text-sm font-bold text-amber-600">{simulationResults.estimatedWaitTime.toFixed(0)} minutes</div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">AI recommendations will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Footfall {simulationMode && '(Simulated)'}</p>
              <p className="text-3xl font-bold text-blue-600">{footfallData.current.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className={`w-8 h-8 text-blue-600 ${simulationMode ? 'animate-pulse' : ''}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">
              {simulationMode ? `Scenario: ${whatIfScenarios.find(s => s.id === whatIfScenario)?.name}` : '+12% from yesterday'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">AI Predicted Peak</p>
              <p className="text-3xl font-bold text-purple-600">{footfallData.predicted.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-purple-600">Expected at 3:30 PM</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Emergencies</p>
              <p className="text-3xl font-bold text-red-600">2</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-red-600">1 medical, 1 security</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Face Recognition</p>
              <p className="text-3xl font-bold text-indigo-600">156</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Eye className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-indigo-600">Active matches today</div>
        </div>
      </div>

      {/* AI Forecasting Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-3 rounded-xl text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">AI Footfall Forecasting</h3>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm transition-colors">
              Hourly
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm transition-colors">
              Daily
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-2 h-40">
          {Array.from({length: 12}, (_, i) => {
            const height = Math.random() * 80 + 20;
            return (
              <div key={i} className="flex flex-col justify-end">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                  style={{height: `${height}%`}}
                ></div>
                <div className="text-xs text-gray-600 text-center mt-2">
                  {8 + i}:00
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crowd Density Heatmap */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Real-time Crowd Density</h3>
          </div>

          <div className="space-y-4">
            {crowdZones.map(zone => (
              <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{zone.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    zone.status === 'critical' ? 'bg-red-100 text-red-800' :
                    zone.status === 'high' ? 'bg-orange-100 text-orange-800' :
                    zone.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {zone.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Density</span>
                    <span className="font-semibold">{zone.density}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getDensityColor(zone.density)}`}
                      style={{width: `${zone.density}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Capacity: {zone.capacity}</span>
                    <span>Current: {Math.floor(zone.capacity * zone.density / 100)}</span>
                  </div>
                </div>

                {zone.density >= 85 && (
                  <button className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors">
                    Trigger Crowd Control
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Response Center */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-3 rounded-xl">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Emergency Response</h3>
          </div>

          <div className="space-y-3">
            {emergencyAlerts.map(alert => (
              <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getPriorityColor(alert.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{alert.type}</span>
                  <span className="text-xs">{alert.time}</span>
                </div>
                <div className="text-sm opacity-80 mb-2">{alert.location}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.status === 'responding' ? 'bg-blue-100 text-blue-800' :
                    alert.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.status}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded transition-colors">
                      Details
                    </button>
                    <button className="text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded transition-colors">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Emergency Broadcast
          </button>
        </div>
      </div>

      {/* Darshan Slot Management */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">AI-Powered Slot Reallocation</h3>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors">
            Auto-Optimize Slots
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">2,156</div>
            <div className="text-sm text-green-800">Available Slots</div>
            <div className="text-xs text-gray-600 mt-2">Next 24 hours</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">8,742</div>
            <div className="text-sm text-blue-800">Booked Slots</div>
            <div className="text-xs text-gray-600 mt-2">Today</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">456</div>
            <div className="text-sm text-purple-800">AI Reallocated</div>
            <div className="text-xs text-gray-600 mt-2">Last hour</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">AI Recommendation:</span>
          </div>
          <p className="text-amber-700 mt-2">
            Increase slot capacity by 15% between 2:00-4:00 PM to handle predicted peak footfall. 
            Consider opening additional darshan lines in Queue Area C.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;