import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Bell, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Navigation, 
  Radio, 
  Shield, 
  Target,
  TrendingUp, 
  Users, 
  Zap 
} from 'lucide-react';
import CalendarAnalytics from './CalendarAnalytics';
import VIPMovementModal from './VIPMovementModal';

const GroundStaffDashboard: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [currentShift, setCurrentShift] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'urgent', message: 'Medical emergency at Zone A - Ambulance requested', time: '2 min ago', location: 'Zone A' },
    { id: 2, type: 'warning', message: 'Crowd density high at Main Temple entrance', time: '5 min ago', location: 'Main Temple' },
    { id: 3, type: 'info', message: 'VIP arrival expected in 15 minutes', time: '8 min ago', location: 'VIP Gate' }
  ]);

  const [taskList, setTaskList] = useState([
    { id: 1, task: 'Check crowd barriers at Gate 3', priority: 'high', completed: false, assignedTo: 'Team A' },
    { id: 2, task: 'Coordinate with shuttle service', priority: 'medium', completed: true, assignedTo: 'Team B' },
    { id: 3, task: 'Update parking availability signs', priority: 'low', completed: false, assignedTo: 'Team C' },
    { id: 4, task: 'Assist elderly devotees at ramp', priority: 'high', completed: false, assignedTo: 'Team A' }
  ]);

  const [realTimeStats, setRealTimeStats] = useState({
    currentCrowd: 2847,
    queueWaitTime: 35,
    emergencyAlerts: 1,
    completedTasks: 12,
    activeStaff: 45,
    vehiclesInQueue: 156
  });

  const [communicationLog, setCommunicationLog] = useState([
    { id: 1, from: 'Control Room', message: 'Increase crowd control at Main Gate', time: '10:30 AM', type: 'instruction' },
    { id: 2, from: 'Team Leader', message: 'Medical team dispatched to Zone A', time: '10:25 AM', type: 'update' },
    { id: 3, from: 'Security', message: 'VIP convoy approaching - clear Route 2', time: '10:20 AM', type: 'alert' }
  ]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        currentCrowd: prev.currentCrowd + Math.floor(Math.random() * 20) - 10,
        queueWaitTime: Math.max(15, prev.queueWaitTime + Math.floor(Math.random() * 6) - 3),
        vehiclesInQueue: Math.max(0, prev.vehiclesInQueue + Math.floor(Math.random() * 8) - 4)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTaskList(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'morning': return 'bg-orange-100 text-orange-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'evening': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header with Shift Info */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-display-lg mb-2">Ground Staff Dashboard</h1>
            <p className="text-body-lg opacity-90">Real-time field operations and task management</p>
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

        {/* Shift Selector */}
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Current Shift:</span>
          <div className="flex space-x-2">
            {[
              { id: 'morning', name: 'Morning (6AM-2PM)', time: '6AM-2PM' },
              { id: 'afternoon', name: 'Afternoon (2PM-10PM)', time: '2PM-10PM' },
              { id: 'evening', name: 'Evening (10PM-6AM)', time: '10PM-6AM' }
            ].map(shift => (
              <button
                key={shift.id}
                onClick={() => setCurrentShift(shift.id as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentShift === shift.id
                    ? 'bg-white text-green-600'
                    : 'bg-white/20 hover:bg-white/30 text-white'
                }`}
              >
                {shift.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeStats.currentCrowd.toLocaleString()}</div>
              <div className="text-body-sm text-gray-600">Current Crowd</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-blue-600">
            <Activity className="w-4 h-4" />
            <span className="text-label-sm">Live count</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeStats.queueWaitTime}</div>
              <div className="text-body-sm text-gray-600">Wait Time (min)</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-yellow-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-label-sm">Average queue time</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeStats.emergencyAlerts}</div>
              <div className="text-body-sm text-gray-600">Active Alerts</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-red-600">
            <Bell className="w-4 h-4" />
            <span className="text-label-sm">Requires attention</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeStats.completedTasks}</div>
              <div className="text-body-sm text-gray-600">Tasks Completed</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Target className="w-4 h-4" />
            <span className="text-label-sm">Today's progress</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeStats.activeStaff}</div>
              <div className="text-body-sm text-gray-600">Active Staff</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-purple-600">
            <Radio className="w-4 h-4" />
            <span className="text-label-sm">On duty</span>
          </div>
        </div>

        <div className="card-mobius p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <Navigation className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="text-right">
              <div className="text-display-sm font-bold text-gray-900">{realTimeStats.vehiclesInQueue}</div>
              <div className="text-body-sm text-gray-600">Vehicles in Queue</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-indigo-600">
            <MapPin className="w-4 h-4" />
            <span className="text-label-sm">Traffic monitoring</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="card-mobius p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-display-sm font-bold text-gray-900">Active Alerts</h3>
              <p className="text-body-sm text-gray-600">Immediate attention required</p>
            </div>
          </div>

          <div className="space-y-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="font-semibold text-gray-800">{alert.message}</div>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-white/80 hover:bg-white px-3 py-1 rounded transition-colors">
                      Acknowledge
                    </button>
                    <button className="text-xs bg-white/80 hover:bg-white px-3 py-1 rounded transition-colors">
                      Respond
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management */}
        <div className="card-mobius p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-display-sm font-bold text-gray-900">Task Management</h3>
              <p className="text-body-sm text-gray-600">Current shift assignments</p>
            </div>
          </div>

          <div className="space-y-3">
            {taskList.map(task => (
              <div key={task.id} className={`border border-gray-200 rounded-lg p-4 ${task.completed ? 'opacity-60' : ''}`}>
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.completed && <CheckCircle className="w-3 h-3" />}
                  </button>
                  <div className="flex-1">
                    <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                      {task.task}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600">Assigned to: {task.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Communication Center */}
      <div className="card-mobius p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-display-sm font-bold text-gray-900">Communication Center</h3>
            <p className="text-body-sm text-gray-600">Real-time updates and instructions</p>
          </div>
        </div>

        <div className="space-y-3">
          {communicationLog.map(comm => (
            <div key={comm.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full mt-2 ${
                comm.type === 'instruction' ? 'bg-blue-500' :
                comm.type === 'update' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-800">{comm.from}</span>
                  <span className="text-xs text-gray-500">{comm.time}</span>
                </div>
                <div className="text-sm text-gray-700">{comm.message}</div>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    comm.type === 'instruction' ? 'bg-blue-100 text-blue-800' :
                    comm.type === 'update' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {comm.type.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-mobius p-6">
        <h3 className="text-display-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-mobius-error flex items-center justify-center space-x-2 py-3">
            <Zap className="w-4 h-4" />
            <span>Emergency Alert</span>
          </button>
          <button className="btn-mobius-warning flex items-center justify-center space-x-2 py-3">
            <Radio className="w-4 h-4" />
            <span>Request Backup</span>
          </button>
          <button className="btn-mobius-primary flex items-center justify-center space-x-2 py-3">
            <MessageSquare className="w-4 h-4" />
            <span>Send Update</span>
          </button>
          <button className="btn-mobius-success flex items-center justify-center space-x-2 py-3">
            <CheckCircle className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CalendarAnalytics 
        persona="ground-staff"
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

export default GroundStaffDashboard;