import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, BarChart3, Activity, Users, Car, AlertTriangle, CheckCircle, Clock, Eye, EyeOff } from 'lucide-react';

interface DayData {
  date: string;
  predicted: {
    visitors: number;
    vehicles: number;
    incidents: number;
    revenue: number;
    crowdDensity: number;
    waitTime: number;
  };
  actual?: {
    visitors: number;
    vehicles: number;
    incidents: number;
    revenue: number;
    crowdDensity: number;
    waitTime: number;
  };
  accuracy?: number;
  type: 'historical' | 'future';
}

interface CalendarAnalyticsProps {
  persona: 'c-level' | 'operational' | 'ground-staff';
  isOpen: boolean;
  onClose: () => void;
}

const CalendarAnalytics: React.FC<CalendarAnalyticsProps> = ({ persona, isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [selectedMetric, setSelectedMetric] = useState<'visitors' | 'vehicles' | 'incidents' | 'revenue' | 'crowdDensity' | 'waitTime'>('visitors');
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [showPredictions, setShowPredictions] = useState(true);

  // Generate sample data for past 10 days and future 10 days
  useEffect(() => {
    const generateCalendarData = (): DayData[] => {
      const data: DayData[] = [];
      const today = new Date();
      
      // Generate past 10 days (with actual data)
      for (let i = 10; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const baseVisitors = 15000 + Math.random() * 10000;
        const predicted = {
          visitors: Math.floor(baseVisitors),
          vehicles: Math.floor(baseVisitors * 0.3),
          incidents: Math.floor(Math.random() * 5),
          revenue: Math.floor(baseVisitors * 150),
          crowdDensity: Math.floor(60 + Math.random() * 30),
          waitTime: Math.floor(30 + Math.random() * 60)
        };
        
        // Add some variance for actual data
        const variance = 0.8 + Math.random() * 0.4; // 80% to 120% of predicted
        const actual = {
          visitors: Math.floor(predicted.visitors * variance),
          vehicles: Math.floor(predicted.vehicles * variance),
          incidents: Math.floor(predicted.incidents * (0.5 + Math.random())),
          revenue: Math.floor(predicted.revenue * variance),
          crowdDensity: Math.floor(predicted.crowdDensity * variance),
          waitTime: Math.floor(predicted.waitTime * variance)
        };
        
        // Calculate accuracy based on visitors (main metric)
        const accuracy = Math.max(0, 100 - Math.abs((predicted.visitors - actual.visitors) / predicted.visitors * 100));
        
        data.push({
          date: date.toISOString().split('T')[0],
          predicted,
          actual,
          accuracy: Math.floor(accuracy),
          type: 'historical'
        });
      }
      
      // Generate future 10 days (predictions only)
      for (let i = 1; i <= 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        // Add some trend and seasonality
        const dayOfWeek = date.getDay();
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.5 : 1.0;
        const trendMultiplier = 1 + (i * 0.02); // Slight upward trend
        
        const baseVisitors = (15000 + Math.random() * 10000) * weekendMultiplier * trendMultiplier;
        
        const predicted = {
          visitors: Math.floor(baseVisitors),
          vehicles: Math.floor(baseVisitors * 0.3),
          incidents: Math.floor(Math.random() * 5),
          revenue: Math.floor(baseVisitors * 150),
          crowdDensity: Math.floor(60 + Math.random() * 30),
          waitTime: Math.floor(30 + Math.random() * 60)
        };
        
        data.push({
          date: date.toISOString().split('T')[0],
          predicted,
          type: 'future'
        });
      }
      
      return data;
    };

    setCalendarData(generateCalendarData());
  }, []);

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'visitors': return <Users className="w-4 h-4" />;
      case 'vehicles': return <Car className="w-4 h-4" />;
      case 'incidents': return <AlertTriangle className="w-4 h-4" />;
      case 'revenue': return <TrendingUp className="w-4 h-4" />;
      case 'crowdDensity': return <Activity className="w-4 h-4" />;
      case 'waitTime': return <Clock className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'visitors': return 'Visitors';
      case 'vehicles': return 'Vehicles';
      case 'incidents': return 'Incidents';
      case 'revenue': return 'Revenue (₹)';
      case 'crowdDensity': return 'Crowd Density (%)';
      case 'waitTime': return 'Wait Time (min)';
      default: return metric;
    }
  };

  const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
      case 'revenue': return `₹${(value / 1000).toFixed(0)}K`;
      case 'crowdDensity': return `${value}%`;
      case 'waitTime': return `${value}m`;
      case 'visitors': return `${(value / 1000).toFixed(1)}K`;
      case 'vehicles': return `${(value / 1000).toFixed(1)}K`;
      default: return value.toString();
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-100';
    if (accuracy >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getDayColor = (day: DayData) => {
    if (day.type === 'future') {
      return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
    
    if (!day.accuracy) return 'bg-gray-50 border-gray-200';
    
    if (day.accuracy >= 90) return 'bg-green-50 border-green-200 hover:bg-green-100';
    if (day.accuracy >= 75) return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    return 'bg-red-50 border-red-200 hover:bg-red-100';
  };

  const getPersonaMetrics = () => {
    switch (persona) {
      case 'c-level':
        return ['visitors', 'revenue', 'incidents', 'crowdDensity'];
      case 'operational':
        return ['visitors', 'vehicles', 'incidents', 'waitTime'];
      case 'ground-staff':
        return ['visitors', 'crowdDensity', 'waitTime', 'incidents'];
      default:
        return ['visitors', 'vehicles', 'incidents', 'revenue'];
    }
  };

  const calculateTrend = (data: DayData[], metric: string) => {
    const historicalData = data.filter(d => d.type === 'historical' && d.actual);
    if (historicalData.length < 2) return { trend: 0, direction: 'stable' };
    
    const recent = historicalData.slice(-3);
    const earlier = historicalData.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, d) => sum + (d.actual as any)[metric], 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, d) => sum + (d.actual as any)[metric], 0) / earlier.length;
    
    const trend = ((recentAvg - earlierAvg) / earlierAvg) * 100;
    const direction = trend > 5 ? 'up' : trend < -5 ? 'down' : 'stable';
    
    return { trend: Math.abs(trend), direction };
  };

  const selectedDayData = selectedDate ? calendarData.find(d => d.date === selectedDate) : null;
  const availableMetrics = getPersonaMetrics();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Predictive Analytics Calendar</h2>
                <p className="text-indigo-100">Compare predictions vs actual data • {persona.replace('-', ' ').toUpperCase()} View</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPredictions(!showPredictions)}
                className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors"
              >
                {showPredictions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="text-sm">Predictions</span>
              </button>
              <button
                onClick={onClose}
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Calendar Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">20-Day Analytics Overview</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span>Low Accuracy (&lt;75%)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span>Medium Accuracy (75-90%)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span>High Accuracy (&gt;90%)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                    <span>Future Predictions</span>
                  </div>
                </div>
              </div>

              {/* Metric Selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {availableMetrics.map(metric => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric as any)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedMetric === metric
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {getMetricIcon(metric)}
                    <span>{getMetricLabel(metric)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-5 gap-3">
              {calendarData.map((day, index) => {
                const date = new Date(day.date);
                const isSelected = selectedDate === day.date;
                const metricValue = day.predicted[selectedMetric];
                const actualValue = day.actual?.[selectedMetric];
                
                return (
                  <div
                    key={day.date}
                    onClick={() => setSelectedDate(day.date)}
                    className={`${getDayColor(day)} border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-indigo-500 border-indigo-300' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        {day.type === 'historical' ? 'Past' : 'Future'}
                      </div>
                      
                      {/* Metric Values */}
                      <div className="space-y-1">
                        {showPredictions && (
                          <div className="text-xs">
                            <span className="text-blue-600 font-medium">P:</span>
                            <span className="ml-1">{formatMetricValue(selectedMetric, metricValue)}</span>
                          </div>
                        )}
                        {actualValue !== undefined && (
                          <div className="text-xs">
                            <span className="text-green-600 font-medium">A:</span>
                            <span className="ml-1">{formatMetricValue(selectedMetric, actualValue)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Accuracy Badge */}
                      {day.accuracy !== undefined && (
                        <div className={`text-xs px-2 py-1 rounded-full mt-2 ${getAccuracyColor(day.accuracy)}`}>
                          {day.accuracy}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed View Sidebar */}
          <div className="w-96 border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            {selectedDayData ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {new Date(selectedDayData.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedDayData.type === 'historical' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedDayData.type === 'historical' ? 'Historical Data' : 'Future Prediction'}
                    </span>
                    {selectedDayData.accuracy && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccuracyColor(selectedDayData.accuracy)}`}>
                        {selectedDayData.accuracy}% Accurate
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics Comparison */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Metrics Overview</h4>
                  {availableMetrics.map(metric => {
                    const predicted = selectedDayData.predicted[metric];
                    const actual = selectedDayData.actual?.[metric];
                    const variance = actual ? ((actual - predicted) / predicted * 100) : 0;
                    
                    return (
                      <div key={metric} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getMetricIcon(metric)}
                            <span className="font-medium text-gray-800">{getMetricLabel(metric)}</span>
                          </div>
                          {actual && (
                            <div className={`flex items-center space-x-1 text-xs ${
                              variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {variance > 0 ? <TrendingUp className="w-3 h-3" /> : 
                               variance < 0 ? <TrendingDown className="w-3 h-3" /> : 
                               <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                              <span>{Math.abs(variance).toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-600">Predicted:</span>
                            <span className="font-semibold">{formatMetricValue(metric, predicted)}</span>
                          </div>
                          {actual && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-green-600">Actual:</span>
                              <span className="font-semibold">{formatMetricValue(metric, actual)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Visual bar */}
                        <div className="mt-3">
                          <div className="flex space-x-1 h-2">
                            <div 
                              className="bg-blue-200 rounded-l"
                              style={{ width: actual ? '50%' : '100%' }}
                            ></div>
                            {actual && (
                              <div 
                                className={`rounded-r ${variance >= 0 ? 'bg-green-200' : 'bg-red-200'}`}
                                style={{ width: '50%' }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Trend Analysis */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Trend Analysis</h4>
                  {availableMetrics.map(metric => {
                    const trendData = calculateTrend(calendarData, metric);
                    return (
                      <div key={metric} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-2">
                          {getMetricIcon(metric)}
                          <span className="text-sm">{getMetricLabel(metric)}</span>
                        </div>
                        <div className={`flex items-center space-x-1 text-xs ${
                          trendData.direction === 'up' ? 'text-green-600' : 
                          trendData.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trendData.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                           trendData.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : 
                           <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                          <span>{trendData.trend.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Insights */}
                {selectedDayData.type === 'historical' && selectedDayData.accuracy && (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">AI Insights</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      {selectedDayData.accuracy >= 90 && (
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>Excellent prediction accuracy. Model performed well for this day.</span>
                        </div>
                      )}
                      {selectedDayData.accuracy < 75 && (
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <span>Lower accuracy detected. Consider external factors that may have influenced actual numbers.</span>
                        </div>
                      )}
                      <div className="flex items-start space-x-2">
                        <Activity className="w-4 h-4 text-blue-600 mt-0.5" />
                        <span>This data helps improve future predictions through machine learning.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-20">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a date to view detailed analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarAnalytics;