import React, { useState, useEffect } from 'react';
import { 
  Users, Target, CheckCircle, MessageSquare, Bell, MapPin, 
  AlertTriangle, Activity, Eye, Clock, TrendingUp, BarChart3,
  Zap, Shield, Navigation, Settings, Play, Pause, RotateCcw
} from 'lucide-react';

const GroundStaffDashboard: React.FC = () => {
  // Simulation state
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [dayType, setDayType] = useState('normal');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);
  
  // UI state
  const [selectedTriggerFilter, setSelectedTriggerFilter] = useState('all');
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<any>(null);
  const [showScenarioBuilder, setShowScenarioBuilder] = useState(false);

  // Real-time data state
  const [fieldKPIs, setFieldKPIs] = useState({
    completedTasks: 23,
    responseTime: 4.2,
    areasCovered: 8,
    efficiency: 94.5
  });

  const [crowdKPIs, setCrowdKPIs] = useState({
    currentCrowdCount: 15420,
    densityAlerts: 3,
    averageDensity: 67.8,
    peakDensity: 89.2
  });

  const [guidanceMetrics, setGuidanceMetrics] = useState({
    activeGuidance: 12,
    completedGuidance: 89,
    specialAssistance: 7,
    languageSupport: ['Telugu', 'Tamil', 'Hindi', 'English', 'Kannada']
  });

  // Configuration data
  const dayTypes = [
    { id: 'normal', name: 'Normal Day', multiplier: 1.0 },
    { id: 'weekend', name: 'Weekend', multiplier: 1.5 },
    { id: 'holiday', name: 'Public Holiday', multiplier: 2.0 },
    { id: 'festival', name: 'Festival Day', multiplier: 3.5 }
  ];

  const ttdSpecialDaysConfig = [
    { id: 'brahmotsavam', name: 'Brahmotsavam', multiplier: 4.0 },
    { id: 'vaikunta-ekadasi', name: 'Vaikunta Ekadasi', multiplier: 5.0 },
    { id: 'rathasaptami', name: 'Rathasaptami', multiplier: 3.5 },
    { id: 'garuda-seva', name: 'Garuda Seva', multiplier: 3.0 }
  ];

  const regionalFestivalsConfig = [
    { id: 'diwali', name: 'Diwali', multiplier: 2.5 },
    { id: 'dussehra', name: 'Dussehra', multiplier: 2.0 },
    { id: 'ugadi', name: 'Ugadi', multiplier: 2.2 },
    { id: 'sankranti', name: 'Sankranti', multiplier: 1.8 }
  ];

  // Sample data
  const [assignedTasks] = useState([
    { id: 1, task: 'Crowd Control at Main Gate', location: 'Gate 1', priority: 'high', status: 'in-progress', assignedTime: '10:30 AM', eta: '15 min' },
    { id: 2, task: 'Guide Lost Pilgrim Family', location: 'Zone C', priority: 'medium', status: 'pending', assignedTime: '11:15 AM', eta: '10 min' },
    { id: 3, task: 'Assist Elderly Devotees', location: 'Queue Line 3', priority: 'high', status: 'pending', assignedTime: '11:45 AM', eta: '5 min' },
    { id: 4, task: 'Traffic Management', location: 'Parking Area B', priority: 'low', status: 'completed', assignedTime: '9:00 AM', eta: 'Completed' }
  ]);

  const [activeAlerts] = useState([
    { id: 1, type: 'crowd', message: 'High density detected in Main Temple area', location: 'Main Temple', priority: 'critical', time: '11:30 AM', status: 'pending' },
    { id: 2, type: 'darshan', message: 'Queue overflow in VIP line', location: 'VIP Queue', priority: 'high', time: '11:25 AM', status: 'pending' },
    { id: 3, type: 'lost-found', message: 'Child separated from family', location: 'Zone B', priority: 'critical', time: '11:20 AM', status: 'pending' },
    { id: 4, type: 'shuttle', message: 'Bus breakdown at Alipiri', location: 'Alipiri Base', priority: 'medium', time: '11:15 AM', status: 'in-progress' },
    { id: 5, type: 'parking', message: 'Parking lot nearly full', location: 'Lot A', priority: 'low', time: '11:10 AM', status: 'pending' }
  ]);

  const [areaStatus] = useState([
    { id: 1, name: 'Main Temple', status: 'high-density', crowdCount: 2800, capacity: 3000, density: 93.3, alert: true },
    { id: 2, name: 'Queue Complex', status: 'moderate', crowdCount: 1500, capacity: 2000, density: 75.0, alert: false },
    { id: 3, name: 'Parking Area A', status: 'normal', crowdCount: 800, capacity: 1200, density: 66.7, alert: false },
    { id: 4, name: 'VIP Section', status: 'high-density', crowdCount: 450, capacity: 500, density: 90.0, alert: true }
  ]);

  const [densityAlerts] = useState([
    { id: 1, zone: 'Main Temple Entrance', density: 95, level: 'critical', action: 'immediate crowd control', time: '11:30 AM' },
    { id: 2, zone: 'Queue Line 2', density: 87, level: 'high', action: 'enhanced monitoring', time: '11:25 AM' },
    { id: 3, zone: 'Prasadam Counter', density: 78, level: 'moderate', action: 'watch for escalation', time: '11:20 AM' }
  ]);

  // Simulation effects
  useEffect(() => {
    if (!simulationMode) return;

    const interval = setInterval(() => {
      const baseMultiplier = dayTypes.find(d => d.id === dayType)?.multiplier || 1;
      const ttdMultiplier = ttdSpecialDays.reduce((acc, day) => {
        const config = ttdSpecialDaysConfig.find(d => d.id === day);
        return acc + (config?.multiplier || 0);
      }, 0);
      const festivalMultiplier = regionalFestivals.reduce((acc, festival) => {
        const config = regionalFestivalsConfig.find(f => f.id === festival);
        return acc + (config?.multiplier || 0);
      }, 0);

      const totalMultiplier = baseMultiplier + ttdMultiplier + festivalMultiplier;
      const speedMultiplier = simulationSpeed;

      // Update crowd data
      setCrowdKPIs(prev => ({
        ...prev,
        currentCrowdCount: Math.max(5000, Math.min(50000, 
          prev.currentCrowdCount + Math.floor((Math.random() * 200 - 100) * totalMultiplier * speedMultiplier)
        )),
        averageDensity: Math.max(30, Math.min(95, 
          prev.averageDensity + (Math.random() * 4 - 2) * totalMultiplier * speedMultiplier
        )),
        densityAlerts: Math.max(0, Math.min(10, 
          prev.densityAlerts + Math.floor((Math.random() * 2 - 1) * totalMultiplier)
        ))
      }));

      // Update field KPIs
      setFieldKPIs(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + Math.floor(Math.random() * 2 * speedMultiplier),
        responseTime: Math.max(1, Math.min(15, 
          prev.responseTime + (Math.random() * 1 - 0.5) * speedMultiplier
        )),
        efficiency: Math.max(70, Math.min(100, 
          prev.efficiency + (Math.random() * 2 - 1) * speedMultiplier
        ))
      }));

      // Update guidance metrics
      setGuidanceMetrics(prev => ({
        ...prev,
        activeGuidance: Math.max(0, Math.min(50, 
          prev.activeGuidance + Math.floor((Math.random() * 4 - 2) * totalMultiplier)
        )),
        completedGuidance: prev.completedGuidance + Math.floor(Math.random() * 3 * speedMultiplier),
        specialAssistance: Math.max(0, Math.min(20, 
          prev.specialAssistance + Math.floor((Math.random() * 2 - 1) * totalMultiplier)
        ))
      }));
    }, 2000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, dayType, ttdSpecialDays, regionalFestivals]);

  // Helper functions
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

  const resetSimulation = () => {
    setSimulationMode(false);
    setSimulationSpeed(1);
    setDayType('normal');
    setTtdSpecialDays([]);
    setRegionalFestivals([]);
    
    // Reset to default values
    setFieldKPIs({
      completedTasks: 23,
      responseTime: 4.2,
      areasCovered: 8,
      efficiency: 94.5
    });
    
    setCrowdKPIs({
      currentCrowdCount: 15420,
      densityAlerts: 3,
      averageDensity: 67.8,
      peakDensity: 89.2
    });
    
    setGuidanceMetrics({
      activeGuidance: 12,
      completedGuidance: 89,
      specialAssistance: 7,
      languageSupport: ['Telugu', 'Tamil', 'Hindi', 'English', 'Kannada']
    });
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'in-progress': return 'bg-blue-50 border-blue-200';
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high-density': return 'bg-red-500';
      case 'moderate': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDensityLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'moderate': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-green-500 bg-green-50';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crowd': return 'bg-red-100 text-red-600';
      case 'darshan': return 'bg-yellow-100 text-yellow-600';
      case 'shuttle': return 'bg-orange-100 text-orange-600';
      case 'lost-found': return 'bg-purple-100 text-purple-600';
      case 'parking': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crowd': return <Users className="w-3 h-3" />;
      case 'darshan': return <Eye className="w-3 h-3" />;
      case 'shuttle': return <Navigation className="w-3 h-3" />;
      case 'lost-found': return <AlertTriangle className="w-3 h-3" />;
      case 'parking': return <MapPin className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const filteredAlerts = activeAlerts.filter(alert => 
    selectedTriggerFilter === 'all' || alert.type === selectedTriggerFilter
  ).filter(alert => alert.status === 'pending');

  const openTriggerModal = (alert: any) => {
    setSelectedTrigger(alert);
    setShowTriggerModal(true);
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Enhanced Header with Simulation Controls */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Ground Staff Command Center</h1>
              <p className="text-green-100">Real-time field operations and direct pilgrim assistance</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-green-200">Field Status</div>
                <div className="text-lg font-bold flex items-center space-x-2">
                  <span>All Teams Active</span>
                  {simulationMode && (
                    <div className="bg-white/20 px-2 py-1 rounded text-xs animate-pulse">
                      SIMULATION
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Simulation Control Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSimulationMode(!simulationMode)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    simulationMode 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {simulationMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{simulationMode ? 'Stop Simulation' : 'Start Simulation'}</span>
                </button>

                {simulationMode && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Speed:</span>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                        className="w-20"
                      />
                      <span className="text-sm font-medium">{simulationSpeed}x</span>
                    </div>

                    <button
                      onClick={resetSimulation}
                      className="flex items-center space-x-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setShowScenarioBuilder(!showScenarioBuilder)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Scenario Builder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scenario Builder Panel */}
        {showScenarioBuilder && (
          <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Day Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <span>🗓️</span>
                  <span>Day Type</span>
                </label>
                <div className="space-y-2">
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
                      <span className="text-sm text-white">{day.name}</span>
                      <span className="text-xs text-green-200">({day.multiplier}x)</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* TTD Special Days */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <span>🛕</span>
                  <span>TTD Special Days</span>
                </label>
                <div className="space-y-2">
                  {ttdSpecialDaysConfig.map(day => (
                    <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ttdSpecialDays.includes(day.id)}
                        onChange={() => handleTtdSpecialDayToggle(day.id)}
                        className="text-purple-600"
                      />
                      <span className="text-sm text-white">{day.name}</span>
                      <span className="text-xs text-purple-200">({day.multiplier}x)</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regional Festivals */}
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center space-x-2">
                  <span>🌍</span>
                  <span>Regional Festivals</span>
                </label>
                <div className="space-y-2">
                  {regionalFestivalsConfig.map(festival => (
                    <label key={festival.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={regionalFestivals.includes(festival.id)}
                        onChange={() => handleRegionalFestivalToggle(festival.id)}
                        className="text-teal-600"
                      />
                      <span className="text-sm text-white">{festival.name}</span>
                      <span className="text-xs text-teal-200">({festival.multiplier}x)</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced KPI Dashboard */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Field Performance Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">My Performance</h3>
              <p className="text-sm text-gray-600">Today's metrics</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">Tasks Completed</p>
                  <p className="text-2xl font-bold text-green-800">{fieldKPIs.completedTasks}</p>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+12% from yesterday</span>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 text-sm font-medium">Response Time</p>
                  <p className="text-2xl font-bold text-yellow-800">{fieldKPIs.responseTime.toFixed(1)} min</p>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-yellow-600">Target: &lt;5 min</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">Efficiency</p>
                  <p className="text-2xl font-bold text-purple-800">{fieldKPIs.efficiency.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${fieldKPIs.efficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crowd Monitoring Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Crowd Monitoring</h3>
              <p className="text-sm text-gray-600">Real-time crowd data</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-700 text-sm font-medium">
                    Current Crowd {simulationMode && <span className="text-xs">(Sim)</span>}
                  </p>
                  <p className="text-2xl font-bold text-red-800">{crowdKPIs.currentCrowdCount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Activity className={`w-5 h-5 text-red-600 ${simulationMode ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-700 text-sm font-medium">Density Alerts</p>
                  <p className="text-2xl font-bold text-orange-800">{crowdKPIs.densityAlerts}</p>
                </div>
                <div className="text-right">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 text-sm font-medium">Avg Density</p>
                  <p className="text-2xl font-bold text-yellow-800">{crowdKPIs.averageDensity.toFixed(1)}%</p>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${crowdKPIs.averageDensity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Tasks Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">My Tasks</h3>
              <p className="text-sm text-gray-600">{assignedTasks.filter(t => t.status !== 'completed').length} active tasks</p>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {assignedTasks.slice(0, 4).map(task => (
              <div key={task.id} className={`p-4 rounded-xl border transition-all hover:shadow-sm ${getTaskStatusColor(task.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{task.task}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{task.location}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Assigned: {task.assignedTime}</span>
                  <span className="font-semibold text-blue-600">ETA: {task.eta}</span>
                </div>
                {task.status === 'pending' && (
                  <button className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors">
                    Start Task
                  </button>
                )}
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl text-white">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Guidance Support</h3>
              <p className="text-sm text-gray-600">Pilgrim assistance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-700 text-sm font-medium">Active Guidance</p>
                  <p className="text-2xl font-bold text-purple-800">{guidanceMetrics.activeGuidance}</p>
                </div>
                <div className="text-right">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium">Completed Today</p>
                  <p className="text-2xl font-bold text-green-800">{guidanceMetrics.completedGuidance}</p>
                </div>
                <div className="text-right">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-medium">Special Assistance</p>
                  <p className="text-2xl font-bold text-blue-800">{guidanceMetrics.specialAssistance}</p>
                </div>
                <div className="text-right">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs font-medium text-gray-700 mb-2">Languages Supported:</p>
              <div className="flex flex-wrap gap-1">
                {guidanceMetrics.languageSupport.map(lang => (
                  <span key={lang} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Triggers Panel - Enhanced */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
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
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg transition-colors"
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
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {filteredAlerts.slice(0, 4).map(alert => (
              <div
                key={alert.id}
                onClick={() => openTriggerModal(alert)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${getPriorityColor(alert.priority)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${getTypeColor(alert.type)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <span className="font-semibold text-sm capitalize">{alert.type.replace('-', ' ')}</span>
                  </div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <div className="text-xs text-gray-600 mb-2 flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{alert.location}</span>
                </div>
                <div className="text-sm text-gray-800 mb-2">{alert.message}</div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    alert.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.priority}
                  </span>
                  <span className="text-xs text-blue-600 hover:text-blue-800">Click to manage →</span>
                </div>
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

      {/* Area Status and Density Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area-wise Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Area-wise Status</h3>
          </div>

          <div className="space-y-4">
            {areaStatus.map(area => (
              <div key={area.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`}></div>
                    <span className="font-semibold text-gray-800">{area.name}</span>
                    {area.alert && (
                      <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium animate-pulse">
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

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        area.density >= 90 ? 'bg-red-500' :
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
                  <button className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                    Take Action
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Crowd Density Alerts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl text-white">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Density Alerts</h3>
          </div>

          <div className="space-y-4">
            {densityAlerts.map(alert => (
              <div key={alert.id} className={`border-l-4 p-4 rounded-xl transition-all hover:shadow-sm ${getDensityLevelColor(alert.level)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{alert.zone}</span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Density: {alert.density}%</span>
                  <span className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${
                    alert.level === 'critical' ? 'bg-red-100 text-red-800' :
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
                    <button className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition-colors">
                      Respond Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 text-amber-800 mb-2">
              <Eye className="w-4 h-4" />
              <span className="font-semibold text-sm">Monitoring Guidelines:</span>
            </div>
            <ul className="text-amber-700 text-xs space-y-1">
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
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Current Assignments</span>
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• {crowdKPIs.currentCrowdCount.toLocaleString()} people in monitored areas</li>
              <li>• {fieldKPIs.areasCovered} zones actively monitored</li>
              <li>• {fieldKPIs.completedTasks} tasks completed today</li>
              <li>• {fieldKPIs.responseTime.toFixed(1)} min average response</li>
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Active Support</span>
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• {guidanceMetrics.activeGuidance} pilgrims receiving guidance</li>
              <li>• {guidanceMetrics.languageSupport.length} languages supported</li>
              <li>• {guidanceMetrics.specialAssistance} special assistance cases</li>
              <li>• {crowdKPIs.densityAlerts} active density alerts</li>
            </ul>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Next Priorities</span>
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>• {assignedTasks.filter(t => t.status === 'pending').length} pending tasks to complete</li>
              <li>• {areaStatus.filter(a => a.alert).length} areas requiring attention</li>
              <li>• {densityAlerts.filter(a => a.level === 'critical').length} critical density alerts</li>
              <li>• Shift handover at 6:00 PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Trigger Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Manage Alert</h3>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {selectedTrigger && (
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${getPriorityColor(selectedTrigger.priority)}`}>
                  <div className="font-semibold mb-2">{selectedTrigger.message}</div>
                  <div className="text-sm text-gray-600">Location: {selectedTrigger.location}</div>
                  <div className="text-sm text-gray-600">Time: {selectedTrigger.time}</div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Accept Task
                  </button>
                  <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Escalate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroundStaffDashboard;