import React, { useState, useEffect } from 'react';
import { UserCheck, TrendingUp, Users, Activity, Settings, BarChart3, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import CLevelDashboard from './components/CLevelDashboard';
import OperationalDashboard from './components/OperationalDashboard';
import GroundStaffDashboard from './components/GroundStaffDashboard';
import FloatingAlerts from './components/FloatingAlerts';
import ChatBot from './components/ChatBot';
import NotificationCenter from './components/NotificationCenter';

type Persona = 'c-level' | 'operational' | 'ground-staff';

function App() {
  const [currentPersona, setCurrentPersona] = useState<Persona>('c-level');
  const [showChatBot, setShowChatBot] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'emergency';
    message: string;
    timestamp: Date;
  }>>([]);

  const personas = [
    { id: 'c-level' as const, name: 'C-Level', icon: BarChart3, description: 'Strategic Overview & Executive Insights' },
    { id: 'operational' as const, name: 'Operational Team', icon: Settings, description: 'Operations Management & Control' },
    { id: 'ground-staff' as const, name: 'Ground Staff', icon: Users, description: 'Field Operations & Real-time Support' }
  ];

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const notificationTypes = [
        { type: 'info' as const, messages: ['New darshan slot available', 'Shuttle arrived at Gate 2', 'Weather update: Clear skies'] },
        { type: 'warning' as const, messages: ['High crowd density at Main Temple', 'Parking lot 80% full', 'Traffic congestion on Ghat Road'] },
        { type: 'emergency' as const, messages: ['Medical emergency at Zone A', 'Fire drill initiated', 'Lost child alert - Sector 3'] }
      ];

      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const randomMessage = randomType.messages[Math.floor(Math.random() * randomType.messages.length)];

      if (Math.random() > 0.8) { // 20% chance every 5 seconds
        setNotifications(prev => [{
          id: Date.now().toString(),
          type: randomType.type,
          message: randomMessage,
          timestamp: new Date()
        }, ...prev.slice(0, 4)]); // Keep only last 5 notifications
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map((n) => 
      setTimeout(() => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== n.id));
      }, 5000) // Auto-remove after 10 seconds
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [notifications]);


  const renderPersonaDashboard = () => {
    switch (currentPersona) {
      case 'c-level':
        return <CLevelDashboard />;
      case 'operational':
        return <OperationalDashboard />;
      case 'ground-staff':
        return <GroundStaffDashboard />;
      default:
        return <CLevelDashboard />;
    }
  };

  const getCurrentPersona = () => personas.find(p => p.id === currentPersona);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Side Panel */}
      <div className={`fixed left-0 top-0 h-full ${sidebarCollapsed ? 'w-16' : 'w-80'} bg-white border-r border-gray-200 shadow-sm flex flex-col transition-all duration-300 ease-in-out z-50`}>
        {/* Collapse Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all duration-200 z-10"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Side Panel Header */}
        <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200 transition-all duration-300`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className={`${sidebarCollapsed ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300`}>
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="text-lg font-bold text-gray-900">TTD AI System</h1>
                <p className="text-xs text-gray-600">Tirumala Tirupathi Devasthanam</p>
              </div>
            )}
          </div>
        </div>

        {/* Persona Selection */}
        <div className={`flex-1 ${sidebarCollapsed ? 'p-2' : 'p-6'} transition-all duration-300`}>
          <div className="mb-6">
            {!sidebarCollapsed && (
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 transition-opacity duration-300">Select View</h2>
            )}
            <div className={`${sidebarCollapsed ? 'space-y-2' : 'space-y-3'}`}>
              {personas.map((persona) => {
                const IconComponent = persona.icon;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setCurrentPersona(persona.id)}
                    title={sidebarCollapsed ? persona.name : undefined}
                    className={`w-full flex items-start ${sidebarCollapsed ? 'justify-center p-3' : 'space-x-4 p-4'} rounded-xl transition-all duration-200 text-left ${
                      currentPersona === persona.id
                        ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className={`${sidebarCollapsed ? 'p-2' : 'p-2'} rounded-lg ${
                      currentPersona === persona.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-white text-gray-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0 transition-opacity duration-300">
                        <div className={`font-semibold text-sm ${
                          currentPersona === persona.id ? 'text-indigo-900' : 'text-gray-900'
                        }`}>
                          {persona.name}
                        </div>
                        <div className={`text-xs mt-1 leading-relaxed ${
                          currentPersona === persona.id ? 'text-indigo-700' : 'text-gray-600'
                        }`}>
                          {persona.description}
                        </div>
                      </div>
                    )}
                    {currentPersona === persona.id && !sidebarCollapsed && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Status */}
          <div className={`bg-gradient-to-r from-green-50 to-blue-50 rounded-xl ${sidebarCollapsed ? 'p-2' : 'p-4'} border border-green-200 transition-all duration-300`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-2 mb-2'}`}>
              <Activity className={`${sidebarCollapsed ? 'w-5 h-5' : 'w-4 h-4'} text-green-600 animate-pulse`} />
              {!sidebarCollapsed && (
                <span className="text-sm font-semibold text-green-800">System Status</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="text-xs text-green-700 transition-opacity duration-300">
                All systems operational • Live data streaming
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
      {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Current View Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{getCurrentPersona()?.name} Dashboard</h2>
              <p className="text-sm text-gray-600">{getCurrentPersona()?.description}</p>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-3">
              <NotificationCenter notifications={notifications} />
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Active View</div>
                <div className="text-sm font-bold text-blue-900">{getCurrentPersona()?.name}</div>
              </div>
            </div>
          </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto px-6 py-6">
          {renderPersonaDashboard()}
        </main>
      </div>

      {/* Floating Components */}
      <FloatingAlerts notifications={notifications} />
      {showChatBot && (
        <ChatBot onClose={() => setShowChatBot(false)} />
      )}

      {/* Live Status Indicator */}
      <div className="fixed bottom-6 left-6 bg-mobius-success text-white px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-2 animate-fade-in z-50">
        <Activity className="w-4 h-4 animate-pulse" />
        <span className="text-label-md">Live</span>
      </div>

      {/* Chat Bot Toggle */}
      <button
        onClick={() => setShowChatBot(!showChatBot)}
        className="fixed bottom-6 right-6 btn-mobius-primary p-4 rounded-2xl shadow-lg transition-all duration-200"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    </div>
  );
}

export default App;