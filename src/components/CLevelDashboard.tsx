import React, { useState, useEffect } from 'react';
import { TrendingUp, Users,  AlertTriangle, Brain, Target, Zap, BarChart3, Globe, Shield, Clock, Activity, Car, MapPin } from 'lucide-react';
import SatisfactionScoreModal from './SatisfactionScoreModal';

const CLevelDashboard: React.FC = () => {
  // Enhanced state management for better UX
  const [activeTab, setActiveTab] = useState<'overview' | 'forecasting' | 'simulation'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [dashboardView, setDashboardView] = useState<'compact' | 'detailed'>('compact');
  const [showSatisfactionModal, setShowSatisfactionModal] = useState(false);

  // Pilgrim Management KPIs
  const [pilgrimKPIs, setPilgrimKPIs] = useState({
    current: 45632,
    aiPredictedPeak: 68500,
    dailyCapacity: 75000,
    satisfactionScore: 4.7,
    avgDarshanTime: 12,
    queueEfficiency: 94.2
  });

  // Traffic Management KPIs
  const [trafficKPIs, setTrafficKPIs] = useState({
    current: 1247,
    aiPredictedPeak: 1850,
    roadCapacity: 2000,
    avgTravelTime: 68,
    parkingUtilization: 78.5,
    trafficFlow: 92.3
  });

  // Financial & Strategic KPIs
  const [strategicKPIs, setStrategicKPIs] = useState({
    dailyRevenue: 12500000,
    monthlyGrowth: 15.2,
    operationalCost: 8200000,
    profitMargin: 34.4,
    digitalAdoption: 78.4,
    sustainabilityScore: 85.7
  });

  const [scenarioCheckboxes, setScenarioCheckboxes] = useState<{ [key: string]: boolean }>({});
  const [isApplyingScenario, setIsApplyingScenario] = useState(false);
  const [hasCheckboxChanges, setHasCheckboxChanges] = useState(false);
  const [whatIfScenario, setWhatIfScenario] = useState('weather-impact');
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);

  // 24-hour forecast data
  const [forecastData, setForecastData] = useState(() => {
    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      let baseFlow = 1000;

      // Realistic pilgrim flow pattern
      if (hour >= 4 && hour <= 6) baseFlow = 3500; // Early morning peak
      else if (hour >= 7 && hour <= 9) baseFlow = 4200; // Morning peak
      else if (hour >= 10 && hour <= 12) baseFlow = 3800; // Late morning
      else if (hour >= 13 && hour <= 15) baseFlow = 2800; // Afternoon
      else if (hour >= 16 && hour <= 18) baseFlow = 3200; // Evening
      else if (hour >= 19 && hour <= 21) baseFlow = 2400; // Night
      else if (hour >= 22 || hour <= 3) baseFlow = 800; // Late night/early morning

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        predicted: baseFlow + Math.floor(Math.random() * 400 - 200),
        actual: hour <= new Date().getHours() ? baseFlow + Math.floor(Math.random() * 300 - 150) : null,
        confidence: 85 + Math.floor(Math.random() * 10)
      };
    });
    return hours;
  });

  // Realistic Scenario State
  const [dayType, setDayType] = useState('normal-day');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);
  const [calculatedMultiplier, setCalculatedMultiplier] = useState(1.0);

  // Time-Specific Forecasting State
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('06:30');
  const [timeSlotPredictions, setTimeSlotPredictions] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState('weather-crisis');
  const [chartTimePeriod, setChartTimePeriod] = useState('hourly');
  
  // Date range filter states
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days from now

  // Festival calendar states
  const [festivalFilterEnabled, setFestivalFilterEnabled] = useState(false);
  const [selectedFestivals, setSelectedFestivals] = useState<string[]>([]);

  // TTD Festivals Configuration
  const ttdFestivals = [
    { id: 'vaikunta_dwadasi', name: 'Vaikunta Dwadasi (Chakrasnanam)', date: '2025-01-11', category: 'Major', impact: 3.5 },
    { id: 'goda_parinyam', name: 'Goda Parinyam & Pranaya Kalaha Mahotsavam', date: '2025-01-15', category: 'Special', impact: 2.8 },
    { id: 'adhyayanotsavam', name: 'Adhyayanotsavam', date: '2025-01-23', category: 'Religious', impact: 2.2 },
    { id: 'rathasapthami', name: 'Rathasapthami', date: '2025-02-04', category: 'Major', impact: 3.2 },
    { id: 'rama_krishna_mukkoti', name: 'Rama Krishna Teertha Mukkoti', date: '2025-02-12', category: 'Special', impact: 2.5 },
    { id: 'maha_shivratri', name: 'Maha Shivratri', date: '2025-02-26', category: 'Major', impact: 4.2 },
    { id: 'float_festival_start', name: 'Float Festival (Start)', date: '2025-03-09', category: 'Major', impact: 3.8 },
    { id: 'float_festival_peak', name: 'Float Festival (Peak)', date: '2025-03-11', category: 'Major', impact: 4.5 },
    { id: 'float_festival_end', name: 'Float Festival (End)', date: '2025-03-13', category: 'Major', impact: 3.0 },
    { id: 'ugadi', name: 'Ugadi (Telugu New Year)', date: '2025-03-30', category: 'Cultural', impact: 3.5 },
    { id: 'rama_navami', name: 'Sri Rama Navami', date: '2025-04-10', category: 'Major', impact: 4.0 },
    { id: 'vasanthotsavam_start', name: 'Vasanthotsavam (Start)', date: '2025-04-15', category: 'Special', impact: 2.8 },
    { id: 'vasanthotsavam_peak', name: 'Vasanthotsavam (Peak)', date: '2025-04-16', category: 'Special', impact: 3.2 },
    { id: 'vasanthotsavam_end', name: 'Vasanthotsavam (End)', date: '2025-04-17', category: 'Special', impact: 2.5 },
    { id: 'narasimha_jayanti', name: 'Narasimha Jayanti', date: '2025-05-14', category: 'Major', impact: 3.8 },
    { id: 'jyestabhishekam_start', name: 'Jyestabhishekam (Start)', date: '2025-05-28', category: 'Religious', impact: 2.5 },
    { id: 'jyestabhishekam_peak', name: 'Jyestabhishekam (Peak)', date: '2025-05-29', category: 'Religious', impact: 3.0 },
    { id: 'jyestabhishekam_end', name: 'Jyestabhishekam (End)', date: '2025-05-30', category: 'Religious', impact: 2.2 },
    { id: 'aani_garuda_seva', name: 'Aani Garuda Seva', date: '2025-06-22', category: 'Special', impact: 2.8 },
    { id: 'pavitrotsavam_start', name: 'Pavitrotsavam (Start)', date: '2025-07-17', category: 'Religious', impact: 2.5 },
    { id: 'pavitrotsavam_peak', name: 'Pavitrotsavam (Peak)', date: '2025-07-18', category: 'Religious', impact: 3.0 },
    { id: 'pavitrotsavam_end', name: 'Pavitrotsavam (End)', date: '2025-07-19', category: 'Religious', impact: 2.2 },
    { id: 'krishna_janmashtami', name: 'Sri Krishna Janmashtami', date: '2025-08-16', category: 'Major', impact: 4.2 },
    { id: 'pushpa_pallaki', name: 'Pushpa Pallaki', date: '2025-08-20', category: 'Special', impact: 2.8 },
    { id: 'brahmotsavam_start', name: 'Brahmotsavam (Start)', date: '2025-09-16', category: 'Major', impact: 4.8 },
    { id: 'brahmotsavam_garuda_seva', name: 'Brahmotsavam (Garuda Seva)', date: '2025-09-20', category: 'Major', impact: 5.0 },
    { id: 'brahmotsavam_end', name: 'Brahmotsavam (End)', date: '2025-09-24', category: 'Major', impact: 4.5 },
    { id: 'navaratri_start', name: 'Navaratri Utsavam (Start)', date: '2025-10-01', category: 'Major', impact: 3.5 },
    { id: 'navaratri_peak', name: 'Navaratri Utsavam (Peak)', date: '2025-10-05', category: 'Major', impact: 4.0 },
    { id: 'dussehra', name: 'Dussehra', date: '2025-10-09', category: 'Major', impact: 4.2 },
    { id: 'deepavali', name: 'Deepavali', date: '2025-11-01', category: 'Cultural', impact: 3.8 },
    { id: 'karthika_deepotsavam', name: 'Karthika Deepotsavam', date: '2025-11-23', category: 'Major', impact: 4.0 },
    { id: 'vaikuntha_ekadashi', name: 'Vaikuntha Ekadashi', date: '2025-12-30', category: 'Major', impact: 4.8 }
  ];

  // Enhanced C-Level KPIs
  const [executiveKPIs, setExecutiveKPIs] = useState({
    dailyFootfall: 45632,
    vipPilgrimCount: 1247,
    averageDarshanTime: 12.5, // minutes
    averageWaitingTime: 35, // minutes
    crowdDensity: 78.5, // percentage
    revenuesCrores: 2.8 // Rs Crores
  });

  // Prediction vs Actual tracking
  const [predictionAccuracy, setPredictionAccuracy] = useState({
    hourly: { predicted: 1850, actual: 1823, accuracy: 98.5 },
    daily: { predicted: 45000, actual: 45632, accuracy: 98.6 },
    weekly: { predicted: 315000, actual: 319424, accuracy: 98.6 }
  });

  // Hourly predictions for next 24 hours
  const [hourlyPredictions, setHourlyPredictions] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      predicted: Math.floor(1200 + Math.sin(i * 0.5) * 800 + Math.random() * 200),
      confidence: Math.floor(85 + Math.random() * 12)
    }))
  );

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Operations', multiplier: 1.0, description: 'Current baseline performance' },
    { id: 'festival-season', name: 'Festival Season', multiplier: 2.8, description: 'Brahmotsavam & major festivals' },
    { id: 'digital-transformation', name: 'Full Digital Adoption', multiplier: 1.4, description: '100% digital services' },
    { id: 'capacity-expansion', name: 'Infrastructure Expansion', multiplier: 1.6, description: '60% capacity increase' },
    { id: 'weather-crisis', name: 'Weather Crisis', multiplier: 0.4, description: 'Severe weather impact' },
    { id: 'vip-event', name: 'VIP Event', multiplier: 0.7, description: 'Special event restrictions' }
  ];

  // Realistic Scenario Configuration
  const dayTypes = [
    { id: 'normal-day', name: 'Normal Day', multiplier: 1.0 },
    { id: 'state-holiday', name: 'State Holiday', multiplier: 1.8 },
    { id: 'summer-vacation', name: 'Summer Vacation', multiplier: 2.2 },
    { id: 'rainy-day', name: 'Rainy Day', multiplier: 0.6 }
  ];

  const ttdSpecialDaysConfig = [
    { id: 'brahmotsavam', name: 'Brahmotsavam', multiplier: 2.5 },
    { id: 'vaikunta-ekadashi', name: 'Vaikunta Ekadashi', multiplier: 3.2 },
    { id: 'chaturmaasa-vratam', name: 'Chaturmaasa Vratam', multiplier: 1.6 }
  ];

  const regionalFestivalsConfig = [
    { id: 'andhra-pradesh', name: 'Andhra Pradesh', multiplier: 1.4 },
    { id: 'telangana', name: 'Telangana', multiplier: 1.3 },
    { id: 'tamil-nadu', name: 'Tamil Nadu', multiplier: 1.2 }
  ];

  // Auto-calculate multiplier based on selections
  useEffect(() => {
    let baseMultiplier = dayTypes.find(d => d.id === dayType)?.multiplier || 1.0;

    // Add TTD special days multipliers
    ttdSpecialDays.forEach(dayId => {
      const specialDay = ttdSpecialDaysConfig.find(d => d.id === dayId);
      if (specialDay) {
        baseMultiplier *= specialDay.multiplier;
      }
    });

    // Add regional festival multipliers
    regionalFestivals.forEach(festivalId => {
      const festival = regionalFestivalsConfig.find(f => f.id === festivalId);
      if (festival) {
        baseMultiplier *= festival.multiplier;
      }
    });

    // Special combination logic
    if (ttdSpecialDays.includes('vaikunta-ekadashi') && regionalFestivals.includes('telangana')) {
      baseMultiplier *= 1.15; // Additional 15% for this combination
    }

    setCalculatedMultiplier(Math.min(baseMultiplier, 5.0)); // Cap at 5x
  }, [dayType, ttdSpecialDays, regionalFestivals]);

  const handleTtdSpecialDayToggle = (dayId: string) => {
    setTtdSpecialDays(prev =>
      prev.includes(dayId)
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleRegionalFestivalToggle = (festivalId: string) => {
    setRegionalFestivals(prev => 
      prev.includes(festivalId) 
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  // Festival calendar toggle handler
  const handleFestivalToggle = (festivalId: string) => {
    setSelectedFestivals(prev => 
      prev.includes(festivalId) 
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  // Get festivals in date range
  const getFestivalsInRange = (startDate: Date, endDate: Date) => {
    return ttdFestivals.filter(festival => {
      const festivalDate = new Date(festival.date);
      return festivalDate >= startDate && festivalDate <= endDate;
    });
  };  const handleCheckboxChange = (key: string, checked: boolean) => {
    setScenarioCheckboxes(prev => {
      const newState = { ...prev, [key]: checked };

      // Save to localStorage with timestamp
      localStorage.setItem('ttd-scenario-checkboxes', JSON.stringify(newState));
      localStorage.setItem('ttd-scenario-timestamp', Date.now().toString());

      return newState;
    });

    setWhatIfScenario(key)


    setHasCheckboxChanges(true);
  };

  const applyScenario = () => {
    setIsApplyingScenario(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsApplyingScenario(false);
      setHasCheckboxChanges(false);
    }, 2000);
  };
}
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TTD Executive Dashboard</h1>
          <p className="text-gray-600">Real-time insights and AI-powered predictions for Tirumala operations</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Pilgrims */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Pilgrims</p>
                <p className="text-2xl font-bold text-gray-900">{pilgrimKPIs.current.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12.5% from yesterday</span>
              </div>
            </div>
          </div>

          {/* AI Predicted Peak */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Predicted Peak</p>
                <p className="text-2xl font-bold text-gray-900">{pilgrimKPIs.aiPredictedPeak.toLocaleString()}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-orange-600">Expected at 10:30 AM</span>
              </div>
            </div>
          </div>

          {/* Satisfaction Score */}
          <div 
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowSatisfactionModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction Score</p>
                <p className="text-2xl font-bold text-gray-900">{pilgrimKPIs.satisfactionScore}/5.0</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+0.3 this month</span>
              </div>
            </div>
          </div>

          {/* Queue Efficiency */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Queue Efficiency</p>
                <p className="text-2xl font-bold text-gray-900">{pilgrimKPIs.queueEfficiency}%</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <Activity className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-600">Optimal performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Traffic Flow</h3>
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Vehicles</span>
                <span className="font-medium">{trafficKPIs.current.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Road Capacity</span>
                <span className="font-medium">{trafficKPIs.roadCapacity.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Utilization</span>
                <span className="font-medium text-green-600">{((trafficKPIs.current / trafficKPIs.roadCapacity) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Parking Status</h3>
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Utilization</span>
                <span className="font-medium">{trafficKPIs.parkingUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${trafficKPIs.parkingUtilization}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Travel Time</span>
                <span className="font-medium">{trafficKPIs.avgTravelTime} min</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Strategic KPIs</h3>
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily Revenue</span>
                <span className="font-medium">₹{(strategicKPIs.dailyRevenue / 10000000).toFixed(1)}Cr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Growth Rate</span>
                <span className="font-medium text-green-600">+{strategicKPIs.monthlyGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Digital Adoption</span>
                <span className="font-medium">{strategicKPIs.digitalAdoption}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">High Traffic Volume Expected</p>
                <p className="text-xs text-yellow-600">AI predicts 25% increase in next 2 hours</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-800">Digital Services Performance</p>
                <p className="text-xs text-blue-600">Mobile app usage up 18% today</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <Shield className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-800">Security Systems Optimal</p>
                <p className="text-xs text-green-600">All monitoring systems functioning normally</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction Score Modal */}
      {showSatisfactionModal && (
        <SatisfactionScoreModal 
          isOpen={showSatisfactionModal}
          onClose={() => setShowSatisfactionModal(false)}
        />
      )}
    </div>
  );