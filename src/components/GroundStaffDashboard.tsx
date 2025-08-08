import React, { useState, useEffect } from 'react';
import { Users, MapPin, Clock, AlertTriangle, CheckCircle, Radio, Camera, Bus, Shield, Activity, MessageSquare, Navigation, Zap, Bell, Eye, UserCheck } from 'lucide-react';
import FilterableChart from './FilterableChart';

const GroundStaffDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'tasks' | 'crowd' | 'incidents' | 'communication'>('tasks');
  const [currentShift, setCurrentShift] = useState('Morning Shift (6 AM - 2 PM)');
  const [staffStatus, setStaffStatus] = useState('on-duty');

  // Real-time data simulation
  const [liveData, setLiveData] = useState({
    currentQueue: 142,
    avgWaitTime: 18,
    crowdLevel: 'moderate',
    activeIncidents: 2,
    completedTasks: 8,
    pendingTasks: 4
  });

  // Generate sample data for ground staff charts
  const generateStaffData = (hours: number, baseValue: number, variance: number) => {
    const data = [];
    for (let i = hours; i >= 0; i--) {
      const date = new Date();
      date.setHours(date.getHours() - i);
      data.push({
        label: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        value: Math.floor(baseValue + (Math.random() - 0.5) * variance),
        timestamp: date,
        category: 'hourly'
      });
    }
    return data;
  };

  const taskCompletionData = generateStaffData(12, 85, 15);
  const crowdFlowData = generateStaffData(12, 65, 25);
  const responseTimeData = generateStaffData(12, 12, 8);
  const incidentData = generateStaffData(12, 3, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        currentQueue: Math.max(0, prev.currentQueue + Math.floor(Math.random() * 10 - 5)),
        avgWaitTime: Math.max(5, prev.avgWaitTime + Math.floor(Math.random() * 4 - 2)),
        activeIncidents: Math.max(0, prev.activeIncidents + Math.floor(Math.random() * 2 - 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const quickStats = [
    {
      title: 'Current Queue',
      value: liveData.currentQueue.toString(),
      unit: 'people',
      icon: Users,
      color: 'blue',
      status: liveData.currentQueue < 100 ? 'good' : liveData.currentQueue < 200 ? 'warning' : 'critical'
    },
    {
      title: 'Wait Time',
      value: liveData.avgWaitTime.toString(),
      unit: 'min',
      icon: Clock,
      color: 'green',
      status: liveData.avgWaitTime < 20 ? 'good' : liveData.avgWaitTime < 30 ? 'warning' : 'critical'
    },
    {
      title: 'Tasks Done',
      value: liveData.completedTasks.toString(),
      unit: 'today',
      icon: CheckCircle,
      color: 'purple',
      status: 'good'
    },
    {
      title: 'Active Incidents',
      value: liveData.activeIncidents.toString(),
      unit: 'ongoing',
      icon: AlertTriangle,
      color: 'red',
      status: liveData.activeIncidents === 0 ? 'good' : liveData.activeIncidents < 3 ? 'warning' : 'critical'
    }
  ];

  const myTasks = [
    {
      id: 1,
      title: 'Queue Management - Gate 3',
      priority: 'high',
      status: 'in-progress',
      time: '10:30 AM',
      location: 'Main Entrance',
      description: 'Monitor and guide pilgrims in darshan queue'
    },
    {
      id: 2,
      title: 'Crowd Control - Temple Premises',
      priority: 'medium',
      status: 'pending',
      time: '11:00 AM',
      location: 'Temple Area',
      description: 'Ensure smooth crowd flow during peak hours'
    },
    {
      id: 3,
      title: 'Lost & Found Assistance',
      priority: 'low',
      status: 'completed',
      time: '9:45 AM',
      location: 'Information Desk',
      description: 'Help pilgrim locate missing belongings'
    },
    {
      id: 4,
      title: 'VIP Escort Duty',
      priority: 'critical',
      status: 'scheduled',
      time: '2:00 PM',
      location: 'VIP Entrance',
      description: 'Escort VIP delegation for special darshan'
    }
  ];

  const activeIncidents = [
    {
      id: 1,
      type: 'Medical Emergency',
      location: 'Queue Area - Zone B',
      time: '10:15 AM',
      status: 'responding',
      priority: 'critical',
      assignedTo: 'Medical Team Alpha'
    },
    {
      id: 2,
      type: 'Lost Child',
      location: 'Temple Courtyard',
      time: '10:45 AM',
      status: 'investigating',
      priority: 'high',
      assignedTo: 'Security Team 2'
    }
  ];

  const crowdAreas = [
    { area: 'Main Temple', density: 85, status: 'high', capacity: '850/1000' },
    { area: 'Queue Area A', density: 72, status: 'moderate', capacity: '360/500' },
    { area: 'Queue Area B', density: 45, status: 'low', capacity: '225/500' },
    { area: 'Parking Lot', density: 68, status: 'moderate', capacity: '340/500' },
    { area: 'Food Court', density: 35, status: 'low', capacity: '105/300' },
    { area: 'Shopping Area', density: 58, status: 'moderate', capacity: '145/250' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': case 'completed': case 'low': return 'text-green-600 bg-green-100';
      case 'warning': case 'moderate': case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'critical': case 'high': case 'responding': return 'text-red-600 bg-red-100';
      case 'in-progress': case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 border-green-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const sections = [
    { id: 'tasks', name: 'My Tasks', icon: CheckCircle },
    { id: 'crowd', name: 'Crowd Monitor', icon: Users },
    { id: 'incidents', name: 'Incidents', icon: AlertTriangle },
    { id: 'communication', name: 'Communication', icon: Radio }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-2xl shadow-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ground Staff Operations</h1>
            <p className="text-green-100">Field operations and real-time assistance</p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5" />
                <span className="text-sm">{currentShift}</span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                staffStatus === 'on-duty' ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  staffStatus === 'on-duty' ? 'bg-green-300 animate-pulse' : 'bg-red-300'
                }`}></div>
                <span>{staffStatus === 'on-duty' ? 'On Duty' : 'Off Duty'}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{liveData.completedTasks}</div>
            <div className="text-green-200">Tasks Completed</div>
            <button className="mt-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-colors">
              Emergency Alert
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${
                stat.status === 'good' ? 'border-green-500' :
                stat.status === 'warning' ? 'border-yellow-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(stat.status)}`}>
                  {stat.status.toUpperCase()}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {stat.value}
                  <span className="text-lg text-gray-500 ml-1">{stat.unit}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {sections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeSection === section.id
                      ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{section.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeSection === 'tasks' && (
            <div className="space-y-6">
              {/* Task List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">My Assigned Tasks</h3>
                {myTasks.map(task => (
                  <div key={task.id} className={`border-l-4 rounded-lg p-4 bg-white shadow-sm ${getPriorityColor(task.priority)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{task.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{task.location}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {task.status === 'pending' && (
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                            Start Task
                          </button>
                        )}
                        {task.status === 'in-progress' && (
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">
                            Complete
                          </button>
                        )}
                        <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Task Performance Chart */}
              <FilterableChart
                title="Task Completion Rate"
                data={taskCompletionData}
                chartType="bar"
                color="green"
                icon={<CheckCircle className="w-5 h-5" />}
              />
            </div>
          )}

          {activeSection === 'crowd' && (
            <div className="space-y-6">
              {/* Crowd Density Grid */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Real-time Crowd Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crowdAreas.map((area, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{area.area}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(area.status)}`}>
                          {area.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Density</span>
                          <span className="font-semibold">{area.density}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              area.density > 80 ? 'bg-red-500' :
                              area.density > 60 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{width: `${area.density}%`}}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">{area.capacity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crowd Flow Chart */}
              <FilterableChart
                title="Crowd Flow Patterns"
                data={crowdFlowData}
                chartType="area"
                color="blue"
                icon={<Users className="w-5 h-5" />}
              />
            </div>
          )}

          {activeSection === 'incidents' && (
            <div className="space-y-6">
              {/* Active Incidents */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Active Incidents</h3>
                <div className="space-y-4">
                  {activeIncidents.map(incident => (
                    <div key={incident.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(incident.priority)}`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{incident.type}</h4>
                            <p className="text-sm text-gray-600">{incident.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                            {incident.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{incident.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{incident.assignedTo}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                            Update Status
                          </button>
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">
                            Resolve
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incident Response Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FilterableChart
                  title="Response Time Trends"
                  data={responseTimeData}
                  chartType="line"
                  color="red"
                  icon={<Clock className="w-5 h-5" />}
                />

                <FilterableChart
                  title="Incident Frequency"
                  data={incidentData}
                  chartType="bar"
                  color="yellow"
                  icon={<AlertTriangle className="w-5 h-5" />}
                />
              </div>
            </div>
          )}

          {activeSection === 'communication' && (
            <div className="space-y-6">
              {/* Communication Channels */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Control Room', status: 'online', channel: 'Channel 1', icon: Radio },
                  { name: 'Security Team', status: 'online', channel: 'Channel 2', icon: Shield },
                  { name: 'Medical Team', status: 'online', channel: 'Channel 3', icon: Activity },
                  { name: 'Transport Team', status: 'busy', channel: 'Channel 4', icon: Bus },
                  { name: 'Maintenance', status: 'online', channel: 'Channel 5', icon: Settings },
                  { name: 'Emergency', status: 'standby', channel: 'Emergency', icon: Zap }
                ].map((comm, index) => {
                  const IconComponent = comm.icon;
                  return (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getStatusColor(comm.status)}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{comm.name}</h4>
                            <p className="text-sm text-gray-600">{comm.channel}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          comm.status === 'online' ? 'bg-green-500 animate-pulse' :
                          comm.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-medium">
                        Connect
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Quick Messages */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Messages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'All clear in my sector',
                    'Need backup at Gate 3',
                    'Medical assistance required',
                    'Crowd control needed',
                    'VIP movement in progress',
                    'Maintenance required'
                  ].map((message, index) => (
                    <button
                      key={index}
                      className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundStaffDashboard;