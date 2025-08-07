import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  Bus, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  RefreshCw,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Monitor,
  Radio,
  Zap,
  Shield,
  Camera,
  Mic,
  Navigation,
  Activity
} from 'lucide-react';
import TrafficConsole from './TrafficConsole';

const OperationalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLive, setIsLive] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState('all');

  const [operationalData, setOperationalData] = useState({
    queueLength: 1247,
    averageWaitTime: 45,
    shuttleCount: 24,
    staffOnDuty: 156,
    incidentCount: 3,
    systemStatus: 'operational'
  });

  const [zones, setZones] = useState([
    { id: 'main-temple', name: 'Main Temple', status: 'normal', capacity: 85, alerts: 1 },
    { id: 'parking', name: 'Parking Areas', status: 'warning', capacity: 92, alerts: 2 },
    { id: 'alipiri', name: 'Alipiri Base', status: 'normal', capacity: 67, alerts: 0 },
    { id: 'transport', name: 'Transport Hub', status: 'normal', capacity: 78, alerts: 0 }
  ]);

  const [announcements, setAnnouncements] = useState([
    { id: 1, message: 'Next shuttle to Tirumala in 5 minutes', zone: 'transport', priority: 'normal' },
    { id: 2, message: 'Parking Lot A is 90% full', zone: 'parking', priority: 'warning' },
    { id: 3, message: 'VIP darshan at 2:30 PM', zone: 'main-temple', priority: 'info' }
  ]);

  useEffect(() => {
    if (autoRefresh && isLive) {
      const interval = setInterval(() => {
        handleRefreshData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isLive]);

  const handleRefreshData = () => {
    setOperationalData(prev => ({
      ...prev,
      queueLength: Math.max(0, prev.queueLength + Math.floor(Math.random() * 20 - 10)),
      averageWaitTime: Math.max(15, prev.averageWaitTime + Math.floor(Math.random() * 10 - 5)),
      shuttleCount: Math.max(20, Math.min(30, prev.shuttleCount + Math.floor(Math.random() * 3 - 1)))
    }));
  };

  const handleEmergencyToggle = () => {
    const confirmed = emergencyMode ? 
      confirm('Deactivate emergency mode?') : 
      confirm('Activate emergency mode? This will alert all staff and initiate emergency protocols.');
    
    if (confirmed) {
      setEmergencyMode(!emergencyMode);
      if (!emergencyMode) {
        alert('Emergency mode activated. All departments notified. Emergency protocols in effect.');
      } else {
        alert('Emergency mode deactivated. Normal operations resumed.');
      }
    }
  };

  const handleZoneControl = (zoneId: string, action: string) => {
    switch (action) {
      case 'lockdown':
        if (confirm(`Lock down ${zones.find(z => z.id === zoneId)?.name}? This will restrict access.`)) {
          alert(`${zones.find(z => z.id === zoneId)?.name} locked down. Access restricted.`);
        }
        break;
      case 'evacuate':
        if (confirm(`Initiate evacuation for ${zones.find(z => z.id === zoneId)?.name}?`)) {
          alert(`Evacuation initiated for ${zones.find(z => z.id === zoneId)?.name}. Emergency exits activated.`);
        }
        break;
      case 'increase-staff':
        alert(`Deploying additional staff to ${zones.find(z => z.id === zoneId)?.name}.`);
        break;
      case 'broadcast':
        const message = prompt('Enter announcement message:');
        if (message) {
          setAnnouncements(prev => [{
            id: Date.now(),
            message,
            zone: zoneId,
            priority: 'normal'
          }, ...prev.slice(0, 4)]);
          alert(`Broadcasting message to ${zones.find(z => z.id === zoneId)?.name}.`);
        }
        break;
    }
  };

  const handleShuttleControl = (action: string) => {
    switch (action) {
      case 'dispatch-emergency':
        alert('Emergency shuttle dispatched. ETA: 3 minutes.');
        break;
      case 'increase-frequency':
        alert('Shuttle frequency increased by 50%. Additional buses deployed.');
        break;
      case 'route-optimization':
        alert('AI route optimization activated. Calculating optimal paths...');
        break;
      case 'maintenance-mode':
        if (confirm('Put shuttle system in maintenance mode? This will temporarily halt services.')) {
          alert('Shuttle system in maintenance mode. Alternative transport arranged.');
        }
        break;
    }
  };

  const handleSystemControl = (system: string, action: string) => {
    switch (system) {
      case 'audio':
        setAudioEnabled(!audioEnabled);
        alert(`Audio system ${!audioEnabled ? 'enabled' : 'disabled'}.`);
        break;
      case 'cameras':
        alert('Camera system controls accessed. All feeds active and recording.');
        break;
      case 'lighting':
        alert('Lighting system controls accessed. Emergency lighting protocols available.');
        break;
      case 'access-control':
        alert('Access control system active. All entry points monitored.');
        break;
    }
  };

  const handleIncidentResponse = (incidentId: number) => {
    if (confirm('Dispatch response team to this incident?')) {
      alert('Response team dispatched. ETA: 5 minutes. Incident commander notified.');
    }
  };

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Monitor },
    { id: 'zones', name: 'Zone Control', icon: MapPin },
    { id: 'transport', name: 'Transport', icon: Bus },
    { id: 'traffic', name: 'Traffic Control', icon: Navigation },
    { id: 'systems', name: 'Systems', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Operations Control Center</h2>
            <p className="text-gray-600">Real-time monitoring and control systems</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-medium">{isLive ? 'LIVE' : 'OFFLINE'}</span>
            </div>
            
            <button
              onClick={() => setIsLive(!isLive)}
              className={`btn-mobius-secondary flex items-center space-x-2 ${isLive ? '' : 'opacity-50'}`}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLive ? 'Pause' : 'Resume'}</span>
            </button>

            <button
              onClick={handleRefreshData}
              className="btn-mobius-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleEmergencyToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                emergencyMode 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-red-100 hover:bg-red-200 text-red-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{emergencyMode ? 'EMERGENCY ACTIVE' : 'Emergency Mode'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-mobius p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Queue Length</p>
                  <p className="text-3xl font-bold text-blue-600">{operationalData.queueLength}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <button
                onClick={() => alert('Opening detailed queue management...')}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Manage Queue
              </button>
            </div>

            <div className="card-mobius p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-orange-600">{operationalData.averageWaitTime}m</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <button
                onClick={() => alert('Optimizing wait times...')}
                className="mt-3 text-orange-600 hover:text-orange-800 text-sm font-medium"
              >
                Optimize
              </button>
            </div>

            <div className="card-mobius p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Shuttles</p>
                  <p className="text-3xl font-bold text-green-600">{operationalData.shuttleCount}</p>
                </div>
                <Bus className="w-8 h-8 text-green-600" />
              </div>
              <button
                onClick={() => setActiveTab('transport')}
                className="mt-3 text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Control Shuttles
              </button>
            </div>

            <div className="card-mobius p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Staff on Duty</p>
                  <p className="text-3xl font-bold text-purple-600">{operationalData.staffOnDuty}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600" />
              </div>
              <button
                onClick={() => alert('Opening staff management dashboard...')}
                className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Manage Staff
              </button>
            </div>
          </div>

          {/* Zone Status Overview */}
          <div className="card-mobius p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Zone Status Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {zones.map(zone => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">{zone.name}</span>
                    <div className={`w-3 h-3 rounded-full ${getZoneStatusColor(zone.status)}`}></div>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Capacity: {zone.capacity}%</div>
                    <div>Alerts: {zone.alerts}</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('zones')}
                    className="w-full btn-mobius-secondary text-sm py-2"
                  >
                    Control Zone
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'zones' && (
        <div className="space-y-6">
          <div className="card-mobius p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Zone Control Center</h3>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="select-mobius"
              >
                <option value="all">All Zones</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {zones.map(zone => (
                <div key={zone.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">{zone.name}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      zone.status === 'critical' ? 'bg-red-100 text-red-800' :
                      zone.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {zone.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleZoneControl(zone.id, 'lockdown')}
                      className="btn-mobius-error text-sm py-2"
                    >
                      Lockdown
                    </button>
                    <button
                      onClick={() => handleZoneControl(zone.id, 'evacuate')}
                      className="btn-mobius-warning text-sm py-2"
                    >
                      Evacuate
                    </button>
                    <button
                      onClick={() => handleZoneControl(zone.id, 'increase-staff')}
                      className="btn-mobius-primary text-sm py-2"
                    >
                      Add Staff
                    </button>
                    <button
                      onClick={() => handleZoneControl(zone.id, 'broadcast')}
                      className="btn-mobius-secondary text-sm py-2"
                    >
                      Broadcast
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Capacity:</span>
                      <span className="font-medium">{zone.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getZoneStatusColor(zone.status)}`}
                        style={{width: `${zone.capacity}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transport' && (
        <div className="space-y-6">
          <div className="card-mobius p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Transport Control Center</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Shuttle Operations</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => handleShuttleControl('dispatch-emergency')}
                    className="w-full btn-mobius-error flex items-center justify-center space-x-2 py-3"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Dispatch Emergency Shuttle</span>
                  </button>
                  
                  <button
                    onClick={() => handleShuttleControl('increase-frequency')}
                    className="w-full btn-mobius-warning flex items-center justify-center space-x-2 py-3"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>Increase Frequency</span>
                  </button>
                  
                  <button
                    onClick={() => handleShuttleControl('route-optimization')}
                    className="w-full btn-mobius-primary flex items-center justify-center space-x-2 py-3"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Optimize Routes</span>
                  </button>
                  
                  <button
                    onClick={() => handleShuttleControl('maintenance-mode')}
                    className="w-full btn-mobius-secondary flex items-center justify-center space-x-2 py-3"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Maintenance Mode</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-4">Live Shuttle Status</h4>
                <div className="space-y-3">
                  {[
                    { id: 'S001', route: 'Alipiri-Tirumala', status: 'En Route', eta: '5 min', capacity: '85%' },
                    { id: 'S002', route: 'Tirumala-Alipiri', status: 'Loading', eta: '8 min', capacity: '60%' },
                    { id: 'S003', route: 'VIP Shuttle', status: 'Available', eta: '2 min', capacity: '20%' }
                  ].map(shuttle => (
                    <div key={shuttle.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{shuttle.id}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          shuttle.status === 'En Route' ? 'bg-green-100 text-green-800' :
                          shuttle.status === 'Loading' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {shuttle.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{shuttle.route}</div>
                        <div className="flex justify-between mt-1">
                          <span>ETA: {shuttle.eta}</span>
                          <span>Load: {shuttle.capacity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'traffic' && (
        <TrafficConsole />
      )}

      {activeTab === 'systems' && (
        <div className="space-y-6">
          <div className="card-mobius p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">System Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Audio & Communication</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSystemControl('audio', 'toggle')}
                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-colors ${
                      audioEnabled 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                    }`}
                  >
                    {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    <span>Audio System {audioEnabled ? 'ON' : 'OFF'}</span>
                  </button>
                  
                  <button
                    onClick={() => alert('Opening public announcement system...')}
                    className="w-full btn-mobius-primary flex items-center justify-center space-x-2 py-3"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Public Announcements</span>
                  </button>
                  
                  <button
                    onClick={() => alert('Opening radio communication panel...')}
                    className="w-full btn-mobius-secondary flex items-center justify-center space-x-2 py-3"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Radio Communications</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-4">Security & Monitoring</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => handleSystemControl('cameras', 'control')}
                    className="w-full btn-mobius-primary flex items-center justify-center space-x-2 py-3"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Camera System</span>
                  </button>
                  
                  <button
                    onClick={() => handleSystemControl('access-control', 'manage')}
                    className="w-full btn-mobius-secondary flex items-center justify-center space-x-2 py-3"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Access Control</span>
                  </button>
                  
                  <button
                    onClick={() => handleSystemControl('lighting', 'control')}
                    className="w-full btn-mobius-secondary flex items-center justify-center space-x-2 py-3"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Emergency Lighting</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-4">System Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { system: 'Network', status: 'Online', uptime: '99.9%' },
                  { system: 'Database', status: 'Online', uptime: '99.8%' },
                  { system: 'Backup Power', status: 'Standby', uptime: '100%' }
                ].map(item => (
                  <div key={item.system} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">{item.system}</span>
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'Online' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Status: {item.status}</div>
                      <div>Uptime: {item.uptime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Announcements */}
      <div className="card-mobius p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Live Announcements</h3>
          <button
            onClick={() => {
              const message = prompt('Enter new announcement:');
              if (message) {
                setAnnouncements(prev => [{
                  id: Date.now(),
                  message,
                  zone: 'all',
                  priority: 'normal'
                }, ...prev.slice(0, 4)]);
              }
            }}
            className="btn-mobius-primary text-sm"
          >
            New Announcement
          </button>
        </div>
        
        <div className="space-y-2">
          {announcements.map(announcement => (
            <div key={announcement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-800">{announcement.message}</span>
                <span className="text-sm text-gray-600 ml-2">({announcement.zone})</span>
              </div>
              <button
                onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== announcement.id))}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationalDashboard;