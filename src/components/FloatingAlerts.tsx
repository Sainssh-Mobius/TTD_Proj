import React, { useState } from 'react';
import { X, AlertTriangle, Info, Bell } from 'lucide-react';

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

  const handleDismiss = (id: string) => {
    setDismissed(prev => new Set([...prev, id]));
  };

  const visibleNotifications = notifications.filter(n => !dismissed.has(n.id));

  if (visibleNotifications.length === 0) return null;

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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingAlerts;