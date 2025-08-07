import React, { useState, useEffect } from 'react';
import { Settings, Users, Car, AlertTriangle, Activity, Clock, MapPin, Shield, Zap, Target, BarChart3, TrendingUp, Brain } from 'lucide-react';
import VIPMovementModal from './VIPMovementModal';

const OperationalDashboard: React.FC = () => {
  const [showVIPModal, setShowVIPModal] = useState(false);
  
  // Pilgrim Management KPIs
  const [pilgrimKPIs, setPilgrimKPIs] = useState({
    currentPilgrims: 45632,
    aiPredictedPeak: 52000,
    queueWaitTime: 35,
    darshanSlots: 2156,
    queueEfficiency: 87.3,
    crowdDensity: 78.5
  });

  // Traffic Management KPIs
  const [trafficKPIs, setTrafficKPIs] = useState({
    currentVehicles: 1247,
    aiPredictedPeak: 1650,
    avgTravelTime: 72,
    parkingUtilization: 78.5,
    shuttleServices: 24,
    trafficFlow: 92.3
  });

  // Operational KPIs
  const [operationalKPIs, setOperationalKPIs] = useState({
    staffUtilization: 87.3,
    systemUptime: 99.8,
    incidentResponse: 2.3,
    emergencyUnits: 12,
    volunteerCount: 156,
    facilitiesStatus: 98.2
  });

  // Zone-level Operations Data
  const [zoneOperations, setZoneOperations] = useState([
    { id: 1, name: 'Main Temple Complex', currentCount: 8456, capacity: 12000, status: 'normal', incidents: 0, staffOnDuty: 45 },
    { id: 2, name: 'Queue Complex A', currentCount: 3247, capacity: 4000, status: 'high', incidents: 1, staffOnDuty: 28 },
    { id: 3, name: 'Queue Complex B', currentCount: 2156, capacity: 3500, status: 'normal', incidents: 0, staffOnDuty: 22 },
    { id: 4, name: 'VIP Darshan Area', currentCount: 156, capacity: 300, status: 'normal', incidents: 0, staffOnDuty: 12 },
    { id: 5, name: 'Alipiri Base Complex', currentCount: 1847, capacity: 2500, status: 'normal', incidents: 0, staffOnDuty: 18 },
    { id: 6, name: 'Parking & Transport', currentCount: 2341, capacity: 5000, status: 'moderate', incidents: 2, staffOnDuty: 35 }
  ]);

  // Queue Complex Data
  const [queueComplexes, setQueueComplexes] = useState([
    { id: 1, name: 'Compartment 1', occupancy: 89, capacity: 500, eta: 45, status: 'active' },
    { id: 2, name: 'Compartment 2', occupancy: 76, capacity: 500, eta: 38, status: 'active' },
    { id: 3, name: 'Compartment 3', occupancy: 92, capacity: 500, eta: 52, status: 'high' },
    { id: 4, name: 'Compartment 4', occupancy: 67, capacity: 500, eta: 32, status: 'active' },
    { id: 5, name: 'VIP Queue', occupancy: 45, capacity: 100, eta: 15, status: 'normal' }
  ]);

  // VIP Movement Tracking
  const [vipMovement, setVipMovement] = useState({
    currentVIPs: 23,
    scheduledArrivals: 8,
    inTransit: 5,
    completedDarshan: 12,
    securityLevel: 'high',
    protocolActive: true
  });

  // Entry/Exit Gate Status
  const [gateStatus, setGateStatus] = useState([
    { id: 1, name: 'Main Entry Gate', status: 'open', throughput: 156, capacity: 200, waitTime: 8 },
    { id: 2, name: 'VIP Entry Gate', status: 'controlled', throughput: 23, capacity: 50, waitTime: 2 },
    { id: 3, name: 'Exit Gate A', status: 'open', throughput: 134, capacity: 180, waitTime: 5 },
    { id: 4, name: 'Exit Gate B', status: 'open', throughput: 98, capacity: 150, waitTime: 3 },
    { id: 5, name: 'Emergency Gate', status: 'standby', throughput: 0, capacity: 100, waitTime: 0 }
  ]);

  // Staff Status by Department
  const [staffStatus, setStaffStatus] = useState([
    { department: 'Security', onDuty: 45, total: 50, efficiency: 94.2 },
    { department: 'Queue Management', onDuty: 28, total: 32, efficiency: 91.8 },
    { department: 'VIP Protocol', onDuty: 12, total: 15, efficiency: 96.5 },
    { department: 'Crowd Control', onDuty: 35, total: 40, efficiency: 89.3 },
    { department: 'Emergency Response', onDuty: 18, total: 20, efficiency: 97.1 }
  ]);

  // Zone Incidents
  const [zoneIncidents, setZoneIncidents] = useState([
    { id: 1, zone: 'Queue Complex A', type: 'Medical', severity: 'medium', time: '10 min ago', status: 'responding' },
    { id: 2, zone: 'Parking Area', type: 'Traffic', severity: 'low', time: '25 min ago', status: 'resolved' },
    { id: 3, zone: 'Main Temple', type: 'Lost Child', severity: 'high', time: '5 min ago', status: 'active' }
  ]);

  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [whatIfScenario, setWhatIfScenario] = useState('normal');
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Realistic Scenario State
  const [dayType, setDayType] = useState('normal-day');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);
  const [calculatedMultiplier, setCalculatedMultiplier] = useState(1.0);

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Operations', multiplier: 1.0, description: 'Standard operational parameters' },
    { id: 'peak-hours', name: 'Peak Hours', multiplier: 1.8, description: 'Morning & evening rush periods' },
    { id: 'festival-day', name: 'Festival Day', multiplier: 2.5, description: 'Major festival operations' },
    { id: 'weather-impact', name: 'Adverse Weather', multiplier: 0.7, description: 'Rain/storm operational impact' },
    { id: 'maintenance-mode', name: 'Maintenance Window', multiplier: 0.4, description: 'Scheduled maintenance operations' },
    { id: 'emergency-response', name: 'Emergency Protocol', multiplier: 0.2, description: 'Emergency response scenario' }
  ];

  // Realistic Scenario Configuration
  const dayTypes = [
    { id: 'normal-day', name: 'Normal Day', multiplier: 1.0 },
    { id: 'state-holiday', name: 'State Holiday', multiplier: 1.8 },
    { id: 'summer-vacation', name: 'Summer Vacation', multiplier: 2.2 },
    { id: 'rainy-day', name: 'Rainy Day', multiplier: 0.6 }
  ];

  const ttdSpecialDaysConfig = [
    { id: 'brahmotsavam', name: 'Brahmotsavam', multiplier: 2.5 },
    { id: 'vaikunta-ekadashi', name: 'Vaikunta Ekadashi', multiplier: 3.2 },
    { id: 'chaturmaasa-vratam', name: 'Chaturmaasa Vratam', multiplier: 1.6 }
  ];

  const regionalFestivalsConfig = [
    { id: 'andhra-pradesh', name: 'Andhra Pradesh', multiplier: 1.4 },
    { id: 'telangana', name: 'Telangana', multiplier: 1.3 },
    { id: 'tamil-nadu', name: 'Tamil Nadu', multiplier: 1.2 }
  ];

  // Auto-calculate multiplier based on selections
  useEffect(() => {
    let baseMultiplier = dayTypes.find(d => d.id === dayType)?.multiplier || 1.0;
    
    ttdSpecialDays.forEach(dayId => {
      const specialDay = ttdSpecialDaysConfig.find(d => d.id === dayId);
      if (specialDay) {
        baseMultiplier *= specialDay.multiplier;
      }
    });
    
    regionalFestivals.forEach(festivalId => {
      const festival = regionalFestivalsConfig.find(f => f.id === festivalId);
      if (festival) {
        baseMultiplier *= festival.multiplier;
      }
    });
    
    if (ttdSpecialDays.includes('vaikunta-ekadashi') && regionalFestivals.includes('telangana')) {
      baseMultiplier *= 1.15;
    }
    
    setCalculatedMultiplier(Math.min(baseMultiplier, 5.0));
  }, [dayType, ttdSpecialDays, regionalFestivals]);

  const handleTtdSpecialDayToggle = (dayId: string) => {
    setTtdSpecialDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleRegionalFestivalToggle = (festivalId: string) => {
    setRegionalFestivals(prev => 
      prev.includes(festivalId) 
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationMode) {
        const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
        const speedMultiplier = simulationSpeed;
        
        setPilgrimKPIs(prev => ({
          ...prev,
          currentPilgrims: Math.max(0, prev.currentPilgrims + Math.floor((Math.random() * 200 - 100) * scenarioMultiplier * speedMultiplier)),
          aiPredictedPeak: Math.max(prev.currentPilgrims, prev.aiPredictedPeak + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier)),
          queueWaitTime: Math.max(5, Math.min(120, prev.queueWaitTime + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier))),
          darshanSlots: Math.max(0, prev.darshanSlots + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier)),
          queueEfficiency: Math.max(60, Math.min(100, prev.queueEfficiency + (Math.random() * 4 - 2) * scenarioMultiplier)),
          crowdDensity: Math.max(40, Math.min(100, prev.crowdDensity + (Math.random() * 6 - 3) * scenarioMultiplier))
        }));

        setTrafficKPIs(prev => ({
          ...prev,
          currentVehicles: Math.max(0, prev.currentVehicles + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier * speedMultiplier)),
          aiPredictedPeak: Math.max(prev.currentVehicles, prev.aiPredictedPeak + Math.floor((Math.random() * 30 - 15) * scenarioMultiplier)),
          avgTravelTime: Math.max(15, Math.min(60, prev.avgTravelTime + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          parkingUtilization: Math.max(40, Math.min(100, prev.parkingUtilization + (Math.random() * 6 - 3) * scenarioMultiplier)),
          shuttleServices: Math.max(10, Math.min(40, prev.shuttleServices + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          trafficFlow: Math.max(60, Math.min(100, prev.trafficFlow + (Math.random() * 2 - 1) * scenarioMultiplier))
        }));

        setOperationalKPIs(prev => ({
          ...prev,
          staffUtilization: Math.max(60, Math.min(100, prev.staffUtilization + (Math.random() * 4 - 2) * scenarioMultiplier)),
          systemUptime: Math.max(95, Math.min(100, prev.systemUptime + (Math.random() * 0.4 - 0.2))),
          incidentResponse: Math.max(1, Math.min(10, prev.incidentResponse + (Math.random() * 1 - 0.5) * scenarioMultiplier)),
          emergencyUnits: Math.max(8, Math.min(20, prev.emergencyUnits + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))),
          volunteerCount: Math.max(100, Math.min(250, prev.volunteerCount + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier)))
        }));

        // Update zone operations
        setZoneOperations(prev => prev.map(zone => ({
          ...zone,
          currentCount: Math.max(0, Math.min(zone.capacity, 
            zone.currentCount + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier * speedMultiplier))),
          incidents: Math.max(0, zone.incidents + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))
        })));

        // Update queue complexes
        setQueueComplexes(prev => prev.map(queue => ({
          ...queue,
          occupancy: Math.max(30, Math.min(100, 
            queue.occupancy + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier))),
          eta: Math.max(10, Math.min(90, 
            queue.eta + Math.floor((Math.random() * 8 - 4) * scenarioMultiplier)))
        })));

        // Update VIP movement
        setVipMovement(prev => ({
          ...prev,
          currentVIPs: Math.max(0, Math.min(50, prev.currentVIPs + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          inTransit: Math.max(0, Math.min(20, prev.inTransit + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier)))
        }));

        // Update gate status
        setGateStatus(prev => prev.map(gate => ({
          ...gate,
          throughput: Math.max(0, Math.min(gate.capacity, 
            gate.throughput + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier))),
          waitTime: Math.max(0, Math.min(30, 
            gate.waitTime + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier)))
        })));
      }
    }, simulationMode ? 1000 / simulationSpeed : 3000);

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, whatIfScenario]);

  const runOperationalAnalysis = () => {
    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);
    const finalMultiplier = scenario!.multiplier * calculatedMultiplier;
    const projectedPilgrims = Math.floor(pilgrimKPIs.currentPilgrims * finalMultiplier);
    const projectedVehicles = Math.floor(trafficKPIs.currentVehicles * finalMultiplier);
    const projectedWaitTime = Math.floor(pilgrimKPIs.queueWaitTime * (finalMultiplier > 1 ? finalMultiplier : 1));
    const resourceStrain = Math.min(100, (projectedPilgrims / 75000) * 100);
    
    let overbookingRisk = 0;
    if (ttdSpecialDays.includes('vaikunta-ekadashi') && regionalFestivals.length > 0) {
      overbookingRisk = 25;
    }
    
    setSimulationResults({
      scenario: scenario!.name,
      dayType: dayTypes.find(d => d.id === dayType)?.name,
      calculatedMultiplier,
      projectedPilgrims,
      projectedVehicles,
      projectedWaitTime,
      resourceStrain,
      overbookingRisk,
      operationalRecommendations: getOperationalRecommendations(finalMultiplier, resourceStrain, overbookingRisk)
    });
  };

  const getOperationalRecommendations = (multiplier: number, strain: number, overbookingRisk: number) => {
    const recommendations = [];
    if (multiplier > 2) recommendations.push('Activate all backup systems');
    if (multiplier > 1.5) recommendations.push('Deploy additional staff');
    if (strain > 80) recommendations.push('Implement crowd control measures');
    if (multiplier < 0.5) recommendations.push('Scale down non-essential operations');
    if (strain > 90) recommendations.push('Consider entry restrictions');
    if (overbookingRisk > 20) recommendations.push('Monitor slot allocation closely');
    if (dayType === 'rainy-day') recommendations.push('Activate weather protocols');
    return recommendations;
  };

  const getStatusColor = (value: number, thresholds: {good: number, warning: number}) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGateStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'controlled': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      case 'standby': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'bg-red-500';
    if (occupancy >= 75) return 'bg-yellow-500';
    if (occupancy >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Operational Command Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 mb-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Operational Command Center</h1>
            <p className="text-blue-100">Real-time operations management and resource coordination</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-blue-200">Current Status</div>
              <div className="text-lg font-bold">All Systems Active</div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Settings className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Unified Operations Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Pilgrim Operations Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Pilgrim Operations</h3>
                <p className="text-sm text-gray-600">Live crowd management</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Current Load {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-blue-800">{pilgrimKPIs.currentPilgrims.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Capacity</p>
                    <p className="text-sm font-bold text-blue-700">{((pilgrimKPIs.currentPilgrims / 75000) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">AI Predicted Peak</p>
                    <p className="text-2xl font-bold text-purple-800">{pilgrimKPIs.aiPredictedPeak.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Expected</p>
                    <p className="text-sm font-bold text-purple-700">3:30 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Queue Wait Time</p>
                    <p className="text-2xl font-bold text-yellow-800">{pilgrimKPIs.queueWaitTime} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">Target: {'<30'}</p>
                    <p className={`text-sm font-bold ${pilgrimKPIs.queueWaitTime <= 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {pilgrimKPIs.queueWaitTime <= 30 ? 'On Track' : 'Alert'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Optimize Queues
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Add Slots
              </button>
            </div>
          </div>

          {/* Traffic Operations Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl text-white">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Traffic Operations</h3>
                <p className="text-sm text-gray-600">Vehicle flow management</p>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Current Vehicles {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-orange-800">{trafficKPIs.currentVehicles.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-600">Per hour</p>
                    <p className="text-sm font-bold text-orange-700">Road cap: 2K</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">AI Predicted Peak</p>
                    <p className="text-2xl font-bold text-red-800">{trafficKPIs.aiPredictedPeak.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">Expected</p>
                    <p className="text-sm font-bold text-red-700">4:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Travel Time</p>
                    <p className="text-2xl font-bold text-blue-800">{trafficKPIs.avgTravelTime} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Alipiri-Temple</p>
                    <p className={`text-sm font-bold ${trafficKPIs.avgTravelTime <= 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {trafficKPIs.avgTravelTime <= 30 ? 'Good' : 'Congested'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Route Traffic
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Add Shuttles
              </button>
            </div>
          </div>

          {/* Resource & Emergency Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Resources & Emergency</h3>
                <p className="text-sm text-gray-600">System status & response</p>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Staff Utilization</p>
                    <p className="text-2xl font-bold text-purple-800">{operationalKPIs.staffUtilization.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Optimal: 80-90%</p>
                    <p className="text-sm font-bold text-purple-700">Good</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">System Uptime</p>
                    <p className="text-2xl font-bold text-green-800">{operationalKPIs.systemUptime.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">All systems</p>
                    <p className="text-sm font-bold text-green-700">Excellent</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold text-red-800">{operationalKPIs.incidentResponse.toFixed(1)} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">Target: &lt;3 min</p>
                    <p className="text-sm font-bold text-red-700">Good</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Status */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-800">All Emergency Units Ready</span>
              </div>
              <div className="text-xs text-green-700 mt-1">{operationalKPIs.emergencyUnits} units active • {operationalKPIs.volunteerCount} volunteers on duty</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Zone-Level Operations */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Tirumala Zone Operations</h3>
                <p className="text-sm text-gray-600">Live zone monitoring {simulationMode && '(Simulated)'}</p>
              </div>
            </div>

            <div className="space-y-4">
              {zoneOperations.map(zone => {
                const occupancyPercentage = (zone.currentCount / zone.capacity) * 100;
                return (
                  <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-800">{zone.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded border ${getZoneStatusColor(zone.status)}`}>
                          {zone.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-800">{zone.currentCount.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">of {zone.capacity.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(occupancyPercentage)}`}
                        style={{width: `${occupancyPercentage}%`}}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                      <div>Occupancy: <span className="font-semibold">{occupancyPercentage.toFixed(1)}%</span></div>
                      <div>Staff: <span className="font-semibold">{zone.staffOnDuty}</span></div>
                      <div>Incidents: <span className={`font-semibold ${zone.incidents > 0 ? 'text-red-600' : 'text-green-600'}`}>{zone.incidents}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue Complex Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Queue Complex Status</h3>
                <p className="text-sm text-gray-600">Real-time queue monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {queueComplexes.map(queue => (
                <div key={queue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-800">{queue.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        queue.status === 'high' ? 'bg-red-100 text-red-800' :
                        queue.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {queue.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{queue.eta} min</div>
                      <div className="text-xs text-gray-600">ETA</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(queue.occupancy)}`}
                      style={{width: `${queue.occupancy}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Occupancy: <span className="font-semibold">{queue.occupancy}%</span></span>
                    <span>Capacity: <span className="font-semibold">{queue.capacity}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowVIPModal(true)}
          className="bg-gradient-to-r from-amber-500 to-red-600 hover:shadow-lg text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2"
        >
          <Shield className="w-5 h-5" />
          <span>Manage VIP Movement</span>
        </button>

        {/* VIP Movement & Gate Status */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* VIP Movement Tracking */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">VIP Movement Control</h3>
                <p className="text-sm text-gray-600">Special darshan coordination</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-amber-600">{vipMovement.currentVIPs}</div>
                <div className="text-sm text-amber-800">Current VIPs</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600">{vipMovement.inTransit}</div>
                <div className="text-sm text-orange-800">In Transit</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{vipMovement.completedDarshan}</div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{vipMovement.scheduledArrivals}</div>
                <div className="text-sm text-blue-800">Scheduled</div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-red-800">Security Protocol: {vipMovement.securityLevel.toUpperCase()}</span>
              </div>
              <div className="text-xs text-red-700">
                {vipMovement.protocolActive ? 'VIP protocols active • Enhanced security measures' : 'Standard operations'}
              </div>
            </div>
          </div>

          {/* Entry/Exit Gate Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Gate Operations</h3>
                <p className="text-sm text-gray-600">Entry/Exit monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {gateStatus.map(gate => (
                <div key={gate.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getGateStatusColor(gate.status)}`}></div>
                      <h4 className="font-semibold text-gray-800">{gate.name}</h4>
                      <span className="text-xs text-gray-600 capitalize">{gate.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">{gate.throughput}/hr</div>
                      <div className="text-xs text-gray-600">Throughput</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>Capacity: <span className="font-semibold">{gate.capacity}/hr</span></div>
                    <div>Utilization: <span className="font-semibold">{((gate.throughput/gate.capacity)*100).toFixed(0)}%</span></div>
                    <div>Wait: <span className="font-semibold">{gate.waitTime} min</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Status & Zone Incidents */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* On-Duty Staff Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Staff Deployment Status</h3>
                <p className="text-sm text-gray-600">Department-wise allocation</p>
              </div>
            </div>

            <div className="space-y-4">
              {staffStatus.map((dept, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{dept.department}</h4>
                    <div className="text-right">
                      <div className="text-sm font-bold text-teal-600">{dept.onDuty}/{dept.total}</div>
                      <div className="text-xs text-gray-600">On Duty</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                      style={{width: `${(dept.onDuty/dept.total)*100}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Deployment: <span className="font-semibold">{((dept.onDuty/dept.total)*100).toFixed(0)}%</span></span>
                    <span>Efficiency: <span className="font-semibold text-green-600">{dept.efficiency}%</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Incidents */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Zone Incidents</h3>
                <p className="text-sm text-gray-600">Active incident monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {zoneIncidents.map(incident => (
                <div key={incident.id} className={`border-l-4 p-4 rounded-lg ${
                  incident.severity === 'high' ? 'bg-red-50 border-red-500' :
                  incident.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">{incident.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{incident.time}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{incident.zone}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      incident.status === 'active' ? 'bg-red-100 text-red-800' :
                      incident.status === 'responding' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.status}
                    </span>
                    <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Report New Incident
            </button>
          </div>
        </div>

        {/* Operational Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl text-white">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Operational Command Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Zone Operations</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {zoneOperations.filter(z => z.status === 'normal').length} zones operating normally</li>
                <li>• {zoneOperations.reduce((sum, z) => sum + z.currentCount, 0).toLocaleString()} total pilgrims across zones</li>
                <li>• {zoneOperations.reduce((sum, z) => sum + z.staffOnDuty, 0)} staff members deployed</li>
                <li>• {zoneIncidents.filter(i => i.status === 'active').length} active incidents being managed</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Queue & VIP Operations</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {queueComplexes.length} queue compartments monitored</li>
                <li>• Average ETA: {Math.round(queueComplexes.reduce((sum, q) => sum + q.eta, 0) / queueComplexes.length)} minutes</li>
                <li>• {vipMovement.currentVIPs} VIPs currently in complex</li>
                <li>• {vipMovement.protocolActive ? 'Enhanced' : 'Standard'} security protocols active</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Gate & Staff Status</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {gateStatus.filter(g => g.status === 'open').length} gates currently operational</li>
                <li>• Average wait time: {Math.round(gateStatus.reduce((sum, g) => sum + g.waitTime, 0) / gateStatus.length)} minutes</li>
                <li>• {staffStatus.reduce((sum, s) => sum + s.onDuty, 0)} staff on active duty</li>
                <li>• {(staffStatus.reduce((sum, s) => sum + s.efficiency, 0) / staffStatus.length).toFixed(1)}% average efficiency</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Operational Scenarios */}
         <div className="space-y-6">
              <h4 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Operational Scenarios</span>
              </h4>
              
              {/* Realistic Scenario Configuration */}
              <div className='flex flex-col md:flex-row gap-6'>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 flex w-full justify-between">
                <h5 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Realistic Scenario Builder</span>
                </h5>
                <div className='flex w-2/3 flex-row justify-evenly'>
                {/* Day Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🗓️ Day Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {dayTypes.map(day => (
                      <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="dayType"
                          value={day.id}
                          checked={dayType === day.id}
                          onChange={(e) => setDayType(e.target.value)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{day.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* TTD Special Days */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🛕 TTD Special Days</label>
                  <div className="space-y-1">
                    {ttdSpecialDaysConfig.map(day => (
                      <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={ttdSpecialDays.includes(day.id)}
                          onChange={() => handleTtdSpecialDayToggle(day.id)}
                          className="text-purple-600"
                        />
                        <span className="text-sm text-gray-700">{day.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Regional Festivals */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🌍 Regional Festivals</label>
                  <div className="space-y-1">
                    {regionalFestivalsConfig.map(festival => (
                      <label key={festival.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={regionalFestivals.includes(festival.id)}
                          onChange={() => handleRegionalFestivalToggle(festival.id)}
                          className="text-green-600"
                        />
                        <span className="text-sm text-gray-700">{festival.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                </div>
                
                {/* Calculated Impact */}
                {/* <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-300">
                  <div className="text-sm font-semibold text-gray-700">🧠 Calculated Impact</div>
                  <div className="text-lg font-bold text-blue-600">
                    {calculatedMultiplier > 1 ? '+' : ''}{((calculatedMultiplier - 1) * 100).toFixed(0)}% Load Increase
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Multiplier: {calculatedMultiplier.toFixed(2)}x
                  </div>
                </div> */}
              </div>
              
              {/* <div className="grid w-[49%] grid-cols-1 md:grid-cols-2 gap-3">
                {whatIfScenarios.map(scenario => (
                  <div
                    key={scenario.id}
                    onClick={() => setWhatIfScenario(scenario.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                      whatIfScenario === scenario.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-semibold text-gray-800 mb-1">{scenario.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{scenario.description}</div>
                    <div className="text-xs text-blue-600 font-semibold">
                      Base Load: {scenario.multiplier > 1 ? '+' : ''}{((scenario.multiplier - 1) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              <button
                onClick={runOperationalAnalysis}
                className=" col-span-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg w-full"
              >
                Run Operational Analysis
              </button>
              </div> */}
              
              </div>
            </div>

        {/* Operational Simulation Control */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl text-white">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Operational Time Series Analysis & Simulation</h3>
                <p className="text-gray-600 mt-1">Real-time trends, AI predictions, and operational scenario testing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSimulationMode(!simulationMode)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  simulationMode 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>{simulationMode ? 'Stop Simulation' : 'Start Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Time Series Charts */}
          <div className="grid grid-cols-1 gap-8 m-10">
            {/* Pilgrim Operations Time Series */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800 text-lg">Pilgrim Operations Trends</h4>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>AI Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Simulation</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {Array.from({length: 24}, (_, i) => {
                    const hour = i;
                    const currentHeight = Math.max(20, Math.min(90, 35 + Math.sin(i * 0.5) * 25 + Math.random() * 10));
                    const predictedHeight = Math.max(20, Math.min(90, currentHeight + 12 + Math.sin(i * 0.3) * 18));
                    const simulationHeight = simulationMode ? 
                      Math.max(20, Math.min(90, currentHeight * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1))) : 
                      currentHeight;
                    
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div 
                            className="w-2 bg-blue-500 rounded-t transition-all duration-500"
                            style={{height: `${currentHeight}%`}}
                          ></div>
                          <div 
                            className="w-2 bg-purple-500 rounded-t opacity-70 transition-all duration-500"
                            style={{height: `${predictedHeight}%`}}
                          ></div>
                          {simulationMode && (
                            <div 
                              className="w-2 bg-green-500 rounded-t animate-pulse transition-all duration-500"
                              style={{height: `${simulationHeight}%`}}
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center">
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{pilgrimKPIs.currentPilgrims.toLocaleString()}</div>
                  <div className="text-xs text-blue-800">Current Load</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{pilgrimKPIs.aiPredictedPeak.toLocaleString()}</div>
                  <div className="text-xs text-purple-800">AI Predicted</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {Math.floor(pilgrimKPIs.currentPilgrims * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1)).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-800">Simulation Load</div>
                  </div>
                )}
              </div>
            </div>

            {/* Traffic Operations Time Series */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800 text-lg">Traffic Operations Trends</h4>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>AI Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span>Simulation</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {Array.from({length: 24}, (_, i) => {
                    const hour = i;
                    const currentHeight = Math.max(15, Math.min(85, 30 + Math.sin(i * 0.4) * 20 + Math.random() * 8));
                    const predictedHeight = Math.max(15, Math.min(85, currentHeight + 8 + Math.sin(i * 0.2) * 15));
                    const simulationHeight = simulationMode ? 
                      Math.max(15, Math.min(85, currentHeight * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1))) : 
                      currentHeight;
                    
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div 
                            className="w-2 bg-orange-500 rounded-t transition-all duration-500"
                            style={{height: `${currentHeight}%`}}
                          ></div>
                          <div 
                            className="w-2 bg-red-500 rounded-t opacity-70 transition-all duration-500"
                            style={{height: `${predictedHeight}%`}}
                          ></div>
                          {simulationMode && (
                            <div 
                              className="w-2 bg-teal-500 rounded-t animate-pulse transition-all duration-500"
                              style={{height: `${simulationHeight}%`}}
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center">
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{trafficKPIs.currentVehicles.toLocaleString()}</div>
                  <div className="text-xs text-orange-800">Current Flow</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{trafficKPIs.aiPredictedPeak.toLocaleString()}</div>
                  <div className="text-xs text-red-800">AI Predicted</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="text-lg font-bold text-teal-600">
                      {Math.floor(trafficKPIs.currentVehicles * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1)).toLocaleString()}
                    </div>
                    <div className="text-xs text-teal-800">Simulation Flow</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Simulation Controls */}
            {/* <div className="space-y-6">
              <h4 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Control Panel</span>
              </h4>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Simulation Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-gray-600 mt-2 font-medium">{simulationSpeed}x speed</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-sm font-semibold text-blue-800 mb-2">System Status</div>
                <div className="text-xs text-blue-700">
                  {simulationMode ? 'Simulation Active' : 'Live Operations'}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Travel Time: {trafficKPIs.avgTravelTime} min (Min: 60 min)
                </div>
              </div>
            </div> */}

            
           

            {/* Analysis Results */}
            {/* <div className="space-y-4">
              <h4 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Analysis Results</span>
              </h4>
              
              {simulationResults ? (
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700">Active Scenario</div>
                    <div className="text-lg font-bold text-blue-600">{simulationResults.scenario}</div>
                    {simulationResults.dayType && (
                      <div className="text-xs text-gray-600 mt-1">Day: {simulationResults.dayType}</div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-cyan-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700">Total Multiplier</div>
                    <div className="text-lg font-bold text-cyan-600">{simulationResults.calculatedMultiplier.toFixed(2)}x</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700">Projected Load</div>
                    <div className="text-lg font-bold text-green-600">{simulationResults.projectedPilgrims.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700">Wait Time</div>
                    <div className="text-lg font-bold text-yellow-600">{simulationResults.projectedWaitTime} min</div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl">
                    <div className="text-sm font-semibold text-gray-700">Resource Strain</div>
                    <div className="text-lg font-bold text-red-600">{simulationResults.resourceStrain.toFixed(1)}%</div>
                  </div>

                  {simulationResults.overbookingRisk > 0 && (
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700">Overbooking Risk</div>
                      <div className="text-lg font-bold text-orange-600">{simulationResults.overbookingRisk}%</div>
                    </div>
                  )}

                  {simulationResults.operationalRecommendations.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Actions Required</div>
                      <ul className="text-xs text-amber-800 space-y-1">
                        {simulationResults.operationalRecommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start space-x-1">
                            <span>•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Run analysis to see operational insights</p>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
    
    <VIPMovementModal 
      isOpen={showVIPModal}
      onClose={() => setShowVIPModal(false)} 
    />
    
    <VIPMovementModal 
);
};

export default OperationalDashboard;