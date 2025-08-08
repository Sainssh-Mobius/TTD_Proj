import React, { useState, useEffect } from 'react';
import { Settings, Users, Car, AlertTriangle, Activity, Clock, MapPin, Shield, Zap, Target, BarChart3, TrendingUp, Brain } from 'lucide-react';
import VIPMovementModal from './VIPMovementModal';
import ActionCenter from './ActionCenter';

const OperationalDashboard: React.FC = () => {
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [showActionCenter, setShowActionCenter] = useState(false);
  
  // Pilgrim Management KPIs
  const [pilgrimKPIs, setPilgrimKPIs] = useState({
    currentPilgrims: 45632,
    aiPredictedPeak: 52000,
    queueWaitTime: 35,
    darshanSlots: 2156,
    queueEfficiency: 87.3,
    crowdDensity: 78.5
  });

  // Traffic Management KPIs
  const [trafficKPIs, setTrafficKPIs] = useState({
    currentVehicles: 1247,
    aiPredictedPeak: 1650,
    avgTravelTime: 72,
    parkingUtilization: 78.5,
    shuttleServices: 24,
    trafficFlow: 92.3
  });

  // Operational KPIs
  const [operationalKPIs, setOperationalKPIs] = useState({
    staffUtilization: 87.3,
    systemUptime: 99.8,
    incidentResponse: 2.3,
    emergencyUnits: 12,
    volunteerCount: 156,
    facilitiesStatus: 98.2
  });

  // Zone-level Operations Data
  const [zoneOperations, setZoneOperations] = useState([
    { id: 1, name: 'Main Temple Complex', currentCount: 8456, capacity: 12000, status: 'normal', incidents: 0, staffOnDuty: 45 },
    { id: 2, name: 'Queue Complex A', currentCount: 3247, capacity: 4000, status: 'high', incidents: 1, staffOnDuty: 28 },
    { id: 3, name: 'Queue Complex B', currentCount: 2156, capacity: 3500, status: 'normal', incidents: 0, staffOnDuty: 22 },
    { id: 4, name: 'VIP Darshan Area', currentCount: 156, capacity: 300, status: 'normal', incidents: 0, staffOnDuty: 12 },
    { id: 5, name: 'Alipiri Base Complex', currentCount: 1847, capacity: 2500, status: 'normal', incidents: 0, staffOnDuty: 18 },
    { id: 6, name: 'Parking & Transport', currentCount: 2341, capacity: 5000, status: 'moderate', incidents: 2, staffOnDuty: 35 }
  ]);

  // Queue Complex Data
  const [queueComplexes, setQueueComplexes] = useState([
    { id: 1, name: 'Compartment 1', occupancy: 89, capacity: 500, eta: 45, status: 'active' },
    { id: 2, name: 'Compartment 2', occupancy: 76, capacity: 500, eta: 38, status: 'active' },
    { id: 3, name: 'Compartment 3', occupancy: 92, capacity: 500, eta: 52, status: 'high' },
    { id: 4, name: 'Compartment 4', occupancy: 67, capacity: 500, eta: 32, status: 'active' },
    { id: 5, name: 'VIP Queue', occupancy: 45, capacity: 100, eta: 15, status: 'normal' }
  ]);

  // VIP Movement Tracking
  const [vipMovement, setVipMovement] = useState({
    currentVIPs: 23,
    scheduledArrivals: 8,
    inTransit: 5,
    completedDarshan: 12,
    securityLevel: 'high',
    protocolActive: true
  });

  // Entry/Exit Gate Status
  const [gateStatus, setGateStatus] = useState([
    { id: 1, name: 'Main Entry Gate', status: 'open', throughput: 156, capacity: 200, waitTime: 8 },
    { id: 2, name: 'VIP Entry Gate', status: 'controlled', throughput: 23, capacity: 50, waitTime: 2 },
    { id: 3, name: 'Exit Gate A', status: 'open', throughput: 134, capacity: 180, waitTime: 5 },
    { id: 4, name: 'Exit Gate B', status: 'open', throughput: 98, capacity: 150, waitTime: 3 },
    { id: 5, name: 'Emergency Gate', status: 'standby', throughput: 0, capacity: 100, waitTime: 0 }
  ]);

  // Staff Status by Department
  const [staffStatus, setStaffStatus] = useState([
    { department: 'Security', onDuty: 45, total: 50, efficiency: 94.2 },
    { department: 'Queue Management', onDuty: 28, total: 32, efficiency: 91.8 },
    { department: 'VIP Protocol', onDuty: 12, total: 15, efficiency: 96.5 },
    { department: 'Crowd Control', onDuty: 35, total: 40, efficiency: 89.3 },
    { department: 'Emergency Response', onDuty: 18, total: 20, efficiency: 97.1 }
  ]);

  // Zone Incidents
  const [zoneIncidents, setZoneIncidents] = useState([
    { id: 1, zone: 'Queue Complex A', type: 'Medical', severity: 'medium', time: '10 min ago', status: 'responding' },
    { id: 2, zone: 'Parking Area', type: 'Traffic', severity: 'low', time: '25 min ago', status: 'resolved' },
    { id: 3, zone: 'Main Temple', type: 'Lost Child', severity: 'high', time: '5 min ago', status: 'active' }
  ]);

  const [simulationMode, setSimulationMode] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [whatIfScenario, setWhatIfScenario] = useState('weather-impact');
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Realistic Scenario State
  const [dayType, setDayType] = useState('normal-day');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);

  // Chart and Filter State
  const [chartTimePeriod, setChartTimePeriod] = useState('hourly');
  const [dateFilterEnabled, setDateFilterEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [festivalFilterEnabled, setFestivalFilterEnabled] = useState(false);
  const [selectedFestivals, setSelectedFestivals] = useState<string[]>([]);

  // TTD Festival Calendar 2025
  const ttdFestivals = [
    { id: 'vaikunta-ekadashi', name: 'Vaikunta Ekadashi', date: '2025-01-10', category: 'Major', impact: 5.0 },
    { id: 'makara-sankranti', name: 'Makara Sankranti', date: '2025-01-14', category: 'Special', impact: 2.5 },
    { id: 'thai-pusam', name: 'Thai Pusam', date: '2025-01-21', category: 'Religious', impact: 2.0 },
    { id: 'vasant-panchami', name: 'Vasant Panchami', date: '2025-02-02', category: 'Cultural', impact: 1.5 },
    { id: 'maha-shivaratri', name: 'Maha Shivaratri', date: '2025-02-26', category: 'Major', impact: 4.0 },
    { id: 'holi', name: 'Holi Festival', date: '2025-03-14', category: 'Cultural', impact: 1.8 },
    { id: 'ugadi', name: 'Ugadi (Telugu New Year)', date: '2025-03-30', category: 'Special', impact: 3.5 },
    { id: 'sri-rama-navami', name: 'Sri Rama Navami', date: '2025-04-06', category: 'Major', impact: 4.5 },
    { id: 'hanuman-jayanti', name: 'Hanuman Jayanti', date: '2025-04-13', category: 'Religious', impact: 2.8 },
    { id: 'akshaya-tritiya', name: 'Akshaya Tritiya', date: '2025-05-01', category: 'Special', impact: 2.2 },
    { id: 'narasimha-jayanti', name: 'Narasimha Jayanti', date: '2025-05-12', category: 'Major', impact: 3.8 },
    { id: 'vat-purnima', name: 'Vat Purnima', date: '2025-06-09', category: 'Cultural', impact: 1.6 },
    { id: 'guru-purnima', name: 'Guru Purnima', date: '2025-07-13', category: 'Religious', impact: 2.3 },
    { id: 'nag-panchami', name: 'Nag Panchami', date: '2025-08-01', category: 'Cultural', impact: 1.7 },
    { id: 'raksha-bandhan', name: 'Raksha Bandhan', date: '2025-08-09', category: 'Cultural', impact: 1.4 },
    { id: 'krishna-janmashtami', name: 'Krishna Janmashtami', date: '2025-08-16', category: 'Major', impact: 4.2 },
    { id: 'gowri-ganesha', name: 'Gowri Ganesha Festival', date: '2025-08-27', category: 'Major', impact: 4.8 },
    { id: 'onam', name: 'Onam Festival', date: '2025-09-05', category: 'Cultural', impact: 2.1 },
    { id: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', date: '2025-08-29', category: 'Major', impact: 4.6 },
    { id: 'pitru-paksha', name: 'Pitru Paksha', date: '2025-09-14', category: 'Religious', impact: 2.7 },
    { id: 'navaratri', name: 'Navaratri Festival', date: '2025-09-21', category: 'Major', impact: 4.3 },
    { id: 'dussehra', name: 'Dussehra (Vijayadashami)', date: '2025-10-02', category: 'Major', impact: 4.7 },
    { id: 'karva-chauth', name: 'Karva Chauth', date: '2025-10-17', category: 'Cultural', impact: 1.5 },
    { id: 'dhanteras', name: 'Dhanteras', date: '2025-10-29', category: 'Special', impact: 2.4 },
    { id: 'diwali', name: 'Diwali (Deepavali)', date: '2025-11-01', category: 'Major', impact: 4.9 },
    { id: 'bhai-dooj', name: 'Bhai Dooj', date: '2025-11-03', category: 'Cultural', impact: 1.6 },
    { id: 'tulsi-vivah', name: 'Tulsi Vivah', date: '2025-11-13', category: 'Religious', impact: 2.0 },
    { id: 'karthikai-deepam', name: 'Karthikai Deepam', date: '2025-11-15', category: 'Special', impact: 3.2 },
    { id: 'guru-nanak-jayanti', name: 'Guru Nanak Jayanti', date: '2025-11-24', category: 'Religious', impact: 1.8 },
    { id: 'ayyappa-mandalam', name: 'Ayyappa Mandalam', date: '2025-11-16', category: 'Special', impact: 2.6 },
    { id: 'mokshada-ekadashi', name: 'Mokshada Ekadashi', date: '2025-12-10', category: 'Religious', impact: 3.1 },
    { id: 'christmas', name: 'Christmas', date: '2025-12-25', category: 'Cultural', impact: 1.3 },
    { id: 'new-year-eve', name: 'New Year Eve', date: '2025-12-31', category: 'Cultural', impact: 1.9 }
  ];
  const [calculatedMultiplier, setCalculatedMultiplier] = useState(1.0);

  const whatIfScenarios = [
    { id: 'normal', name: 'Normal Operations', multiplier: 1.0, description: 'Standard operational parameters' },
    { id: 'peak-hours', name: 'Peak Hours', multiplier: 1.8, description: 'Morning & evening rush periods' },
    { id: 'festival-day', name: 'Festival Day', multiplier: 2.5, description: 'Major festival operations' },
    { id: 'weather-impact', name: 'Adverse Weather', multiplier: 0.7, description: 'Rain/storm operational impact' },
    { id: 'maintenance-mode', name: 'Maintenance Window', multiplier: 0.4, description: 'Scheduled maintenance operations' },
    { id: 'emergency-response', name: 'Emergency Protocol', multiplier: 0.2, description: 'Emergency response scenario' }
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

  const handleFestivalToggle = (festivalId: string) => {
    setSelectedFestivals(prev =>
      prev.includes(festivalId)
        ? prev.filter(id => id !== festivalId)
        : [...prev, festivalId]
    );
  };

  // Dynamic Chart Data Generation
  const generateOperationalChartData = () => {
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

    // Generate base data
    const currentData = [];
    const predictedData = [];
    const simulationData = [];

    for (let i = 0; i < dataPoints; i++) {
      let baseValue;
      
      // Different patterns for different time periods
      switch(timePeriod) {
        case 'hourly':
          baseValue = 35 + Math.sin(i * 0.5) * 25 + Math.sin((i - 6) * Math.PI / 6) * 15;
          break;
        case 'daily':
          baseValue = 45 + (i >= 5 ? 20 : 0) + Math.sin(i * Math.PI / 3.5) * 10;
          break;
        case 'weekly':
          baseValue = 50 + (i === 0 || i === 3 ? 15 : 0) + Math.sin(i * Math.PI / 2) * 8;
          break;
        case 'monthly':
          const festivalMonths = [2, 7, 9, 10];
          baseValue = 55 + (festivalMonths.includes(i) ? 25 : 0) + Math.sin(i * Math.PI / 6) * 15;
          break;
        case 'yearly':
          baseValue = 40 + (i * 5) + Math.sin(i * Math.PI / 3) * 12;
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
        
        if (daysDiff <= 7) dateMultiplier = 1.2;
        else if (daysDiff <= 30) dateMultiplier = 1.0;
        else dateMultiplier = 0.9;
      }

      // Apply festival impact if enabled
      let festivalMultiplier = 1;
      if (festivalFilterEnabled && selectedFestivals.length > 0) {
        const totalImpact = selectedFestivals.reduce((sum, festivalId) => {
          const festival = ttdFestivals.find(f => f.id === festivalId);
          return sum + (festival ? festival.impact : 1);
        }, 0);
        festivalMultiplier = 1 + (totalImpact / selectedFestivals.length - 1) * 0.7;
      }

      const scenarioMultiplier = calculatedMultiplier;

      const finalCurrentValue = Math.max(20, Math.min(90, baseValue * dateMultiplier * festivalMultiplier));
      const finalPredictedValue = Math.max(20, Math.min(90, finalCurrentValue * 1.15 + Math.random() * 8));
      const finalSimulationValue = Math.max(20, Math.min(90, finalCurrentValue * scenarioMultiplier));

      currentData.push(finalCurrentValue);
      predictedData.push(finalPredictedValue);
      simulationData.push(finalSimulationValue);
    }

    return { labels, currentData, predictedData, simulationData, dataPoints };
  };

  const chartData = generateOperationalChartData();

  useEffect(() => {
    const interval = setInterval(() => {
      if (simulationMode) {
        const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
        const speedMultiplier = simulationSpeed;
        
        setPilgrimKPIs(prev => ({
          ...prev,
          currentPilgrims: Math.max(0, prev.currentPilgrims + Math.floor((Math.random() * 200 - 100) * scenarioMultiplier * speedMultiplier)),
          aiPredictedPeak: Math.max(prev.currentPilgrims, prev.aiPredictedPeak + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier)),
          queueWaitTime: Math.max(5, Math.min(120, prev.queueWaitTime + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier))),
          darshanSlots: Math.max(0, prev.darshanSlots + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier)),
          queueEfficiency: Math.max(60, Math.min(100, prev.queueEfficiency + (Math.random() * 4 - 2) * scenarioMultiplier)),
          crowdDensity: Math.max(40, Math.min(100, prev.crowdDensity + (Math.random() * 6 - 3) * scenarioMultiplier))
        }));

        setTrafficKPIs(prev => ({
          ...prev,
          currentVehicles: Math.max(0, prev.currentVehicles + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier * speedMultiplier)),
          aiPredictedPeak: Math.max(prev.currentVehicles, prev.aiPredictedPeak + Math.floor((Math.random() * 30 - 15) * scenarioMultiplier)),
          avgTravelTime: Math.max(15, Math.min(60, prev.avgTravelTime + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          parkingUtilization: Math.max(40, Math.min(100, prev.parkingUtilization + (Math.random() * 6 - 3) * scenarioMultiplier)),
          shuttleServices: Math.max(10, Math.min(40, prev.shuttleServices + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          trafficFlow: Math.max(60, Math.min(100, prev.trafficFlow + (Math.random() * 2 - 1) * scenarioMultiplier))
        }));

        setOperationalKPIs(prev => ({
          ...prev,
          staffUtilization: Math.max(60, Math.min(100, prev.staffUtilization + (Math.random() * 4 - 2) * scenarioMultiplier)),
          systemUptime: Math.max(95, Math.min(100, prev.systemUptime + (Math.random() * 0.4 - 0.2))),
          incidentResponse: Math.max(1, Math.min(10, prev.incidentResponse + (Math.random() * 1 - 0.5) * scenarioMultiplier)),
          emergencyUnits: Math.max(8, Math.min(20, prev.emergencyUnits + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))),
          volunteerCount: Math.max(100, Math.min(250, prev.volunteerCount + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier)))
        }));

        // Update zone operations
        setZoneOperations(prev => prev.map(zone => ({
          ...zone,
          currentCount: Math.max(0, Math.min(zone.capacity, 
            zone.currentCount + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier * speedMultiplier))),
          incidents: Math.max(0, zone.incidents + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier))
        })));

        // Update queue complexes
        setQueueComplexes(prev => prev.map(queue => ({
          ...queue,
          occupancy: Math.max(30, Math.min(100, 
            queue.occupancy + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier))),
          eta: Math.max(10, Math.min(90, 
            queue.eta + Math.floor((Math.random() * 8 - 4) * scenarioMultiplier)))
        })));

        // Update VIP movement
        setVipMovement(prev => ({
          ...prev,
          currentVIPs: Math.max(0, Math.min(50, prev.currentVIPs + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          inTransit: Math.max(0, Math.min(20, prev.inTransit + Math.floor((Math.random() * 2 - 1) * scenarioMultiplier)))
        }));

        // Update gate status
        setGateStatus(prev => prev.map(gate => ({
          ...gate,
          throughput: Math.max(0, Math.min(gate.capacity, 
            gate.throughput + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier))),
          waitTime: Math.max(0, Math.min(30, 
            gate.waitTime + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier)))
        })));
      }
    }, simulationMode ? 1800000 : 3000); // 1800000ms = 30 minutes for simulation updates

    return () => clearInterval(interval);
  }, [simulationMode, simulationSpeed, whatIfScenario]);

  const runOperationalAnalysis = () => {
    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);
    const finalMultiplier = scenario!.multiplier * calculatedMultiplier;
    const projectedPilgrims = Math.floor(pilgrimKPIs.currentPilgrims * finalMultiplier);
    const projectedVehicles = Math.floor(trafficKPIs.currentVehicles * finalMultiplier);
    const projectedWaitTime = Math.floor(pilgrimKPIs.queueWaitTime * (finalMultiplier > 1 ? finalMultiplier : 1));
    const resourceStrain = Math.min(100, (projectedPilgrims / 75000) * 100);
    
    let overbookingRisk = 0;
    if (ttdSpecialDays.includes('vaikunta-ekadashi') && regionalFestivals.length > 0) {
      overbookingRisk = 25;
    }
    
    setSimulationResults({
      scenario: scenario!.name,
      dayType: dayTypes.find(d => d.id === dayType)?.name,
      calculatedMultiplier,
      projectedPilgrims,
      projectedVehicles,
      projectedWaitTime,
      resourceStrain,
      overbookingRisk,
      operationalRecommendations: getOperationalRecommendations(finalMultiplier, resourceStrain, overbookingRisk)
    });
  };

  const getOperationalRecommendations = (multiplier: number, strain: number, overbookingRisk: number) => {
    const recommendations = [];
    if (multiplier > 2) recommendations.push('Activate all backup systems');
    if (multiplier > 1.5) recommendations.push('Deploy additional staff');
    if (strain > 80) recommendations.push('Implement crowd control measures');
    if (multiplier < 0.5) recommendations.push('Scale down non-essential operations');
    if (strain > 90) recommendations.push('Consider entry restrictions');
    if (overbookingRisk > 20) recommendations.push('Monitor slot allocation closely');
    if (dayType === 'rainy-day') recommendations.push('Activate weather protocols');
    return recommendations;
  };

  const getStatusColor = (value: number, thresholds: {good: number, warning: number}) => {
    if (value >= thresholds.good) return 'text-green-600';
    if (value >= thresholds.warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGateStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'controlled': return 'bg-yellow-500';
      case 'closed': return 'bg-red-500';
      case 'standby': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy >= 90) return 'bg-red-500';
    if (occupancy >= 75) return 'bg-yellow-500';
    if (occupancy >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Operational Command Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 mb-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Operational Command Center</h1>
            <p className="text-blue-100">Real-time operations management and resource coordination</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm text-blue-200">Current Status</div>
              <div className="text-lg font-bold">All Systems Active</div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <Settings className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Unified Operations Dashboard */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Pilgrim Operations Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Pilgrim Operations</h3>
                <p className="text-sm text-gray-600">Live crowd management</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Current Load {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-blue-800">{pilgrimKPIs.currentPilgrims.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Capacity</p>
                    <p className="text-sm font-bold text-blue-700">{((pilgrimKPIs.currentPilgrims / 75000) * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">AI Predicted Peak</p>
                    <p className="text-2xl font-bold text-purple-800">{pilgrimKPIs.aiPredictedPeak.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Expected</p>
                    <p className="text-sm font-bold text-purple-700">3:30 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 text-sm font-medium">Queue Wait Time</p>
                    <p className="text-2xl font-bold text-yellow-800">{pilgrimKPIs.queueWaitTime} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-yellow-600">Target: {'<30'}</p>
                    <p className={`text-sm font-bold ${pilgrimKPIs.queueWaitTime <= 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {pilgrimKPIs.queueWaitTime <= 30 ? 'On Track' : 'Alert'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Optimize Queues
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Add Slots
              </button>
            </div>
          </div>

          {/* Traffic Operations Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-xl text-white">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Traffic Operations</h3>
                <p className="text-sm text-gray-600">Vehicle flow management</p>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Current Vehicles {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-orange-800">{trafficKPIs.currentVehicles.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-600">Per hour</p>
                    <p className="text-sm font-bold text-orange-700">Road cap: 2K</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">AI Predicted Peak</p>
                    <p className="text-2xl font-bold text-red-800">{trafficKPIs.aiPredictedPeak.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">Expected</p>
                    <p className="text-sm font-bold text-red-700">4:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-medium">Travel Time</p>
                    <p className="text-2xl font-bold text-blue-800">{trafficKPIs.avgTravelTime} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-600">Alipiri-Temple</p>
                    <p className={`text-sm font-bold ${trafficKPIs.avgTravelTime <= 30 ? 'text-green-600' : 'text-red-600'}`}>
                      {trafficKPIs.avgTravelTime <= 30 ? 'Good' : 'Congested'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Route Traffic
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded-lg transition-colors">
                Add Shuttles
              </button>
            </div>
          </div>

          {/* Resource & Emergency Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Resources & Emergency</h3>
                <p className="text-sm text-gray-600">System status & response</p>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-medium">Staff Utilization</p>
                    <p className="text-2xl font-bold text-purple-800">{operationalKPIs.staffUtilization.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600">Optimal: 80-90%</p>
                    <p className="text-sm font-bold text-purple-700">Good</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-medium">System Uptime</p>
                    <p className="text-2xl font-bold text-green-800">{operationalKPIs.systemUptime.toFixed(1)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">All systems</p>
                    <p className="text-sm font-bold text-green-700">Excellent</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-700 text-sm font-medium">Response Time</p>
                    <p className="text-2xl font-bold text-red-800">{operationalKPIs.incidentResponse.toFixed(1)} min</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-600">Target: &lt;3 min</p>
                    <p className="text-sm font-bold text-red-700">Good</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Status */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-800">All Emergency Units Ready</span>
              </div>
              <div className="text-xs text-green-700 mt-1">{operationalKPIs.emergencyUnits} units active • {operationalKPIs.volunteerCount} volunteers on duty</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Zone-Level Operations */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl text-white">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Tirumala Zone Operations</h3>
                <p className="text-sm text-gray-600">Live zone monitoring {simulationMode && '(Simulated)'}</p>
              </div>
            </div>

            <div className="space-y-4">
              {zoneOperations.map(zone => {
                const occupancyPercentage = (zone.currentCount / zone.capacity) * 100;
                return (
                  <div key={zone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-800">{zone.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded border ${getZoneStatusColor(zone.status)}`}>
                          {zone.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-800">{zone.currentCount.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">of {zone.capacity.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(occupancyPercentage)}`}
                        style={{width: `${occupancyPercentage}%`}}
                      ></div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                      <div>Occupancy: <span className="font-semibold">{occupancyPercentage.toFixed(1)}%</span></div>
                      <div>Staff: <span className="font-semibold">{zone.staffOnDuty}</span></div>
                      <div>Incidents: <span className={`font-semibold ${zone.incidents > 0 ? 'text-red-600' : 'text-green-600'}`}>{zone.incidents}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue Complex Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Queue Complex Status</h3>
                <p className="text-sm text-gray-600">Real-time queue monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {queueComplexes.map(queue => (
                <div key={queue.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-800">{queue.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        queue.status === 'high' ? 'bg-red-100 text-red-800' :
                        queue.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {queue.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">{queue.eta} min</div>
                      <div className="text-xs text-gray-600">ETA</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getOccupancyColor(queue.occupancy)}`}
                      style={{width: `${queue.occupancy}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Occupancy: <span className="font-semibold">{queue.occupancy}%</span></span>
                    <span>Capacity: <span className="font-semibold">{queue.capacity}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        

        {/* VIP Movement & Gate Status */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* VIP Movement Tracking */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl text-white">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">VIP Movement Control</h3>
                <p className="text-sm text-gray-600">Special darshan coordination</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-amber-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-amber-600">{vipMovement.currentVIPs}</div>
                <div className="text-sm text-amber-800">Current VIPs</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600">{vipMovement.inTransit}</div>
                <div className="text-sm text-orange-800">In Transit</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{vipMovement.completedDarshan}</div>
                <div className="text-sm text-green-800">Completed</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-600">{vipMovement.scheduledArrivals}</div>
                <div className="text-sm text-blue-800">Scheduled</div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-red-800">Security Protocol: {vipMovement.securityLevel.toUpperCase()}</span>
              </div>
              <div className="text-xs text-red-700">
                {vipMovement.protocolActive ? 'VIP protocols active • Enhanced security measures' : 'Standard operations'}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowVIPModal(true)}
                className="bg-gradient-to-r from-amber-500 to-red-600 hover:shadow-lg text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>Manage VIP Movement</span>
              </button>
            </div>
          </div>

          {/* Entry/Exit Gate Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Gate Operations</h3>
                <p className="text-sm text-gray-600">Entry/Exit monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {gateStatus.map(gate => (
                <div key={gate.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getGateStatusColor(gate.status)}`}></div>
                      <h4 className="font-semibold text-gray-800">{gate.name}</h4>
                      <span className="text-xs text-gray-600 capitalize">{gate.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-800">{gate.throughput}/hr</div>
                      <div className="text-xs text-gray-600">Throughput</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>Capacity: <span className="font-semibold">{gate.capacity}/hr</span></div>
                    <div>Utilization: <span className="font-semibold">{((gate.throughput/gate.capacity)*100).toFixed(0)}%</span></div>
                    <div>Wait: <span className="font-semibold">{gate.waitTime} min</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Status & Zone Incidents */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* On-Duty Staff Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-3 rounded-xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Staff Deployment Status</h3>
                <p className="text-sm text-gray-600">Department-wise allocation</p>
              </div>
            </div>

            <div className="space-y-4">
              {staffStatus.map((dept, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{dept.department}</h4>
                    <div className="text-right">
                      <div className="text-sm font-bold text-teal-600">{dept.onDuty}/{dept.total}</div>
                      <div className="text-xs text-gray-600">On Duty</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 bg-teal-500 rounded-full transition-all duration-300"
                      style={{width: `${(dept.onDuty/dept.total)*100}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Deployment: <span className="font-semibold">{((dept.onDuty/dept.total)*100).toFixed(0)}%</span></span>
                    <span>Efficiency: <span className="font-semibold text-green-600">{dept.efficiency}%</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Incidents */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 p-3 rounded-xl text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Zone Incidents</h3>
                <p className="text-sm text-gray-600">Active incident monitoring</p>
              </div>
            </div>

            <div className="space-y-4">
              {zoneIncidents.map(incident => (
                <div key={incident.id} className={`border-l-4 p-4 rounded-lg ${
                  incident.severity === 'high' ? 'bg-red-50 border-red-500' :
                  incident.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-800">{incident.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        incident.severity === 'high' ? 'bg-red-100 text-red-800' :
                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {incident.severity}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">{incident.time}</span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">{incident.zone}</div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      incident.status === 'active' ? 'bg-red-100 text-red-800' :
                      incident.status === 'responding' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {incident.status}
                    </span>
                    <button className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
              Report New Incident
            </button>
          </div>
        </div>

        {/* Action Center Integration */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl text-white">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Operational Action Center</h3>
                <p className="text-gray-600">AI-powered situation management and response coordination</p>
              </div>
            </div>
            <button
              onClick={() => setShowActionCenter(!showActionCenter)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                showActionCenter
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {showActionCenter ? 'Hide Action Center' : 'Open Action Center'}
            </button>
          </div>
        </div>

        {/* Action Center */}
        {showActionCenter && (
          <div className="mt-6">
            <ActionCenter />
          </div>
        )}

        {/* Operational Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl text-white">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Operational Command Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Zone Operations</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {zoneOperations.filter(z => z.status === 'normal').length} zones operating normally</li>
                <li>• {zoneOperations.reduce((sum, z) => sum + z.currentCount, 0).toLocaleString()} total pilgrims across zones</li>
                <li>• {zoneOperations.reduce((sum, z) => sum + z.staffOnDuty, 0)} staff members deployed</li>
                <li>• {zoneIncidents.filter(i => i.status === 'active').length} active incidents being managed</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Queue & VIP Operations</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {queueComplexes.length} queue compartments monitored</li>
                <li>• Average ETA: {Math.round(queueComplexes.reduce((sum, q) => sum + q.eta, 0) / queueComplexes.length)} minutes</li>
                <li>• {vipMovement.currentVIPs} VIPs currently in complex</li>
                <li>• {vipMovement.protocolActive ? 'Enhanced' : 'Standard'} security protocols active</li>
              </ul>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-bold text-gray-800 mb-3">Gate & Staff Status</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• {gateStatus.filter(g => g.status === 'open').length} gates currently operational</li>
                <li>• Average wait time: {Math.round(gateStatus.reduce((sum, g) => sum + g.waitTime, 0) / gateStatus.length)} minutes</li>
                <li>• {staffStatus.reduce((sum, s) => sum + s.onDuty, 0)} staff on active duty</li>
                <li>• {(staffStatus.reduce((sum, s) => sum + s.efficiency, 0) / staffStatus.length).toFixed(1)}% average efficiency</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Operational Scenarios */}
        <div className="grid grid-cols-1 gap-8">
          {/* Simulation Controls */}
          <div className="space-y-6">

            {/* Realistic Scenario Builder */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h5 className="font-bold text-gray-800 flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Realistic Scenario Builder</span>
                </h5>
                
                {calculatedMultiplier !== 1.0 && (
                  <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full border border-green-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium text-sm">Live Updates Active</span>
                  </div>
                )}
              </div>

              {/* Filter Controls Section */}
              <div className="bg-white/80 rounded-lg p-4 mb-6 border border-gray-200">
                <h6 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Chart & Filter Controls</span>
                </h6>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Time Period Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 block">📊 Chart Time Period</label>
                    <select
                      value={chartTimePeriod || 'hourly'}
                      onChange={(e) => setChartTimePeriod(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm font-medium transition-all duration-200"
                    >
                      <option value="hourly">📈 Hourly View</option>
                      <option value="daily">📅 Daily View</option>
                      <option value="weekly">📊 Weekly View</option>
                      <option value="monthly">📋 Monthly View</option>
                      <option value="yearly">📆 Yearly View</option>
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="dateFilter"
                        checked={dateFilterEnabled}
                        onChange={(e) => setDateFilterEnabled(e.target.checked)}
                        className="text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="dateFilter" className="text-sm font-medium text-gray-600 cursor-pointer">
                        📅 Custom Date Range
                      </label>
                    </div>
                    
                    {dateFilterEnabled && (
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-2 py-2 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-2 py-2 border border-blue-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="End Date"
                        />
                      </div>
                    )}
                  </div>

                  {/* Festival Filter */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <input
                        type="checkbox"
                        id="festivalFilter"
                        checked={festivalFilterEnabled}
                        onChange={(e) => setFestivalFilterEnabled(e.target.checked)}
                        className="text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="festivalFilter" className="text-sm font-medium text-gray-600 cursor-pointer">
                        🎉 Festival Impact Analysis
                      </label>
                    </div>
                    
                    {festivalFilterEnabled && (
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <p className="text-xs text-purple-700 mb-2">
                          Select festivals from the calendar below to see their impact on operations
                        </p>
                        <div className="text-xs text-purple-600">
                          {selectedFestivals.length > 0 
                            ? `${selectedFestivals.length} festivals selected` 
                            : 'No festivals selected'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Scenario Parameters Section */}
              <div className="bg-white/90 rounded-lg p-4 mb-6 border border-gray-200">
                <h6 className="font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                  <span>⚙️</span>
                  <span>Scenario Parameters</span>
                </h6>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Day Type Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">🗓️ Day Type</label>
                    <div className="space-y-2">
                      {dayTypes.map(day => (
                        <label key={day.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <input
                            type="radio"
                            name="dayType"
                            value={day.id}
                            checked={dayType === day.id}
                            onChange={(e) => setDayType(e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 font-medium">{day.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* TTD Special Days */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">🛕 TTD Special Days</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {ttdSpecialDaysConfig.map(day => (
                        <label key={day.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-purple-50 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={ttdSpecialDays.includes(day.id)}
                            onChange={() => handleTtdSpecialDayToggle(day.id)}
                            className="text-purple-600 rounded focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-700">{day.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Regional Festivals */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">🌍 Regional Festivals</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {regionalFestivalsConfig.map(festival => (
                        <label key={festival.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-green-50 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={regionalFestivals.includes(festival.id)}
                            onChange={() => handleRegionalFestivalToggle(festival.id)}
                            className="text-green-600 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">{festival.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TTD Festival Calendar */}
              {festivalFilterEnabled && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h5 className="font-bold text-purple-900 text-lg flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg text-white">
                        <span className="text-lg">🎉</span>
                      </div>
                      <div>
                        <div>TTD Festival Calendar 2025</div>
                        <div className="text-sm font-normal text-purple-600 mt-1">
                          Select festivals to see their impact on operations
                        </div>
                      </div>
                    </h5>
                    
                    {selectedFestivals.length > 0 && (
                      <div className="bg-purple-100 px-4 py-2 rounded-full border border-purple-300">
                        <span className="text-purple-800 font-semibold text-sm">
                          {selectedFestivals.length} Festival{selectedFestivals.length !== 1 ? 's' : ''} Selected
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-80 overflow-y-auto">
                    {ttdFestivals.map(festival => {
                      const isSelected = selectedFestivals.includes(festival.id);
                      const festivalDate = new Date(festival.date);
                      const isPast = festivalDate < new Date();
                      const isUpcoming = !isPast && festivalDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      
                      return (
                        <label
                          key={festival.id}
                          className={`group relative flex items-start space-x-3 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                            isSelected
                              ? 'bg-white border-purple-400 shadow-lg ring-2 ring-purple-200'
                              : isPast
                                ? 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                : isUpcoming
                                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 hover:border-amber-400 hover:shadow-md'
                                  : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleFestivalToggle(festival.id)}
                            className="text-purple-600 mt-1 flex-shrink-0 w-4 h-4 rounded focus:ring-purple-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold mb-2 leading-tight ${
                              isSelected ? 'text-purple-900' : isPast ? 'text-gray-500' : 'text-gray-800'
                            }`}>
                              {festival.name}
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`text-xs px-2 py-1 rounded-md font-medium flex items-center space-x-1 ${
                                isPast ? 'bg-gray-200 text-gray-600' :
                                isUpcoming ? 'bg-amber-200 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                <span>📅</span>
                                <span>{festivalDate.toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}</span>
                              </div>
                              
                              {isUpcoming && (
                                <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                  SOON
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                festival.category === 'Major' ? 'bg-red-100 text-red-700 border border-red-200' :
                                festival.category === 'Special' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                festival.category === 'Religious' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                'bg-green-100 text-green-700 border border-green-200'
                              }`}>
                                {festival.category}
                              </span>
                              <div className="flex items-center space-x-1">
                                <span className="text-orange-600 font-bold text-sm">
                                  {festival.impact}x
                                </span>
                                <span className="text-xs text-orange-500">impact</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  
                  {selectedFestivals.length > 0 && (
                    <div className="mt-6 bg-white/90 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-semibold text-purple-900 flex items-center space-x-2">
                          <span>🎯</span>
                          <span>Active Festival Impact Analysis</span>
                        </div>
                        <button
                          onClick={() => setSelectedFestivals([])}
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          if (!festival) return null;
                          return (
                            <div
                              key={festivalId}
                              className="group flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-2 rounded-full border border-purple-200 shadow-sm"
                            >
                              <span className="text-purple-800 font-medium text-sm">{festival.name}</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-orange-600 font-bold text-sm">{festival.impact}x</span>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleFestivalToggle(festivalId);
                                  }}
                                  className="text-purple-600 hover:text-purple-800 ml-1 w-4 h-4 rounded-full hover:bg-purple-200 flex items-center justify-center transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Operational Simulation Control */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-4 rounded-xl text-white">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Operational Time Series Analysis & Simulation</h3>
                <p className="text-gray-600 mt-1">Real-time trends, AI predictions, and operational scenario testing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSimulationMode(!simulationMode)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  simulationMode 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span>{simulationMode ? 'Stop Simulation' : 'Start Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Time Series Charts */}
          <div className="grid grid-cols-1 gap-8 m-10">
            {/* Pilgrim Operations Time Series */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Pilgrim Operations Trends</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {chartTimePeriod ? `${chartTimePeriod.charAt(0).toUpperCase() + chartTimePeriod.slice(1)} View` : 'Hourly View'}
                    {dateFilterEnabled && startDate && endDate && 
                      ` | ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                    }
                    {festivalFilterEnabled && selectedFestivals.length > 0 && 
                      ` | ${selectedFestivals.length} Festival${selectedFestivals.length !== 1 ? 's' : ''} Impact`
                    }
                  </div>
                </div>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>AI Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Simulation</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {chartData.labels.map((label, i) => {
                    const currentHeight = chartData.currentData[i];
                    const predictedHeight = chartData.predictedData[i];
                    const simulationHeight = simulationMode ? chartData.simulationData[i] : currentHeight;
                    
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div 
                            className="w-2 bg-blue-500 rounded-t transition-all duration-500"
                            style={{height: `${currentHeight}%`}}
                          ></div>
                          <div 
                            className="w-2 bg-purple-500 rounded-t opacity-70 transition-all duration-500"
                            style={{height: `${predictedHeight}%`}}
                          ></div>
                          {simulationMode && (
                            <div 
                              className="w-2 bg-green-500 rounded-t animate-pulse transition-all duration-500"
                              style={{height: `${simulationHeight}%`}}
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center whitespace-nowrap">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {Math.floor(pilgrimKPIs.currentPilgrims * calculatedMultiplier * 
                      (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) : 1.0
                      )
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-800">Current Load</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.floor(pilgrimKPIs.aiPredictedPeak * calculatedMultiplier * 
                      (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) : 1.0
                      )
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-purple-800">AI Predicted</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {Math.floor(pilgrimKPIs.currentPilgrims * calculatedMultiplier * 
                        (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                          Math.max(...selectedFestivals.map(festivalId => {
                            const festival = ttdFestivals.find(f => f.id === festivalId);
                            return festival ? festival.impact : 1.0;
                          })) : 1.0
                        ) * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1)
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-800">Simulation Load</div>
                  </div>
                )}
              </div>
              
              {/* Filter Impact Summary */}
              {(dateFilterEnabled || (festivalFilterEnabled && selectedFestivals.length > 0) || calculatedMultiplier !== 1.0) && (
                <div className="mt-4 bg-white/80 rounded-lg p-4 border border-gray-200">
                  <h6 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <span>📈</span>
                    <span>Active Filter Impact</span>
                  </h6>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {dateFilterEnabled && startDate && endDate && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                        Custom Date Range Active
                      </div>
                    )}
                    {festivalFilterEnabled && selectedFestivals.length > 0 && (
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                        {selectedFestivals.length} Festival Impact{selectedFestivals.length !== 1 ? 's' : ''}
                      </div>
                    )}
                    {calculatedMultiplier !== 1.0 && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
                        Scenario Multiplier: {calculatedMultiplier.toFixed(2)}x
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Traffic Operations Time Series */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Traffic Operations Trends</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    {chartTimePeriod ? `${chartTimePeriod.charAt(0).toUpperCase() + chartTimePeriod.slice(1)} View` : 'Hourly View'}
                    {dateFilterEnabled && startDate && endDate && 
                      ` | ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                    }
                    {festivalFilterEnabled && selectedFestivals.length > 0 && 
                      ` | ${selectedFestivals.length} Festival${selectedFestivals.length !== 1 ? 's' : ''} Impact`
                    }
                  </div>
                </div>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Current</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>AI Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span>Simulation</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {chartData.labels.map((label, i) => {
                    // Adjust data for traffic (generally lower values than pilgrim data)
                    const trafficCurrentHeight = Math.max(15, Math.min(85, chartData.currentData[i] * 0.8));
                    const trafficPredictedHeight = Math.max(15, Math.min(85, chartData.predictedData[i] * 0.8));
                    const trafficSimulationHeight = simulationMode ? Math.max(15, Math.min(85, chartData.simulationData[i] * 0.8)) : trafficCurrentHeight;
                    
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div 
                            className="w-2 bg-orange-500 rounded-t transition-all duration-500"
                            style={{height: `${trafficCurrentHeight}%`}}
                          ></div>
                          <div 
                            className="w-2 bg-red-500 rounded-t opacity-70 transition-all duration-500"
                            style={{height: `${trafficPredictedHeight}%`}}
                          ></div>
                          {simulationMode && (
                            <div 
                              className="w-2 bg-teal-500 rounded-t animate-pulse transition-all duration-500"
                              style={{height: `${trafficSimulationHeight}%`}}
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center whitespace-nowrap">
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {Math.floor(trafficKPIs.currentVehicles * calculatedMultiplier * 
                      (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) * 0.8 : 1.0 // Traffic has lower festival impact
                      )
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-orange-800">Current Flow</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">
                    {Math.floor(trafficKPIs.aiPredictedPeak * calculatedMultiplier * 
                      (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) * 0.8 : 1.0
                      )
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-red-800">AI Predicted</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <div className="text-lg font-bold text-teal-600">
                      {Math.floor(trafficKPIs.currentVehicles * calculatedMultiplier * 
                        (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                          Math.max(...selectedFestivals.map(festivalId => {
                            const festival = ttdFestivals.find(f => f.id === festivalId);
                            return festival ? festival.impact : 1.0;
                          })) * 0.8 : 1.0
                        ) * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1)
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs text-teal-800">Simulation Flow</div>
                  </div>
                )}
              </div>
              
              {/* Filter Impact Summary */}
              {(dateFilterEnabled || (festivalFilterEnabled && selectedFestivals.length > 0) || calculatedMultiplier !== 1.0) && (
                <div className="mt-4 bg-white/80 rounded-lg p-4 border border-gray-200">
                  <h6 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                    <span>🚗</span>
                    <span>Traffic Filter Impact</span>
                  </h6>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {dateFilterEnabled && startDate && endDate && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                        Custom Date Range Active
                      </div>
                    )}
                    {festivalFilterEnabled && selectedFestivals.length > 0 && (
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                        {selectedFestivals.length} Festival Impact{selectedFestivals.length !== 1 ? 's' : ''} (Reduced)
                      </div>
                    )}
                    {calculatedMultiplier !== 1.0 && (
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
                        Traffic Multiplier: {calculatedMultiplier.toFixed(2)}x
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Simulation Controls */}
          </div>
        </div>
      </div>

      <VIPMovementModal 
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
      />
    </div>
  );
};

export default OperationalDashboard;