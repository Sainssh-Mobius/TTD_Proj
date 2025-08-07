import React, { useState, useEffect } from 'react';
import { Users, MapPin, AlertTriangle, Radio, Activity, Zap, Target, Bell, MessageSquare, Bus, Search, Car, Eye, CheckCircle, UserCheck, X } from 'lucide-react';

const GroundStaffDashboard: React.FC = () => {
  // Pilgrim Management KPIs (Ground Staff View)
  const [pilgrimKPIs, setPilgrimKPIs] = useState({
    assignedPilgrims: 156,
    guidanceRequests: 45,
    assistanceProvided: 78,
    crowdAlerts: 12,
    queueManagement: 23
  });

  // Field Operations KPIs
  const [fieldKPIs, setFieldKPIs] = useState({
    completedTasks: 89,
    responseTime: 1.8,
    areasCovered: 8,
    emergencyAlerts: 2,
    communicationScore: 96.5,
    teamCoordination: 94.2
  });

  // Ground Staff Specific KPIs
  const [crowdKPIs, setCrowdKPIs] = useState({
    currentCrowdCount: 3247,
    densityAlerts: 4,
    highDensityZones: 2,
    averageDensity: 68.5
  });

  const [areaStatus, setAreaStatus] = useState([
    { id: 1, name: 'Main Temple Entrance', status: 'high-density', crowdCount: 892, capacity: 1000, density: 89.2, alert: true },
    { id: 2, name: 'Queue Complex A', status: 'moderate', crowdCount: 654, capacity: 800, density: 81.8, alert: false },
    { id: 3, name: 'VIP Waiting Area', status: 'normal', crowdCount: 45, capacity: 100, density: 45.0, alert: false },
    { id: 4, name: 'Rest Area 1', status: 'low', crowdCount: 123, capacity: 300, density: 41.0, alert: false },
    { id: 5, name: 'Prasadam Counter', status: 'high-density', crowdCount: 567, capacity: 600, density: 94.5, alert: true },
    { id: 6, name: 'Exit Gate B', status: 'moderate', crowdCount: 234, capacity: 400, density: 58.5, alert: false }
  ]);

  const [assignedTasks, setAssignedTasks] = useState([
    { id: 1, task: 'Crowd Control - Main Temple', priority: 'high', status: 'in-progress', assignedTime: '10:30 AM', eta: '15 min', location: 'Zone A' },
    { id: 2, task: 'Pilgrim Guidance - Queue Complex', priority: 'medium', status: 'pending', assignedTime: '11:00 AM', eta: '20 min', location: 'Zone B' },
    { id: 3, task: 'Lost Child Assistance', priority: 'high', status: 'completed', assignedTime: '09:45 AM', eta: 'Completed', location: 'Rest Area' },
    { id: 4, task: 'Elderly Support - VIP Area', priority: 'medium', status: 'in-progress', assignedTime: '11:15 AM', eta: '10 min', location: 'VIP Zone' },
    { id: 5, task: 'Queue Line Management', priority: 'low', status: 'pending', assignedTime: '11:30 AM', eta: '25 min', location: 'Queue A' }
  ]);

  const [guidanceMetrics, setGuidanceMetrics] = useState({
    activeGuidance: 23,
    completedGuidance: 67,
    languageSupport: ['Telugu', 'Tamil', 'Hindi', 'English'],
    specialAssistance: 12,
    elderlySupport: 8,
    disabilitySupport: 4
  });

  const [densityAlerts, setDensityAlerts] = useState([
    { id: 1, zone: 'Main Temple Entrance', level: 'critical', density: 89.2, time: '2 min ago', action: 'immediate' },
    { id: 2, zone: 'Prasadam Counter', level: 'high', density: 94.5, time: '5 min ago', action: 'monitor' },
    { id: 3, zone: 'Queue Complex A', level: 'moderate', density: 81.8, time: '8 min ago', action: 'watch' },
    { id: 4, zone: 'Exit Gate B', level: 'normal', density: 58.5, time: '12 min ago', action: 'none' }
  ]);

  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [whatIfScenario, setWhatIfScenario] = useState('weather-impact');
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Baseline values to show difference between current and simulation
  const [baselinePilgrimKPIs, setBaselinePilgrimKPIs] = useState<any>(null);

  // Realistic Scenario State
  const [dayType, setDayType] = useState('normal-day');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);
  const [calculatedMultiplier, setCalculatedMultiplier] = useState(1.0);

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Shift', multiplier: 1.0, description: 'Standard field operations' },
    { id: 'busy-period', name: 'Busy Period', multiplier: 1.6, description: 'High pilgrim activity period' },
    { id: 'festival-rush', name: 'Festival Rush', multiplier: 2.2, description: 'Major festival crowd management' },
    { id: 'emergency-drill', name: 'Emergency Drill', multiplier: 0.3, description: 'Emergency response training' },
    { id: 'weather-alert', name: 'Weather Alert', multiplier: 0.8, description: 'Adverse weather conditions' },
    { id: 'vip-visit', name: 'VIP Visit', multiplier: 1.4, description: 'Special security protocols' }
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

  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'darshan', category: 'Darshan Updates', location: 'Queue Zone A', priority: 'medium', time: '2 min ago', message: 'Darshan slot timing updated - inform waiting pilgrims', status: 'pending' },
    { id: 2, type: 'crowd', category: 'Crowd Alerts', location: 'Main Temple', priority: 'high', time: '5 min ago', message: 'High density detected, crowd control needed', status: 'pending' },
    { id: 3, type: 'shuttle', category: 'Shuttle Events', location: 'Alipiri Base', priority: 'medium', time: '8 min ago', message: 'Shuttle S-12 delayed by 15 minutes', status: 'pending' },
    { id: 4, type: 'lost-found', category: 'Lost & Found', location: 'Rest Area 3', priority: 'low', time: '12 min ago', message: 'Lost child reported - 8 year old boy in blue shirt', status: 'pending' },
    { id: 5, type: 'parking', category: 'Parking Saturation', location: 'Parking Lot A', priority: 'high', time: '15 min ago', message: 'Parking lot 95% full - redirect to Lot B', status: 'pending' }
  ]);

  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<typeof activeAlerts[0] | null>(null);
  const [selectedTriggerFilter, setSelectedTriggerFilter] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationMode) {
        const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
        const speedMultiplier = simulationSpeed;

        setPilgrimKPIs(prev => ({
          ...prev,
          assignedPilgrims: Math.max(0, prev.assignedPilgrims + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier * speedMultiplier)),
          guidanceRequests: Math.max(0, prev.guidanceRequests + Math.floor((Math.random() * 8 - 4) * scenarioMultiplier * speedMultiplier)),
          assistanceProvided: Math.max(0, prev.assistanceProvided + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier * speedMultiplier)),
          crowdAlerts: Math.max(0, prev.crowdAlerts + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier)),
          queueManagement: Math.max(0, prev.queueManagement + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier))
        }));

        setFieldKPIs(prev => ({
          ...prev,
          completedTasks: Math.max(0, prev.completedTasks + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier * speedMultiplier)),
          responseTime: Math.max(0.5, Math.min(10, prev.responseTime + (Math.random() * 1 - 0.5) * scenarioMultiplier)),
          areasCovered: Math.max(1, Math.min(15, prev.areasCovered + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))),
          emergencyAlerts: Math.max(0, prev.emergencyAlerts + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier)),
          communicationScore: Math.max(80, Math.min(100, prev.communicationScore + (Math.random() * 2 - 1) * scenarioMultiplier)),
          teamCoordination: Math.max(80, Math.min(100, prev.teamCoordination + (Math.random() * 2 - 1) * scenarioMultiplier))
        }));

        // Update Ground Staff specific KPIs
        setCrowdKPIs(prev => ({
          ...prev,
          currentCrowdCount: Math.max(1000, Math.min(5000,
            prev.currentCrowdCount + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier * speedMultiplier))),
          densityAlerts: Math.max(0, Math.min(10,
            prev.densityAlerts + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))),
          averageDensity: Math.max(30, Math.min(95,
            prev.averageDensity + (Math.random() * 4 - 2) * scenarioMultiplier))
        }));

        setAreaStatus(prev => prev.map(area => ({
          ...area,
          crowdCount: Math.max(10, Math.min(area.capacity,
            area.crowdCount + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier * speedMultiplier))),
          density: Math.max(20, Math.min(100,
            (area.crowdCount / area.capacity) * 100 + (Math.random() * 6 - 3)))
        })));

        // Update guidance metrics
        setGuidanceMetrics(prev => ({
          ...prev,
          activeGuidance: Math.max(0, Math.min(50,
            prev.activeGuidance + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          completedGuidance: prev.completedGuidance + Math.floor((Math.random() * 3) * scenarioMultiplier),
          specialAssistance: Math.max(0, Math.min(20,
            prev.specialAssistance + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier)))
        }));

        // Update density alerts
        setDensityAlerts(prev => {
          const newAlerts = [...prev];
          if (Math.random() < 0.3 * scenarioMultiplier) {
            // Add new alert
            const zones = ['Main Temple Entrance', 'Prasadam Counter', 'Queue Complex A', 'Exit Gate B', 'Rest Area'];
            const levels = ['normal', 'moderate', 'high', 'critical'];
            const actions = ['none', 'watch', 'monitor', 'immediate'];
            const newAlert = {
              id: Date.now(),
              zone: zones[Math.floor(Math.random() * zones.length)],
              level: levels[Math.floor(Math.random() * levels.length)],
              density: Math.floor(Math.random() * 40) + 60,
              time: 'Just now',
              action: actions[Math.floor(Math.random() * actions.length)]
            };
            newAlerts.push(newAlert);
          }
          // Remove old alerts occasionally
          if (Math.random() < 0.2 && newAlerts.length > 0) {
            newAlerts.shift();
          }
          return newAlerts.slice(0, 10); // Keep max 10 alerts
        });

        // Update assigned tasks occasionally
        if (Math.random() < 0.1) {
          setAssignedTasks(prev => prev.map(task => {
            if (task.status === 'pending' && Math.random() < 0.3) {
              return { ...task, status: 'in-progress' };
            }
            if (task.status === 'in-progress' && Math.random() < 0.2) {
              return { ...task, status: 'completed' };
            }
            return task;
          }));
        }
      }
    }, simulationMode ? 1800000 : 4000); // 1800000ms = 30 minutes for simulation updates

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, whatIfScenario]);

  const runFieldAnalysis = () => {
    // Capture baseline values when starting simulation
    if (!simulationMode) {
      setBaselinePilgrimKPIs({
        assignedPilgrims: pilgrimKPIs.assignedPilgrims,
        guidanceRequests: pilgrimKPIs.guidanceRequests,
        assistanceProvided: pilgrimKPIs.assistanceProvided,
        crowdAlerts: pilgrimKPIs.crowdAlerts,
        queueManagement: pilgrimKPIs.queueManagement
      });
    }

    // Auto-stop simulation after 30 minutes (1800000 milliseconds)
    if (!simulationMode) {
      setTimeout(() => {
        setSimulationMode(false);
        setBaselinePilgrimKPIs(null);
        console.log('Ground Staff Simulation auto-stopped after 30 minutes');
      }, 1800000); // 30 minutes = 30 * 60 * 1000 = 1800000 milliseconds
    }

    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);
    const finalMultiplier = scenario!.multiplier * calculatedMultiplier;
    const projectedWorkload = Math.floor(pilgrimKPIs.assignedPilgrims * finalMultiplier);
    const projectedTasks = Math.floor(pilgrimKPIs.guidanceRequests * finalMultiplier);
    const projectedResponseTime = fieldKPIs.responseTime * (finalMultiplier > 1 ? finalMultiplier * 0.8 : 1);
    const workloadStrain = Math.min(100, (projectedWorkload / 200) * 100);

    setSimulationResults({
      scenario: scenario!.name,
      dayType: dayTypes.find(d => d.id === dayType)?.name,
      calculatedMultiplier,
      projectedWorkload,
      projectedTasks,
      projectedResponseTime,
      workloadStrain,
      fieldRecommendations: getFieldRecommendations(finalMultiplier, workloadStrain)
    });
  };

  const getFieldRecommendations = (multiplier: number, strain: number) => {
    const recommendations = [];
    if (multiplier > 2) recommendations.push('Request additional ground staff');
    if (multiplier > 1.5) recommendations.push('Prioritize high-impact assistance');
    if (strain > 80) recommendations.push('Focus on crowd management');
    if (multiplier < 0.5) recommendations.push('Conduct training and maintenance');
    if (strain > 90) recommendations.push('Escalate to operational command');
    return recommendations;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'darshan': return <Bell className="w-4 h-4" />;
      case 'crowd': return <Users className="w-4 h-4" />;
      case 'shuttle': return <Bus className="w-4 h-4" />;
      case 'lost-found': return <Search className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'darshan': return 'text-yellow-600 bg-yellow-100';
      case 'crowd': return 'text-red-600 bg-red-100';
      case 'shuttle': return 'text-orange-600 bg-orange-100';
      case 'lost-found': return 'text-purple-600 bg-purple-100';
      case 'parking': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'high-density': return 'bg-red-400';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDensityLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTriggerAction = (triggerId: number, action: 'acknowledge' | 'delegate') => {
    setActiveAlerts(prev => prev.map(alert =>
      alert.id === triggerId
        ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'delegated' }
        : alert
    ));
    setShowTriggerModal(false);
    setSelectedTrigger(null);
  };

  const openTriggerModal = (trigger: typeof activeAlerts[0]) => {
    setSelectedTrigger(trigger);
    setShowTriggerModal(true);
  };

  const filteredAlerts = selectedTriggerFilter === 'all'
    ? activeAlerts.filter(alert => alert.status === 'pending')
    : activeAlerts.filter(alert => alert.type === selectedTriggerFilter && alert.status === 'pending');

  return (
    <div className="max-w-full mx-auto">
      {/* Ground Staff Command Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white p-6 mb-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ground Staff Command Center</h1>
            <p className="text-green-100">Real-time field operations and direct pilgrim assistance</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-green-200">Field Status</div>
              <div className="text-lg font-bold">All Teams Active</div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Unified Field Operations Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Field Performance Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">My Performance</h3>
                <p className="text-sm text-gray-600">Today's metrics</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Tasks Completed</p>
                    <p className="text-2xl font-bold text-green-800">{fieldKPIs.completedTasks}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Today</p>
                    <p className="text-sm font-bold text-green-700">Excellent</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold text-yellow-800">{fieldKPIs.responseTime.toFixed(1)} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">Average</p>
                    <p className="text-sm font-bold text-yellow-700">Good</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Areas Covered</p>
                    <p className="text-2xl font-bold text-purple-800">{fieldKPIs.areasCovered}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Active zones</p>
                    <p className="text-sm font-bold text-purple-700">Full</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crowd Monitoring Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Crowd Monitoring</h3>
                <p className="text-sm text-gray-600">Real-time crowd data</p>
              </div>
            </div>

            {/* Crowd Metrics */}
            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">Current Crowd {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-red-800">{crowdKPIs.currentCrowdCount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">In my areas</p>
                    <p className="text-sm font-bold text-red-700">Active</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Density Alerts</p>
                    <p className="text-2xl font-bold text-orange-800">{crowdKPIs.densityAlerts}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-600">Active</p>
                    <p className="text-sm font-bold text-orange-700">Monitor</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Avg Density</p>
                    <p className="text-2xl font-bold text-yellow-800">{crowdKPIs.averageDensity.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">My zones</p>
                    <p className="text-sm font-bold text-yellow-700">Normal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Tasks Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">My Tasks</h3>
                <p className="text-sm text-gray-600">{assignedTasks.filter(t => t.status !== 'completed').length} active tasks</p>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {assignedTasks.slice(0, 3).map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${getTaskStatusColor(task.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{task.task}</span>
                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-xs opacity-80 mb-1">{task.location}</div>
                  <div className="flex justify-between text-xs">
                    <span>Assigned: {task.assignedTime}</span>
                    <span className="font-semibold">ETA: {task.eta}</span>
                  </div>
                </div>
              ))}

              {assignedTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Guidance Metrics Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Guidance Support</h3>
                <p className="text-sm text-gray-600">Pilgrim assistance</p>
              </div>
            </div>

            {/* Guidance Metrics */}
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Active Guidance</p>
                    <p className="text-2xl font-bold text-purple-800">{guidanceMetrics.activeGuidance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Current</p>
                    <p className="text-sm font-bold text-purple-700">Helping</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Completed Today</p>
                    <p className="text-2xl font-bold text-green-800">{guidanceMetrics.completedGuidance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Pilgrims</p>
                    <p className="text-sm font-bold text-green-700">Helped</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Special Assistance</p>
                    <p className="text-2xl font-bold text-blue-800">{guidanceMetrics.specialAssistance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Elderly/Disabled</p>
                    <p className="text-sm font-bold text-blue-700">Priority</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Triggers Panel - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Active Triggers</h3>
                  <p className="text-sm text-gray-600">{filteredAlerts.length} pending actions</p>
                </div>
              </div>
              <button
                onClick={() => setShowTriggerModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedTriggerFilter('all')}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedTriggerFilter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All ({activeAlerts.filter(a => a.status === 'pending').length})
              </button>
              {[
                { id: 'darshan', name: 'Darshan', color: 'yellow' },
                { id: 'crowd', name: 'Crowd', color: 'red' },
                { id: 'shuttle', name: 'Shuttle', color: 'orange' },
                { id: 'lost-found', name: 'Lost', color: 'purple' },
                { id: 'parking', name: 'Parking', color: 'blue' }
              ].map(category => {
                const count = activeAlerts.filter(a => a.type === category.id && a.status === 'pending').length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedTriggerFilter(category.id)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedTriggerFilter === category.id
                      ? `bg-${category.color}-500 text-white`
                      : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                      }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Trigger List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredAlerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => openTriggerModal(alert)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getPriorityColor(alert.priority)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getTypeColor(alert.type)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <span className="font-semibold text-sm capitalize">{alert.type.replace('-', ' ')}</span>
                    </div>
                    <span className="text-xs">{alert.time}</span>
                  </div>
                  <div className="text-xs opacity-80 mb-1">{alert.location}</div>
                  <div className="text-sm">{alert.message}</div>
                  <div className="text-xs text-gray-500 mt-2">Click to manage →</div>
                </div>
              ))}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active triggers</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Area-wise Status & Crowd Density Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area-wise Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Area-wise Status</h3>
            </div>

            <div className="space-y-4">
              {areaStatus.map(area => (
                <div key={area.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`}></div>
                      <span className="font-semibold text-gray-800">{area.name}</span>
                      {area.alert && (
                        <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                          Alert
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-600">
                      {area.density.toFixed(1)}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Occupancy</span>
                      <span className="font-semibold">{area.crowdCount}/{area.capacity}</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${area.density >= 90 ? 'bg-red-500' :
                          area.density >= 70 ? 'bg-yellow-500' :
                            area.density >= 50 ? 'bg-orange-500' :
                              'bg-green-500'
                          }`}
                        style={{ width: `${area.density}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600">
                      <span className="capitalize">{area.status.replace('-', ' ')}</span>
                      <span>{(area.capacity - area.crowdCount)} available</span>
                    </div>
                  </div>

                  {area.alert && (
                    <button className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors">
                      Take Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Crowd Density Alerts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Density Alerts</h3>
            </div>

            <div className="space-y-3">
              {densityAlerts.map(alert => (
                <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getDensityLevelColor(alert.level)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{alert.zone}</span>
                    <span className="text-xs">{alert.time}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Density: {alert.density}%</span>
                    <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.level === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                      {alert.level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 capitalize">Action: {alert.action}</span>
                    {alert.level === 'critical' && (
                      <button className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors">
                        Respond Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center space-x-2 text-amber-800">
                <Eye className="w-4 h-4" />
                <span className="font-semibold text-sm">Monitoring Guidelines:</span>
              </div>
              <ul className="text-amber-700 text-xs mt-2 space-y-1">
                <li>• Critical (90%+): Immediate crowd control needed</li>
                <li>• High (80-89%): Enhanced monitoring required</li>
                <li>• Moderate (70-79%): Watch for escalation</li>
                <li>• Normal (&lt;70%): Standard operations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Field Operations Summary */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-green-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Field Operations Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Current Assignments</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {crowdKPIs.currentCrowdCount.toLocaleString()} people in monitored areas</li>
                <li>• {fieldKPIs.areasCovered} zones actively monitored</li>
                <li>• {fieldKPIs.completedTasks} tasks completed today</li>
                <li>• {fieldKPIs.responseTime.toFixed(1)} min average response</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Active Support</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {guidanceMetrics.activeGuidance} pilgrims receiving guidance</li>
                <li>• {guidanceMetrics.languageSupport.length} languages supported</li>
                <li>• {guidanceMetrics.specialAssistance} special assistance cases</li>
                <li>• {crowdKPIs.densityAlerts} active density alerts</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Next Priorities</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {assignedTasks.filter(t => t.status === 'pending').length} pending tasks to complete</li>
                <li>• {areaStatus.filter(a => a.alert).length} areas requiring attention</li>
                <li>• {densityAlerts.filter(a => a.level === 'critical').length} critical density alerts</li>
                <li>• Shift handover at 6:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          {/* FIELD SCENARIOS - Column 1 */}
           <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 flex w-full justify-between">
              <h5 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Realistic Scenario Builder</span>
              </h5>

            {/* Realistic Scenario Configuration */}
            
              {/* Day Type Selection */}
              <div className='flex w-2/3 flex-row justify-evenly'>
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
                        className="text-green-600"
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
                        className="text-teal-600"
                      />
                      <span className="text-sm text-gray-700">{festival.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              </div>

              {/* Calculated Impact */}
              {/* <div className="mt-4 p-3 bg-white/70 rounded-lg border border-green-300">
                <div className="text-sm font-semibold text-gray-700">🧠 Calculated Impact</div>
                <div className="text-lg font-bold text-green-600">
                  {calculatedMultiplier > 1 ? '+' : ''}{((calculatedMultiplier - 1) * 100).toFixed(0)}% Workload Increase
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Multiplier: {calculatedMultiplier.toFixed(2)}x
                </div>
              </div> */}
            </div>
          </div>

          {/* WHAT-IF SCENARIOS - Column 2 */}
          {/* <div className="flex flex-col justify-between space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {whatIfScenarios.map(scenario => (
                <div
                  key={scenario.id}
                  onClick={() => setWhatIfScenario(scenario.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${whatIfScenario === scenario.id
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                >
                  <div className="font-semibold text-gray-800 mb-1">{scenario.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{scenario.description}</div>
                  <div className="text-xs text-green-600 font-semibold">
                    Base Workload: {scenario.multiplier > 1 ? '+' : ''}{((scenario.multiplier - 1) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={runFieldAnalysis}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
            >
              Run Field Analysis
            </button>
          </div> */}

          {/* FIELD INSIGHTS - Column 3 */}
          {/* <div className="space-y-4">
            <h4 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Field Insights</span>
            </h4>

            {simulationResults ? (
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-700">Active Scenario</div>
                  <div className="text-lg font-bold text-green-600">{simulationResults.scenario}</div>
                  {simulationResults.dayType && (
                    <div className="text-xs text-gray-600 mt-1">Day: {simulationResults.dayType}</div>
                  )}
                </div>

                <div className="p-4 bg-teal-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-700">Total Multiplier</div>
                  <div className="text-lg font-bold text-teal-600">{simulationResults.calculatedMultiplier.toFixed(2)}x</div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-700">Workload</div>
                  <div className="text-lg font-bold text-blue-600">{simulationResults.projectedWorkload}</div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-700">Response Time</div>
                  <div className="text-lg font-bold text-yellow-600">{simulationResults.projectedResponseTime.toFixed(1)} min</div>
                </div>

                <div className="p-4 bg-red-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-700">Workload Strain</div>
                  <div className="text-lg font-bold text-red-600">{simulationResults.workloadStrain.toFixed(1)}%</div>
                </div>

                  {simulationResults.fieldRecommendations.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700 mb-2">Field Actions</div>
                      <ul className="text-xs text-amber-800 space-y-1">
                        {simulationResults.fieldRecommendations.map((rec: string, index: number) => (
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
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Run analysis to see field insights</p>
                </div>
              )}
            </div> */}
          

        {/* Field Operations Simulation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-xl text-white">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Field Operations Time Series & Task Simulation</h3>
                <p className="text-gray-600 mt-1">Real-time field trends, workload predictions, and task management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Speed:</label>
                <select
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  disabled={simulationMode}
                >
                  <option value={1}>1x</option>
                  <option value={5}>5x</option>
                  <option value={10}>10x</option>
                  <option value={30}>30x</option>
                  <option value={60}>60x</option>
                </select>
              </div> */}
              <button
                onClick={() => {
                  if (simulationMode) {
                    // Stop simulation and reset baseline
                    setSimulationMode(false);
                    setBaselinePilgrimKPIs(null);
                  } else {
                    // Start simulation
                    setSimulationMode(true);
                    runFieldAnalysis();
                  }
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${simulationMode
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                  }`}
              >
                <Activity className="w-5 h-5" />
                <span>{simulationMode ? 'Stop Simulation' : 'Start Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Time Series Charts */}
          <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Field Workload Time Series */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800 text-lg">Field Workload Trends</h4>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Simulation</span>
                  </div>
                </div>
              </div>

              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i;
                    const currentHeight = Math.max(25, Math.min(85, 40 + Math.sin(i * 0.6) * 20 + Math.random() * 8));
                    const predictedHeight = Math.max(25, Math.min(85, currentHeight + 8 + Math.sin(i * 0.4) * 12));
                    const simulationHeight = simulationMode ?
                      Math.max(25, Math.min(85, currentHeight * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1))) :
                      currentHeight;

                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div
                            className="w-2 bg-blue-500 rounded-t transition-all duration-500"
                            style={{ height: `${currentHeight}%` }}
                          ></div>
                          <div
                            className="w-2 bg-purple-500 rounded-t opacity-70 transition-all duration-500"
                            style={{ height: `${predictedHeight}%` }}
                          ></div>
                          {simulationMode && (
                            <div
                              className="w-2 bg-green-500 rounded-t animate-pulse transition-all duration-500"
                              style={{ height: `${simulationHeight}%` }}
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
                  <div className="text-lg font-bold text-blue-600">
                    {simulationMode && baselinePilgrimKPIs ? baselinePilgrimKPIs.assignedPilgrims : pilgrimKPIs.assignedPilgrims}
                  </div>
                  <div className="text-xs text-blue-800">Current Workload</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.floor((simulationMode && baselinePilgrimKPIs ? baselinePilgrimKPIs.assignedPilgrims : pilgrimKPIs.assignedPilgrims) * 1.3)}
                  </div>
                  <div className="text-xs text-purple-800">Predicted Peak</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {pilgrimKPIs.assignedPilgrims}
                    </div>
                    <div className="text-xs text-green-800">Simulation Load</div>
                  </div>
                )}
              </div>
            </div>
          </div>



        </div>
      </div>

      {/* Trigger Action Modal */}
      {showTriggerModal && selectedTrigger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Manage Trigger</h3>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded ${getTypeColor(selectedTrigger.type)}`}>
                  {getTypeIcon(selectedTrigger.type)}
                </div>
                <div>
                  <div className="font-semibold capitalize">{selectedTrigger.type.replace('-', ' ')}</div>
                  <div className="text-sm text-gray-600">{selectedTrigger.location}</div>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-4">{selectedTrigger.message}</div>

              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTrigger.priority)}`}>
                {selectedTrigger.priority} priority
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleTriggerAction(selectedTrigger.id, 'acknowledge')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Acknowledge</span>
              </button>
              <button
                onClick={() => handleTriggerAction(selectedTrigger.id, 'delegate')}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Delegate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default GroundStaffDashboard