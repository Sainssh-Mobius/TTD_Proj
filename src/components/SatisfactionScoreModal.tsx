import React, { useState } from 'react';
import { X, Star, TrendingUp, Users, Clock, MapPin, MessageSquare, ThumbsUp, AlertTriangle, Target, BarChart3, PieChart, Activity } from 'lucide-react';

interface SatisfactionScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  satisfactionScore: number;
}

interface ObjectiveData {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  currentScore: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  description: string;
  metrics: {
    label: string;
    value: string;
    status: 'good' | 'warning' | 'critical';
  }[];
  insights: string[];
  actionItems: string[];
}

const SatisfactionScoreModal: React.FC<SatisfactionScoreModalProps> = ({ 
  isOpen, 
  onClose, 
  satisfactionScore 
}) => {
  const [activeObjective, setActiveObjective] = useState<string>('overall');

  const objectives: ObjectiveData[] = [
    {
      id: 'overall',
      name: 'Overall Experience',
      icon: Star,
      currentScore: satisfactionScore,
      target: 4.5,
      trend: 'up',
      trendValue: 0.3,
      description: 'Comprehensive satisfaction across all touchpoints of the pilgrimage experience',
      metrics: [
        { label: 'Total Responses', value: '12,847', status: 'good' },
        { label: 'Response Rate', value: '78%', status: 'good' },
        { label: 'Avg. Rating This Week', value: '4.2/5', status: 'good' },
        { label: 'Negative Feedback', value: '8%', status: 'good' }
      ],
      insights: [
        'Satisfaction has improved by 7% over the last month',
        'Peak satisfaction times: 6-8 AM and 6-8 PM',
        'Mobile app ratings contribute 45% to overall score',
        'Weather conditions impact satisfaction by ±0.3 points'
      ],
      actionItems: [
        'Continue current service quality initiatives',
        'Focus on mid-day experience improvements',
        'Enhance mobile app user experience',
        'Implement weather-adaptive services'
      ]
    },
    {
      id: 'darshan',
      name: 'Darshan Experience',
      icon: Users,
      currentScore: 4.3,
      target: 4.6,
      trend: 'up',
      trendValue: 0.2,
      description: 'Quality of the sacred darshan experience and queue management',
      metrics: [
        { label: 'Avg. Wait Time', value: '45 min', status: 'warning' },
        { label: 'Queue Satisfaction', value: '4.1/5', status: 'good' },
        { label: 'Darshan Duration', value: '12 sec', status: 'good' },
        { label: 'Crowd Management', value: '4.0/5', status: 'good' }
      ],
      insights: [
        'VIP darshan satisfaction is consistently high at 4.7/5',
        'General darshan wait times are the primary concern',
        'Early morning slots have highest satisfaction',
        'Digital queue system adoption at 67%'
      ],
      actionItems: [
        'Optimize queue flow algorithms',
        'Increase digital queue adoption',
        'Add more comfort amenities in waiting areas',
        'Implement dynamic slot allocation'
      ]
    },
    {
      id: 'facilities',
      name: 'Facilities & Amenities',
      icon: MapPin,
      currentScore: 4.0,
      target: 4.4,
      trend: 'stable',
      trendValue: 0.0,
      description: 'Quality of infrastructure, cleanliness, and support facilities',
      metrics: [
        { label: 'Cleanliness Rating', value: '4.5/5', status: 'good' },
        { label: 'Restroom Facilities', value: '3.8/5', status: 'warning' },
        { label: 'Food Quality', value: '4.2/5', status: 'good' },
        { label: 'Accessibility', value: '3.6/5', status: 'warning' }
      ],
      insights: [
        'Cleanliness standards are consistently high',
        'Restroom facilities need attention during peak hours',
        'Food court satisfaction varies by location',
        'Accessibility improvements showing positive impact'
      ],
      actionItems: [
        'Upgrade restroom facilities in high-traffic areas',
        'Standardize food quality across all outlets',
        'Enhance accessibility infrastructure',
        'Install more seating areas for elderly pilgrims'
      ]
    },
    {
      id: 'transport',
      name: 'Transportation',
      icon: Activity,
      currentScore: 3.9,
      target: 4.3,
      trend: 'up',
      trendValue: 0.4,
      description: 'Shuttle services, parking, and transportation coordination',
      metrics: [
        { label: 'Shuttle Punctuality', value: '87%', status: 'good' },
        { label: 'Parking Availability', value: '76%', status: 'warning' },
        { label: 'Transport Comfort', value: '3.7/5', status: 'warning' },
        { label: 'Route Efficiency', value: '4.1/5', status: 'good' }
      ],
      insights: [
        'New shuttle fleet improving comfort ratings',
        'Parking shortage during festival periods',
        'Route optimization reducing travel time by 15%',
        'Electric shuttles receiving positive feedback'
      ],
      actionItems: [
        'Expand parking capacity at key locations',
        'Accelerate electric shuttle deployment',
        'Implement dynamic pricing for parking',
        'Add real-time transport tracking'
      ]
    },
    {
      id: 'digital',
      name: 'Digital Services',
      icon: MessageSquare,
      currentScore: 4.1,
      target: 4.5,
      trend: 'up',
      trendValue: 0.5,
      description: 'Mobile app, online booking, and digital touchpoints',
      metrics: [
        { label: 'App Store Rating', value: '4.3/5', status: 'good' },
        { label: 'Booking Success Rate', value: '94%', status: 'good' },
        { label: 'Digital Adoption', value: '72%', status: 'good' },
        { label: 'Support Response', value: '< 2 hrs', status: 'good' }
      ],
      insights: [
        'Mobile app usage increased 40% this quarter',
        'Online booking reduces on-site wait times',
        'Multilingual support improving accessibility',
        'AI chatbot handling 60% of queries successfully'
      ],
      actionItems: [
        'Launch new app features for elderly users',
        'Improve offline functionality',
        'Expand language support to 8 languages',
        'Integrate AR features for navigation'
      ]
    },
    {
      id: 'staff',
      name: 'Staff Service',
      icon: ThumbsUp,
      currentScore: 4.4,
      target: 4.6,
      trend: 'stable',
      trendValue: 0.1,
      description: 'Quality of service provided by TTD staff and volunteers',
      metrics: [
        { label: 'Staff Helpfulness', value: '4.5/5', status: 'good' },
        { label: 'Language Support', value: '4.2/5', status: 'good' },
        { label: 'Response Time', value: '3 min', status: 'good' },
        { label: 'Problem Resolution', value: '89%', status: 'good' }
      ],
      insights: [
        'Volunteer program contributing significantly to satisfaction',
        'Multilingual staff deployment effective',
        'Training programs showing measurable impact',
        'Staff recognition program boosting morale'
      ],
      actionItems: [
        'Expand volunteer training programs',
        'Implement staff feedback system',
        'Add more multilingual staff during peak seasons',
        'Introduce service excellence awards'
      ]
    }
  ];

  const currentObjective = objectives.find(obj => obj.id === activeObjective) || objectives[0];

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
    return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number, target: number) => {
    const percentage = (score / target) * 100;
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Satisfaction Score Analysis</h2>
                <p className="text-amber-100 mt-1">Comprehensive breakdown of pilgrim satisfaction metrics</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{satisfactionScore.toFixed(1)}/5</div>
              <div className="text-amber-100">Overall Score</div>
              <button
                onClick={onClose}
                className="mt-2 hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Sidebar - Objectives Navigation */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Satisfaction Objectives</h3>
              <div className="space-y-2">
                {objectives.map((objective) => {
                  const IconComponent = objective.icon;
                  const isActive = activeObjective === objective.id;
                  
                  return (
                    <button
                      key={objective.id}
                      onClick={() => setActiveObjective(objective.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-white shadow-md border-2 border-amber-200'
                          : 'hover:bg-white hover:shadow-sm border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          isActive ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${
                            isActive ? 'text-amber-800' : 'text-gray-800'
                          }`}>
                            {objective.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${getScoreColor(objective.currentScore, objective.target)}`}>
                            {objective.currentScore.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">/ {objective.target}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(objective.trend, objective.trendValue)}
                          <span className={`text-xs font-medium ${
                            objective.trend === 'up' ? 'text-green-600' : 
                            objective.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {objective.trend === 'stable' ? '0.0' : 
                             objective.trend === 'up' ? `+${objective.trendValue}` : 
                             `-${objective.trendValue}`}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (objective.currentScore / objective.target) >= 0.95 ? 'bg-green-500' :
                            (objective.currentScore / objective.target) >= 0.85 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{width: `${Math.min((objective.currentScore / objective.target) * 100, 100)}%`}}
                        ></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl">
              {/* Objective Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <currentObjective.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{currentObjective.name}</h3>
                    <p className="text-gray-600">{currentObjective.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mt-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600">Current Score</div>
                    <div className={`text-3xl font-bold ${getScoreColor(currentObjective.currentScore, currentObjective.target)}`}>
                      {currentObjective.currentScore.toFixed(1)}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600">Target Score</div>
                    <div className="text-3xl font-bold text-gray-800">{currentObjective.target.toFixed(1)}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600">Trend</div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(currentObjective.trend, currentObjective.trendValue)}
                      <span className={`text-xl font-bold ${
                        currentObjective.trend === 'up' ? 'text-green-600' : 
                        currentObjective.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {currentObjective.trend === 'stable' ? '0.0' : 
                         currentObjective.trend === 'up' ? `+${currentObjective.trendValue}` : 
                         `-${currentObjective.trendValue}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentObjective.metrics.map((metric, index) => (
                    <div key={index} className={`p-4 rounded-xl border ${getStatusColor(metric.status)}`}>
                      <div className="text-sm font-medium opacity-80">{metric.label}</div>
                      <div className="text-xl font-bold mt-1">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights & Action Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Insights */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <h4 className="text-lg font-semibold text-blue-800">Key Insights</h4>
                  </div>
                  <ul className="space-y-3">
                    {currentObjective.insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-blue-800 text-sm leading-relaxed">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="w-5 h-5 text-green-600" />
                    <h4 className="text-lg font-semibold text-green-800">Action Items</h4>
                  </div>
                  <ul className="space-y-3">
                    {currentObjective.actionItems.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-green-800 text-sm leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Progress Chart Placeholder */}
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Satisfaction Trend (Last 30 Days)</h4>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Interactive satisfaction trend chart</p>
                    <p className="text-sm mt-1">Showing {currentObjective.name.toLowerCase()} metrics over time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatisfactionScoreModal;