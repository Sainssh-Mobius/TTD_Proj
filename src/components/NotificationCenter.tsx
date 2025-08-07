import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, Clock, Trash2, Settings, Filter, MoreVertical } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'emergency' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  category: 'system' | 'security' | 'traffic' | 'darshan' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionRequired?: boolean;
}

interface NotificationCenterProps {
  notifications: Array<{
    id: string;
    type: 'info' | 'warning' | 'emergency';
    message: string;
    timestamp: Date;
  }>;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications: externalNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Enhanced notification data with more details
  const sampleNotifications: Notification[] = [
    {
      id: '1',
      type: 'emergency',
      title: 'Medical Emergency',
      message: 'Medical emergency reported at Zone A - Ambulance dispatched',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      category: 'security',
      priority: 'critical',
      actionRequired: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'High Crowd Density',
      message: 'Crowd density at Main Temple exceeds 85% - Consider crowd control measures',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      category: 'security',
      priority: 'high',
      actionRequired: true
    },
    {
      id: '3',
      type: 'info',
      title: 'Shuttle Service Update',
      message: 'New shuttle arrived at Gate 2 - Capacity: 45 passengers',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
      category: 'traffic',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'success',
      title: 'System Backup Complete',
      message: 'Daily system backup completed successfully at 2:00 AM',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      category: 'system',
      priority: 'low'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Parking Lot Full',
      message: 'Parking Lot A is 95% full - Redirect vehicles to Lot B',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      read: false,
      category: 'traffic',
      priority: 'medium',
      actionRequired: true
    },
    {
      id: '6',
      type: 'info',
      title: 'Weather Update',
      message: 'Clear skies expected for the next 6 hours - Good conditions for darshan',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      category: 'system',
      priority: 'low'
    },
    {
      id: '7',
      type: 'emergency',
      title: 'Fire Drill Initiated',
      message: 'Scheduled fire drill started in Administrative Block',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      read: false,
      category: 'security',
      priority: 'high'
    },
    {
      id: '8',
      type: 'info',
      title: 'VIP Arrival Scheduled',
      message: 'VIP arrival expected at 4:30 PM - Security protocols activated',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: true,
      category: 'security',
      priority: 'high'
    }
  ];

  useEffect(() => {
    // Initialize with sample notifications and convert external notifications
    const convertedExternal = externalNotifications.map(notif => ({
      ...notif,
      title: getNotificationTitle(notif.type, notif.message),
      read: false,
      category: getNotificationCategory(notif.message) as any,
      priority: notif.type === 'emergency' ? 'critical' as const : 
                notif.type === 'warning' ? 'high' as const : 'medium' as const,
      actionRequired: notif.type === 'emergency' || notif.type === 'warning'
    }));

    setNotifications([...convertedExternal, ...sampleNotifications]);
  }, [externalNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationTitle = (type: string, message: string): string => {
    if (message.toLowerCase().includes('medical')) return 'Medical Alert';
    if (message.toLowerCase().includes('crowd')) return 'Crowd Management';
    if (message.toLowerCase().includes('shuttle')) return 'Transport Update';
    if (message.toLowerCase().includes('parking')) return 'Parking Alert';
    if (message.toLowerCase().includes('weather')) return 'Weather Update';
    if (message.toLowerCase().includes('fire')) return 'Emergency Drill';
    if (message.toLowerCase().includes('lost')) return 'Security Alert';
    return type === 'emergency' ? 'Emergency Alert' : 
           type === 'warning' ? 'Warning' : 'Information';
  };

  const getNotificationCategory = (message: string): string => {
    if (message.toLowerCase().includes('medical') || message.toLowerCase().includes('emergency') || 
        message.toLowerCase().includes('security') || message.toLowerCase().includes('lost')) return 'security';
    if (message.toLowerCase().includes('shuttle') || message.toLowerCase().includes('parking') || 
        message.toLowerCase().includes('traffic')) return 'traffic';
    if (message.toLowerCase().includes('darshan') || message.toLowerCase().includes('temple')) return 'darshan';
    if (message.toLowerCase().includes('system') || message.toLowerCase().includes('backup')) return 'system';
    return 'system';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationStyle = (type: string, read: boolean) => {
    const baseStyle = `border-l-4 ${read ? 'opacity-75' : ''}`;
    switch (type) {
      case 'emergency':
        return `${baseStyle} border-red-500 bg-red-50`;
      case 'warning':
        return `${baseStyle} border-yellow-500 bg-yellow-50`;
      case 'success':
        return `${baseStyle} border-green-500 bg-green-50`;
      case 'info':
      default:
        return `${baseStyle} border-blue-500 bg-blue-50`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Critical</span>;
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Low</span>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security':
        return '🛡️';
      case 'traffic':
        return '🚗';
      case 'darshan':
        return '🙏';
      case 'maintenance':
        return '🔧';
      case 'system':
      default:
        return '⚙️';
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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    switch (filter) {
      case 'unread':
        return !notif.read;
      case 'critical':
        return notif.priority === 'critical' || notif.priority === 'high';
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical').length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 flex items-center justify-center">
            <div className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
            {criticalCount > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            )}
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{notifications.length} total</span>
              <span>{unreadCount} unread</span>
              {criticalCount > 0 && (
                <span className="text-red-600 font-medium">{criticalCount} critical</span>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mt-3 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'all', name: 'All', count: notifications.length },
                { id: 'unread', name: 'Unread', count: unreadCount },
                { id: 'critical', name: 'Critical', count: criticalCount }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    filter === tab.id
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.name} {tab.count > 0 && `(${tab.count})`}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No notifications to show</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs">{getCategoryIcon(notification.category)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getPriorityBadge(notification.priority)}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        <p className={`text-sm leading-relaxed ${
                          !notification.read ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(notification.timestamp)}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {notification.actionRequired && (
                              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                                Action Required
                              </span>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={clearAllNotifications}
                  className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-1">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;