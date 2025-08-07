import React, { useState } from 'react';
import { X, AlertTriangle, Info, Bell, Volume2, VolumeX } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'emergency';
  message: string;
  timestamp: Date;
}

interface FloatingAlertsProps {
  notifications: Notification[];
}

const FloatingAlerts: React.FC<FloatingAlertsProps> = ({ notifications }) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const handleDismissAll = () => {
    const allIds = new Set(notifications.map(n => n.id));
    setDismissed(allIds);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      // Play a test sound when enabling
      alert('Alert sounds enabled');
    } else {
      alert('Alert sounds disabled');
    }
  };

  const visibleNotifications = notifications.filter(n => !dismissed.has(n.id));

  if (visibleNotifications.length === 0) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={handleSoundToggle}
          className="bg-white shadow-lg border border-gray-200 rounded-lg p-3 hover:shadow-xl transition-all duration-200"
          title={`Alert sounds ${soundEnabled ? 'enabled' : 'disabled'}`}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-blue-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    );
  }

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-50 text-red-800 border-l-4 border-red-500';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-l-4 border-amber-500';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-l-4 border-blue-500';
      default:
        return 'bg-gray-50 text-gray-800 border-l-4 border-gray-500';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <Bell className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {/* Controls */}
      <div className="flex items-center justify-end space-x-2 mb-2">
        <button
          onClick={handleSoundToggle}
          className="bg-white shadow-sm border border-gray-200 rounded-lg p-2 hover:shadow-md transition-all duration-200"
          title={`Alert sounds ${soundEnabled ? 'enabled' : 'disabled'}`}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-600" />
          ) : (
            <VolumeX className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {visibleNotifications.length > 1 && (
          <button
            onClick={handleDismissAll}
            className="bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 hover:shadow-md transition-all duration-200 text-xs font-medium text-gray-600"
          >
            Dismiss All
          </button>
        )}
      </div>
      
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyle(notification.type)}
            rounded-lg shadow-lg border-l-4 p-4
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">
                {notification.message}
              </p>
              <p className="text-xs opacity-80 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="flex-shrink-0 ml-2 hover:bg-white/20 rounded p-1 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Action buttons for critical alerts */}
          {notification.type === 'emergency' && (
            <div className="mt-3 pt-3 border-t border-red-200 flex space-x-2">
              <button
                onClick={() => {
                  handleDismiss(notification.id);
                  alert('Emergency response team dispatched!');
                }}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
              >
                Respond
              </button>
              <button
                onClick={() => alert('Emergency escalated to higher authorities.')}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition-colors"
              >
                Escalate
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FloatingAlerts;