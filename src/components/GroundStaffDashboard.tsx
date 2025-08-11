import React, { useState, useEffect } from 'react';
import { Users, MapPin, AlertTriangle, Radio, Activity, Zap, Target, Bell, MessageSquare, Bus, Search, Car, Eye, CheckCircle, UserCheck, X, ChevronDown, Brain } from 'lucide-react';
import ActionCenter from './ActionCenter';

const GroundStaffDashboard: React.FC = () => {
  // Pilgrim Management KPIs (Ground Staff View)
  const [pilgrimKPIs, setPilgrimKPIs] = useState({
    assignedPilgrims: 156,
    guidanceRequests: 45,
    assistanceProvided: 78,
    crowdAlerts: 12,
    queueManagement: 23
  });

  // Field Operations KPIs
  const [fieldKPIs, setFieldKPIs] = useState({
    completedTasks: 89,
    responseTime: 1.8,
    areasCovered: 8,
    emergencyAlerts: 2,
    communicationScore: 96.5,
    teamCoordination: 94.2
  });

  // Ground Staff Specific KPIs
  const [crowdKPIs, setCrowdKPIs] = useState({
    currentCrowdCount: 3247,
    densityAlerts: 4,
    highDensityZones: 2,
    averageDensity: 68.5
  });

  const [areaStatus, setAreaStatus] = useState([
    { id: 1, name: 'Main Temple Entrance', status: 'high-density', crowdCount: 892, capacity: 1000, density: 89.2, alert: true },
    { id: 2, name: 'Queue Complex A', status: 'moderate', crowdCount: 654, capacity: 800, density: 81.8, alert: false },
    { id: 3, name: 'VIP Waiting Area', status: 'normal', crowdCount: 45, capacity: 100, density: 45.0, alert: false },
    { id: 4, name: 'Rest Area 1', status: 'low', crowdCount: 123, capacity: 300, density: 41.0, alert: false },
    { id: 5, name: 'Prasadam Counter', status: 'high-density', crowdCount: 567, capacity: 600, density: 94.5, alert: true },
    { id: 6, name: 'Exit Gate B', status: 'moderate', crowdCount: 234, capacity: 400, density: 58.5, alert: false }
  ]);

  const [assignedTasks, setAssignedTasks] = useState([
    { id: 1, task: 'Crowd Control - Main Temple', priority: 'high', status: 'in-progress', assignedTime: '10:30 AM', eta: '15 min', location: 'Zone A' },
    { id: 2, task: 'Pilgrim Guidance - Queue Complex', priority: 'medium', status: 'pending', assignedTime: '11:00 AM', eta: '20 min', location: 'Zone B' },
    { id: 3, task: 'Lost Child Assistance', priority: 'high', status: 'completed', assignedTime: '09:45 AM', eta: 'Completed', location: 'Rest Area' },
    { id: 4, task: 'Elderly Support - VIP Area', priority: 'medium', status: 'in-progress', assignedTime: '11:15 AM', eta: '10 min', location: 'VIP Zone' },
    { id: 5, task: 'Queue Line Management', priority: 'low', status: 'pending', assignedTime: '11:30 AM', eta: '25 min', location: 'Queue A' }
  ]);

  const [guidanceMetrics, setGuidanceMetrics] = useState({
    activeGuidance: 23,
    completedGuidance: 67,
    languageSupport: ['Telugu', 'Tamil', 'Hindi', 'English'],
    specialAssistance: 12,
    elderlySupport: 8,
    disabilitySupport: 4
  });

  const [densityAlerts, setDensityAlerts] = useState([
    { id: 1, zone: 'Main Temple Entrance', level: 'critical', density: 89.2, time: '2 min ago', action: 'immediate' },
    { id: 2, zone: 'Prasadam Counter', level: 'high', density: 94.5, time: '5 min ago', action: 'monitor' },
    { id: 3, zone: 'Queue Complex A', level: 'moderate', density: 81.8, time: '8 min ago', action: 'watch' },
    { id: 4, zone: 'Exit Gate B', level: 'normal', density: 58.5, time: '12 min ago', action: 'none' }
  ]);

  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [whatIfScenario, setWhatIfScenario] = useState('weather-impact');
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Baseline values to show difference between current and simulation
  const [baselinePilgrimKPIs, setBaselinePilgrimKPIs] = useState<any>(null);

  // Chart filtering state
  const [chartTimePeriod, setChartTimePeriod] = useState('hourly');
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [festivalFilterEnabled, setFestivalFilterEnabled] = useState(false);
  const [selectedFestivals, setSelectedFestivals] = useState<string[]>([]);

  // TTD Festival Calendar Data
  const ttdFestivals = [
    { id: 'makar-sankranti', name: 'Makar Sankranti', date: '2025-01-14', category: 'Major', impact: 2.8 },
    { id: 'thai-pusam', name: 'Thai Pusam', date: '2025-01-28', category: 'Special', impact: 2.2 },
    { id: 'vasant-panchami', name: 'Vasant Panchami', date: '2025-02-02', category: 'Religious', impact: 1.8 },
    { id: 'maha-shivratri', name: 'Maha Shivratri', date: '2025-02-26', category: 'Major', impact: 3.5 },
    { id: 'holi', name: 'Holi', date: '2025-03-13', category: 'Cultural', impact: 2.1 },
    { id: 'ugadi', name: 'Ugadi', date: '2025-03-30', category: 'Major', impact: 4.2 },
    { id: 'rama-navami', name: 'Rama Navami', date: '2025-04-06', category: 'Major', impact: 3.8 },
    { id: 'hanuman-jayanti', name: 'Hanuman Jayanti', date: '2025-04-13', category: 'Religious', impact: 2.5 },
    { id: 'akshaya-tritiya', name: 'Akshaya Tritiya', date: '2025-05-02', category: 'Special', impact: 2.0 },
    { id: 'buddha-purnima', name: 'Buddha Purnima', date: '2025-05-12', category: 'Religious', impact: 1.6 },
    { id: 'vat-purnima', name: 'Vat Purnima', date: '2025-06-09', category: 'Cultural', impact: 1.4 },
    { id: 'guru-purnima', name: 'Guru Purnima', date: '2025-07-13', category: 'Religious', impact: 2.3 },
    { id: 'nag-panchami', name: 'Nag Panchami', date: '2025-08-01', category: 'Special', impact: 1.7 },
    { id: 'raksha-bandhan', name: 'Raksha Bandhan', date: '2025-08-09', category: 'Cultural', impact: 1.9 },
    { id: 'krishna-janmashtami', name: 'Krishna Janmashtami', date: '2025-08-16', category: 'Major', impact: 4.5 },
    { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', date: '2025-08-29', category: 'Major', impact: 5.0 },
    { id: 'pitru-paksha', name: 'Pitru Paksha', date: '2025-09-14', category: 'Religious', impact: 2.1 },
    { id: 'navaratri', name: 'Navaratri', date: '2025-10-03', category: 'Major', impact: 4.8 },
    { id: 'dussehra', name: 'Dussehra', date: '2025-10-12', category: 'Major', impact: 3.9 },
    { id: 'karva-chauth', name: 'Karva Chauth', date: '2025-10-20', category: 'Cultural', impact: 1.5 },
    { id: 'dhanteras', name: 'Dhanteras', date: '2025-10-29', category: 'Special', impact: 2.4 },
    { id: 'diwali', name: 'Diwali', date: '2025-11-01', category: 'Major', impact: 4.7 },
    { id: 'govardhan-puja', name: 'Govardhan Puja', date: '2025-11-02', category: 'Religious', impact: 2.2 },
    { id: 'bhai-dooj', name: 'Bhai Dooj', date: '2025-11-03', category: 'Cultural', impact: 1.8 },
    { id: 'guru-nanak-jayanti', name: 'Guru Nanak Jayanti', date: '2025-11-15', category: 'Religious', impact: 1.9 },
    { id: 'kartik-purnima', name: 'Kartik Purnima', date: '2025-11-16', category: 'Special', impact: 2.6 },
    { id: 'karthikai-deepam', name: 'Karthikai Deepam', date: '2025-11-29', category: 'Major', impact: 3.2 },
    { id: 'vaikunta-ekadashi', name: 'Vaikunta Ekadashi', date: '2025-12-11', category: 'Major', impact: 4.9 },
    { id: 'dhanu-masa', name: 'Dhanu Masa', date: '2025-12-16', category: 'Religious', impact: 2.8 },
    { id: 'christmas', name: 'Christmas', date: '2025-12-25', category: 'Cultural', impact: 1.3 },
    { id: 'new-year-eve', name: 'New Year Eve', date: '2025-12-31', category: 'Cultural', impact: 2.0 },
    { id: 'brahmotsavam', name: 'Annual Brahmotsavam', date: '2025-09-20', category: 'Major', impact: 5.0 },
    { id: 'pavitrotsavam', name: 'Pavitrotsavam', date: '2025-08-25', category: 'Special', impact: 3.1 }
  ];

  // Realistic Scenario State
  const [dayType, setDayType] = useState('normal-day');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);
  const [calculatedMultiplier, setCalculatedMultiplier] = useState(1.0);

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Shift', multiplier: 1.0, description: 'Standard field operations' },
    { id: 'busy-period', name: 'Busy Period', multiplier: 1.6, description: 'High pilgrim activity period' },
    { id: 'festival-rush', name: 'Festival Rush', multiplier: 2.2, description: 'Major festival crowd management' },
    { id: 'emergency-drill', name: 'Emergency Drill', multiplier: 0.3, description: 'Emergency response training' },
    { id: 'weather-alert', name: 'Weather Alert', multiplier: 0.8, description: 'Adverse weather conditions' },
    { id: 'vip-visit', name: 'VIP Visit', multiplier: 1.4, description: 'Special security protocols' }
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

    ttdSpecialDays.forEach(dayId => {
      const specialDay = ttdSpecialDaysConfig.find(d => d.id === dayId);
      if (specialDay) {
        baseMultiplier *= specialDay.multiplier;
      }
    });

    regionalFestivals.forEach(festivalId => {
      const festival = regionalFestivalsConfig.find(f => f.id === festivalId);
      if (festival) {
        baseMultiplier *= festival.multiplier;
      }
    });

    if (ttdSpecialDays.includes('vaikunta-ekadashi') && regionalFestivals.includes('telangana')) {
      baseMultiplier *= 1.15;
    }

    setCalculatedMultiplier(Math.min(baseMultiplier, 5.0));
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

  // Dynamic Chart Data Generation
  const generateWorkloadChartData = () => {
    const timePeriod = chartTimePeriod || 'hourly';
    let labels: string[] = [];
    let dataPoints = 0;

    // Generate time labels based on period
    switch(timePeriod) {
      case 'hourly':
        labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
        dataPoints = 24;
        break;
      case 'daily':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dataPoints = 7;
        break;
      case 'weekly':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        dataPoints = 4;
        break;
      case 'monthly':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dataPoints = 12;
        break;
      case 'yearly':
        labels = ['2020', '2021', '2022', '2023', '2024', '2025'];
        dataPoints = 6;
        break;
      default:
        labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
        dataPoints = 24;
    }

    // Generate base data with different patterns for different time periods
    const currentData = [];
    const predictedData = [];
    const simulationData = [];

    for (let i = 0; i < dataPoints; i++) {
      let baseValue;
      
      // Different mathematical patterns for different time periods
      switch(timePeriod) {
        case 'hourly':
          // Peak hours pattern (6-9 AM and 5-8 PM)
          baseValue = 40 + 
            (Math.sin((i - 6) * Math.PI / 6) * 15) + // Morning peak
            (Math.sin((i - 17) * Math.PI / 6) * 12) + // Evening peak
            (Math.random() * 8 - 4);
          break;
        case 'daily':
          // Weekly pattern (higher on weekends)
          baseValue = 45 + (i >= 5 ? 20 : 0) + (Math.sin(i * Math.PI / 3.5) * 10) + (Math.random() * 10 - 5);
          break;
        case 'weekly':
          // Monthly pattern (higher at month start and end)
          baseValue = 50 + (i === 0 || i === 3 ? 15 : 0) + (Math.sin(i * Math.PI / 2) * 8) + (Math.random() * 12 - 6);
          break;
        case 'monthly':
          // Seasonal pattern (higher during festival months)
          const festivalMonths = [2, 7, 9, 10]; // Mar, Aug, Oct, Nov
          baseValue = 55 + (festivalMonths.includes(i) ? 25 : 0) + (Math.sin(i * Math.PI / 6) * 15) + (Math.random() * 10 - 5);
          break;
        case 'yearly':
          // Growth trend with variations
          baseValue = 40 + (i * 5) + (Math.sin(i * Math.PI / 3) * 12) + (Math.random() * 15 - 7);
          break;
        default:
          baseValue = 45 + Math.random() * 20;
      }

      // Apply date filter if enabled
      let dateMultiplier = 1;
      if (dateFilterEnabled && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        // Adjust based on date range length
        if (daysDiff <= 7) dateMultiplier = 1.2; // Short range - higher intensity
        else if (daysDiff <= 30) dateMultiplier = 1.0; // Medium range - normal
        else dateMultiplier = 0.9; // Long range - slightly lower
      }

      // Apply festival impact if enabled
      let festivalMultiplier = 1;
      if (festivalFilterEnabled && selectedFestivals.length > 0) {
        // Calculate combined impact of selected festivals
        const totalImpact = selectedFestivals.reduce((sum, festivalId) => {
          const festival = ttdFestivals.find(f => f.id === festivalId);
          return sum + (festival ? festival.impact : 1);
        }, 0);
        festivalMultiplier = 1 + (totalImpact / selectedFestivals.length - 1) * 0.7; // Moderate the impact
      }

      // Apply scenario multiplier
      const scenarioMultiplier = calculatedMultiplier;

      const finalCurrentValue = Math.max(25, Math.min(85, baseValue * dateMultiplier * festivalMultiplier));
      const finalPredictedValue = Math.max(25, Math.min(85, finalCurrentValue * 1.15 + Math.random() * 8));
      const finalSimulationValue = Math.max(25, Math.min(85, finalCurrentValue * scenarioMultiplier));

      currentData.push(finalCurrentValue);
      predictedData.push(finalPredictedValue);
      simulationData.push(finalSimulationValue);
    }

    return { labels, currentData, predictedData, simulationData, dataPoints };
  };

  const chartData = generateWorkloadChartData();

  const handleFestivalToggle = (festivalId: string) => {
    setSelectedFestivals(prev =>
      prev.includes(festivalId)
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  const [activeAlerts, setActiveAlerts] = useState([
    { id: 1, type: 'darshan', category: 'Darshan Updates', location: 'Queue Zone A', priority: 'medium', time: '2 min ago', message: 'Darshan slot timing updated - inform waiting pilgrims', status: 'pending' },
    { id: 2, type: 'crowd', category: 'Crowd Alerts', location: 'Main Temple', priority: 'high', time: '5 min ago', message: 'High density detected, crowd control needed', status: 'pending' },
    { id: 3, type: 'shuttle', category: 'Shuttle Events', location: 'Alipiri Base', priority: 'medium', time: '8 min ago', message: 'Shuttle S-12 delayed by 15 minutes', status: 'pending' },
    { id: 4, type: 'lost-found', category: 'Lost & Found', location: 'Rest Area 3', priority: 'low', time: '12 min ago', message: 'Lost child reported - 8 year old boy in blue shirt', status: 'pending' },
    { id: 5, type: 'parking', category: 'Parking Saturation', location: 'Parking Lot A', priority: 'high', time: '15 min ago', message: 'Parking lot 95% full - redirect to Lot B', status: 'pending' }
  ]);

  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<typeof activeAlerts[0] | null>(null);
  const [selectedTriggerFilter, setSelectedTriggerFilter] = useState('all');
  const [isAreaStatusExpanded, setIsAreaStatusExpanded] = useState(false);
  const [isDensityAlertsExpanded, setIsDensityAlertsExpanded] = useState(false);
  const [showActionCenter, setShowActionCenter] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationMode) {
        const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
        const speedMultiplier = simulationSpeed;

        setPilgrimKPIs(prev => ({
          ...prev,
          assignedPilgrims: Math.max(0, prev.assignedPilgrims + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier * speedMultiplier)),
          guidanceRequests: Math.max(0, prev.guidanceRequests + Math.floor((Math.random() * 8 - 4) * scenarioMultiplier * speedMultiplier)),
          assistanceProvided: Math.max(0, prev.assistanceProvided + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier * speedMultiplier)),
          crowdAlerts: Math.max(0, prev.crowdAlerts + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier)),
          queueManagement: Math.max(0, prev.queueManagement + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier))
        }));

        setFieldKPIs(prev => ({
          ...prev,
          completedTasks: Math.max(0, prev.completedTasks + Math.floor((Math.random() * 6 - 3) * scenarioMultiplier * speedMultiplier)),
          responseTime: Math.max(0.5, Math.min(10, prev.responseTime + (Math.random() * 1 - 0.5) * scenarioMultiplier)),
          areasCovered: Math.max(1, Math.min(15, prev.areasCovered + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))),
          emergencyAlerts: Math.max(0, prev.emergencyAlerts + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier)),
          communicationScore: Math.max(80, Math.min(100, prev.communicationScore + (Math.random() * 2 - 1) * scenarioMultiplier)),
          teamCoordination: Math.max(80, Math.min(100, prev.teamCoordination + (Math.random() * 2 - 1) * scenarioMultiplier))
        }));

        // Update Ground Staff specific KPIs
        setCrowdKPIs(prev => ({
          ...prev,
          currentCrowdCount: Math.max(1000, Math.min(5000,
            prev.currentCrowdCount + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier * speedMultiplier))),
          densityAlerts: Math.max(0, Math.min(10,
            prev.densityAlerts + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))),
          averageDensity: Math.max(30, Math.min(95,
            prev.averageDensity + (Math.random() * 4 - 2) * scenarioMultiplier))
        }));

        setAreaStatus(prev => prev.map(area => ({
          ...area,
          crowdCount: Math.max(10, Math.min(area.capacity,
            area.crowdCount + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier * speedMultiplier))),
          density: Math.max(20, Math.min(100,
            (area.crowdCount / area.capacity) * 100 + (Math.random() * 6 - 3)))
        })));

        // Update guidance metrics
        setGuidanceMetrics(prev => ({
          ...prev,
          activeGuidance: Math.max(0, Math.min(50,
            prev.activeGuidance + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          completedGuidance: prev.completedGuidance + Math.floor((Math.random() * 3) * scenarioMultiplier),
          specialAssistance: Math.max(0, Math.min(20,
            prev.specialAssistance + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier)))
        }));

        // Update density alerts
        setDensityAlerts(prev => {
          const newAlerts = [...prev];
          if (Math.random() < 0.3 * scenarioMultiplier) {
            // Add new alert
            const zones = ['Main Temple Entrance', 'Prasadam Counter', 'Queue Complex A', 'Exit Gate B', 'Rest Area'];
            const levels = ['normal', 'moderate', 'high', 'critical'];
            const actions = ['none', 'watch', 'monitor', 'immediate'];
            const newAlert = {
              id: Date.now(),
              zone: zones[Math.floor(Math.random() * zones.length)],
              level: levels[Math.floor(Math.random() * levels.length)],
              density: Math.floor(Math.random() * 40) + 60,
              time: 'Just now',
              action: actions[Math.floor(Math.random() * actions.length)]
            };
            newAlerts.push(newAlert);
          }
          // Remove old alerts occasionally
          if (Math.random() < 0.2 && newAlerts.length > 0) {
            newAlerts.shift();
          }
          return newAlerts.slice(0, 10); // Keep max 10 alerts
        });

        // Update assigned tasks occasionally
        if (Math.random() < 0.1) {
          setAssignedTasks(prev => prev.map(task => {
            if (task.status === 'pending' && Math.random() < 0.3) {
              return { ...task, status: 'in-progress' };
            }
            if (task.status === 'in-progress' && Math.random() < 0.2) {
              return { ...task, status: 'completed' };
            }
            return task;
          }));
        }
      }
    }, simulationMode ? 1800000 : 4000); // 1800000ms = 30 minutes for simulation updates

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, whatIfScenario]);

  const runFieldAnalysis = () => {
    // Capture baseline values when starting simulation
    if (!simulationMode) {
      setBaselinePilgrimKPIs({
        assignedPilgrims: pilgrimKPIs.assignedPilgrims,
        guidanceRequests: pilgrimKPIs.guidanceRequests,
        assistanceProvided: pilgrimKPIs.assistanceProvided,
        crowdAlerts: pilgrimKPIs.crowdAlerts,
        queueManagement: pilgrimKPIs.queueManagement
      });
    }

    // Auto-stop simulation after 30 minutes (1800000 milliseconds)
    if (!simulationMode) {
      setTimeout(() => {
        setSimulationMode(false);
        setBaselinePilgrimKPIs(null);
        console.log('Ground Staff Simulation auto-stopped after 30 minutes');
      }, 1800000); // 30 minutes = 30 * 60 * 1000 = 1800000 milliseconds
    }

    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);
    const finalMultiplier = scenario!.multiplier * calculatedMultiplier;
    const projectedWorkload = Math.floor(pilgrimKPIs.assignedPilgrims * finalMultiplier);
    const projectedTasks = Math.floor(pilgrimKPIs.guidanceRequests * finalMultiplier);
    const projectedResponseTime = fieldKPIs.responseTime * (finalMultiplier > 1 ? finalMultiplier * 0.8 : 1);
    const workloadStrain = Math.min(100, (projectedWorkload / 200) * 100);

    setSimulationResults({
      scenario: scenario!.name,
      dayType: dayTypes.find(d => d.id === dayType)?.name,
      calculatedMultiplier,
      projectedWorkload,
      projectedTasks,
      projectedResponseTime,
      workloadStrain,
      fieldRecommendations: getFieldRecommendations(finalMultiplier, workloadStrain)
    });
  };

  const getFieldRecommendations = (multiplier: number, strain: number) => {
    const recommendations = [];
    if (multiplier > 2) recommendations.push('Request additional ground staff');
    if (multiplier > 1.5) recommendations.push('Prioritize high-impact assistance');
    if (strain > 80) recommendations.push('Focus on crowd management');
    if (multiplier < 0.5) recommendations.push('Conduct training and maintenance');
    if (strain > 90) recommendations.push('Escalate to operational command');
    return recommendations;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'darshan': return <Bell className="w-4 h-4" />;
      case 'crowd': return <Users className="w-4 h-4" />;
      case 'shuttle': return <Bus className="w-4 h-4" />;
      case 'lost-found': return <Search className="w-4 h-4" />;
      case 'parking': return <Car className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'darshan': return 'text-yellow-600 bg-yellow-100';
      case 'crowd': return 'text-red-600 bg-red-100';
      case 'shuttle': return 'text-orange-600 bg-orange-100';
      case 'lost-found': return 'text-purple-600 bg-purple-100';
      case 'parking': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'high-density': return 'bg-red-400';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'normal': return 'bg-green-500';
      case 'low': return 'bg-green-400';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDensityLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTriggerAction = (triggerId: number, action: 'acknowledge' | 'delegate') => {
    setActiveAlerts(prev => prev.map(alert =>
      alert.id === triggerId
        ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : 'delegated' }
        : alert
    ));
    setShowTriggerModal(false);
    setSelectedTrigger(null);
  };

  const openTriggerModal = (trigger: typeof activeAlerts[0]) => {
    setSelectedTrigger(trigger);
    setShowTriggerModal(true);
  };

  const filteredAlerts = selectedTriggerFilter === 'all'
    ? activeAlerts.filter(alert => alert.status === 'pending')
    : activeAlerts.filter(alert => alert.type === selectedTriggerFilter && alert.status === 'pending');

  return (
    <div className="max-w-full mx-auto">
      {/* Ground Staff Command Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white p-6 mb-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ground Staff Command Center</h1>
            <p className="text-green-100">Real-time field operations and direct pilgrim assistance</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-green-200">Field Status</div>
              <div className="text-lg font-bold">All Teams Active</div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Unified Field Operations Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Field Performance Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Team Performance</h3>
                <p className="text-sm text-gray-600">Today's metrics</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Tasks Completed</p>
                    <p className="text-2xl font-bold text-green-800">{fieldKPIs.completedTasks}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Today</p>
                    <p className="text-sm font-bold text-green-700">Excellent</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold text-yellow-800">{fieldKPIs.responseTime.toFixed(1)} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">Average</p>
                    <p className="text-sm font-bold text-yellow-700">Good</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Areas Covered</p>
                    <p className="text-2xl font-bold text-purple-800">{fieldKPIs.areasCovered}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Active zones</p>
                    <p className="text-sm font-bold text-purple-700">Full</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crowd Monitoring Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Crowd Monitoring</h3>
                <p className="text-sm text-gray-600">Real-time crowd data</p>
              </div>
            </div>

            {/* Crowd Metrics */}
            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">Current Crowd {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-red-800">{crowdKPIs.currentCrowdCount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">In my areas</p>
                    <p className="text-sm font-bold text-red-700">Active</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Density Alerts</p>
                    <p className="text-2xl font-bold text-orange-800">{crowdKPIs.densityAlerts}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-600">Active</p>
                    <p className="text-sm font-bold text-orange-700">Monitor</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Avg Density</p>
                    <p className="text-2xl font-bold text-yellow-800">{crowdKPIs.averageDensity.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">My zones</p>
                    <p className="text-sm font-bold text-yellow-700">Normal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Tasks Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Team Tasks</h3>
                <p className="text-sm text-gray-600">{assignedTasks.filter(t => t.status !== 'completed').length} active tasks</p>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {assignedTasks.slice(0, 3).map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${getTaskStatusColor(task.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{task.task}</span>
                    <span className={`text-xs px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-xs opacity-80 mb-1">{task.location}</div>
                  <div className="flex justify-between text-xs">
                    <span>Assigned: {task.assignedTime}</span>
                    <span className="font-semibold">ETA: {task.eta}</span>
                  </div>
                </div>
              ))}

              {assignedTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Guidance Metrics Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Guidance Support</h3>
                <p className="text-sm text-gray-600">Pilgrim assistance</p>
              </div>
            </div>

            {/* Guidance Metrics */}
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Active Guidance</p>
                    <p className="text-2xl font-bold text-purple-800">{guidanceMetrics.activeGuidance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Current</p>
                    <p className="text-sm font-bold text-purple-700">Helping</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">Completed Today</p>
                    <p className="text-2xl font-bold text-green-800">{guidanceMetrics.completedGuidance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">Pilgrims</p>
                    <p className="text-sm font-bold text-green-700">Helped</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Special Assistance</p>
                    <p className="text-2xl font-bold text-blue-800">{guidanceMetrics.specialAssistance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Elderly/Disabled</p>
                    <p className="text-sm font-bold text-blue-700">Priority</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Triggers Panel - Enhanced */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Active Triggers</h3>
                  <p className="text-sm text-gray-600">{filteredAlerts.length} pending actions</p>
                </div>
              </div>
              <button
                onClick={() => setShowTriggerModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-lg transition-colors"
              >
                View All
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedTriggerFilter('all')}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedTriggerFilter === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                All ({activeAlerts.filter(a => a.status === 'pending').length})
              </button>
              {[
                { id: 'darshan', name: 'Darshan', color: 'yellow' },
                { id: 'crowd', name: 'Crowd', color: 'red' },
                { id: 'shuttle', name: 'Shuttle', color: 'orange' },
                { id: 'lost-found', name: 'Lost', color: 'purple' },
                { id: 'parking', name: 'Parking', color: 'blue' }
              ].map(category => {
                const count = activeAlerts.filter(a => a.type === category.id && a.status === 'pending').length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedTriggerFilter(category.id)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${selectedTriggerFilter === category.id
                      ? `bg-${category.color}-500 text-white`
                      : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                      }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Trigger List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredAlerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  onClick={() => openTriggerModal(alert)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${getPriorityColor(alert.priority)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getTypeColor(alert.type)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <span className="font-semibold text-sm capitalize">{alert.type.replace('-', ' ')}</span>
                    </div>
                    <span className="text-xs">{alert.time}</span>
                  </div>
                  <div className="text-xs opacity-80 mb-1">{alert.location}</div>
                  <div className="text-sm">{alert.message}</div>
                  <div className="text-xs text-gray-500 mt-2">Click to manage →</div>
                </div>
              ))}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active triggers</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Area-wise Status & Crowd Density Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Area-wise Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div 
              className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsAreaStatusExpanded(!isAreaStatusExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-3 rounded-xl text-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Area-wise Status</h3>
              </div>
              <ChevronDown 
                className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                  isAreaStatusExpanded ? 'rotate-180' : ''
                }`} 
              />
            </div>

            {isAreaStatusExpanded && (
              <div className="p-6 pt-0 space-y-4">
                {areaStatus.map(area => (
                  <div key={area.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(area.status)}`}></div>
                        <span className="font-semibold text-gray-800">{area.name}</span>
                        {area.alert && (
                          <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                            Alert
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        {area.density.toFixed(1)}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Occupancy</span>
                        <span className="font-semibold">{area.crowdCount}/{area.capacity}</span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${area.density >= 90 ? 'bg-red-500' :
                            area.density >= 70 ? 'bg-yellow-500' :
                              area.density >= 50 ? 'bg-orange-500' :
                                'bg-green-500'
                            }`}
                          style={{ width: `${area.density}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between text-xs text-gray-600">
                        <span className="capitalize">{area.status.replace('-', ' ')}</span>
                        <span>{(area.capacity - area.crowdCount)} available</span>
                      </div>
                    </div>

                    {area.alert && (
                      <button className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors">
                        Take Action
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Crowd Density Alerts */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div 
              className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setIsDensityAlertsExpanded(!isDensityAlertsExpanded)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl text-white">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Density Alerts</h3>
              </div>
              <ChevronDown 
                className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                  isDensityAlertsExpanded ? 'rotate-180' : ''
                }`} 
              />
            </div>

            {isDensityAlertsExpanded && (
              <div className="p-6 pt-0">
                <div className="space-y-3">
                  {densityAlerts.map(alert => (
                    <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getDensityLevelColor(alert.level)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{alert.zone}</span>
                        <span className="text-xs">{alert.time}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Density: {alert.density}%</span>
                        <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${alert.level === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.level === 'high' ? 'bg-orange-100 text-orange-800' :
                            alert.level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                          }`}>
                          {alert.level}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 capitalize">Action: {alert.action}</span>
                        {alert.level === 'critical' && (
                          <button className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors">
                            Respond Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <Eye className="w-4 h-4" />
                    <span className="font-semibold text-sm">Monitoring Guidelines:</span>
                  </div>
                  <ul className="text-amber-700 text-xs mt-2 space-y-1">
                    <li>• Critical (90%+): Immediate crowd control needed</li>
                    <li>• High (80-89%): Enhanced monitoring required</li>
                    <li>• Moderate (70-79%): Watch for escalation</li>
                    <li>• Normal (&lt;70%): Standard operations</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Field Operations Summary */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 border border-green-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Field Operations Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Current Assignments</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {crowdKPIs.currentCrowdCount.toLocaleString()} people in monitored areas</li>
                <li>• {fieldKPIs.areasCovered} zones actively monitored</li>
                <li>• {fieldKPIs.emergencyAlerts} emergency alerts active</li>
                <li>• {guidanceMetrics.activeGuidance} pilgrims receiving guidance</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Performance Metrics</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Response time: {fieldKPIs.responseTime.toFixed(1)} minutes</li>
                <li>• Communication score: {fieldKPIs.communicationScore.toFixed(1)}%</li>
                <li>• Team coordination: {fieldKPIs.teamCoordination.toFixed(1)}%</li>
                <li>• Tasks completed: {fieldKPIs.completedTasks}</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Support Services</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Special assistance: {guidanceMetrics.specialAssistance} cases</li>
                <li>• Language support: {guidanceMetrics.languageSupport.length} languages</li>
                <li>• Elderly support: {guidanceMetrics.elderlySupport} cases</li>
                <li>• Disability support: {guidanceMetrics.disabilitySupport} cases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Management Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Active Triggers Management</h2>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedTriggerFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${selectedTriggerFilter === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  All ({activeAlerts.filter(a => a.status === 'pending').length})
                </button>
                {[
                  { id: 'darshan', name: 'Darshan Updates', color: 'yellow' },
                  { id: 'crowd', name: 'Crowd Alerts', color: 'red' },
                  { id: 'shuttle', name: 'Shuttle Events', color: 'orange' },
                  { id: 'lost-found', name: 'Lost & Found', color: 'purple' },
                  { id: 'parking', name: 'Parking Saturation', color: 'blue' }
                ].map(category => {
                  const count = activeAlerts.filter(a => a.type === category.id && a.status === 'pending').length;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedTriggerFilter(category.id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${selectedTriggerFilter === category.id
                        ? `bg-${category.color}-500 text-white`
                        : `bg-${category.color}-100 text-${category.color}-700 hover:bg-${category.color}-200`
                        }`}
                    >
                      {category.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Trigger List */}
              <div className="space-y-4">
                {filteredAlerts.map(alert => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${getPriorityColor(alert.priority)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded ${getTypeColor(alert.type)}`}>
                          {getTypeIcon(alert.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold capitalize">{alert.type.replace('-', ' ')}</h4>
                          <p className="text-sm opacity-80">{alert.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs">{alert.time}</span>
                        <div className={`text-xs px-2 py-1 rounded mt-1 ${alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {alert.priority} priority
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1">Location: {alert.location}</p>
                      <p className="text-sm">{alert.message}</p>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleTriggerAction(alert.id, 'acknowledge')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleTriggerAction(alert.id, 'delegate')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                      >
                        <UserCheck className="w-4 h-4 inline mr-2" />
                        Delegate
                      </button>
                    </div>
                  </div>
                ))}

                {filteredAlerts.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active triggers in this category</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Center Modal */}
      {showActionCenter && (
        <ActionCenter
          onClose={() => setShowActionCenter(false)}
          userRole="ground-staff"
          simulationMode={simulationMode}
          setSimulationMode={setSimulationMode}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          whatIfScenario={whatIfScenario}
          setWhatIfScenario={setWhatIfScenario}
          whatIfScenarios={whatIfScenarios}
          runAnalysis={runFieldAnalysis}
          simulationResults={simulationResults}
          dayType={dayType}
          setDayType={setDayType}
          dayTypes={dayTypes}
          ttdSpecialDays={ttdSpecialDays}
          handleTtdSpecialDayToggle={handleTtdSpecialDayToggle}
          ttdSpecialDaysConfig={ttdSpecialDaysConfig}
          regionalFestivals={regionalFestivals}
          handleRegionalFestivalToggle={handleRegionalFestivalToggle}
          regionalFestivalsConfig={regionalFestivalsConfig}
          calculatedMultiplier={calculatedMultiplier}
          chartTimePeriod={chartTimePeriod}
          setChartTimePeriod={setChartTimePeriod}
          dateFilterEnabled={dateFilterEnabled}
          setDateFilterEnabled={setDateFilterEnabled}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          festivalFilterEnabled={festivalFilterEnabled}
          setFestivalFilterEnabled={setFestivalFilterEnabled}
          selectedFestivals={selectedFestivals}
          handleFestivalToggle={handleFestivalToggle}
          ttdFestivals={ttdFestivals}
          chartData={chartData}
          baselineKPIs={baselinePilgrimKPIs}
          currentKPIs={pilgrimKPIs}
        />
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowActionCenter(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-40"
      >
        <Brain className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GroundStaffDashboard;
                