import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  BarChart3, 
  PieChart, 
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Settings,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Download,
  Filter,
  Eye,
  TrendingDown
} from 'lucide-react';

const CLevelDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['revenue', 'visitors', 'efficiency']);
  
  // Real-time data simulation
  const [metrics, setMetrics] = useState({
    totalVisitors: 45678,
    revenue: 2340000,
    efficiency: 94.2,
    satisfaction: 4.8,
    operationalCost: 890000,
    staffUtilization: 87.5
  });

  const [trends, setTrends] = useState({
    visitors: { change: 12.5, direction: 'up' },
    revenue: { change: 8.3, direction: 'up' },
    efficiency: { change: -2.1, direction: 'down' },
    satisfaction: { change: 5.7, direction: 'up' }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 10) - 5,
        revenue: prev.revenue + Math.floor(Math.random() * 1000) - 500,
        efficiency: Math.max(0, Math.min(100, prev.efficiency + (Math.random() * 0.4) - 0.2)),
        satisfaction: Math.max(0, Math.min(5, prev.satisfaction + (Math.random() * 0.02) - 0.01))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const actionMenuItems = [
    {
      id: 'generate-report',
      name: 'Generate Executive Report',
      description: 'Create comprehensive performance report',
      icon: Download,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'optimize-operations',
      name: 'Optimize Operations',
      description: 'AI-powered operational optimization',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'scenario-analysis',
      name: 'Scenario Analysis',
      description: 'Run what-if scenarios and projections',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'real-time-monitoring',
      name: 'Real-time Monitoring',
      description: 'Switch to live monitoring mode',
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'configure-alerts',
      name: 'Configure Alerts',
      description: 'Set up executive alert preferences',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      id: 'export-data',
      name: 'Export Data',
      description: 'Export strategic data for analysis',
      icon: Download,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const handleActionSelect = (actionId: string) => {
    setShowActionMenu(false);
    
    switch (actionId) {
      case 'generate-report':
        console.log('Generating executive report...');
        // Add report generation logic
        break;
      case 'optimize-operations':
        console.log('Starting operational optimization...');
        // Add optimization logic
        break;
      case 'scenario-analysis':
        console.log('Opening scenario analysis...');
        // Add scenario analysis logic
        break;
      case 'real-time-monitoring':
        console.log('Switching to real-time monitoring...');
        // Add monitoring logic
        break;
      case 'configure-alerts':
        console.log('Opening alert configuration...');
        // Add alert configuration logic
        break;
      case 'export-data':
        console.log('Exporting strategic data...');
        // Add data export logic
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? ArrowUpRight : ArrowDownRight;
  };

  const getTrendColor = (direction: string) => {
    return direction === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Strategic Overview Header with Action Button */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Strategic Overview</h2>
            <p className="text-gray-600">Real-time executive dashboard for TTD operations</p>
          </div>
          
          {/* Strategic Actions Button */}
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Settings className="w-5 h-5" />
              <span>Strategic Actions</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showActionMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Action Menu Dropdown */}
            {showActionMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Executive Actions</h3>
                  <p className="text-xs text-gray-600 mt-1">Select an action to perform strategic operations</p>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {actionMenuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleActionSelect(item.id)}
                        className="w-full flex items-center space-x-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`p-2 rounded-lg ${item.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 text-sm">{item.name}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{item.description}</div>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
                
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-600 text-center">
                    All actions are logged for audit purposes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-4 mb-8">
          <span className="text-sm font-medium text-gray-700">Time Range:</span>
          <div className="flex space-x-2">
            {['today', 'week', 'month', 'quarter'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Visitors */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {React.createElement(getTrendIcon(trends.visitors.direction), {
                  className: `w-4 h-4 ${getTrendColor(trends.visitors.direction)}`
                })}
                <span className={`text-sm font-semibold ${getTrendColor(trends.visitors.direction)}`}>
                  {trends.visitors.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalVisitors)}</p>
              <p className="text-sm text-gray-600 mt-1">Total Visitors</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {React.createElement(getTrendIcon(trends.revenue.direction), {
                  className: `w-4 h-4 ${getTrendColor(trends.revenue.direction)}`
                })}
                <span className={`text-sm font-semibold ${getTrendColor(trends.revenue.direction)}`}>
                  {trends.revenue.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.revenue)}</p>
              <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
            </div>
          </div>

          {/* Operational Efficiency */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {React.createElement(getTrendIcon(trends.efficiency.direction), {
                  className: `w-4 h-4 ${getTrendColor(trends.efficiency.direction)}`
                })}
                <span className={`text-sm font-semibold ${getTrendColor(trends.efficiency.direction)}`}>
                  {Math.abs(trends.efficiency.change)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.efficiency.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 mt-1">Operational Efficiency</p>
            </div>
          </div>

          {/* Visitor Satisfaction */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {React.createElement(getTrendIcon(trends.satisfaction.direction), {
                  className: `w-4 h-4 ${getTrendColor(trends.satisfaction.direction)}`
                })}
                <span className={`text-sm font-semibold ${getTrendColor(trends.satisfaction.direction)}`}>
                  {trends.satisfaction.change}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{metrics.satisfaction.toFixed(1)}/5.0</p>
              <p className="text-sm text-gray-600 mt-1">Visitor Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Revenue Trends</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
              <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
              <span className="text-sm text-gray-600">Costs</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-green-800">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(metrics.revenue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <p className="font-semibold text-red-800">Operational Costs</p>
                <p className="text-2xl font-bold text-red-900">{formatCurrency(metrics.operationalCost)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-blue-800">Net Profit</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(metrics.revenue - metrics.operationalCost)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Operational Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Operational Insights</h3>
            <PieChart className="w-6 h-6 text-gray-600" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="font-semibold text-purple-800">Staff Utilization</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.staffUtilization.toFixed(1)}%</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray={`${metrics.staffUtilization}, 100`}
                  />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Peak Hours</p>
                <p className="text-lg font-bold text-gray-800">6AM-12PM</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-lg font-bold text-gray-800">23 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Alerts */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-amber-100 p-3 rounded-xl">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Strategic Alerts & Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Revenue Target</span>
            </div>
            <p className="text-sm text-green-700">Monthly revenue target achieved 8 days early</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Efficiency Alert</span>
            </div>
            <p className="text-sm text-yellow-700">Operational efficiency down 2.1% - investigate bottlenecks</p>
          </div>
          
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Growth Opportunity</span>
            </div>
            <p className="text-sm text-blue-700">Peak hour capacity can be increased by 15%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLevelDashboard;