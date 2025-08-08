import React, { useState, useEffect } from 'react';
import { Settings, Users, MapPin, Clock, AlertTriangle, Activity, Zap, Shield, Bus, Camera, Radio, Wrench, BarChart3, TrendingUp, Eye, CheckCircle } from 'lucide-react';
import FilterableChart from './FilterableChart';
import TrafficConsole from './TrafficConsole';

const OperationalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'security' | 'maintenance'>('overview');
  const [realTimeData, setRealTimeData] = useState({
    queueLength: 156,
    avgWaitTime: 23,
    crowdDensity: 68,
    systemHealth: 94
  });

  // Generate sample data for operational charts
  const generateOperationalData = (hours: number, baseValue: number, variance: number) => {
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

  const queueData = generateOperationalData(24, 150, 80);
  const crowdData = generateOperationalData(24, 65, 25);
  const systemData = generateOperationalData(24, 92, 8);
  const securityData = generateOperationalData(24, 98, 4);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        queueLength: Math.max(0, prev.queueLength + Math.floor(Math.random() * 10 - 5)),
        avgWaitTime: Math.max(5, prev.avgWaitTime + Math.floor(Math.random() * 6 - 3)),
        crowdDensity: Math.max(0, Math.min(100, prev.crowdDensity + Math.floor(Math.random() * 8 - 4))),
        systemHealth: Math.max(80, Math.min(100, prev.systemHealth + Math.floor(Math.random() * 4 - 2)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const operationalMetrics = [
    {
      title: 'Queue Management',
      value: realTimeData.queueLength.toString(),
      unit: 'people',
      change: '-12',
      trend: 'down',
      icon: Users,
      color: 'blue',
      status: realTimeData.queueLength < 100 ? 'good' : realTimeData.queueLength < 200 ? 'warning' : 'critical'
    },
    {
      title: 'Average Wait Time',
      value: realTimeData.avgWaitTime.toString(),
      unit: 'minutes',
      change: '-5',
      trend: 'down',
      icon: Clock,
      color: 'green',
      status: realTimeData.avgWaitTime < 20 ? 'good' : realTimeData.avgWaitTime < 40 ? 'warning' : 'critical'
    },
    {
      title: 'Crowd Density',
      value: realTimeData.crowdDensity.toString(),
      unit: '%',
      change: '+3',
      trend: 'up',
      icon: MapPin,
      color: 'yellow',
      status: realTimeData.crowdDensity < 70 ? 'good' : realTimeData.crowdDensity < 85 ? 'warning' : 'critical'
    },
    {
      title: 'System Health',
      value: realTimeData.systemHealth.toString(),
      unit: '%',
      change: '+1',
      trend: 'up',
      icon: Activity,
      color: 'purple',
      status: realTimeData.systemHealth > 90 ? 'good' : realTimeData.systemHealth > 80 ? 'warning' : 'critical'
    }
  ];

  const systemStatus = [
    { name: 'CCTV Network', status: 'operational', count: '156/156', icon: Camera },
    { name: 'Communication', status: 'operational', count: '24/24', icon: Radio },
    { name: 'Power Systems', status: 'operational', count: '12/12', icon: Zap },
    { name: 'Security Gates', status: 'maintenance', count: '23/24', icon: Shield },
    { name: 'Transport Fleet', status: 'operational', count: '45/48', icon: Bus },
    { name: 'Maintenance', status: 'scheduled', count: '3 pending', icon: Wrench }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-blue-600 bg-blue-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-green-500 bg-green-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'critical': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Operations Overview', icon: BarChart3 },
    { id: 'traffic', name: 'Traffic Management', icon: Bus },
    { id: 'security', name: 'Security Systems', icon: Shield },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Operational Control Center</h1>
            <p className="text-blue-100">Real-time monitoring and system management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{realTimeData.systemHealth}%</div>
              <div className="text-blue-200 text-sm">System Health</div>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Live Monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Real-time Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {operationalMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl shadow-lg p-6 border-l-4 ${getMetricStatusColor(metric.status)} transition-all duration-200 hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-${metric.color}-100 text-${metric.color}-600`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          metric.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                        }`}>
                          {metric.change}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
                        <p className="text-3xl font-bold text-gray-800">
                          {metric.value}
                          <span className="text-lg text-gray-500 ml-1">{metric.unit}</span>
                        </p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                          {metric.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FilterableChart
                  title="Queue Length Trends"
                  data={queueData}
                  chartType="line"
                  color="blue"
                  icon={<Users className="w-5 h-5" />}
                />

                <FilterableChart
                  title="Crowd Density Analysis"
                  data={crowdData}
                  chartType="area"
                  color="yellow"
                  icon={<MapPin className="w-5 h-5" />}
                />

                <FilterableChart
                  title="System Performance"
                  data={systemData}
                  chartType="bar"
                  color="purple"
                  icon={<Activity className="w-5 h-5" />}
                />

                <FilterableChart
                  title="Security Metrics"
                  data={securityData}
                  chartType="line"
                  color="green"
                  icon={<Shield className="w-5 h-5" />}
                />
              </div>

              {/* System Status Grid */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Status Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemStatus.map((system, index) => {
                    const IconComponent = system.icon;
                    return (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(system.status)}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <span className="font-medium text-gray-800">{system.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">{system.count}</span>
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                          {system.status.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'traffic' && (
            <TrafficConsole />
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Camera className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-green-800">CCTV Monitoring</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">156/156</div>
                    <div className="text-sm text-green-700">Cameras Online</div>
                    <div className="text-xs text-green-600">AI Detection: Active</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-blue-800">Access Control</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">24/24</div>
                    <div className="text-sm text-blue-700">Gates Operational</div>
                    <div className="text-xs text-blue-600">Biometric: Enabled</div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Radio className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-purple-800">Communication</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-purple-600">98%</div>
                    <div className="text-sm text-purple-700">Network Uptime</div>
                    <div className="text-xs text-purple-600">Emergency: Ready</div>
                  </div>
                </div>
              </div>

              <FilterableChart
                title="Security Incident Trends"
                data={securityData}
                chartType="bar"
                color="red"
                icon={<AlertTriangle className="w-5 h-5" />}
              />
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Scheduled Tasks', value: '12', status: 'pending', icon: Clock },
                  { title: 'Completed Today', value: '8', status: 'completed', icon: CheckCircle },
                  { title: 'Critical Issues', value: '2', status: 'critical', icon: AlertTriangle },
                  { title: 'System Uptime', value: '99.8%', status: 'excellent', icon: TrendingUp }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{item.value}</div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Maintenance Schedule</h3>
                <div className="space-y-4">
                  {[
                    { task: 'CCTV Camera Cleaning - Zone A', time: '10:00 AM', status: 'in-progress', priority: 'medium' },
                    { task: 'Generator Maintenance Check', time: '2:00 PM', status: 'scheduled', priority: 'high' },
                    { task: 'Network Equipment Inspection', time: '4:00 PM', status: 'pending', priority: 'low' },
                    { task: 'Emergency System Test', time: '6:00 PM', status: 'scheduled', priority: 'critical' }
                  ].map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-blue-500' :
                          task.status === 'scheduled' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <div className="font-medium text-gray-800">{task.task}</div>
                          <div className="text-sm text-gray-600">{task.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
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

export default OperationalDashboard;