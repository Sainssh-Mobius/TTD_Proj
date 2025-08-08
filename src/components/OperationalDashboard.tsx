import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Bus, 
  Calendar, 
  Camera, 
  Car, 
  CheckCircle, 
  Clock, 
  Cog, 
  MapPin, 
  Monitor, 
  Navigation, 
  Play, 
  Settings, 
  Shield, 
  Sliders, 
  TrendingUp, 
  Users, 
  Zap 
} from 'lucide-react';
import TrafficConsole from './TrafficConsole';
import CalendarAnalytics from './CalendarAnalytics';
import VIPMovementModal from './VIPMovementModal';

const OperationalDashboard: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'traffic' | 'security' | 'maintenance'>('overview');
  const [realTimeData, setRealTimeData] = useState({
    activeVehicles: 1247,
    queueLength: 156,
    averageWaitTime: 45,
    parkingOccupancy: 84,
    shuttleServices: 24,
    cctvFeeds: 156,
    emergencyVehicles: 3,
    systemHealth: 98.5
  });

  const [operationalAlerts, setOperationalAlerts] = useState([
    { id: 1, type: 'warning', message: 'Parking Lot A approaching capacity (84%)', priority: 'medium', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New shuttle deployed to Route 3', priority: 'low', time: '5 min ago' },
    { id: 3, type: 'critical', message: 'CCTV Camera #45 offline - Sector 7', priority: 'high', time: '8 min ago' }
  ]);

  const [systemStatus, setSystemStatus] = useState([
    { name: 'Traffic Management', status: 'operational', uptime: '99.8%', lastCheck: '2 min ago' },
    { name: 'Parking Systems', status: 'operational', uptime: '99.5%', lastCheck: '1 min ago' },
    { name: 'CCTV Network', status: 'warning', uptime: '97.2%', lastCheck: '30 sec ago' },
    { name: 'Communication', status: 'operational', uptime: '100%', lastCheck: '1 min ago' },
    { name: 'Emergency Systems', status: 'operational', uptime: '100%', lastCheck: '30 sec ago' }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeVehicles: prev.activeVehicles + Math.floor(Math.random() * 10) - 5,
        queueLength: Math.max(0, prev.queueLength + Math.floor(Math.random() * 6) - 3),
        averageWaitTime: Math.max(15, prev.averageWaitTime + Math.floor(Math.random() * 6) - 3),
        parkingOccupancy: Math.max(70, Math.min(95, prev.parkingOccupancy + Math.floor(Math.random() * 4) - 2)),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + (Math.random() - 0.5) * 0.5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-display-lg mb-2">Operations Control Center</h1>
            <p className="text-body-lg opacity-90">Real-time monitoring and system management</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Analytics Calendar</span>
            </button>
            <button
              onClick={() => setShowVIPModal(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>VIP Management</span>
            </button>
          </div>
        </div>

        {/* View Selector */}
        <div className="flex space-x-2">
          {[
            { id: 'overview', name: 'System Overview', icon: Monitor },
            { id: 'traffic', name: 'Traffic Control', icon: Car },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'maintenance', name: 'Maintenance', icon: Cog }
          ].map(view => {
            const IconComponent = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === view.id
                    ? 'bg-white text-blue-600'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{view.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Car className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeData.activeVehicles.toLocaleString()}</div>
              <div className="text-body-sm text-gray-600">Active Vehicles</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Activity className="w-4 h-4" />
            <span className="text-label-sm">Live tracking active</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeData.queueLength}</div>
              <div className="text-body-sm text-gray-600">Queue Length</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-yellow-600">
            <Clock className="w-4 h-4" />
            <span className="text-label-sm">{realTimeData.averageWaitTime} min avg wait</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeData.parkingOccupancy}%</div>
              <div className="text-body-sm text-gray-600">Parking Occupancy</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                realTimeData.parkingOccupancy >= 90 ? 'bg-red-500' :
                realTimeData.parkingOccupancy >= 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${realTimeData.parkingOccupancy}%` }}
            ></div>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeData.systemHealth.toFixed(1)}%</div>
              <div className="text-body-sm text-gray-600">System Health</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-label-sm">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <div className="card-mobius p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-3 rounded-xl">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-display-sm font-bold text-gray-900">System Status</h3>
                <p className="text-body-sm text-gray-600">Real-time system health monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {systemStatus.map((system, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      system.status === 'operational' ? 'bg-green-500' :
                      system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-semibold text-gray-800">{system.name}</div>
                      <div className="text-sm text-gray-600">Uptime: {system.uptime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {system.status.toUpperCase()}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{system.lastCheck}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="card-mobius p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-display-sm font-bold text-gray-900">Active Alerts</h3>
                <p className="text-body-sm text-gray-600">System notifications and warnings</p>
              </div>
            </div>

            <div className="space-y-3">
              {operationalAlerts.map(alert => (
                <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-800">{alert.message}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{alert.time}</div>
                  <div className="mt-3 flex space-x-2">
                    <button className="text-xs bg-white/80 hover:bg-white px-3 py-1 rounded transition-colors">
                      Acknowledge
                    </button>
                    <button className="text-xs bg-white/80 hover:bg-white px-3 py-1 rounded transition-colors">
                      Take Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'traffic' && (
        <TrafficConsole />
      )}

      {activeView === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Overview */}
          <div className="card-mobius p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-display-sm font-bold text-gray-900">Security Status</h3>
                <p className="text-body-sm text-gray-600">Comprehensive security monitoring</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{realTimeData.cctvFeeds}</div>
                <div className="text-sm text-gray-600">CCTV Feeds Active</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{realTimeData.emergencyVehicles}</div>
                <div className="text-sm text-gray-600">Emergency Units</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Perimeter Security</span>
                <span className="status-success">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Access Control</span>
                <span className="status-success">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Emergency Response</span>
                <span className="status-success">Ready</span>
              </div>
            </div>
          </div>

          {/* CCTV Monitoring */}
          <div className="card-mobius p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-display-sm font-bold text-gray-900">CCTV Network</h3>
                <p className="text-body-sm text-gray-600">Live camera feeds and AI monitoring</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map(cam => (
                <div key={cam} className="bg-gray-100 rounded-lg p-3 text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium">Camera {cam}</div>
                  <div className="text-xs text-green-600">Online</div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>AI Detection Active</span>
                <span className="text-green-600 font-medium">✓ Enabled</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Motion Tracking</span>
                <span className="text-green-600 font-medium">✓ Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Crowd Analysis</span>
                <span className="text-green-600 font-medium">✓ Running</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'maintenance' && (
        <div className="card-mobius p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Cog className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-display-sm font-bold text-gray-900">Maintenance Dashboard</h3>
              <p className="text-body-sm text-gray-600">System maintenance and health monitoring</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
              <div className="text-2xl font-bold text-green-600">24</div>
              <div className="text-sm text-gray-600">Systems Healthy</div>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-gray-600">Pending Maintenance</div>
            </div>
            
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Settings className="w-12 h-12 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Scheduled Tasks</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card-mobius p-6">
        <h3 className="text-display-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-mobius-primary flex items-center justify-center space-x-2 py-3">
            <Play className="w-4 h-4" />
            <span>Start Simulation</span>
          </button>
          <button className="btn-mobius-secondary flex items-center justify-center space-x-2 py-3">
            <Sliders className="w-4 h-4" />
            <span>Adjust Parameters</span>
          </button>
          <button className="btn-mobius-warning flex items-center justify-center space-x-2 py-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Mode</span>
          </button>
          <button className="btn-mobius-success flex items-center justify-center space-x-2 py-3">
            <TrendingUp className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CalendarAnalytics 
        persona="operational"
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
      />
      
      <VIPMovementModal
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
      />
    </div>
  );
};

export default OperationalDashboard;