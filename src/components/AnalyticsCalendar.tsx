import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Eye, DollarSign, AlertTriangle, Users, Car, Clock, Activity, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface CalendarData {
  date: Date;
  isPast: boolean;
  metrics: {
    visitors?: { predicted: number; actual?: number; accuracy?: number };
    revenue?: { predicted: number; actual?: number; accuracy?: number };
    incidents?: { predicted: number; actual?: number; accuracy?: number };
    crowdDensity?: { predicted: number; actual?: number; accuracy?: number };
    vehicles?: { predicted: number; actual?: number; accuracy?: number };
    waitTime?: { predicted: number; actual?: number; accuracy?: number };
  };
}

interface AnalyticsCalendarProps {
  persona: 'c-level' | 'operational' | 'ground-staff';
}

const AnalyticsCalendar: React.FC<AnalyticsCalendarProps> = ({ persona }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('visitors');
  const [showPredictions, setShowPredictions] = useState(true);

  // Generate 20 days of data (10 past, 10 future)
  const calendarData = useMemo(() => {
    const data: CalendarData[] = [];
    const today = new Date();
    
    // Generate past 10 days
    for (let i = 10; i >= 1; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const baseVisitors = 15000 + Math.random() * 5000;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const weekendMultiplier = isWeekend ? 1.5 : 1;
      
      const visitors = Math.floor(baseVisitors * weekendMultiplier);
      const visitorsActual = Math.floor(visitors * (0.85 + Math.random() * 0.3));
      const visitorsAccuracy = Math.min(100, Math.max(60, 100 - Math.abs((visitors - visitorsActual) / visitors * 100)));
      
      data.push({
        date,
        isPast: true,
        metrics: {
          visitors: { predicted: visitors, actual: visitorsActual, accuracy: visitorsAccuracy },
          revenue: { 
            predicted: Math.floor(visitors * 25), 
            actual: Math.floor(visitorsActual * 25), 
            accuracy: visitorsAccuracy 
          },
          incidents: { 
            predicted: Math.floor(visitors / 5000), 
            actual: Math.floor(Math.random() * 4), 
            accuracy: Math.random() * 40 + 60 
          },
          crowdDensity: { 
            predicted: Math.floor(40 + Math.random() * 40), 
            actual: Math.floor(35 + Math.random() * 45), 
            accuracy: Math.random() * 30 + 70 
          },
          vehicles: { 
            predicted: Math.floor(visitors * 0.3), 
            actual: Math.floor(visitorsActual * 0.3), 
            accuracy: visitorsAccuracy 
          },
          waitTime: { 
            predicted: Math.floor(20 + Math.random() * 40), 
            actual: Math.floor(15 + Math.random() * 50), 
            accuracy: Math.random() * 35 + 65 
          }
        }
      });
    }
    
    // Generate future 10 days
    for (let i = 1; i <= 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const baseVisitors = 15000 + Math.random() * 5000;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const weekendMultiplier = isWeekend ? 1.5 : 1;
      const trendMultiplier = 1 + (i * 0.02); // Slight upward trend
      
      const visitors = Math.floor(baseVisitors * weekendMultiplier * trendMultiplier);
      
      data.push({
        date,
        isPast: false,
        metrics: {
          visitors: { predicted: visitors },
          revenue: { predicted: Math.floor(visitors * 25) },
          incidents: { predicted: Math.floor(visitors / 5000) },
          crowdDensity: { predicted: Math.floor(40 + Math.random() * 40) },
          vehicles: { predicted: Math.floor(visitors * 0.3) },
          waitTime: { predicted: Math.floor(20 + Math.random() * 40) }
        }
      });
    }
    
    return data;
  }, []);

  const getPersonaMetrics = () => {
    switch (persona) {
      case 'c-level':
        return [
          { key: 'visitors', name: 'Visitors', icon: Users, unit: '', color: 'blue' },
          { key: 'revenue', name: 'Revenue', icon: DollarSign, unit: '₹', color: 'green' },
          { key: 'incidents', name: 'Incidents', icon: AlertTriangle, unit: '', color: 'red' },
          { key: 'crowdDensity', name: 'Crowd Density', icon: Activity, unit: '%', color: 'purple' }
        ];
      case 'operational':
        return [
          { key: 'visitors', name: 'Visitors', icon: Users, unit: '', color: 'blue' },
          { key: 'vehicles', name: 'Vehicles', icon: Car, unit: '', color: 'indigo' },
          { key: 'incidents', name: 'Incidents', icon: AlertTriangle, unit: '', color: 'red' },
          { key: 'waitTime', name: 'Wait Time', icon: Clock, unit: 'min', color: 'yellow' }
        ];
      case 'ground-staff':
        return [
          { key: 'visitors', name: 'Visitors', icon: Users, unit: '', color: 'blue' },
          { key: 'crowdDensity', name: 'Crowd Density', icon: Activity, unit: '%', color: 'purple' },
          { key: 'waitTime', name: 'Wait Time', icon: Clock, unit: 'min', color: 'yellow' },
          { key: 'incidents', name: 'Incidents', icon: AlertTriangle, unit: '', color: 'red' }
        ];
      default:
        return [];
    }
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (!accuracy) return 'bg-blue-500'; // Future predictions
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAccuracyTextColor = (accuracy?: number) => {
    if (!accuracy) return 'text-blue-600'; // Future predictions
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '₹') {
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return `${value}${unit}`;
  };

  const getVariance = (predicted: number, actual: number) => {
    const variance = ((actual - predicted) / predicted) * 100;
    return variance;
  };

  const personaMetrics = getPersonaMetrics();
  const selectedMetricData = personaMetrics.find(m => m.key === selectedMetric);

  const getPersonaGradient = () => {
    switch (persona) {
      case 'c-level':
        return 'from-indigo-500 to-purple-600';
      case 'operational':
        return 'from-blue-500 to-cyan-600';
      case 'ground-staff':
        return 'from-green-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getPersonaGradient()} text-white p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">20-Day Analytics Overview</h3>
              <p className="text-white/80">AI-Powered Predictions & Historical Analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPredictions(!showPredictions)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPredictions 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {showPredictions ? 'Hide' : 'Show'} Predictions
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Metric Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-800">Select Metric</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {personaMetrics.map(metric => {
              const IconComponent = metric.icon;
              return (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedMetric === metric.key
                      ? `border-${metric.color}-500 bg-${metric.color}-50 text-${metric.color}-700`
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">
                {selectedMetricData?.name} - Past 10 Days vs Future 10 Days
              </h4>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>90%+ Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>75-90% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>&lt;75% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Future Prediction</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {calendarData.map((day, index) => {
                const metricData = day.metrics[selectedMetric as keyof typeof day.metrics];
                const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day.date)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      {/* Date */}
                      <div className="text-xs font-medium text-gray-600 mb-2">
                        {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      
                      {/* Day of week */}
                      <div className="text-xs text-gray-500 mb-3">
                        {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>

                      {/* Metric Value */}
                      {metricData && (
                        <div className="space-y-2">
                          {/* Predicted Value */}
                          {showPredictions && (
                            <div className="text-sm">
                              <div className="text-xs text-gray-500">Predicted</div>
                              <div className="font-semibold text-gray-800">
                                {formatValue(metricData.predicted, selectedMetricData?.unit || '')}
                              </div>
                            </div>
                          )}

                          {/* Actual Value (for past days) */}
                          {day.isPast && metricData.actual !== undefined && (
                            <div className="text-sm">
                              <div className="text-xs text-gray-500">Actual</div>
                              <div className="font-semibold text-gray-800">
                                {formatValue(metricData.actual, selectedMetricData?.unit || '')}
                              </div>
                            </div>
                          )}

                          {/* Accuracy Indicator */}
                          <div className={`w-full h-2 rounded-full ${getAccuracyColor(metricData.accuracy)}`}></div>
                          
                          {metricData.accuracy && (
                            <div className={`text-xs font-medium ${getAccuracyTextColor(metricData.accuracy)}`}>
                              {metricData.accuracy.toFixed(0)}%
                            </div>
                          )}
                          
                          {!day.isPast && (
                            <div className="text-xs font-medium text-blue-600">
                              Prediction
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Sidebar */}
          <div className="space-y-6">
            {selectedDate ? (
              <>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  
                  {(() => {
                    const selectedDayData = calendarData.find(d => 
                      d.date.toDateString() === selectedDate.toDateString()
                    );
                    
                    if (!selectedDayData) return null;
                    
                    return (
                      <div className="space-y-4">
                        {personaMetrics.map(metric => {
                          const metricData = selectedDayData.metrics[metric.key as keyof typeof selectedDayData.metrics];
                          if (!metricData) return null;
                          
                          const IconComponent = metric.icon;
                          
                          return (
                            <div key={metric.key} className="border-b border-gray-200 pb-3 last:border-b-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <IconComponent className="w-4 h-4 text-gray-600" />
                                <span className="font-medium text-gray-800">{metric.name}</span>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Predicted:</span>
                                  <span className="font-semibold">
                                    {formatValue(metricData.predicted, metric.unit)}
                                  </span>
                                </div>
                                
                                {selectedDayData.isPast && metricData.actual !== undefined && (
                                  <>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Actual:</span>
                                      <span className="font-semibold">
                                        {formatValue(metricData.actual, metric.unit)}
                                      </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Variance:</span>
                                      <span className={`font-semibold ${
                                        getVariance(metricData.predicted, metricData.actual) >= 0 
                                          ? 'text-green-600' 
                                          : 'text-red-600'
                                      }`}>
                                        {getVariance(metricData.predicted, metricData.actual) >= 0 ? '+' : ''}
                                        {getVariance(metricData.predicted, metricData.actual).toFixed(1)}%
                                      </span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Accuracy:</span>
                                      <span className={`font-semibold ${getAccuracyTextColor(metricData.accuracy)}`}>
                                        {metricData.accuracy?.toFixed(1)}%
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* AI Insights */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-semibold text-blue-800 mb-2">AI Insights</h5>
                  <div className="text-sm text-blue-700 space-y-2">
                    {(() => {
                      const selectedDayData = calendarData.find(d => 
                        d.date.toDateString() === selectedDate.toDateString()
                      );
                      
                      if (!selectedDayData) return null;
                      
                      const insights = [];
                      
                      if (selectedDayData.isPast) {
                        const visitorsData = selectedDayData.metrics.visitors;
                        if (visitorsData?.accuracy && visitorsData.accuracy > 90) {
                          insights.push("🎯 High prediction accuracy indicates stable patterns");
                        } else if (visitorsData?.accuracy && visitorsData.accuracy < 75) {
                          insights.push("⚠️ Lower accuracy suggests external factors affected attendance");
                        }
                        
                        if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
                          insights.push("📈 Weekend patterns show increased visitor volume");
                        }
                      } else {
                        insights.push("🔮 Future prediction based on historical trends and seasonality");
                        
                        if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
                          insights.push("📊 Weekend prediction includes 50% visitor increase");
                        }
                        
                        insights.push("🌟 Confidence level: High based on similar historical patterns");
                      }
                      
                      return insights.map((insight, index) => (
                        <div key={index}>{insight}</div>
                      ));
                    })()}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">Click on any date to see detailed analytics</p>
              </div>
            )}

            {/* Overall Statistics */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">Overall Performance</h5>
              <div className="space-y-3 text-sm">
                {(() => {
                  const pastDays = calendarData.filter(d => d.isPast);
                  const avgAccuracy = pastDays.reduce((sum, day) => {
                    const metricData = day.metrics[selectedMetric as keyof typeof day.metrics];
                    return sum + (metricData?.accuracy || 0);
                  }, 0) / pastDays.length;
                  
                  const highAccuracyDays = pastDays.filter(day => {
                    const metricData = day.metrics[selectedMetric as keyof typeof day.metrics];
                    return (metricData?.accuracy || 0) >= 90;
                  }).length;
                  
                  return (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Accuracy:</span>
                        <span className={`font-semibold ${getAccuracyTextColor(avgAccuracy)}`}>
                          {avgAccuracy.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">High Accuracy Days:</span>
                        <span className="font-semibold text-green-600">
                          {highAccuracyDays}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prediction Confidence:</span>
                        <span className="font-semibold text-blue-600">
                          {avgAccuracy >= 85 ? 'High' : avgAccuracy >= 75 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCalendar;