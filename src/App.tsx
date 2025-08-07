import React, { useState, useEffect } from 'react';
import { UserCheck, TrendingUp, Users, Activity, Settings, BarChart3 } from 'lucide-react';
import CLevelDashboard from './components/CLevelDashboard';
import OperationalDashboard from './components/OperationalDashboard';
import GroundStaffDashboard from './components/GroundStaffDashboard';
import FloatingAlerts from './components/FloatingAlerts';
import ChatBot from './components/ChatBot';

type Persona = 'c-level' | 'operational' | 'ground-staff';

function App() {
  const [currentPersona, setCurrentPersona] = useState<Persona>('c-level');
  const [showChatBot, setShowChatBot] = useState(false);
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">TTD AI Management System</h1>
                <p className="text-xs text-gray-600">Tirumala Tirupathi Devasthanam</p>
              </div>
            </div>

            {/* Center - Persona Toggle */}
            <div className="flex items-center">
              {/* Persona Toggle */}
              <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shadow-sm">
                {personas.map((persona) => {
                  const IconComponent = persona.icon;
                  return (
                    <button
                      key={persona.id}
                      onClick={() => setCurrentPersona(persona.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${currentPersona === persona.id
                          ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                        }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{persona.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side - Current View */}
            <div className="flex items-center">
              {/* Current View Indicator */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Current View</div>
                <div className="text-sm font-bold text-blue-900">{getCurrentPersona()?.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Persona Description Bar */}
        <div className="border-t border-gray-100 bg-gray-50/30">
          <div className="max-w-full mx-auto px-6 py-2">
            <p className="text-center text-xs text-gray-600 font-medium">{getCurrentPersona()?.description}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 py-4">
        {renderPersonaDashboard()}
      </main>

      {/* Floating Components */}
      <FloatingAlerts notifications={notifications} />
      {showChatBot && (
        <ChatBot onClose={() => setShowChatBot(false)} />
      )}

      {/* Live Status Indicator */}
      <div className="fixed bottom-6 left-6 bg-mobius-success text-white px-4 py-3 rounded-2xl shadow-lg flex items-center space-x-2 animate-fade-in">
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