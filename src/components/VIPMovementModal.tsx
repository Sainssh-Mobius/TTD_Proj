import React, { useState } from 'react';
import { X, Shield, Clock, MapPin, Users, AlertTriangle, CheckCircle, Car, Radio, Camera, Route } from 'lucide-react';

interface VIPMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VIPDetails {
  name: string;
  category: 'political' | 'religious' | 'celebrity' | 'foreign-dignitary';
  securityLevel: 'standard' | 'high' | 'maximum';
  entourage: number;
  estimatedArrival: string;
  specialRequirements: string[];
}

interface MovementPlan {
  route: string;
  securityPersonnel: number;
  vehicleCount: number;
  estimatedDuration: string;
  checkpoints: string[];
  emergencyProtocols: string[];
}

const VIPMovementModal: React.FC<VIPMovementModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'active' | 'history'>('new');
  const [vipDetails, setVipDetails] = useState<VIPDetails>({
    name: '',
    category: 'political',
    securityLevel: 'standard',
    entourage: 1,
    estimatedArrival: '',
    specialRequirements: []
  });
  const [movementPlan, setMovementPlan] = useState<MovementPlan>({
    route: 'main-entrance',
    securityPersonnel: 10,
    vehicleCount: 3,
    estimatedDuration: '45 minutes',
    checkpoints: ['Gate 1', 'Security Check', 'VIP Lounge', 'Temple Entrance'],
    emergencyProtocols: ['Medical Team Standby', 'Alternate Route Ready', 'Communication Backup']
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const vipCategories = [
    { id: 'political', name: 'Political Leader', color: 'bg-red-100 text-red-800' },
    { id: 'religious', name: 'Religious Leader', color: 'bg-orange-100 text-orange-800' },
    { id: 'celebrity', name: 'Celebrity/VIP', color: 'bg-purple-100 text-purple-800' },
    { id: 'foreign-dignitary', name: 'Foreign Dignitary', color: 'bg-blue-100 text-blue-800' }
  ];

  const securityLevels = [
    { id: 'standard', name: 'Standard', personnel: 10, vehicles: 3, color: 'bg-green-100 text-green-800' },
    { id: 'high', name: 'High Security', personnel: 20, vehicles: 5, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'maximum', name: 'Maximum Security', personnel: 35, vehicles: 8, color: 'bg-red-100 text-red-800' }
  ];

  const activeVIPs = [
    {
      id: 1,
      name: 'Hon. Chief Minister',
      category: 'Political Leader',
      status: 'In Transit',
      eta: '15 minutes',
      location: 'Checkpoint 2',
      securityLevel: 'Maximum'
    },
    {
      id: 2,
      name: 'Sri Jagadguru',
      category: 'Religious Leader',
      status: 'At Temple',
      eta: 'Darshan in progress',
      location: 'VIP Darshan Hall',
      securityLevel: 'High'
    }
  ];

  const movementHistory = [
    {
      id: 1,
      name: 'Former President',
      date: '2024-01-15',
      time: '10:30 AM',
      status: 'Completed',
      duration: '2h 15m',
      incidents: 0
    },
    {
      id: 2,
      name: 'Film Star',
      date: '2024-01-14',
      time: '6:00 AM',
      status: 'Completed',
      duration: '1h 30m',
      incidents: 1
    }
  ];

  const specialRequirements = [
    'Medical Team Standby',
    'Wheelchair Accessibility',
    'Photography Restrictions',
    'Media Coordination',
    'Special Prasadam',
    'Private Darshan',
    'Helicopter Landing',
    'Road Closure'
  ];

  const routes = [
    { id: 'main-entrance', name: 'Main Entrance Route', duration: '45 min', security: 'Standard' },
    { id: 'vip-entrance', name: 'VIP Entrance Route', duration: '30 min', security: 'Enhanced' },
    { id: 'helicopter-route', name: 'Helicopter Landing Route', duration: '15 min', security: 'Maximum' },
    { id: 'back-entrance', name: 'Back Entrance (Discrete)', duration: '35 min', security: 'High' }
  ];

  const handleSecurityLevelChange = (level: string) => {
    const securityConfig = securityLevels.find(s => s.id === level);
    if (securityConfig) {
      setVipDetails(prev => ({ ...prev, securityLevel: level as any }));
      setMovementPlan(prev => ({
        ...prev,
        securityPersonnel: securityConfig.personnel,
        vehicleCount: securityConfig.vehicles
      }));
    }
  };

  const handleRequirementToggle = (requirement: string) => {
    setVipDetails(prev => ({
      ...prev,
      specialRequirements: prev.specialRequirements.includes(requirement)
        ? prev.specialRequirements.filter(r => r !== requirement)
        : [...prev.specialRequirements, requirement]
    }));
  };

  const handleInitiateMovement = async () => {
    setIsProcessing(true);
    
    // Simulate API call and system coordination
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically:
    // 1. Notify security teams
    // 2. Update traffic management
    // 3. Coordinate with temple authorities
    // 4. Set up monitoring systems
    // 5. Activate emergency protocols
    
    setIsProcessing(false);
    onClose();
    
    // Show success notification (you could add this to your notification system)
    alert('VIP Movement Protocol Initiated Successfully!\n\n' +
          '✓ Security teams notified\n' +
          '✓ Traffic routes optimized\n' +
          '✓ Temple authorities coordinated\n' +
          '✓ Emergency protocols activated');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">VIP Movement Control Center</h2>
                <p className="text-amber-100">Coordinate and manage VIP visits with enhanced security protocols</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'new', name: 'New Movement', icon: Shield },
              { id: 'active', name: 'Active VIPs', icon: Radio },
              { id: 'history', name: 'Movement History', icon: Clock }
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-amber-500 text-amber-600 bg-amber-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'new' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* VIP Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">VIP Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">VIP Name</label>
                      <input
                        type="text"
                        value={vipDetails.name}
                        onChange={(e) => setVipDetails(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Enter VIP name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <div className="grid grid-cols-2 gap-2">
                        {vipCategories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => setVipDetails(prev => ({ ...prev, category: category.id as any }))}
                            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                              vipDetails.category === category.id
                                ? `${category.color} border-current`
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Security Level</label>
                      <div className="space-y-2">
                        {securityLevels.map(level => (
                          <button
                            key={level.id}
                            onClick={() => handleSecurityLevelChange(level.id)}
                            className={`w-full p-3 rounded-lg border text-left transition-colors ${
                              vipDetails.securityLevel === level.id
                                ? `${level.color} border-current`
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{level.name}</div>
                            <div className="text-xs opacity-80">
                              {level.personnel} personnel • {level.vehicles} vehicles
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Entourage Size</label>
                        <input
                          type="number"
                          value={vipDetails.entourage}
                          onChange={(e) => setVipDetails(prev => ({ ...prev, entourage: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Arrival</label>
                        <input
                          type="datetime-local"
                          value={vipDetails.estimatedArrival}
                          onChange={(e) => setVipDetails(prev => ({ ...prev, estimatedArrival: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Special Requirements</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {specialRequirements.map(requirement => (
                      <button
                        key={requirement}
                        onClick={() => handleRequirementToggle(requirement)}
                        className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                          vipDetails.specialRequirements.includes(requirement)
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {requirement}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Movement Plan */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Movement Plan</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Route Selection</label>
                      <div className="space-y-2">
                        {routes.map(route => (
                          <button
                            key={route.id}
                            onClick={() => setMovementPlan(prev => ({ ...prev, route: route.id }))}
                            className={`w-full p-3 rounded-lg border text-left transition-colors ${
                              movementPlan.route === route.id
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium">{route.name}</div>
                            <div className="text-xs opacity-80">
                              {route.duration} • {route.security} security
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Security Personnel</label>
                        <input
                          type="number"
                          value={movementPlan.securityPersonnel}
                          onChange={(e) => setMovementPlan(prev => ({ ...prev, securityPersonnel: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Count</label>
                        <input
                          type="number"
                          value={movementPlan.vehicleCount}
                          onChange={(e) => setMovementPlan(prev => ({ ...prev, vehicleCount: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkpoints */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Security Checkpoints</h4>
                  <div className="space-y-2">
                    {movementPlan.checkpoints.map((checkpoint, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{checkpoint}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergency Protocols */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Emergency Protocols</h4>
                  <div className="space-y-2">
                    {movementPlan.emergencyProtocols.map((protocol, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-sm">{protocol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Currently Active VIP Movements</h3>
              {activeVIPs.map(vip => (
                <div key={vip.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{vip.name}</h4>
                      <p className="text-sm text-gray-600">{vip.category}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vip.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {vip.status}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {vip.securityLevel}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{vip.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{vip.eta}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                      Track Live
                    </button>
                    <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs">
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Movement History</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">VIP Name</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Incidents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movementHistory.map(movement => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-sm">{movement.name}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">{movement.date}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">{movement.time}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">{movement.duration}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {movement.status}
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            movement.incidents === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {movement.incidents}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'new' && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                All systems will be automatically coordinated upon initiation
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiateMovement}
                  disabled={!vipDetails.name || !vipDetails.estimatedArrival || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-red-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Initiating...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Initiate VIP Movement</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPMovementModal;