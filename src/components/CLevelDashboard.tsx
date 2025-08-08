import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Activity, 
  BarChart3, 
  PieChart, 
  Calendar,
  Brain,
  Eye,
  Shield,
  Clock,
  MapPin,
  Zap,
  Target,
  Award,
  Globe
} from 'lucide-react';
import CalendarAnalytics from './CalendarAnalytics';
import VIPMovementModal from './VIPMovementModal';

const CLevelDashboard: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month' | 'quarter'>('today');
  const [kpiData, setKpiData] = useState({
    totalVisitors: 45678,
    revenue: 6789000,
    satisfaction: 94.2,
    efficiency: 87.5,
    incidents: 3,
    vipVisits: 2
  });

  const [trends, setTrends] = useState({
    visitors: { value: 12.5, direction: 'up' as const },
    revenue: { value: 8.3, direction: 'up' as const },
    satisfaction: { value: 2.1, direction: 'up' as const },
    efficiency: { value: 5.7, direction: 'down' as const }
  });

  const [predictiveInsights, setPredictiveInsights] = useState([
    {
      id: 1,
      type: 'opportunity' as const,
      title: 'Peak Season Preparation',
      description: 'AI predicts 40% increase in visitors next month. Recommend increasing shuttle frequency.',
      confidence: 92,
      impact: 'high' as const,
      timeframe: '2-4 weeks'
    },
    {
      id: 2,
      type: 'risk' as const,
      title: 'Parking Capacity Alert',
      description: 'Current growth trend will exceed parking capacity by 15% during festival season.',
      confidence: 87,
      impact: 'high' as const,
      timeframe: '1-2 months'
    },
    {
      id: 3,
      type: 'optimization' as const,
      title: 'Resource Allocation',
      description: 'Optimize staff scheduling to reduce wait times by 23% during peak hours.',
      confidence: 78,
      impact: 'medium' as const,
      timeframe: '1 week'
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState([
    { name: 'Visitor Satisfaction', value: 94.2, target: 95, trend: 'up' },
    { name: 'Operational Efficiency', value: 87.5, target: 90, trend: 'down' },
    { name: 'Revenue per Visitor', value: 148.7, target: 150, trend: 'up' },
    { name: 'Safety Score', value: 98.1, target: 98, trend: 'up' },
    { name: 'Digital Adoption', value: 76.3, target: 80, trend: 'up' },
    { name: 'Staff Productivity', value: 82.4, target: 85, trend: 'stable' }
  ]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setKpiData(prev => ({
        ...prev,
        totalVisitors: prev.totalVisitors + Math.floor(Math.random() * 10) - 5,
        revenue: prev.revenue + Math.floor(Math.random() * 1000) - 500,
        satisfaction: Math.max(90, Math.min(100, prev.satisfaction + (Math.random() - 0.5) * 0.5)),
        efficiency: Math.max(80, Math.min(95, prev.efficiency + (Math.random() - 0.5) * 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'optimization': return <Target className="w-5 h-5 text-blue-600" />;
      default: return <Brain className="w-5 h-5 text-purple-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-50 border-green-200';
      case 'risk': return 'bg-red-50 border-red-200';
      case 'optimization': return 'bg-blue-50 border-blue-200';
      default: return 'bg-purple-50 border-purple-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Executive Summary Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-display-lg mb-2">Executive Dashboard</h1>
            <p className="text-body-lg opacity-90">Strategic insights and performance overview</p>
          </div>
          <div className="flex items-center space-x-4">
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

        {/* Time Frame Selector */}
        <div className="flex space-x-2">
          {[
            { id: 'today', name: 'Today' },
            { id: 'week', name: 'This Week' },
            { id: 'month', name: 'This Month' },
            { id: 'quarter', name: 'This Quarter' }
          ].map(timeframe => (
            <button
              key={timeframe.id}
              onClick={() => setSelectedTimeframe(timeframe.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe.id
                  ? 'bg-white text-indigo-600'
                  : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              {timeframe.name}
            </button>
          ))}
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-label-sm font-semibold">+{trends.visitors.value}%</span>
            </div>
          </div>
          <div>
            <p className="text-body-sm text-gray-600 mb-1">Total Visitors</p>
            <p className="text-display-sm font-bold text-gray-900">{formatNumber(kpiData.totalVisitors)}</p>
            <p className="text-label-sm text-gray-500 mt-2">vs last {selectedTimeframe}</p>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-label-sm font-semibold">+{trends.revenue.value}%</span>
            </div>
          </div>
          <div>
            <p className="text-body-sm text-gray-600 mb-1">Revenue</p>
            <p className="text-display-sm font-bold text-gray-900">{formatCurrency(kpiData.revenue)}</p>
            <p className="text-label-sm text-gray-500 mt-2">vs last {selectedTimeframe}</p>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-label-sm font-semibold">+{trends.satisfaction.value}%</span>
            </div>
          </div>
          <div>
            <p className="text-body-sm text-gray-600 mb-1">Satisfaction Score</p>
            <p className="text-display-sm font-bold text-gray-900">{kpiData.satisfaction.toFixed(1)}%</p>
            <p className="text-label-sm text-gray-500 mt-2">Devotee feedback</p>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex items-center space-x-1 text-red-600">
              <TrendingDown className="w-4 h-4" />
              <span className="text-label-sm font-semibold">-{trends.efficiency.value}%</span>
            </div>
          </div>
          <div>
            <p className="text-body-sm text-gray-600 mb-1">Operational Efficiency</p>
            <p className="text-display-sm font-bold text-gray-900">{kpiData.efficiency.toFixed(1)}%</p>
            <p className="text-label-sm text-gray-500 mt-2">System performance</p>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="status-success">
              <CheckCircle className="w-4 h-4" />
              <span>Low</span>
            </div>
          </div>
          <div>
            <p className="text-body-sm text-gray-600 mb-1">Active Incidents</p>
            <p className="text-display-sm font-bold text-gray-900">{kpiData.incidents}</p>
            <p className="text-label-sm text-gray-500 mt-2">Requires attention</p>
          </div>
        </div>

        <div className="card-mobius-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
            <div className="status-info">
              <Eye className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>
          <div>
            <p className="text-body-sm text-gray-600 mb-1">VIP Visits Today</p>
            <p className="text-display-sm font-bold text-gray-900">{kpiData.vipVisits}</p>
            <p className="text-label-sm text-gray-500 mt-2">Security protocols active</p>
          </div>
        </div>
      </div>

      {/* AI-Powered Predictive Insights */}
      <div className="card-mobius-elevated p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-display-md font-bold text-gray-900">AI Predictive Insights</h2>
              <p className="text-body-sm text-gray-600">Strategic recommendations powered by machine learning</p>
            </div>
          </div>
          <button className="btn-mobius-primary">
            View All Insights
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {predictiveInsights.map(insight => (
            <div key={insight.id} className={`border-2 rounded-xl p-6 ${getInsightColor(insight.type)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h3 className="text-label-lg font-semibold text-gray-900">{insight.title}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-label-sm font-medium mt-1 ${getImpactBadge(insight.impact)}`}>
                      {insight.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-label-sm font-semibold text-gray-700">{insight.confidence}%</div>
                  <div className="text-label-sm text-gray-500">confidence</div>
                </div>
              </div>
              
              <p className="text-body-sm text-gray-700 mb-4 leading-relaxed">{insight.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-label-sm">{insight.timeframe}</span>
                </div>
                <button className="text-label-sm font-medium text-indigo-600 hover:text-indigo-800">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Scorecard */}
        <div className="card-mobius-elevated p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-display-sm font-bold text-gray-900">Performance Scorecard</h3>
              <p className="text-body-sm text-gray-600">Key metrics vs targets</p>
            </div>
          </div>

          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-md font-medium text-gray-800">{metric.name}</span>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(metric.trend)}
                    <span className="text-label-sm font-semibold text-gray-700">
                      {metric.value}{metric.name.includes('Revenue') ? '' : '%'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metric.value >= metric.target ? 'bg-green-500' : 
                        metric.value >= metric.target * 0.9 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-label-sm text-gray-600">
                    Target: {metric.target}{metric.name.includes('Revenue') ? '' : '%'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Initiatives */}
        <div className="card-mobius-elevated p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-display-sm font-bold text-gray-900">Strategic Initiatives</h3>
              <p className="text-body-sm text-gray-600">Current focus areas</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { name: 'Digital Transformation', progress: 78, status: 'On Track', priority: 'High' },
              { name: 'Sustainability Program', progress: 65, status: 'In Progress', priority: 'Medium' },
              { name: 'Visitor Experience Enhancement', progress: 92, status: 'Ahead', priority: 'High' },
              { name: 'Infrastructure Modernization', progress: 45, status: 'Behind', priority: 'High' }
            ].map((initiative, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-label-md font-semibold text-gray-800">{initiative.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-label-sm font-medium ${
                        initiative.status === 'Ahead' ? 'bg-green-100 text-green-800' :
                        initiative.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                        initiative.status === 'Behind' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {initiative.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-label-sm font-medium ${
                        initiative.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {initiative.priority} Priority
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-label-lg font-bold text-gray-900">{initiative.progress}%</div>
                    <div className="text-label-sm text-gray-500">Complete</div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      initiative.progress >= 90 ? 'bg-green-500' :
                      initiative.progress >= 70 ? 'bg-blue-500' :
                      initiative.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${initiative.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Impact & Recognition */}
      <div className="card-mobius-elevated p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl text-white">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-display-sm font-bold text-gray-900">Global Impact & Recognition</h3>
            <p className="text-body-sm text-gray-600">International standing and achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl">
            <div className="text-display-lg font-bold text-indigo-600 mb-2">150+</div>
            <div className="text-label-md font-semibold text-gray-800 mb-1">Countries</div>
            <div className="text-body-sm text-gray-600">Devotees from worldwide</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
            <div className="text-display-lg font-bold text-emerald-600 mb-2">4.8★</div>
            <div className="text-label-md font-semibold text-gray-800 mb-1">Global Rating</div>
            <div className="text-body-sm text-gray-600">International reviews</div>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl">
            <div className="text-display-lg font-bold text-violet-600 mb-2">12</div>
            <div className="text-label-md font-semibold text-gray-800 mb-1">Awards</div>
            <div className="text-body-sm text-gray-600">This year</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalendarAnalytics 
        persona="c-level"
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

export default CLevelDashboard;