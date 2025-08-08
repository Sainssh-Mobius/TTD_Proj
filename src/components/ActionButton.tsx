import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Users, 
  Car, 
  Shield, 
  Zap, 
  Phone, 
  Radio, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  Activity,
  Send
} from 'lucide-react';

interface ActionSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  department: string;
  aiConfidence: number;
  resources?: string[];
}

interface ActionButtonProps {
  situationType: 'medical' | 'crowd' | 'traffic' | 'security' | 'weather' | 'vip' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  description: string;
  onActionTaken?: (action: string, suggestions: ActionSuggestion[]) => void;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  situationType,
  severity,
  location,
  description,
  onActionTaken,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const getSituationIcon = () => {
    switch (situationType) {
      case 'medical': return <Zap className="w-5 h-5" />;
      case 'crowd': return <Users className="w-5 h-5" />;
      case 'traffic': return <Car className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'weather': return <AlertTriangle className="w-5 h-5" />;
      case 'vip': return <Shield className="w-5 h-5" />;
      case 'maintenance': return <Activity className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600';
      case 'high': return 'from-orange-500 to-orange-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const generateAISuggestions = (): ActionSuggestion[] => {
    const baseSuggestions: Record<string, ActionSuggestion[]> = {
      medical: [
        {
          id: 'dispatch-ambulance',
          title: 'Dispatch Emergency Medical Team',
          description: 'Deploy nearest ambulance with paramedics to the location',
          priority: 'critical',
          estimatedTime: '3-5 minutes',
          department: 'Medical Emergency',
          aiConfidence: 95,
          resources: ['Ambulance Unit 1', 'Paramedic Team A', 'Emergency Kit']
        },
        {
          id: 'clear-path',
          title: 'Clear Emergency Access Path',
          description: 'Coordinate with traffic control to clear fastest route to hospital',
          priority: 'high',
          estimatedTime: '2-3 minutes',
          department: 'Traffic Control',
          aiConfidence: 88,
          resources: ['Traffic Controllers', 'Route Optimization AI']
        },
        {
          id: 'notify-hospital',
          title: 'Alert Receiving Hospital',
          description: 'Pre-notify SVIMS Hospital emergency department',
          priority: 'high',
          estimatedTime: '1 minute',
          department: 'Medical Coordination',
          aiConfidence: 92,
          resources: ['Hospital Communication Link']
        }
      ],
      crowd: [
        {
          id: 'deploy-crowd-control',
          title: 'Deploy Additional Security Personnel',
          description: 'Send 8-10 security officers to manage crowd flow',
          priority: 'high',
          estimatedTime: '5-7 minutes',
          department: 'Security',
          aiConfidence: 90,
          resources: ['Security Team B', 'Crowd Barriers', 'Megaphones']
        },
        {
          id: 'activate-alternate-routes',
          title: 'Activate Alternate Darshan Routes',
          description: 'Open secondary pathways to distribute crowd density',
          priority: 'medium',
          estimatedTime: '3-4 minutes',
          department: 'Operations',
          aiConfidence: 85,
          resources: ['Route Controllers', 'Digital Signage']
        },
        {
          id: 'increase-shuttle-frequency',
          title: 'Increase Shuttle Service Frequency',
          description: 'Deploy additional buses to reduce waiting crowds',
          priority: 'medium',
          estimatedTime: '10-15 minutes',
          department: 'Transport',
          aiConfidence: 78,
          resources: ['Bus Fleet', 'Additional Drivers']
        }
      ],
      traffic: [
        {
          id: 'traffic-rerouting',
          title: 'Implement Smart Traffic Rerouting',
          description: 'Activate AI-powered traffic management system',
          priority: 'high',
          estimatedTime: '2-3 minutes',
          department: 'Traffic Control',
          aiConfidence: 93,
          resources: ['Traffic AI System', 'Digital Signs', 'Traffic Controllers']
        },
        {
          id: 'deploy-traffic-personnel',
          title: 'Deploy Traffic Management Team',
          description: 'Send traffic controllers to key intersections',
          priority: 'medium',
          estimatedTime: '8-10 minutes',
          department: 'Traffic Control',
          aiConfidence: 87,
          resources: ['Traffic Personnel', 'Communication Equipment']
        },
        {
          id: 'parking-redirection',
          title: 'Redirect to Alternative Parking',
          description: 'Guide vehicles to less congested parking areas',
          priority: 'medium',
          estimatedTime: '5 minutes',
          department: 'Parking Management',
          aiConfidence: 82,
          resources: ['Parking Attendants', 'Digital Displays']
        }
      ],
      security: [
        {
          id: 'security-alert',
          title: 'Activate Security Alert Protocol',
          description: 'Notify all security personnel and increase vigilance',
          priority: 'critical',
          estimatedTime: '1-2 minutes',
          department: 'Security',
          aiConfidence: 96,
          resources: ['Security Network', 'CCTV Monitoring', 'Communication System']
        },
        {
          id: 'lockdown-procedure',
          title: 'Initiate Controlled Area Lockdown',
          description: 'Secure the affected area and control access',
          priority: 'high',
          estimatedTime: '3-5 minutes',
          department: 'Security',
          aiConfidence: 89,
          resources: ['Security Barriers', 'Access Control Systems']
        },
        {
          id: 'coordinate-authorities',
          title: 'Coordinate with Local Authorities',
          description: 'Alert police and relevant government agencies',
          priority: 'high',
          estimatedTime: '2-3 minutes',
          department: 'Administration',
          aiConfidence: 91,
          resources: ['Government Liaison', 'Police Communication']
        }
      ],
      weather: [
        {
          id: 'weather-advisory',
          title: 'Issue Weather Advisory',
          description: 'Broadcast weather warnings to all visitors',
          priority: 'medium',
          estimatedTime: '2 minutes',
          department: 'Communications',
          aiConfidence: 88,
          resources: ['PA System', 'Digital Displays', 'Mobile Alerts']
        },
        {
          id: 'shelter-preparation',
          title: 'Prepare Emergency Shelters',
          description: 'Open covered areas and prepare for visitor safety',
          priority: 'high',
          estimatedTime: '5-8 minutes',
          department: 'Operations',
          aiConfidence: 85,
          resources: ['Shelter Areas', 'Emergency Supplies']
        },
        {
          id: 'transport-adjustment',
          title: 'Adjust Transport Services',
          description: 'Modify shuttle schedules based on weather conditions',
          priority: 'medium',
          estimatedTime: '10 minutes',
          department: 'Transport',
          aiConfidence: 79,
          resources: ['Bus Fleet', 'Weather Monitoring']
        }
      ],
      vip: [
        {
          id: 'vip-security-protocol',
          title: 'Activate VIP Security Protocol',
          description: 'Deploy enhanced security measures for VIP movement',
          priority: 'critical',
          estimatedTime: '5-10 minutes',
          department: 'VIP Security',
          aiConfidence: 94,
          resources: ['Elite Security Team', 'Escort Vehicles', 'Communication Network']
        },
        {
          id: 'route-clearance',
          title: 'Clear and Secure VIP Route',
          description: 'Ensure safe passage with route security sweep',
          priority: 'high',
          estimatedTime: '15-20 minutes',
          department: 'Security & Traffic',
          aiConfidence: 91,
          resources: ['Route Security', 'Traffic Control', 'Bomb Squad']
        },
        {
          id: 'crowd-management-vip',
          title: 'Implement VIP Crowd Management',
          description: 'Control crowd access and maintain safe distances',
          priority: 'high',
          estimatedTime: '10 minutes',
          department: 'Crowd Control',
          aiConfidence: 87,
          resources: ['Crowd Barriers', 'Security Personnel', 'Public Address']
        }
      ],
      maintenance: [
        {
          id: 'maintenance-team-dispatch',
          title: 'Dispatch Maintenance Team',
          description: 'Send technical team to address the maintenance issue',
          priority: 'medium',
          estimatedTime: '15-20 minutes',
          department: 'Maintenance',
          aiConfidence: 86,
          resources: ['Technical Team', 'Equipment', 'Spare Parts']
        },
        {
          id: 'safety-isolation',
          title: 'Isolate Affected Area',
          description: 'Secure area to prevent visitor access during repairs',
          priority: 'high',
          estimatedTime: '5 minutes',
          department: 'Safety',
          aiConfidence: 92,
          resources: ['Safety Barriers', 'Warning Signs', 'Security Personnel']
        },
        {
          id: 'backup-systems',
          title: 'Activate Backup Systems',
          description: 'Switch to redundant systems to maintain operations',
          priority: 'medium',
          estimatedTime: '3-5 minutes',
          department: 'Technical Operations',
          aiConfidence: 84,
          resources: ['Backup Systems', 'Technical Staff']
        }
      ]
    };

    return baseSuggestions[situationType] || [];
  };

  const handleActionInitiate = async () => {
    setIsProcessing(true);
    const suggestions = generateAISuggestions();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsProcessing(false);
    setIsExpanded(true);
    
    if (onActionTaken) {
      onActionTaken('initiated', suggestions);
    }
  };

  const handleExecuteActions = async () => {
    setIsProcessing(true);
    const suggestions = generateAISuggestions();
    const selectedActions = suggestions.filter(s => selectedSuggestions.includes(s.id));
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsExpanded(false);
    setSelectedSuggestions([]);
    
    if (onActionTaken) {
      onActionTaken('executed', selectedActions);
    }
  };

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const suggestions = generateAISuggestions();
  const averageConfidence = suggestions.length > 0 
    ? Math.round(suggestions.reduce((sum, s) => sum + s.aiConfidence, 0) / suggestions.length)
    : 0;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Main Action Button */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`bg-gradient-to-r ${getSeverityColor()} p-3 rounded-xl text-white`}>
              {getSituationIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {situationType} Response Required
              </h3>
              <p className="text-sm text-gray-600">
                {location && `Location: ${location} • `}
                Severity: <span className="font-medium capitalize">{severity}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-xs text-gray-500">AI Confidence</div>
              <div className="text-lg font-bold text-green-600">{averageConfidence}%</div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-6">{description}</p>

        {!isExpanded ? (
          <button
            onClick={handleActionInitiate}
            disabled={isProcessing}
            className={`w-full bg-gradient-to-r ${getSeverityColor()} text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing Situation...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Get AI Action Plan</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            {/* AI Suggestions Header */}
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h4 className="font-semibold text-gray-800">AI-Recommended Actions</h4>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {suggestions.length} suggestions
              </span>
            </div>

            {/* Suggestions List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedSuggestions.includes(suggestion.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleSuggestion(suggestion.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedSuggestions.includes(suggestion.id)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedSuggestions.includes(suggestion.id) && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <h5 className="font-medium text-gray-800">{suggestion.title}</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        suggestion.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        suggestion.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {suggestion.priority}
                      </span>
                      <span className="text-xs text-gray-500">{suggestion.aiConfidence}% confidence</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Target className="w-3 h-3" />
                        <span>{suggestion.department}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{suggestion.estimatedTime}</span>
                      </span>
                    </div>
                  </div>

                  {suggestion.resources && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {suggestion.resources.map((resource, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {resource}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsExpanded(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteActions}
                disabled={selectedSuggestions.length === 0 || isProcessing}
                className={`flex-2 bg-gradient-to-r ${getSeverityColor()} text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Executing Actions...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Execute {selectedSuggestions.length} Action{selectedSuggestions.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Brain className="w-4 h-4" />
            <span>AI-powered response optimization</span>
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time analysis</span>
            </span>
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>Live coordination</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButton;