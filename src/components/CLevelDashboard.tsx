import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Activity, MapPin, AlertTriangle, Clock, BarChart3, PieChart, Calendar, Target, Zap, Globe, Shield, Award } from 'lucide-react';
import FilterableChart from './FilterableChart';
import VIPMovementModal from './VIPMovementModal';

const CLevelDashboard: React.FC = () => {
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Generate sample data for charts
  const generateChartData = (days: number, baseValue: number, variance: number) => {
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.floor(baseValue + (Math.random() - 0.5) * variance),
        timestamp: date,
        category: 'daily'
      });
    }
    return data;
  };

  // Sample data for different metrics
  const visitorData = generateChartData(30, 45000, 15000);
  const revenueData = generateChartData(30, 2500000, 800000);
  const satisfactionData = generateChartData(30, 85, 15);
  const operationalData = generateChartData(30, 92, 8);

  // Key Performance Indicators
  const kpis = [
    {
      id: 'visitors',
      title: 'Daily Visitors',
      value: '47,234',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'Total pilgrims today'
    },
    {
      id: 'revenue',
      title: 'Revenue',
      value: '₹2.8Cr',
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      description: 'Daily collections'
    },
    {
      id: 'satisfaction',
      title: 'Satisfaction',
      value: '4.7/5',
      change: '+0.2',
      trend: 'up',
      icon: Award,
      color: 'purple',
      description: 'Pilgrim feedback'
    },
    {
      id: 'efficiency',
      title: 'Operational Efficiency',
      value: '94%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'indigo',
      description: 'System performance'
    }
  ];

  // Strategic Metrics
  const strategicMetrics = [
    {
      title: 'Queue Management',
      value: '15 min',
      subtitle: 'Avg. wait time',
      status: 'excellent',
      icon: Clock,
      trend: '-23%'
    },
    {
      title: 'Crowd Density',
      value: '68%',
      subtitle: 'Current capacity',
      status: 'good',
      icon: Users,
      trend: '+5%'
    },
    {
      title: 'Security Status',
      value: 'All Clear',
      subtitle: '156 cameras active',
      status: 'excellent',
      icon: Shield,
      trend: '100%'
    },
    {
      title: 'Digital Services',
      value: '89%',
      subtitle: 'Online bookings',
      status: 'good',
      icon: Globe,
      trend: '+12%'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-green-600';
    if (trend.startsWith('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
            <p className="text-indigo-100 text-lg">Strategic Overview & Key Performance Indicators</p>
            <div className="flex items-center space-x-4 mt-4 text-indigo-100">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 animate-pulse" />
                <span>Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">₹2.8Cr</div>
            <div className="text-indigo-200">Today's Revenue</div>
            <button
              onClick={() => setShowVIPModal(true)}
              className="mt-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <Shield className="w-5 h-5" />
              <span>VIP Movement Control</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => setSelectedMetric(kpi.id)}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${kpi.color}-100 text-${kpi.color}-600 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  kpi.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                }`}>
                  {kpi.change}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-600 text-sm font-medium">{kpi.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
                <p className="text-gray-500 text-xs">{kpi.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strategic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {strategicMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                  {metric.trend}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-gray-600 text-sm font-medium">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                <p className="text-gray-500 text-xs">{metric.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitor Analytics */}
        <FilterableChart
          title="Visitor Analytics"
          data={visitorData}
          chartType="area"
          color="blue"
          icon={<Users className="w-5 h-5" />}
        />

        {/* Revenue Trends */}
        <FilterableChart
          title="Revenue Trends"
          data={revenueData}
          chartType="line"
          color="green"
          icon={<DollarSign className="w-5 h-5" />}
        />

        {/* Satisfaction Scores */}
        <FilterableChart
          title="Pilgrim Satisfaction"
          data={satisfactionData}
          chartType="bar"
          color="purple"
          icon={<Award className="w-5 h-5" />}
        />

        {/* Operational Efficiency */}
        <FilterableChart
          title="Operational Efficiency"
          data={operationalData}
          chartType="area"
          color="indigo"
          icon={<Target className="w-5 h-5" />}
        />
      </div>

      {/* Executive Insights */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl text-white">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Executive Insights & Recommendations</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Growth Opportunities</h4>
            </div>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Digital darshan bookings up 23%</li>
              <li>• VIP services showing strong demand</li>
              <li>• Mobile app engagement increased 45%</li>
              <li>• International pilgrim visits up 18%</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Operational Excellence</h4>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Queue wait times reduced by 35%</li>
              <li>• 99.8% system uptime achieved</li>
              <li>• Energy efficiency improved 12%</li>
              <li>• Staff productivity up 28%</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Strategic Focus Areas</h4>
            </div>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• Peak season capacity planning</li>
              <li>• Infrastructure modernization</li>
              <li>• Sustainability initiatives</li>
              <li>• Technology integration roadmap</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Executive Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Generate Executive Report</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Schedule Board Meeting</span>
          </button>
          <button 
            onClick={() => setShowVIPModal(true)}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">VIP Protocol Center</span>
          </button>
        </div>
      </div>

      {/* VIP Movement Modal */}
      <VIPMovementModal 
        isOpen={showVIPModal} 
        onClose={() => setShowVIPModal(false)} 
      />
    </div>
  );
};

export default CLevelDashboard;