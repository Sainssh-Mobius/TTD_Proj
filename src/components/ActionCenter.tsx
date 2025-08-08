import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, Users, Car, Shield, Zap, Activity, Brain, Filter, Search, RefreshCw } from 'lucide-react';
import ActionButton from './ActionButton';

interface ActiveSituation {
  id: string;
  type: 'medical' | 'crowd' | 'traffic' | 'security' | 'weather' | 'vip' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'pending' | 'in-progress' | 'resolved';
  assignedDepartment?: string;
  estimatedResolution?: string;
}

const ActionCenter: React.FC = () => {
  const [situations, setSituations] = useState<ActiveSituation[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample situations data
  const sampleSituations: ActiveSituation[] = [
    {
      id: '1',
      type: 'medical',
      severity: 'critical',
      title: 'Medical Emergency',
      description: 'Elderly visitor collapsed near Main Temple entrance. Requires immediate medical attention.',
      location: 'Main Temple Entrance, Zone A',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'pending',
      estimatedResolution: '10-15 minutes'
    },
    {
      id: '2',
      type: 'crowd',
      severity: 'high',
      title: 'High Crowd Density Alert',
      description: 'Crowd density at darshan queue exceeds safe limits. Risk of stampede situation.',
      location: 'Darshan Queue Area',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      status: 'in-progress',
      assignedDepartment: 'Security & Crowd Control',
      estimatedResolution: '20-25 minutes'
    },
    {
      id: '3',
      type: 'traffic',
      severity: 'medium',
      title: 'Traffic Congestion',
      description: 'Heavy traffic buildup on Ghat Road causing delays in shuttle services.',
      location: 'Ghat Road KM 12-15',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      status: 'in-progress',
      assignedDepartment: 'Traffic Management',
      estimatedResolution: '30-40 minutes'
    },
    {
      id: '4',
      type: 'security',
      severity: 'high',
      title: 'Suspicious Activity',
      description: 'Unattended bag reported near VIP waiting area. Security sweep required.',
      location: 'VIP Waiting Area',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      status: 'pending',
      estimatedResolution: '15-20 minutes'
    },
    {
      id: '5',
      type: 'maintenance',
      severity: 'medium',
      title: 'Elevator Malfunction',
      description: 'Main elevator in Administrative Block not functioning properly.',
      location: 'Administrative Block',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'in-progress',
      assignedDepartment: 'Maintenance Team',
      estimatedResolution: '60-90 minutes'
    },
    {
      id: '6',
      type: 'weather',
      severity: 'medium',
      title: 'Weather Advisory',
      description: 'Heavy rain expected in next 2 hours. Prepare shelter arrangements.',
      location: 'Entire Complex',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'pending',
      estimatedResolution: '30 minutes'
    }
  ];

  useEffect(() => {
    setSituations(sampleSituations);
  }, []);

  const handleActionTaken = (situationId: string, action: string, suggestions: any[]) => {
    setSituations(prev => prev.map(situation => 
      situation.id === situationId 
        ? { 
            ...situation, 
            status: action === 'executed' ? 'resolved' : 'in-progress',
            assignedDepartment: suggestions[0]?.department || situation.assignedDepartment
          }
        : situation
    ));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getSituationIcon = (type: string) => {
    switch (type) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const filteredSituations = situations.filter(situation => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'critical' && situation.severity === 'critical') ||
                         situation.status === filter;
    
    const matchesSearch = searchTerm === '' || 
                         situation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         situation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         situation.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatistics = () => {
    const total = situations.length;
    const pending = situations.filter(s => s.status === 'pending').length;
    const inProgress = situations.filter(s => s.status === 'in-progress').length;
    const critical = situations.filter(s => s.severity === 'critical').length;
    const resolved = situations.filter(s => s.status === 'resolved').length;

    return { total, pending, inProgress, critical, resolved };
  };

  const stats = getStatistics();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI-Powered Action Center</h2>
              <p className="text-gray-600">Real-time situation monitoring and intelligent response coordination</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Situations</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
            <div className="text-sm text-red-700">Pending Action</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-yellow-700">In Progress</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.critical}</div>
            <div className="text-sm text-orange-700">Critical</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-green-700">Resolved</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex space-x-2">
              {[
                { id: 'all', name: 'All', count: stats.total },
                { id: 'pending', name: 'Pending', count: stats.pending },
                { id: 'in-progress', name: 'In Progress', count: stats.inProgress },
                { id: 'critical', name: 'Critical', count: stats.critical }
              ].map(filterOption => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === filterOption.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.name} ({filterOption.count})
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search situations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Situations List */}
      <div className="space-y-6">
        {filteredSituations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Situations Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No situations match your search criteria.' : 'All situations are under control.'}
            </p>
          </div>
        ) : (
          filteredSituations.map(situation => (
            <div key={situation.id} className={`border-l-4 rounded-2xl ${getSeverityColor(situation.severity)}`}>
              <div className="bg-white p-6 rounded-r-2xl shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      {getSituationIcon(situation.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{situation.title}</h3>
                      <p className="text-sm text-gray-600">{situation.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(situation.status)}`}>
                      {situation.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor((Date.now() - situation.timestamp.getTime()) / (1000 * 60))}m ago</span>
                    </span>
                  </div>
                </div>

                {situation.assignedDepartment && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Assigned to:</strong> {situation.assignedDepartment}
                      {situation.estimatedResolution && (
                        <span className="ml-4">
                          <strong>ETA:</strong> {situation.estimatedResolution}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <ActionButton
                  situationType={situation.type}
                  severity={situation.severity}
                  location={situation.location}
                  description={situation.description}
                  onActionTaken={(action, suggestions) => handleActionTaken(situation.id, action, suggestions)}
                  className="mt-4"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionCenter;