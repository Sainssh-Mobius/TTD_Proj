import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  Phone,
  Radio,
  Navigation,
  Camera,
  Shield,
  Zap,
  Activity,
  Bell,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  RefreshCw,
  Settings
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  estimatedTime: number;
  description: string;
}

interface Incident {
  id: number;
  type: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  time: string;
  status: 'open' | 'investigating' | 'resolved';
}

const GroundStaffDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('tasks');
  const [currentLocation, setCurrentLocation] = useState('Main Temple - Zone A');
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [radioEnabled, setRadioEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Crowd Control - Main Entrance',
      location: 'Main Temple Entrance',
      priority: 'high',
      status: 'pending',
      assignedTo: 'You',
      estimatedTime: 30,
      description: 'Manage crowd flow during peak hours'
    },
    {
      id: 2,
      title: 'Lost Child Assistance',
      location: 'Parking Area B',
      priority: 'critical',
      status: 'in-progress',
      assignedTo: 'You',
      estimatedTime: 15,
      description: 'Help locate missing child - 8 year old boy in blue shirt'
    },
    {
      id: 3,
      title: 'Shuttle Queue Management',
      location: 'Transport Hub',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Team',
      estimatedTime: 45,
      description: 'Organize shuttle boarding queue'
    }
  ]);

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 1,
      type: 'Medical Emergency',
      location: 'Main Temple - Zone C',
      severity: 'critical',
      reportedBy: 'Staff Member',
      time: '11:45 AM',
      status: 'investigating'
    },
    {
      id: 2,
      type: 'Suspicious Activity',
      location: 'Parking Lot A',
      severity: 'medium',
      reportedBy: 'Security Camera',
      time: '11:30 AM',
      status: 'open'
    }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, from: 'Control Center', message: 'VIP arrival expected at 2:30 PM', time: '11:45 AM', type: 'info' },
    { id: 2, from: 'Team Lead', message: 'Additional staff needed at Gate 3', time: '11:40 AM', type: 'request' },
    { id: 3, from: 'Emergency', message: 'Medical team dispatched to Zone C', time: '11:35 AM', type: 'alert' }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [quickActions] = useState([
    { id: 'crowd-control', name: 'Request Crowd Control', icon: Users, color: 'blue' },
    { id: 'medical', name: 'Medical Emergency', icon: Zap, color: 'red' },
    { id: 'security', name: 'Security Alert', icon: Shield, color: 'orange' },
    { id: 'maintenance', name: 'Maintenance Issue', icon: Settings, color: 'gray' }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isOnDuty) {
        // Simulate new messages
        if (Math.random() > 0.9) {
          const newMsg = {
            id: Date.now(),
            from: 'Control Center',
            message: 'Status update requested',
            time: new Date().toLocaleTimeString(),
            type: 'info'
          };
          setMessages(prev => [newMsg, ...prev.slice(0, 9)]);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isOnDuty]);

  const handleTaskAction = (taskId: number, action: 'start' | 'complete' | 'reassign') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'start':
            return { ...task, status: 'in-progress' };
          case 'complete':
            return { ...task, status: 'completed' };
          case 'reassign':
            const newAssignee = prompt('Reassign to:');
            if (newAssignee) {
              return { ...task, assignedTo: newAssignee };
            }
            return task;
          default:
            return task;
        }
      }
      return task;
    }));

    switch (action) {
      case 'start':
        alert('Task started. Timer activated.');
        break;
      case 'complete':
        alert('Task completed successfully. Control center notified.');
        break;
      case 'reassign':
        alert('Task reassignment request sent.');
        break;
    }
  };

  const handleIncidentAction = (incidentId: number, action: 'investigate' | 'resolve' | 'escalate') => {
    setIncidents(prev => prev.map(incident => {
      if (incident.id === incidentId) {
        switch (action) {
          case 'investigate':
            return { ...incident, status: 'investigating' };
          case 'resolve':
            return { ...incident, status: 'resolved' };
          default:
            return incident;
        }
      }
      return incident;
    }));

    switch (action) {
      case 'investigate':
        alert('Investigation started. Please proceed to location.');
        break;
      case 'resolve':
        alert('Incident marked as resolved. Report filed.');
        break;
      case 'escalate':
        alert('Incident escalated to supervisor. Additional resources requested.');
        break;
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'crowd-control':
        alert('Crowd control request sent. Additional staff being dispatched.');
        break;
      case 'medical':
        if (confirm('Report medical emergency? This will dispatch medical team immediately.')) {
          alert('Medical emergency reported. Medical team dispatched. ETA: 3 minutes.');
          setEmergencyMode(true);
        }
        break;
      case 'security':
        alert('Security alert sent. Security team notified.');
        break;
      case 'maintenance':
        const issue = prompt('Describe maintenance issue:');
        if (issue) {
          alert('Maintenance request submitted. Maintenance team will respond shortly.');
        }
        break;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        from: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString(),
        type: 'outgoing'
      };
      setMessages(prev => [message, ...prev]);
      setNewMessage('');
      alert('Message sent to control center.');
    }
  };

  const handleLocationUpdate = () => {
    const newLocation = prompt('Update your current location:', currentLocation);
    if (newLocation) {
      setCurrentLocation(newLocation);
      alert('Location updated. Control center notified.');
    }
  };

  const handleEmergencyButton = () => {
    if (confirm('EMERGENCY ALERT: This will immediately notify all emergency services and control center. Continue?')) {
      setEmergencyMode(true);
      alert('EMERGENCY ALERT ACTIVATED. All emergency services notified. Help is on the way.');
    }
  };

  const handleDutyToggle = () => {
    const newStatus = !isOnDuty;
    setIsOnDuty(newStatus);
    alert(`Duty status changed to: ${newStatus ? 'ON DUTY' : 'OFF DUTY'}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sections = [
    { id: 'tasks', name: 'My Tasks', icon: CheckCircle },
    { id: 'incidents', name: 'Incidents', icon: AlertTriangle },
    { id: 'communication', name: 'Messages', icon: MessageSquare },
    { id: 'location', name: 'Location', icon: MapPin }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Status Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${isOnDuty ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ground Staff Dashboard</h2>
              <p className="text-gray-600">Status: {isOnDuty ? 'ON DUTY' : 'OFF DUTY'} • Location: {currentLocation}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLocationUpdate}
              className="btn-mobius-secondary flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Update Location</span>
            </button>

            <button
              onClick={handleDutyToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isOnDuty 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>{isOnDuty ? 'End Shift' : 'Start Shift'}</span>
            </button>

            <button
              onClick={handleEmergencyButton}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold animate-pulse"
            >
              EMERGENCY
            </button>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setRadioEnabled(!radioEnabled)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                radioEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Radio {radioEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                audioEnabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Audio</span>
            </button>

            <button
              onClick={() => setCameraAccess(!cameraAccess)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                cameraAccess ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              {cameraAccess ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Camera</span>
            </button>
          </div>

          {/* Section Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {sections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                    activeSection === section.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map(action => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              className={`card-mobius p-4 hover:shadow-lg transition-all duration-200 text-center ${
                action.id === 'medical' ? 'border-red-200 hover:border-red-300' : ''
              }`}
            >
              <div className={`bg-${action.color}-100 p-3 rounded-xl mx-auto mb-3 w-fit`}>
                <IconComponent className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <span className="text-sm font-medium text-gray-800">{action.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      {activeSection === 'tasks' && (
        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">My Tasks</h3>
            <button
              onClick={() => alert('Requesting new task assignment...')}
              className="btn-mobius-primary"
            >
              Request New Task
            </button>
          </div>

          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{task.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{task.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimatedTime} min</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {task.status === 'pending' && (
                    <button
                      onClick={() => handleTaskAction(task.id, 'start')}
                      className="btn-mobius-primary text-sm px-4 py-2"
                    >
                      Start Task
                    </button>
                  )}
                  {task.status === 'in-progress' && (
                    <button
                      onClick={() => handleTaskAction(task.id, 'complete')}
                      className="btn-mobius-success text-sm px-4 py-2"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleTaskAction(task.id, 'reassign')}
                    className="btn-mobius-secondary text-sm px-4 py-2"
                  >
                    Reassign
                  </button>
                  <button
                    onClick={() => alert(`Getting directions to ${task.location}...`)}
                    className="btn-mobius-secondary text-sm px-4 py-2"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'incidents' && (
        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Active Incidents</h3>
            <button
              onClick={() => {
                const type = prompt('Incident type:');
                const location = prompt('Location:');
                if (type && location) {
                  const newIncident: Incident = {
                    id: Date.now(),
                    type,
                    location,
                    severity: 'medium',
                    reportedBy: 'You',
                    time: new Date().toLocaleTimeString(),
                    status: 'open'
                  };
                  setIncidents(prev => [newIncident, ...prev]);
                  alert('Incident reported successfully.');
                }
              }}
              className="btn-mobius-warning"
            >
              Report Incident
            </button>
          </div>

          <div className="space-y-4">
            {incidents.map(incident => (
              <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{incident.type}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.severity)}`}>
                        {incident.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{incident.location}</span>
                      </span>
                      <span>Reported by: {incident.reportedBy}</span>
                      <span>{incident.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {incident.status === 'open' && (
                    <button
                      onClick={() => handleIncidentAction(incident.id, 'investigate')}
                      className="btn-mobius-primary text-sm px-4 py-2"
                    >
                      Investigate
                    </button>
                  )}
                  {incident.status === 'investigating' && (
                    <button
                      onClick={() => handleIncidentAction(incident.id, 'resolve')}
                      className="btn-mobius-success text-sm px-4 py-2"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => handleIncidentAction(incident.id, 'escalate')}
                    className="btn-mobius-warning text-sm px-4 py-2"
                  >
                    Escalate
                  </button>
                  <button
                    onClick={() => alert(`Getting directions to ${incident.location}...`)}
                    className="btn-mobius-secondary text-sm px-4 py-2"
                  >
                    Navigate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'communication' && (
        <div className="card-mobius p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Communication Center</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Recent Messages</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.map(message => (
                  <div key={message.id} className={`p-3 rounded-lg ${
                    message.type === 'alert' ? 'bg-red-50 border border-red-200' :
                    message.type === 'request' ? 'bg-yellow-50 border border-yellow-200' :
                    message.from === 'You' ? 'bg-blue-50 border border-blue-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{message.from}</span>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Send Message</h4>
              <div className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to control center..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSendMessage}
                    className="btn-mobius-primary flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                  <button
                    onClick={() => alert('Voice message recording started...')}
                    className="btn-mobius-secondary flex items-center space-x-2"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Voice Message</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-3">Quick Contacts</h5>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Control Center', number: '100' },
                      { name: 'Medical Team', number: '108' },
                      { name: 'Security', number: '101' },
                      { name: 'Maintenance', number: '102' }
                    ].map(contact => (
                      <button
                        key={contact.name}
                        onClick={() => alert(`Calling ${contact.name} (${contact.number})...`)}
                        className="btn-mobius-secondary flex items-center space-x-2 text-sm py-2"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{contact.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'location' && (
        <div className="card-mobius p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Location & Navigation</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Current Status</h4>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Current Location</span>
                  </div>
                  <p className="text-blue-700">{currentLocation}</p>
                  <button
                    onClick={handleLocationUpdate}
                    className="mt-2 btn-mobius-primary text-sm"
                  >
                    Update Location
                  </button>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Duty Status</span>
                  </div>
                  <p className="text-green-700">{isOnDuty ? 'ON DUTY' : 'OFF DUTY'}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {isOnDuty ? 'Available for assignments' : 'Not available'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Quick Navigation</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Main Temple',
                  'Parking Lot A',
                  'Parking Lot B',
                  'Transport Hub',
                  'Medical Center',
                  'Security Office',
                  'Control Room',
                  'Staff Quarters'
                ].map(location => (
                  <button
                    key={location}
                    onClick={() => alert(`Getting directions to ${location}...`)}
                    className="btn-mobius-secondary text-sm py-3 flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{location}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800 mb-3">Zone Map</h5>
                <div className="bg-white rounded-lg h-32 flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Interactive zone map</p>
                    <button
                      onClick={() => alert('Opening full-screen map...')}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Full Map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroundStaffDashboard;