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
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Bell,
  Eye,
  FileText,
  Target
} from 'lucide-react';

const CLevelDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(12);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [reportType, setReportType] = useState('executive');

  const [kpiData, setKpiData] = useState({
    totalVisitors: 45678,
    revenue: 2340000,
    satisfaction: 94.2,
    efficiency: 87.5
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Parking capacity at 85%', time: '10:30 AM', priority: 'medium' },
    { id: 2, type: 'info', message: 'VIP darshan scheduled at 2 PM', time: '11:00 AM', priority: 'low' },
    { id: 3, type: 'critical', message: 'Weather alert: Heavy rain expected', time: '11:30 AM', priority: 'high' }
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, 30000); // Auto-refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setKpiData(prev => ({
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 100),
        revenue: prev.revenue + Math.floor(Math.random() * 10000),
        satisfaction: Math.max(85, Math.min(100, prev.satisfaction + (Math.random() - 0.5) * 2)),
        efficiency: Math.max(80, Math.min(100, prev.efficiency + (Math.random() - 0.5) * 3))
      }));
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExportReport = () => {
    const reportData = {
      timeRange,
      reportType,
      kpiData,
      alerts,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ttd-executive-report-${timeRange}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = (metric: string) => {
    setSelectedMetric(metric);
    // In a real app, this would navigate to a detailed view
    alert(`Viewing detailed analytics for ${metric}. This would open a comprehensive dashboard.`);
  };

  const handleDismissAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setNotifications(prev => Math.max(0, prev - 1));
  };

  const handleOptimizeOperations = () => {
    alert('AI optimization initiated. Analyzing current operations and generating recommendations...');
    // Simulate optimization process
    setTimeout(() => {
      alert('Optimization complete! Recommendations: 1) Increase shuttle frequency by 20% 2) Open additional parking zones 3) Deploy extra staff to high-traffic areas');
    }, 2000);
  };

  const handleEmergencyProtocol = () => {
    const confirmed = confirm('Are you sure you want to activate emergency protocols? This will alert all departments and initiate emergency procedures.');
    if (confirmed) {
      alert('Emergency protocols activated. All departments have been notified. Emergency response teams are being deployed.');
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Executive Dashboard</h2>
          <p className="text-gray-600">Strategic overview and key performance indicators</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="select-mobius"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-mobius-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportReport}
            className="btn-mobius-primary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-mobius-secondary p-3"
          >
            <Settings className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifications(0)}
              className="btn-mobius-secondary p-3 relative"
            >
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dashboard Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto Refresh</label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">Enable auto-refresh (30s)</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="select-mobius w-full"
              >
                <option value="executive">Executive Summary</option>
                <option value="detailed">Detailed Analytics</option>
                <option value="operational">Operational Metrics</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowSettings(false)}
                className="btn-mobius-primary w-full"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Total Visitors</p>
              <p className="text-3xl font-bold text-blue-600">{kpiData.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">+12.5% from last period</span>
            <button
              onClick={() => handleViewDetails('visitors')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-green-600">₹{(kpiData.revenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">+8.3% from last period</span>
            <button
              onClick={() => handleViewDetails('revenue')}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Satisfaction</p>
              <p className="text-3xl font-bold text-purple-600">{kpiData.satisfaction.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">+2.1% from last period</span>
            <button
              onClick={() => handleViewDetails('satisfaction')}
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-600 text-sm">Efficiency</p>
              <p className="text-3xl font-bold text-orange-600">{kpiData.efficiency.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">+5.7% from last period</span>
            <button
              onClick={() => handleViewDetails('efficiency')}
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-mobius-elevated p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Strategic Actions</h3>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleOptimizeOperations}
              className="w-full btn-mobius-primary flex items-center justify-center space-x-2 py-4"
            >
              <Zap className="w-5 h-5" />
              <span>AI-Powered Operations Optimization</span>
            </button>

            <button
              onClick={handleEmergencyProtocol}
              className="w-full btn-mobius-error flex items-center justify-center space-x-2 py-4"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Activate Emergency Protocols</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert('Generating comprehensive performance report...')}
                className="btn-mobius-secondary flex items-center justify-center space-x-2 py-3"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Report</span>
              </button>

              <button
                onClick={() => alert('Opening resource allocation dashboard...')}
                className="btn-mobius-secondary flex items-center justify-center space-x-2 py-3"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Resource Planning</span>
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Critical Alerts</h3>
            </div>
            <button
              onClick={() => setAlerts([])}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active alerts</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getAlertColor(alert.type)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{alert.message}</span>
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="text-xs hover:bg-white/50 px-2 py-1 rounded"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-sm opacity-80">
                    <span>{alert.time}</span>
                    <span className="capitalize">{alert.priority} Priority</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {alerts.length > 0 && (
            <button
              onClick={() => alert('Opening detailed alert management system...')}
              className="w-full mt-4 btn-mobius-warning"
            >
              Manage All Alerts
            </button>
          )}
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="card-mobius-elevated p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-xl text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Performance Analytics</h3>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="select-mobius"
            >
              <option value="revenue">Revenue Trends</option>
              <option value="visitors">Visitor Patterns</option>
              <option value="satisfaction">Satisfaction Scores</option>
              <option value="efficiency">Operational Efficiency</option>
            </select>
            
            <button
              onClick={() => alert(`Applying advanced filters for ${selectedMetric} analysis...`)}
              className="btn-mobius-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 animate-pulse" />
            <p>Advanced analytics visualization for {selectedMetric}</p>
            <p className="text-sm mt-2">Time Range: {timeRange}</p>
            <button
              onClick={() => alert('Opening full-screen analytics dashboard...')}
              className="mt-4 btn-mobius-primary flex items-center space-x-2 mx-auto"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLevelDashboard;