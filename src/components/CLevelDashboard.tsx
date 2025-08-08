import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  Clock, 
  Shield, 
  Car, 
  Zap,
  Brain,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  MessageSquare,
  Phone,
  Radio,
  Megaphone,
  UserCheck,
  Settings,
  Eye,
  BarChart3,
  TrendingDown,
  Calendar,
  Bell,
  Lightbulb,
  ArrowRight,
  PlayCircle,
  PauseCircle,
  RefreshCw
} from 'lucide-react';

interface ActionItem {
  id: string;
  type: 'emergency' | 'warning' | 'optimization' | 'maintenance';
  title: string;
  description: string;
  department: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  aiSuggestion: string;
  estimatedImpact: string;
  estimatedTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'dismissed';
  timestamp: Date;
}

interface AIRecommendation {
  id: string;
  category: 'crowd-management' | 'traffic-optimization' | 'resource-allocation' | 'security-enhancement' | 'operational-efficiency';
  title: string;
  description: string;
  confidence: number;
  expectedOutcome: string;
  requiredDepartments: string[];
  estimatedCost: string;
  implementationTime: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const CLevelDashboard: React.FC = () => {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isExecutingAction, setIsExecutingAction] = useState(false);

  // Sample data - in real implementation, this would come from your backend
  useEffect(() => {
    const sampleActions: ActionItem[] = [
      {
        id: '1',
        type: 'emergency',
        title: 'High Crowd Density Alert',
        description: 'Crowd density at Main Temple has reached 92% capacity',
        department: ['Ground Staff', 'Security', 'Traffic Management'],
        priority: 'critical',
        aiSuggestion: 'Deploy additional crowd control barriers and redirect incoming pilgrims to alternate darshan routes. Activate emergency evacuation protocols if density exceeds 95%.',
        estimatedImpact: 'Prevent potential stampede, ensure pilgrim safety',
        estimatedTime: '15-20 minutes',
        status: 'pending',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '2',
        type: 'warning',
        title: 'Parking Lot A Near Capacity',
        description: 'Parking Lot A is 89% full with increasing vehicle arrivals',
        department: ['Traffic Management', 'Ground Staff'],
        priority: 'high',
        aiSuggestion: 'Activate dynamic signage to redirect vehicles to Parking Lot B. Deploy traffic coordinators at key junctions. Consider opening overflow parking area.',
        estimatedImpact: 'Prevent traffic congestion, improve vehicle flow',
        estimatedTime: '10-15 minutes',
        status: 'pending',
        timestamp: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '3',
        type: 'optimization',
        title: 'Shuttle Service Optimization',
        description: 'AI detected suboptimal shuttle scheduling causing 12-minute average delays',
        department: ['Transport', 'Operations'],
        priority: 'medium',
        aiSuggestion: 'Adjust shuttle frequency to every 8 minutes during peak hours. Deploy additional shuttle on Route 2. Implement dynamic scheduling based on real-time demand.',
        estimatedImpact: 'Reduce wait times by 40%, improve pilgrim satisfaction',
        estimatedTime: '30-45 minutes',
        status: 'pending',
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: '4',
        type: 'maintenance',
        title: 'CCTV Camera Malfunction',
        description: 'Camera #47 in Zone C is offline, creating blind spot',
        department: ['Technical', 'Security'],
        priority: 'medium',
        aiSuggestion: 'Deploy mobile security unit to cover blind spot temporarily. Schedule immediate technician dispatch. Consider installing backup camera system.',
        estimatedImpact: 'Maintain security coverage, prevent incidents',
        estimatedTime: '45-60 minutes',
        status: 'in-progress',
        timestamp: new Date(Date.now() - 25 * 60 * 1000)
      }
    ];

    const sampleRecommendations: AIRecommendation[] = [
      {
        id: '1',
        category: 'crowd-management',
        title: 'Implement Predictive Crowd Flow System',
        description: 'Deploy AI-powered crowd prediction to anticipate high-density areas 30 minutes in advance',
        confidence: 87,
        expectedOutcome: '35% reduction in crowd-related incidents',
        requiredDepartments: ['IT', 'Security', 'Ground Staff'],
        estimatedCost: '₹2.5L - ₹4L',
        implementationTime: '2-3 weeks',
        riskLevel: 'low'
      },
      {
        id: '2',
        category: 'traffic-optimization',
        title: 'Smart Traffic Light Integration',
        description: 'Connect temple traffic lights with city traffic management system for seamless flow',
        confidence: 92,
        expectedOutcome: '25% reduction in traffic congestion',
        requiredDepartments: ['Traffic Management', 'IT', 'External Coordination'],
        estimatedCost: '₹8L - ₹12L',
        implementationTime: '4-6 weeks',
        riskLevel: 'medium'
      },
      {
        id: '3',
        category: 'operational-efficiency',
        title: 'Automated Resource Allocation',
        description: 'AI-driven staff deployment based on real-time crowd patterns and historical data',
        confidence: 78,
        expectedOutcome: '20% improvement in response times',
        requiredDepartments: ['HR', 'Operations', 'IT'],
        estimatedCost: '₹1.5L - ₹3L',
        implementationTime: '3-4 weeks',
        riskLevel: 'low'
      }
    ];

    setActionItems(sampleActions);
    setAIRecommendations(sampleRecommendations);
  }, []);

  const executeAction = async (action: ActionItem) => {
    setIsExecutingAction(true);
    setSelectedAction(action);
    
    // Simulate action execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update action status
    setActionItems(prev => 
      prev.map(item => 
        item.id === action.id 
          ? { ...item, status: 'in-progress' }
          : item
      )
    );
    
    setIsExecutingAction(false);
    setShowActionModal(false);
    
    // Show success notification
    alert(`Action "${action.title}" has been initiated successfully!\n\nDepartments notified: ${action.department.join(', ')}\nEstimated completion: ${action.estimatedTime}`);
  };

  const dismissAction = (actionId: string) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === actionId 
          ? { ...item, status: 'dismissed' }
          : item
      )
    );
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'optimization': return <Target className="w-5 h-5" />;
      case 'maintenance': return <Settings className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getActionColor = (type: string, priority: string) => {
    if (priority === 'critical') return 'bg-red-500 text-white';
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'optimization': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'maintenance': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'dismissed': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const pendingActions = actionItems.filter(action => action.status === 'pending');
  const activeActions = actionItems.filter(action => action.status === 'in-progress');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Pilgrims Today</p>
              <p className="text-3xl font-bold text-blue-600">47,832</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+12.3% from yesterday</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue Generated</p>
              <p className="text-3xl font-bold text-green-600">₹18.4L</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+8.7% from last week</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Efficiency</p>
              <p className="text-3xl font-bold text-purple-600">94.2%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+2.1% optimization</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Incidents</p>
              <p className="text-3xl font-bold text-red-600">{pendingActions.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-600">{activeActions.length} in progress</span>
          </div>
        </div>
      </div>

      {/* AI-Powered Action Center */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI-Powered Action Center</h3>
              <p className="text-gray-600">Real-time situation analysis with intelligent recommendations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 px-3 py-1 rounded-full">
              <span className="text-green-800 text-sm font-medium">AI Active</span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Immediate Actions Required ({pendingActions.length})</span>
          </h4>
          
          {pendingActions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No pending actions. All systems operating normally.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingActions.map(action => (
                <div key={action.id} className={`border-2 rounded-xl p-4 ${getActionColor(action.type, action.priority)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(action.type)}
                      <h5 className="font-semibold">{action.title}</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(action.priority)}`}>
                        {action.priority.toUpperCase()}
                      </span>
                      <span className="text-xs opacity-75">{formatTimeAgo(action.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3 opacity-90">{action.description}</p>
                  
                  <div className="bg-white/20 rounded-lg p-3 mb-3">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-600" />
                      <div>
                        <p className="text-xs font-medium mb-1">AI Recommendation:</p>
                        <p className="text-xs opacity-90">{action.aiSuggestion}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="font-medium">Impact:</span>
                      <p className="opacity-90">{action.estimatedImpact}</p>
                    </div>
                    <div>
                      <span className="font-medium">Time:</span>
                      <p className="opacity-90">{action.estimatedTime}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-xs font-medium">Departments:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {action.department.map(dept => (
                        <span key={dept} className="bg-white/30 px-2 py-1 rounded text-xs">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAction(action);
                        setShowActionModal(true);
                      }}
                      className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Execute Action</span>
                    </button>
                    <button
                      onClick={() => dismissAction(action.id)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Actions */}
        {activeActions.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
              <span>Actions In Progress ({activeActions.length})</span>
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeActions.map(action => (
                <div key={action.id} className="border border-blue-300 bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-blue-800">{action.title}</h5>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(action.status)}
                      <span className="text-xs text-blue-600">In Progress</span>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">{action.description}</p>
                  <div className="text-xs text-blue-600">
                    Departments: {action.department.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl text-white">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Strategic AI Recommendations</h3>
            <p className="text-gray-600">Long-term improvements based on data analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {aiRecommendations.map(recommendation => (
            <div key={recommendation.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {recommendation.category.replace('-', ' ').toUpperCase()}
                </span>
                <div className="flex items-center space-x-1">
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">{recommendation.confidence}%</span>
                </div>
              </div>
              
              <h5 className="font-semibold text-gray-800 mb-2">{recommendation.title}</h5>
              <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Outcome:</span>
                  <span className="font-medium text-green-600">{recommendation.expectedOutcome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Implementation:</span>
                  <span className="font-medium">{recommendation.implementationTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Investment:</span>
                  <span className="font-medium">{recommendation.estimatedCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level:</span>
                  <span className={`font-medium ${
                    recommendation.riskLevel === 'low' ? 'text-green-600' :
                    recommendation.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {recommendation.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Required Departments:</p>
                <div className="flex flex-wrap gap-1">
                  {recommendation.requiredDepartments.map(dept => (
                    <span key={dept} className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
              
              <button className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <ArrowRight className="w-4 h-4" />
                <span>Review Proposal</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Execution Modal */}
      {showActionModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {getActionIcon(selectedAction.type)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Execute Action</h3>
                    <p className="text-blue-100">{selectedAction.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowActionModal(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Situation Analysis</h4>
                  <p className="text-gray-600">{selectedAction.description}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-800 mb-1">AI Recommendation</h5>
                      <p className="text-blue-700 text-sm">{selectedAction.aiSuggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Expected Impact</h5>
                    <p className="text-gray-600 text-sm">{selectedAction.estimatedImpact}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Estimated Time</h5>
                    <p className="text-gray-600 text-sm">{selectedAction.estimatedTime}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Departments to be Notified</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedAction.department.map(dept => (
                      <div key={dept} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                        <UserCheck className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-yellow-800 mb-1">Action Confirmation</h5>
                      <p className="text-yellow-700 text-sm">
                        This action will immediately notify all relevant departments and initiate the recommended response protocol. 
                        Are you sure you want to proceed?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeAction(selectedAction)}
                  disabled={isExecutingAction}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
                >
                  {isExecutingAction ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Execute Action</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crowd Density Heatmap */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-red-100 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Live Crowd Density</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { zone: 'Main Temple', density: 92, status: 'critical' },
              { zone: 'Queue Area', density: 78, status: 'high' },
              { zone: 'Parking Lot A', density: 89, status: 'high' },
              { zone: 'Food Court', density: 45, status: 'normal' }
            ].map(area => (
              <div key={area.zone} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{area.zone}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    area.status === 'critical' ? 'bg-red-500 text-white' :
                    area.status === 'high' ? 'bg-orange-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {area.density}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      area.status === 'critical' ? 'bg-red-500' :
                      area.status === 'high' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{width: `${area.density}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-green-100 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">System Performance</h3>
          </div>

          <div className="space-y-4">
            {[
              { system: 'CCTV Network', status: 98.5, color: 'green' },
              { system: 'Traffic Management', status: 94.2, color: 'green' },
              { system: 'Communication', status: 89.7, color: 'yellow' },
              { system: 'Emergency Systems', status: 100, color: 'green' }
            ].map(system => (
              <div key={system.system} className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{system.system}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        system.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                      style={{width: `${system.status}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 w-12">
                    {system.status}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CLevelDashboard;