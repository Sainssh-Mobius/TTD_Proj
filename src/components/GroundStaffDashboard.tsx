import React, { useState, useEffect } from 'react';
import { 
  Users, Target, CheckCircle, MessageSquare, Bell, MapPin, AlertTriangle, 
  Activity, Eye, Clock, Navigation, Zap, Car, Bus, Camera, Settings,
  TrendingUp, BarChart3, Sliders, Play, Home, Clipboard, Map, 
  AlertCircle, UserCheck, Shield, Radio, Headphones
} from 'lucide-react';

const GroundStaffDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationMode, setSimulationMode] = useState(false);
  const [selectedTriggerFilter, setSelectedTriggerFilter] = useState('all');
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [dayType, setDayType] = useState('normal');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);

  // Navigation tabs configuration
  const navigationTabs = [
    { 
      id: 'overview', 
      name: 'Overview', 
      icon: Home, 
      description: 'Dashboard summary and key metrics',
      color: 'from-green-500 to-teal-600'
    },
    { 
      id: 'tasks', 
      name: 'My Tasks', 
      icon: Clipboard, 
      description: 'Assigned tasks and performance',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'monitoring', 
      name: 'Area Monitor', 
      icon: Map, 
      description: 'Real-time area and crowd monitoring',
      color: 'from-red-500 to-orange-600'
    },
    { 
      id: 'alerts', 
      name: 'Active Alerts', 
      icon: AlertCircle, 
      description: 'Triggers and emergency responses',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'scenarios', 
      name: 'Scenarios', 
      icon: Settings, 
      description: 'Simulation and scenario planning',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  // Sample data (keeping all existing data structures)
  const [fieldKPIs] = useState({
    completedTasks: 23,
    responseTime: 4.2,
    areasCovered: 8,
    efficiency: 94.5
  });

  const [crowdKPIs, setCrowdKPIs] = useState({
    currentCrowdCount: 12847,
    densityAlerts: 3,
    averageDensity: 67.8,
    peakDensity: 89.2
  });

  const [guidanceMetrics] = useState({
    activeGuidance: 15,
    completedGuidance: 89,
    specialAssistance: 12,
    languageSupport: ['Telugu', 'Tamil', 'Hindi', 'English', 'Kannada']
  });

  const [assignedTasks] = useState([
    { id: 1, task: 'Crowd Control at Main Gate', location: 'Gate 1 - Main Entrance', priority: 'high', status: 'in-progress', assignedTime: '10:30 AM', eta: '15 min' },
    { id: 2, task: 'Guide Elderly Pilgrims', location: 'Temple Complex - Zone A', priority: 'medium', status: 'pending', assignedTime: '11:00 AM', eta: '20 min' },
    { id: 3, task: 'Lost Child Assistance', location: 'Parking Area B', priority: 'high', status: 'pending', assignedTime: '11:15 AM', eta: '10 min' },
    { id: 4, task: 'Shuttle Queue Management', location: 'Alipiri Base', priority: 'medium', status: 'completed', assignedTime: '9:45 AM', eta: 'Completed' },
    { id: 5, task: 'Medical Emergency Support', location: 'Temple Premises', priority: 'high', status: 'completed', assignedTime: '8:30 AM', eta: 'Completed' }
  ]);

  const [activeAlerts] = useState([
    { id: 1, type: 'crowd', message: 'High density detected at Main Temple entrance', location: 'Main Temple Gate', priority: 'high', time: '11:45 AM', status: 'pending' },
    { id: 2, type: 'lost-found', message: 'Lost child reported - 8 year old boy', location: 'Parking Area B', priority: 'high', time: '11:30 AM', status: 'pending' },
    { id: 3, type: 'shuttle', message: 'Shuttle breakdown causing delays', location: 'Alipiri Route 2', priority: 'medium', time: '11:20 AM', status: 'pending' },
    { id: 4, type: 'darshan', message: 'VIP darshan slot adjustment needed', location: 'VIP Complex', priority: 'medium', time: '11:00 AM', status: 'pending' },
    { id: 5, type: 'parking', message: 'Parking lot approaching capacity', location: 'Lot A', priority: 'low', time: '10:45 AM', status: 'pending' }
  ]);

  const [areaStatus] = useState([
    { id: 1, name: 'Main Temple Complex', status: 'high-density', crowdCount: 2847, capacity: 3200, density: 89.0, alert: true },
    { id: 2, name: 'Alipiri Base Station', status: 'normal', crowdCount: 1456, capacity: 2500, density: 58.2, alert: false },
    { id: 3, name: 'Parking Area A', status: 'moderate', crowdCount: 1890, capacity: 2400, density: 78.8, alert: false },
    { id: 4, name: 'VIP Complex', status: 'normal', crowdCount: 234, capacity: 500, density: 46.8, alert: false },
    { id: 5, name: 'Shuttle Terminal', status: 'high-density', crowdCount: 1678, capacity: 2000, density: 83.9, alert: true }
  ]);

  const [densityAlerts] = useState([
    { id: 1, zone: 'Main Temple Entrance', density: 92, level: 'critical', time: '11:45 AM', action: 'immediate crowd control' },
    { id: 2, zone: 'Shuttle Terminal', density: 84, level: 'high', time: '11:30 AM', action: 'enhanced monitoring' },
    { id: 3, zone: 'Parking Area A', density: 79, level: 'moderate', time: '11:15 AM', action: 'watch for escalation' }
  ]);

  const dayTypes = [
    { id: 'normal', name: 'Normal Day', multiplier: 1.0 },
    { id: 'weekend', name: 'Weekend', multiplier: 1.5 },
    { id: 'festival', name: 'Festival Day', multiplier: 2.5 },
    { id: 'special', name: 'Special Event', multiplier: 3.0 }
  ];

  const ttdSpecialDaysConfig = [
    { id: 'brahmotsavam', name: 'Brahmotsavam', multiplier: 4.0 },
    { id: 'vaikunta-ekadasi', name: 'Vaikunta Ekadasi', multiplier: 3.5 },
    { id: 'rathasaptami', name: 'Rathasaptami', multiplier: 2.8 },
    { id: 'new-year', name: 'New Year', multiplier: 2.2 }
  ];

  const regionalFestivalsConfig = [
    { id: 'diwali', name: 'Diwali', multiplier: 2.0 },
    { id: 'dussehra', name: 'Dussehra', multiplier: 1.8 },
    { id: 'ugadi', name: 'Ugadi', multiplier: 1.6 },
    { id: 'sankranti', name: 'Sankranti', multiplier: 1.4 }
  ];

  // Utility functions (keeping all existing functions)
  const filteredAlerts = selectedTriggerFilter === 'all' 
    ? activeAlerts.filter(a => a.status === 'pending')
    : activeAlerts.filter(a => a.type === selectedTriggerFilter && a.status === 'pending');

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
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crowd': return 'bg-red-100 text-red-600';
      case 'lost-found': return 'bg-purple-100 text-purple-600';
      case 'shuttle': return 'bg-orange-100 text-orange-600';
      case 'darshan': return 'bg-yellow-100 text-yellow-600';
      case 'parking': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crowd': return <Users className="w-3 h-3" />;
      case 'lost-found': return <UserCheck className="w-3 h-3" />;
      case 'shuttle': return <Bus className="w-3 h-3" />;
      case 'darshan': return <Clock className="w-3 h-3" />;
      case 'parking': return <Car className="w-3 h-3" />;
      default: return <Bell className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high-density': return 'bg-red-500';
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

  const openTriggerModal = (alert: any) => {
    console.log('Opening trigger modal for:', alert);
  };

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

  // Simulation effect
  useEffect(() => {
    if (simulationMode) {
      const interval = setInterval(() => {
        setCrowdKPIs(prev => ({
          ...prev,
          currentCrowdCount: Math.max(5000, prev.currentCrowdCount + Math.floor(Math.random() * 200 - 100))
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [simulationMode]);

  // Tab content renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Tasks Completed</p>
                    <p className="text-3xl font-bold text-green-600">{fieldKPIs.completedTasks}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-green-600">Today's performance</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Response Time</p>
                    <p className="text-3xl font-bold text-blue-600">{fieldKPIs.responseTime.toFixed(1)} min</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-blue-600">Average response</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Current Crowd {simulationMode && '(Sim)'}</p>
                    <p className="text-3xl font-bold text-red-600">{crowdKPIs.currentCrowdCount.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <Users className={`w-8 h-8 text-red-600 ${simulationMode ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="mt-4 text-sm text-red-600">In monitored areas</div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Guidance</p>
                    <p className="text-3xl font-bold text-purple-600">{guidanceMetrics.activeGuidance}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 text-sm text-purple-600">Pilgrims being helped</div>
              </div>
            </div>

            {/* Quick Status Summary */}
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
          </div>
        );

      case 'tasks':
        return (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
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

              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
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

              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
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

            {/* Task List */}
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

              <div className="space-y-3">
                {assignedTasks.map(task => (
                  <div key={task.id} className={`p-4 rounded-lg border ${getTaskStatusColor(task.status)}`}>
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
              </div>
            </div>

            {/* Guidance Metrics */}
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
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

                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
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

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
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
          </div>
        );

      case 'monitoring':
        return (
          <div className="space-y-6">
            {/* Area-wise Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Area-wise Status</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            {/* Active Triggers Panel */}
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
              <div className="space-y-3">
                {filteredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    onClick={() => openTriggerModal(alert)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getPriorityColor(alert.priority)}`}
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
        );

      case 'scenarios':
        return (
          <div className="space-y-6">
            {/* Simulation Control */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl text-white">
                    <Settings className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Simulation Control</h3>
                </div>
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

              {simulationMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="font-semibold text-sm">Simulation Active</span>
                  </div>
                  <p className="text-blue-700 text-xs mt-1">Real-time crowd data is being simulated for training purposes</p>
                </div>
              )}
            </div>

            {/* Scenario Builder */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-6">
                <h5 className="font-bold text-gray-800 flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Realistic Scenario Builder</span>
                </h5>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Day Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🗓️ Day Type</label>
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
                        <span className="text-sm text-gray-700">{day.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* TTD Special Days */}
                <div>
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
                <div>
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
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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

      {/* Enhanced Navigation Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
          <div className="flex flex-wrap gap-2">
            {navigationTabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 flex flex-col items-center space-y-2 px-4 py-4 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{tab.name}</div>
                    <div className={`text-xs mt-1 ${activeTab === tab.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {navigationTabs.find(tab => tab.id === activeTab)?.name} - Active
            </span>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GroundStaffDashboard;