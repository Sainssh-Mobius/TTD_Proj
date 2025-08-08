import React, { useState, useEffect } from 'react';
import { TrendingUp, Users,  AlertTriangle, Brain, Target, Zap, BarChart3, Globe, Shield, Clock, Activity, Car, MapPin } from 'lucide-react';

const CLevelDashboard: React.FC = () => {
  // Enhanced state management for better UX
  const [activeTab, setActiveTab] = useState<'overview' | 'forecasting' | 'simulation'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [dashboardView, setDashboardView] = useState<'compact' | 'detailed'>('compact');

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

  // Daily forecast data (7 days)
  const [dailyForecastData, setDailyForecastData] = useState(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return Array.from({ length: 7 }, (_, i) => {
      let baseFlow = 45000;
      
      // Weekend patterns
      if (i === 5 || i === 6) baseFlow = 65000; // Sat-Sun higher
      
      return {
        day: days[i],
        predicted: baseFlow + Math.floor(Math.random() * 8000 - 4000),
        actual: i < 3 ? baseFlow + Math.floor(Math.random() * 6000 - 3000) : null, // Only past 3 days have actuals
        confidence: 88 + Math.floor(Math.random() * 8)
      };
    });
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
  const [overviewChartMode, setOverviewChartMode] = useState<'hourly' | 'daily'>('hourly');
  
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

      // Clear saved state after applying
      localStorage.removeItem('ttd-scenario-checkboxes');
      localStorage.removeItem('ttd-scenario-timestamp');
    }, 2000);
  };

  const runStrategicAnalysis = () => {
    const scenario = whatIfScenarios.find(s => s.id === whatIfScenario);

    if (!scenario) return;

    const finalMultiplier = scenario.multiplier * calculatedMultiplier;

    // Calculate projections
    const projectedPilgrims = Math.floor(pilgrimKPIs.current * finalMultiplier);
    const projectedVehicles = Math.floor(trafficKPIs.current * finalMultiplier);
    const projectedRevenue = Math.floor(strategicKPIs.dailyRevenue * finalMultiplier);

    // Calculate strain percentages
    const capacityStrain = (projectedPilgrims / pilgrimKPIs.dailyCapacity) * 100;
    const trafficStrain = (projectedVehicles / trafficKPIs.roadCapacity) * 100;

    // Calculate ROI impact
    const roiImpact = ((finalMultiplier - 1) * 100);

    // Special risk calculations
    let overbookingRisk = 0;
    if (ttdSpecialDays.includes('vaikunta-ekadashi') && regionalFestivals.length > 0) {
      overbookingRisk = 25; // 25% overbooking risk
    }

    setSimulationResults({
      scenario: scenario!.name,
      dayType: dayTypes.find(d => d.id === dayType)?.name,
      specialDays: ttdSpecialDays.map(id => ttdSpecialDaysConfig.find(d => d.id === id)?.name).filter(Boolean),
      regionalFestivals: regionalFestivals.map(id => regionalFestivalsConfig.find(f => f.id === id)?.name).filter(Boolean),
      calculatedMultiplier,
      projectedPilgrims,
      projectedVehicles,
      projectedRevenue,
      capacityStrain,
      trafficStrain,
      roiImpact,
      overbookingRisk,
      strategicRecommendations: getStrategicRecommendations(finalMultiplier, capacityStrain, trafficStrain, overbookingRisk)
    });

    // Auto-stop simulation after 5 seconds and save status
    if (simulationMode === false) {
      setTimeout(() => {
        // Save the current chart status to localStorage before stopping
        const chartStatus = {
          timestamp: new Date().toISOString(),
          scenario: scenario!.name,
          finalMultiplier,
          projectedPilgrims,
          projectedVehicles,
          capacityStrain,
          trafficStrain,
          dayType: dayTypes.find(d => d.id === dayType)?.name,
          specialDays: ttdSpecialDays,
          regionalFestivals: regionalFestivals,
          simulationCompleted: true
        };
        
        localStorage.setItem('ttd-simulation-status', JSON.stringify(chartStatus));
        console.log('Simulation status saved:', chartStatus);
        
        // Stop the simulation
        setSimulationMode(false);
        console.log('Simulation auto-stopped after 5 seconds - analysis complete');
      }, 5000); // 5 seconds
    }
  };

  useEffect(() => {
    // Load saved checkbox state from localStorage
    const savedState = localStorage.getItem('ttd-scenario-checkboxes');
    const savedTimestamp = localStorage.getItem('ttd-scenario-timestamp');

    if (savedState && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp);
      const now = Date.now();
      // Check if saved state is within 30 minutes (1800000 ms)
      if (now - timestamp < 1800000) {
        const parsed = JSON.parse(savedState);
        setScenarioCheckboxes(parsed);
        setHasCheckboxChanges(Object.values(parsed).some(Boolean));
      } else {
        // Clear expired state
        localStorage.removeItem('ttd-scenario-checkboxes');
        localStorage.removeItem('ttd-scenario-timestamp');
      }
    }

    const interval = setInterval(() => {
      if (simulationMode) {
        const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
        const speedMultiplier = simulationSpeed;

        // Update executive KPIs
        setExecutiveKPIs(prev => ({
          ...prev,
          dailyFootfall: Math.max(0, prev.dailyFootfall + Math.floor((Math.random() * 200 - 100) * scenarioMultiplier * speedMultiplier)),
          vipPilgrimCount: Math.max(0, prev.vipPilgrimCount + Math.floor((Math.random() * 20 - 10) * scenarioMultiplier * speedMultiplier)),
          averageDarshanTime: Math.max(8, Math.min(20, prev.averageDarshanTime + (Math.random() * 2 - 1) * scenarioMultiplier)),
          averageWaitingTime: Math.max(10, Math.min(120, prev.averageWaitingTime + Math.floor((Math.random() * 10 - 5) * scenarioMultiplier))),
          crowdDensity: Math.max(40, Math.min(100, prev.crowdDensity + (Math.random() * 6 - 3) * scenarioMultiplier)),
          revenuesCrores: Math.max(1.0, prev.revenuesCrores + (Math.random() * 0.2 - 0.1) * scenarioMultiplier)
        }));

        // Update prediction accuracy
        setPredictionAccuracy(prev => ({
          hourly: {
            ...prev.hourly,
            actual: Math.max(0, prev.hourly.actual + Math.floor((Math.random() * 50 - 25) * scenarioMultiplier)),
            accuracy: Math.max(85, Math.min(100, prev.hourly.accuracy + (Math.random() * 2 - 1)))
          },
          daily: {
            ...prev.daily,
            actual: Math.max(0, prev.daily.actual + Math.floor((Math.random() * 500 - 250) * scenarioMultiplier)),
            accuracy: Math.max(85, Math.min(100, prev.daily.accuracy + (Math.random() * 2 - 1)))
          },
          weekly: {
            ...prev.weekly,
            actual: Math.max(0, prev.weekly.actual + Math.floor((Math.random() * 2000 - 1000) * scenarioMultiplier)),
            accuracy: Math.max(85, Math.min(100, prev.weekly.accuracy + (Math.random() * 2 - 1)))
          }
        }));


        setTrafficKPIs(prev => ({
          ...prev,
          current: Math.max(0, Math.min(prev.roadCapacity,
            prev.current + Math.floor((Math.random() * 50 - 25) * scenarioMultiplier * speedMultiplier))),
          aiPredictedPeak: Math.max(prev.current,
            prev.aiPredictedPeak + Math.floor((Math.random() * 30 - 15) * scenarioMultiplier)),
          avgTravelTime: Math.max(15, Math.min(60,
            prev.avgTravelTime + Math.floor((Math.random() * 4 - 2) * scenarioMultiplier))),
          parkingUtilization: Math.max(40, Math.min(100,
            prev.parkingUtilization + (Math.random() * 4 - 2) * scenarioMultiplier)),
          trafficFlow: Math.max(60, Math.min(100,
            prev.trafficFlow + (Math.random() * 2 - 1) * scenarioMultiplier))
        }));

        setStrategicKPIs(prev => ({
          ...prev,
          dailyRevenue: Math.max(0, prev.dailyRevenue + Math.floor((Math.random() * 100000 - 50000) * scenarioMultiplier * speedMultiplier)),
          operationalCost: Math.max(0, prev.operationalCost + Math.floor((Math.random() * 50000 - 25000) * scenarioMultiplier)),
          profitMargin: Math.max(10, Math.min(50, prev.profitMargin + (Math.random() * 2 - 1) * scenarioMultiplier))
        }));
      }

      // Update forecast data during simulation
      if (simulationMode) {
        // const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
        // setForecastData(prev => prev.map(item => ({
        //   ...item,
        //   predicted: Math.max(500, item.predicted + Math.floor((Math.random() * 200 - 100) * scenarioMultiplier)),
        //   confidence: Math.max(70, Math.min(99, item.confidence + Math.floor(Math.random() * 6 - 3)))
        // })));
      }
    }, simulationMode ? 1800000 : 5000); // 1800000ms = 30 minutes for simulation updates

    return () => clearInterval(interval);
  }, [simulationMode, whatIfScenario, simulationSpeed]);

  const getStrategicRecommendations = (
    multiplier: number,
    pilgrimStrain: number,
    trafficStrain: number,
    overbookingRisk: number
  ) => {
    const recommendations: string[] = [];

    // ➤ Load Multiplier Rules
    if (multiplier > 3.0) {
      recommendations.push('Declare Level-3 surge alert; activate statewide emergency coordination');
      recommendations.push('Suspend routine maintenance and reallocate all available staff to operations');
    } else if (multiplier > 2.0) {
      recommendations.push('Activate emergency capacity protocols');
      recommendations.push('Notify upstream travel hubs to initiate controlled entry throttling');
    } else if (multiplier > 1.5) {
      recommendations.push('Scale up operational resources and reserve capacity buffers');
    } else if (multiplier < 0.5) {
      recommendations.push('Enter low-load mode; optimize cost structure, reschedule non-critical services');
    }

    // ➤ Pilgrim Strain Rules
    if (pilgrimStrain > 95) {
      recommendations.push('Restrict new pilgrim entries and initiate priority access only');
      recommendations.push('Setup real-time crowd density alerts at choke points');
    } else if (pilgrimStrain > 90) {
      recommendations.push('Implement pilgrim flow restrictions at temple queues and lodging areas');
    } else if (pilgrimStrain > 80) {
      recommendations.push('Deploy additional crowd management volunteers in peak zones');
    } else if (pilgrimStrain < 40 && multiplier < 1) {
      recommendations.push('Encourage flexible slot bookings and promote travel during off-peak hours');
    }

    // ➤ Traffic Strain Rules
    if (trafficStrain > 95) {
      recommendations.push('Impose vehicle access control to core areas and activate bypass routes');
      recommendations.push('Divert heavy vehicles to night-time slots');
    } else if (trafficStrain > 85) {
      recommendations.push('Deploy additional traffic personnel and mobile command posts');
    } else if (trafficStrain > 75) {
      recommendations.push('Coordinate shuttle frequencies and dynamic route assignments');
    } else if (trafficStrain < 50 && multiplier > 2.5) {
      recommendations.push('Issue travel advisories for underutilized entry corridors');
    }

    // ➤ Overbooking Risk Rules
    if (overbookingRisk > 60) {
      recommendations.push('Freeze new slot issuance and implement fallback queuing strategy');
      recommendations.push('Send bulk alerts to high-risk slot holders for possible deferral');
    } else if (overbookingRisk > 40) {
      recommendations.push('Introduce adaptive slot allocation using real-time attendance data');
    } else if (overbookingRisk > 20) {
      recommendations.push('Implement slot overbooking prevention measures');
    } else if (overbookingRisk < 10 && multiplier < 0.8) {
      recommendations.push('Allow dynamic upscaling of slot issuance for low-risk time blocks');
    }

    // ➤ Cross-Parameter Logic
    if (multiplier > 2 && trafficStrain > 90 && pilgrimStrain > 90) {
      recommendations.push('Trigger multi-agency crisis coordination with traffic-police-temple joint control');
    }

    if (overbookingRisk > 50 && pilgrimStrain > 85) {
      recommendations.push('Activate real-time rebooking mechanism and walk-in rescheduling counters');
    }

    if (multiplier < 1 && trafficStrain < 60 && overbookingRisk < 20) {
      recommendations.push('Design pilot incentives for weekday visits and off-peak demand stimulation');
    }

    if (multiplier > 1.5 && pilgrimStrain > 85 && trafficStrain > 85) {
      recommendations.push('Trigger Tier-2 surge planning for food, sanitation, and health kiosks');
    }

    return recommendations;
  };


  // Generate contextual AI Executive Summary
  const generateAIExecutiveSummary = () => {
    const currentCapacityStrain = ((pilgrimKPIs.current / pilgrimKPIs.dailyCapacity) * 100);
    const trafficStrain = ((trafficKPIs.current / trafficKPIs.roadCapacity) * 100);

    // Determine primary scenario context
    const hasVaikuntaEkadashi = ttdSpecialDays.includes('vaikunta-ekadashi');
    const hasBrahmotsavam = ttdSpecialDays.includes('brahmotsavam');
    const hasChaturmaasa = ttdSpecialDays.includes('chaturmaasa-vratam');
    const isRainyDay = dayType === 'rainy-day';
    const isSummerVacation = dayType === 'summer-vacation';
    const isStateHoliday = dayType === 'state-holiday';

    // Regional context
    const hasAPFestival = regionalFestivals.includes('andhra-pradesh');
    const hasTSFestival = regionalFestivals.includes('telangana');
    const hasTNFestival = regionalFestivals.includes('tamil-nadu');

    // Weather context
    const weatherContext = currentWeather === 'rain' ? 'rainy conditions' :
      currentWeather === 'heatwave' ? 'extreme heat conditions' : 'favorable weather';

    // Generate primary insight
    let primaryInsight = "";
    let resourceRecommendation = "";
    let riskAssessment = "";

    if (hasVaikuntaEkadashi) {
      const regionalBonus = (hasAPFestival || hasTSFestival || hasTNFestival) ? " and regional festival convergence" : "";
      primaryInsight = `Exceptional influx expected due to Vaikunta Ekadashi${regionalBonus}. AI predicts ${Math.floor(pilgrimKPIs.current * calculatedMultiplier).toLocaleString()} pilgrims with ${weatherContext}.`;
      resourceRecommendation = calculatedMultiplier > 3 ? "Full resource deployment by 3:00 AM. Emergency protocols activated." : "Enhanced staffing by 4:00 AM. Additional shuttle services deployed.";
      riskAssessment = `Expected slot saturation by ${calculatedMultiplier > 3 ? '1:30 PM' : '2:30 PM'}. Overbooking risk: ${hasAPFestival || hasTSFestival ? '25%' : '15%'}.`;
    } else if (hasBrahmotsavam) {
      primaryInsight = `Major festival operations active for Brahmotsavam. AI forecasts ${Math.floor(pilgrimKPIs.current * calculatedMultiplier).toLocaleString()} pilgrims across 9-day celebration period.`;
      resourceRecommendation = "Festival-grade resource allocation active. VIP protocols and extended darshan hours implemented.";
      riskAssessment = `Peak capacity management critical. Current strain: ${currentCapacityStrain.toFixed(1)}%. Traffic diversions active.`;
    } else if (isSummerVacation) {
      const regionalContext = (hasAPFestival || hasTSFestival || hasTNFestival) ? " with regional holiday overlap" : "";
      primaryInsight = `Summer vacation peak detected${regionalContext}. Family pilgrim groups increasing by ${((calculatedMultiplier - 1) * 100).toFixed(0)}% above baseline.`;
      resourceRecommendation = "Extended facility hours recommended. Child-friendly services and cooling stations prioritized.";
      riskAssessment = `Parking demand elevated to ${trafficKPIs.parkingUtilization.toFixed(1)}%. Heat stress protocols active.`;
    } else if (isRainyDay) {
      primaryInsight = `Weather-impacted operations with ${(calculatedMultiplier * 100).toFixed(0)}% of normal capacity due to monsoon conditions.`;
      resourceRecommendation = "Covered walkway management active. Indoor queue systems prioritized. Shuttle frequency reduced for safety.";
      riskAssessment = `Reduced footfall expected: ${Math.floor(pilgrimKPIs.current * calculatedMultiplier).toLocaleString()} pilgrims. Slip hazard protocols active.`;
    } else if (isStateHoliday) {
      const stateContext = hasAPFestival ? "Andhra Pradesh" : hasTSFestival ? "Telangana" : hasTNFestival ? "Tamil Nadu" : "regional";
      primaryInsight = `${stateContext} state holiday driving ${((calculatedMultiplier - 1) * 100).toFixed(0)}% increase in pilgrim arrivals. Peak expected between 6:00 AM - 10:00 AM.`;
      resourceRecommendation = "Holiday-grade staffing deployed. Extended parking and shuttle operations active.";
      riskAssessment = `Traffic congestion likely on approach roads. Current flow: ${trafficKPIs.trafficFlow.toFixed(1)}% efficiency.`;
    } else {
      primaryInsight = `Normal operations with optimized pilgrim flow. Current capacity utilization: ${currentCapacityStrain.toFixed(1)}% with ${weatherContext}.`;
      resourceRecommendation = `Standard resource allocation sufficient. AI optimization maintaining queue efficiency at ${pilgrimKPIs.queueEfficiency.toFixed(1)}%.`;
      riskAssessment = `System performance nominal. Traffic flow: ${trafficKPIs.trafficFlow.toFixed(1)}%. Emergency response ready.`;
    }

    return (
      <>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <Brain className="w-4 h-4 text-amber-600" />
            <span>AI Situation Analysis</span>
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {primaryInsight}
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Current Load: {pilgrimKPIs.current.toLocaleString()} pilgrims</div>
            <div>• Scenario Multiplier: {calculatedMultiplier.toFixed(2)}x</div>
            <div>• Weather Impact: {weatherContext}</div>
            {(hasAPFestival || hasTSFestival || hasTNFestival) && (
              <div>• Regional Festivals: {regionalFestivals.map(id =>
                regionalFestivalsConfig.find(f => f.id === id)?.name
              ).filter(Boolean).join(', ')}</div>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-600" />
            <span>Strategic Recommendations</span>
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {resourceRecommendation}
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Queue Efficiency: {pilgrimKPIs.queueEfficiency.toFixed(1)}%</div>
            <div>• Avg Darshan Time: {pilgrimKPIs.avgDarshanTime} minutes</div>
            <div>• Traffic Flow: {trafficKPIs.trafficFlow.toFixed(1)}%</div>
            <div>• System Uptime: 99.8%</div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-red-600" />
            <span>Risk Assessment</span>
          </h4>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {riskAssessment}
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Capacity Strain: {currentCapacityStrain.toFixed(1)}%</div>
            <div>• Traffic Utilization: {trafficStrain.toFixed(1)}%</div>
            <div>• Parking Load: {trafficKPIs.parkingUtilization.toFixed(1)}%</div>
            <div>• Emergency Units: 12 active</div>
          </div>
        </div>
      </>
    );
  };

  // Generate chart data based on time period
  const generateChartData = (timePeriod: string) => {
    const baseMultiplier = calculatedMultiplier;
    const currentDate = new Date();
    
    // Function to check if a date has a selected festival
    const getFestivalMultiplier = (date: Date) => {
      if (!festivalFilterEnabled) return 1.0;
      
      const dateStr = date.toISOString().split('T')[0];
      const activeFestivals = ttdFestivals.filter(festival => 
        selectedFestivals.includes(festival.id) && festival.date === dateStr
      );
      
      if (activeFestivals.length > 0) {
        // Get the highest impact festival for that date
        const maxImpact = Math.max(...activeFestivals.map(f => f.impact));
        return maxImpact;
      }
      return 1.0;
    };
    
    switch (timePeriod) {
      case 'hourly':
        return Array.from({ length: 24 }, (_, i) => {
          const hourDate = new Date();
          hourDate.setHours(i);
          const festivalMultiplier = getFestivalMultiplier(hourDate);
          
          const hourlyBase = 1200 + Math.sin(i * 0.3) * 400;
          const variation = Math.sin(i * 0.7) * 150; // Deterministic variation
          const predicted = Math.floor((hourlyBase + variation) * baseMultiplier * festivalMultiplier);
          const actual = i <= currentDate.getHours() ? 
            Math.floor((hourlyBase + variation * 0.9) * baseMultiplier * festivalMultiplier * (0.95 + Math.sin(i * 0.1) * 0.1)) : null;
          
          return {
            label: `${i.toString().padStart(2, '0')}:00`,
            fullLabel: `${i.toString().padStart(2, '0')}:00 Hours${festivalMultiplier > 1 ? ` (Festival: ${festivalMultiplier}x)` : ''}`,
            predicted,
            actual,
            confidence: Math.floor(85 + Math.sin(i * 0.5) * 8),
            period: 'hour'
          };
        });
      
      case 'daily':
        return Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const festivalMultiplier = getFestivalMultiplier(date);
          
          const dailyBase = 35000 + Math.sin(i * 0.2) * 8000;
          const weekendBoost = (i % 7 === 0 || i % 7 === 6) ? 1.2 : 1.0; // Weekend effect
          const predicted = Math.floor(dailyBase * baseMultiplier * weekendBoost * festivalMultiplier);
          const actual = i < 20 ? 
            Math.floor(dailyBase * baseMultiplier * weekendBoost * festivalMultiplier * (0.92 + Math.sin(i * 0.15) * 0.15)) : null;
          
          const activeFestivals = ttdFestivals.filter(festival => 
            selectedFestivals.includes(festival.id) && festival.date === date.toISOString().split('T')[0]
          );
          const festivalLabel = activeFestivals.length > 0 ? ` 🎉${activeFestivals[0].name}` : '';
          
          return {
            label: `${date.getDate()}`,
            fullLabel: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}${festivalLabel}`,
            predicted,
            actual,
            confidence: Math.floor(80 + Math.sin(i * 0.3) * 12),
            period: 'day'
          };
        });
      
      case 'weekly':
        return Array.from({ length: 12 }, (_, i) => {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() + (i * 7));
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 6);
          
          // Check for festivals in the week
          const weekFestivals = getFestivalsInRange(startDate, endDate)
            .filter(festival => selectedFestivals.includes(festival.id));
          const weekFestivalMultiplier = weekFestivals.length > 0 ? 
            Math.max(...weekFestivals.map(f => f.impact)) : 1.0;
          
          const weeklyBase = 220000 + Math.sin(i * 0.4) * 50000;
          const festivalSeason = (i >= 8 && i <= 10) ? 1.3 : 1.0; // Festival season boost
          const predicted = Math.floor(weeklyBase * baseMultiplier * festivalSeason * (festivalFilterEnabled ? weekFestivalMultiplier : 1.0));
          const actual = i < 8 ? 
            Math.floor(weeklyBase * baseMultiplier * festivalSeason * (festivalFilterEnabled ? weekFestivalMultiplier : 1.0) * (0.9 + Math.sin(i * 0.2) * 0.2)) : null;
          
          const festivalLabel = weekFestivals.length > 0 ? ` 🎉${weekFestivals.length} festivals` : '';
          
          return {
            label: `W${i + 1}`,
            fullLabel: `Week ${i + 1} (${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})${festivalLabel}`,
            predicted,
            actual,
            confidence: Math.floor(75 + Math.sin(i * 0.4) * 15),
            period: 'week'
          };
        });
      
      case 'monthly':
        return Array.from({ length: 12 }, (_, i) => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const currentYear = new Date().getFullYear();
          
          // Check for festivals in the month
          const monthStart = new Date(currentYear, i, 1);
          const monthEnd = new Date(currentYear, i + 1, 0);
          const monthFestivals = getFestivalsInRange(monthStart, monthEnd)
            .filter(festival => selectedFestivals.includes(festival.id));
          const monthFestivalMultiplier = monthFestivals.length > 0 ? 
            Math.max(...monthFestivals.map(f => f.impact)) : 1.0;
          
          const monthlyBase = 850000 + Math.sin(i * 0.5) * 200000;
          const seasonalBoost = (i >= 2 && i <= 4) || (i >= 9 && i <= 11) ? 1.25 : 1.0; // Spring and winter peaks
          const predicted = Math.floor(monthlyBase * baseMultiplier * seasonalBoost * (festivalFilterEnabled ? monthFestivalMultiplier : 1.0));
          const actual = i < 8 ? 
            Math.floor(monthlyBase * baseMultiplier * seasonalBoost * (festivalFilterEnabled ? monthFestivalMultiplier : 1.0) * (0.88 + Math.sin(i * 0.25) * 0.24)) : null;
          
          const festivalLabel = monthFestivals.length > 0 ? ` 🎉${monthFestivals.length} festivals` : '';
          
          return {
            label: monthNames[i],
            fullLabel: `${monthNames[i]} ${currentYear}${festivalLabel}`,
            predicted,
            actual,
            confidence: Math.floor(70 + Math.sin(i * 0.6) * 20),
            period: 'month'
          };
        });
      
      case 'yearly':
        return Array.from({ length: 5 }, (_, i) => {
          const year = 2021 + i;
          const yearlyBase = 10000000 + Math.sin(i * 0.3) * 2000000;
          const growthTrend = Math.pow(1.05, i); // 5% yearly growth trend
          
          // For yearly view, just use a general festival boost if any festivals are selected
          const yearlyFestivalMultiplier = festivalFilterEnabled && selectedFestivals.length > 0 ? 1.15 : 1.0;
          
          const predicted = Math.floor(yearlyBase * baseMultiplier * growthTrend * yearlyFestivalMultiplier);
          const actual = i < 4 ? 
            Math.floor(yearlyBase * baseMultiplier * growthTrend * yearlyFestivalMultiplier * (0.85 + Math.sin(i * 0.35) * 0.3)) : null;
          
          const festivalLabel = festivalFilterEnabled && selectedFestivals.length > 0 ? ` 🎉Festival impact` : '';
          
          return {
            label: year.toString(),
            fullLabel: `Year ${year}${festivalLabel}`,
            predicted,
            actual,
            confidence: Math.floor(65 + Math.sin(i * 0.7) * 25),
            period: 'year'
          };
        });
      
      default:
        return [];
    }
  };

  // Function to get dynamic chart title
  const getChartTitle = () => {
    const baseTitle = {
      'hourly': '24-Hour Pilgrim Flow Forecast',
      'daily': 'Daily Pilgrim Flow Forecast',
      'weekly': 'Weekly Pilgrim Flow Forecast',
      'monthly': 'Monthly Pilgrim Flow Forecast',
      'yearly': 'Yearly Pilgrim Flow Forecast'
    }[chartTimePeriod] || 'Pilgrim Flow Forecast';
    
    if (dateFilterEnabled) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${baseTitle} (${start} - ${end})`;
    }
    
    return baseTitle;
  };

  // Time slot options for forecasting
  const timeSlots = [
    { value: '04:30', label: '04:30 AM', period: 'early-morning' },
    { value: '06:30', label: '06:30 AM', period: 'morning-peak' },
    { value: '08:30', label: '08:30 AM', period: 'morning' },
    { value: '10:30', label: '10:30 AM', period: 'mid-morning' },
    { value: '12:30', label: '12:30 PM', period: 'noon' },
    { value: '14:30', label: '02:30 PM', period: 'afternoon-peak' },
    { value: '16:30', label: '04:30 PM', period: 'evening' },
    { value: '18:30', label: '06:30 PM', period: 'evening-peak' },
    { value: '20:30', label: '08:30 PM', period: 'night' },
    { value: '22:30', label: '10:30 PM', period: 'late-night' }
  ];

  // Generate time-specific predictions
  const generateTimeSlotPredictions = (timeSlot: string) => {
    const slot = timeSlots.find(t => t.value === timeSlot);
    if (!slot) return null;

    // Base multipliers for different time periods
    const periodMultipliers = {
      'early-morning': 0.4,
      'morning-peak': 1.8,
      'morning': 1.2,
      'mid-morning': 1.0,
      'noon': 0.8,
      'afternoon-peak': 2.2,
      'evening': 1.4,
      'evening-peak': 1.9,
      'night': 0.6,
      'late-night': 0.3
    };

    const basePeriodMultiplier = periodMultipliers[slot.period as keyof typeof periodMultipliers];
    const totalMultiplier = basePeriodMultiplier * calculatedMultiplier;

    const expectedFootfall = Math.floor(pilgrimKPIs.current * totalMultiplier);
    const predictedWaitTime = Math.max(15, Math.min(180, 30 + (totalMultiplier - 1) * 45));
    const shuttleDemand = Math.floor(trafficKPIs.current * totalMultiplier * 0.6);
    const parkingDemand = Math.floor(trafficKPIs.current * totalMultiplier * 0.8);

    // High-risk zone calculation
    const riskZones = [];
    if (totalMultiplier > 2.0) riskZones.push({ zone: 'Main Temple', risk: 'high' });
    if (totalMultiplier > 1.8) riskZones.push({ zone: 'Queue Area A', risk: 'high' });
    if (totalMultiplier > 1.5) riskZones.push({ zone: 'Parking Zones', risk: 'medium' });
    if (totalMultiplier > 1.3) riskZones.push({ zone: 'Alipiri Base', risk: 'medium' });

    return {
      timeSlot: slot.label,
      period: slot.period,
      expectedFootfall,
      predictedWaitTime,
      shuttleDemand,
      parkingDemand,
      totalMultiplier,
      riskZones,
      capacityUtilization: (expectedFootfall / pilgrimKPIs.dailyCapacity) * 100,
      recommendations: getTimeSlotRecommendations(totalMultiplier, expectedFootfall)
    };
  };

  const getTimeSlotRecommendations = (multiplier: number, footfall: number) => {
    const recommendations = [];
    if (multiplier > 2.0) recommendations.push('Deploy maximum staff for peak period');
    if (multiplier > 1.8) recommendations.push('Increase shuttle frequency by 50%');
    if (multiplier > 1.5) recommendations.push('Activate additional parking areas');
    if (footfall > 60000) recommendations.push('Consider temporary entry restrictions');
    if (multiplier > 1.6) recommendations.push('Pre-position emergency response teams');
    return recommendations;
  };

  // Update predictions when time slot or multiplier changes
  useEffect(() => {
    const predictions = generateTimeSlotPredictions(selectedTimeSlot);
    setTimeSlotPredictions(predictions);
  }, [selectedTimeSlot, calculatedMultiplier, pilgrimKPIs.current, trafficKPIs.current]);

  // Store current chart data for the selected period
  const [currentChartData, setCurrentChartData] = useState(() => generateChartData(chartTimePeriod));

  // Update chart data when period, multipliers, or scenario settings change
  useEffect(() => {
    const newChartData = generateChartData(chartTimePeriod);
    setCurrentChartData(newChartData);
  }, [chartTimePeriod, calculatedMultiplier, dayType, ttdSpecialDays, regionalFestivals, dateFilterEnabled, startDate, endDate, festivalFilterEnabled, selectedFestivals]);

  const getUtilizationColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const renderInsightsTab = () => {
    // This function was declared but never implemented
    return null;
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Executive Command Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-6 mb-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Executive Command Center</h1>
            <p className="text-indigo-200">Real-time Operations Monitoring</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-indigo-200">System Status</div>
              <div className="text-lg font-bold">All Systems Operational</div>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-white/10 p-1 rounded-xl">
          {[
            { id: 'overview', name: 'Strategic Overview', icon: BarChart3 },
            { id: 'forecasting', name: 'AI Forecasting', icon: Brain },
            { id: 'simulation', name: 'Scenario Planning', icon: Target }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'forecasting' | 'simulation')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-lg'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Pilgrim Management KPIs */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg text-white">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Pilgrim Management - Executive Overview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-blue-700 text-xs font-medium">Current Pilgrims {simulationMode && '(Sim)'}</p>
                    <p className="text-2xl font-bold text-blue-800">{pilgrimKPIs.current.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <Users className={`w-6 h-6 text-blue-700 ${simulationMode ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-600">Capacity Utilization</span>
                  <span className={`font-bold ${getUtilizationColor(pilgrimKPIs.current, pilgrimKPIs.dailyCapacity)}`}>
                    {((pilgrimKPIs.current / pilgrimKPIs.dailyCapacity) * 100).toFixed(1)}% 
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-purple-700 text-xs font-medium">AI Predicted Peak</p>
                    <p className="text-2xl font-bold text-purple-800">{pilgrimKPIs.aiPredictedPeak.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-200 p-2 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-700" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-600">Expected at 3:30 PM</span>
                  <span className="text-purple-700 font-medium">+{((pilgrimKPIs.aiPredictedPeak / pilgrimKPIs.current - 1) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-green-700 text-xs font-medium">Daily Capacity</p>
                    <p className="text-2xl font-bold text-green-800">{pilgrimKPIs.dailyCapacity.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-200 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-green-700" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">Available Slots</span>
                  <span className="text-green-700 font-bold">{(pilgrimKPIs.dailyCapacity - pilgrimKPIs.current).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-600">{pilgrimKPIs.avgDarshanTime} hour</div>
                <div className="text-xs text-gray-700 font-medium">Avg Darshan Time</div>
                <div className="text-xs text-gray-500 mt-1">Target: &lt;15 hour</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-teal-600">{pilgrimKPIs.queueEfficiency.toFixed(1)}%</div>
                <div className="text-xs text-gray-700 font-medium">Queue Efficiency</div>
                <div className="text-xs text-gray-500 mt-1">AI Optimized</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-amber-600">{pilgrimKPIs.satisfactionScore.toFixed(1)}/5</div>
                <div className="text-xs text-gray-700 font-medium">Satisfaction Score</div>
                <div className="text-xs text-gray-500 mt-1">Real-time feedback</div>
              </div>
            </div>
          </div>

          {/* Traffic Management KPIs */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg text-white">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Traffic Management - Executive Overview</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-orange-700 text-sm font-medium">Current Vehicles {simulationMode && '(Sim)'}</p>
                    <p className="text-3xl font-bold text-orange-800">{trafficKPIs.current.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-200 p-3 rounded-xl">
                    <Car className={`w-8 h-8 text-orange-700 ${simulationMode ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-600">Road Utilization</span>
                  <span className={`font-bold ${getUtilizationColor(trafficKPIs.current, trafficKPIs.roadCapacity)}`}>
                    {((trafficKPIs.current / trafficKPIs.roadCapacity) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-red-700 text-sm font-medium">AI Predicted Peak</p>
                    <p className="text-3xl font-bold text-red-800">{trafficKPIs.aiPredictedPeak.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-200 p-3 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-red-700" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Expected at 4:00 PM</span>
                  <span className="text-red-700 font-medium">+{((trafficKPIs.aiPredictedPeak / trafficKPIs.current - 1) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-teal-700 text-sm font-medium">Road Capacity</p>
                    <p className="text-3xl font-bold text-teal-800">{trafficKPIs.roadCapacity.toLocaleString()}</p>
                  </div>
                  <div className="bg-teal-200 p-3 rounded-xl">
                    <MapPin className="w-8 h-8 text-teal-700" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-teal-600">Available Capacity</span>
                  <span className="text-teal-700 font-bold">{(trafficKPIs.roadCapacity - trafficKPIs.current).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{trafficKPIs.avgTravelTime} min</div>
                <div className="text-sm text-gray-700 font-medium">Avg Travel Time</div>
                <div className="text-xs text-gray-500 mt-1">Alipiri to Temple</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">{trafficKPIs.parkingUtilization.toFixed(1)}%</div>
                <div className="text-sm text-gray-700 font-medium">Parking Utilization</div>
                <div className="text-xs text-gray-500 mt-1">All lots combined</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{trafficKPIs.trafficFlow.toFixed(1)}%</div>
                <div className="text-sm text-gray-700 font-medium">Traffic Flow Efficiency</div>
                <div className="text-xs text-gray-500 mt-1">AI Optimized</div>
              </div>
            </div>
          </div>
          

          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-8 border border-amber-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-3 rounded-xl text-white">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">AI Executive Summary & Strategic Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generateAIExecutiveSummary()}
            </div>
          </div>

             {/* Time Series Visualization */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {overviewChartMode === 'hourly' ? '24-Hour Pilgrim Flow Forecast' : '7-Day Pilgrim Flow Forecast'}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setOverviewChartMode('hourly')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      overviewChartMode === 'hourly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Hourly
                  </button>
                  <button 
                    onClick={() => setOverviewChartMode('daily')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      overviewChartMode === 'daily' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    Daily
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Chart Legend */}
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                    <span className="text-gray-600">Predicted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                    <span className="text-gray-600">Actual</span>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">Future</span>
                  </div> */}
                </div>

                {/* Chart */}
                <div className={`grid gap-2 h-48 ${overviewChartMode === 'hourly' ? 'grid-cols-12' : 'grid-cols-7'}`}>
                  {(overviewChartMode === 'hourly' 
                    ? forecastData.filter((_, i) => i % 2 === 0)
                    : dailyForecastData
                  ).map((item, i) => {
                    const currentData = overviewChartMode === 'hourly' ? forecastData : dailyForecastData;
                    const maxValue = Math.max(...currentData.map(d => d.predicted));
                    const predictedHeight = (item.predicted / maxValue) * 100;
                    const actualHeight = item.actual ? (item.actual / maxValue) * 100 : 0;
                    
                    let isPast = false;
                    if (overviewChartMode === 'hourly') {
                      const currentHour = new Date().getHours();
                      const itemHour = parseInt((item as any).hour.split(':')[0]);
                      isPast = itemHour <= currentHour;
                    } else {
                      // For daily view, consider first 3 days as past (since we have actuals for them)
                      isPast = i < 3;
                    }

                    return (
                      <div key={i} className="flex flex-col justify-end group cursor-pointer">
                        <div className="relative h-full flex items-end justify-center space-x-1">
                          {/* Predicted bar */}
                          <div
                            className={`w-3 rounded-t transition-all duration-300 ${isPast ? 'bg-gradient-to-t from-blue-400 to-purple-400' : 'bg-gradient-to-t from-blue-500 to-purple-500'
                              } group-hover:shadow-lg`}
                            style={{ height: `${predictedHeight}%` }}
                          ></div>

                          {/* Actual bar (only for past periods) */}
                          {item.actual && (
                            <div
                              className="w-3 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t transition-all duration-300 group-hover:shadow-lg"
                              style={{ height: `${actualHeight}%` }}
                            ></div>
                          )}
                        </div>

                        {/* Period label */}
                        <div className="text-xs text-gray-600 text-center mt-2 transform -rotate-45 origin-center">
                          {overviewChartMode === 'hourly' ? (item as any).hour : (item as any).day}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                            <div>Predicted: {item.predicted.toLocaleString()}</div>
                            {item.actual && <div>Actual: {item.actual.toLocaleString()}</div>}
                            <div>Confidence: {item.confidence}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {(overviewChartMode === 'hourly' 
                        ? forecastData.reduce((sum, item) => sum + item.predicted, 0)
                        : dailyForecastData.reduce((sum, item) => sum + item.predicted, 0)
                      ).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Total Predicted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round((overviewChartMode === 'hourly' 
                        ? forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length
                        : dailyForecastData.reduce((sum, item) => sum + item.confidence, 0) / dailyForecastData.length
                      ))}%
                    </div>
                    <div className="text-xs text-gray-600">Avg Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.max(...(overviewChartMode === 'hourly' 
                        ? forecastData.map(item => item.predicted)
                        : dailyForecastData.map(item => item.predicted)
                      )).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      Peak {overviewChartMode === 'hourly' ? 'Hour' : 'Day'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )}

      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          {/* Time-Specific Forecasting Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-xl text-white">
                  <Brain className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">AI-Powered Time-Specific Forecasting</h3>
                  <p className="text-gray-600 mt-1">Predictive analytics for strategic resource planning</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="text-sm font-semibold text-gray-700">Select Time Slot:</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm font-medium min-w-[140px]"
                >
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {timeSlotPredictions && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-blue-700 text-sm font-medium">Expected Footfall</p>
                      <p className="text-3xl font-bold text-blue-800">{timeSlotPredictions.expectedFootfall.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-200 p-3 rounded-xl">
                      <Users className="w-8 h-8 text-blue-700" />
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    Capacity: {timeSlotPredictions.capacityUtilization.toFixed(1)}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-yellow-700 text-sm font-medium">Predicted Wait Time</p>
                      <p className="text-3xl font-bold text-yellow-800">{timeSlotPredictions.predictedWaitTime} min</p>
                    </div>
                    <div className="bg-yellow-200 p-3 rounded-xl">
                      <Clock className="w-8 h-8 text-yellow-700" />
                    </div>
                  </div>
                  <div className="text-xs text-yellow-600">
                    Target: &lt;30 min
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-green-700 text-sm font-medium">Shuttle Demand</p>
                      <p className="text-3xl font-bold text-green-800">{timeSlotPredictions.shuttleDemand}</p>
                    </div>
                    <div className="bg-green-200 p-3 rounded-xl">
                      <Car className="w-8 h-8 text-green-700" />
                    </div>
                  </div>
                  <div className="text-xs text-green-600">
                    Vehicles required
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-purple-700 text-sm font-medium">Parking Demand</p>
                      <p className="text-3xl font-bold text-purple-800">{timeSlotPredictions.parkingDemand}</p>
                    </div>
                    <div className="bg-purple-200 p-3 rounded-xl">
                      <Car className="w-8 h-8 text-purple-700" />
                    </div>
                  </div>
                  <div className="text-xs text-purple-600">
                    Vehicles expected
                  </div>
                </div>
              </div>
            )}

            {/* High-Risk Zones */}
            {timeSlotPredictions && timeSlotPredictions.riskZones.length > 0 && (
              <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-8">
                <h4 className="font-bold text-red-800 mb-4 flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>High-Risk Zones Flagged</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeSlotPredictions.riskZones.map((zone: any, index: number) => (
                    <div key={index} className={`p-3 rounded-lg border ${zone.risk === 'high' ? 'bg-red-100 border-red-300 text-red-800' :
                      'bg-yellow-100 border-yellow-300 text-yellow-800'
                      }`}>
                      <div className="font-semibold">{zone.zone}</div>
                      <div className="text-sm opacity-80">Risk Level: {zone.risk}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Recommendations */}
            {timeSlotPredictions && timeSlotPredictions.recommendations.length > 0 && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-8">
                <h4 className="font-bold text-green-800 mb-4 flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Strategic Recommendations</span>
                </h4>
                <ul className="text-sm text-green-700 space-y-2">
                  {timeSlotPredictions.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Time Series Visualization */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {getChartTitle()}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setChartTimePeriod('hourly')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      chartTimePeriod === 'hourly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    📈 Hourly
                  </button>
                  <button 
                    onClick={() => setChartTimePeriod('daily')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      chartTimePeriod === 'daily' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    📅 Daily
                  </button>
                  <button 
                    onClick={() => setChartTimePeriod('weekly')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      chartTimePeriod === 'weekly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    📊 Weekly
                  </button>
                  <button 
                    onClick={() => setChartTimePeriod('monthly')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      chartTimePeriod === 'monthly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    📋 Monthly
                  </button>
                  <button 
                    onClick={() => setChartTimePeriod('yearly')}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      chartTimePeriod === 'yearly' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    📆 Yearly
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Chart Legend */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
                      <span className="text-gray-600">Predicted</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                      <span className="text-gray-600">Actual</span>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-300 rounded"></div>
                      <span className="text-gray-600">Future</span>
                    </div> */}
                  </div>
                  
                  {/* Active filter indicators */}
                  <div className="flex items-center space-x-3">
                    {dateFilterEnabled && (
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-700">
                          📅 Date: {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    
                    {festivalFilterEnabled && selectedFestivals.length > 0 && (
                      <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-purple-700">
                          🎉 Festivals: {selectedFestivals.length} selected
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart */}
                <div className={`grid gap-2 h-48 ${
                  chartTimePeriod === 'hourly' ? 'grid-cols-12 md:grid-cols-24' : 
                  chartTimePeriod === 'daily' ? 'grid-cols-10 md:grid-cols-15' : 
                  chartTimePeriod === 'weekly' ? 'grid-cols-6 md:grid-cols-12' : 
                  chartTimePeriod === 'monthly' ? 'grid-cols-6 md:grid-cols-12' : 
                  'grid-cols-3 md:grid-cols-5'
                }`}>
                  {currentChartData.map((item, i) => {
                    const maxValue = Math.max(...currentChartData.map(d => d.predicted));
                    const predictedHeight = (item.predicted / maxValue) * 100;
                    const actualHeight = item.actual ? (item.actual / maxValue) * 100 : 0;
                    const isPast = item.actual !== null;

                    return (
                      <div key={i} className="flex flex-col justify-end group cursor-pointer">
                        <div className="relative h-full flex items-end justify-center space-x-1">
                          {/* Predicted bar */}
                          <div
                            className={`w-3 rounded-t transition-all duration-500 ease-out ${isPast ? 'bg-gradient-to-t from-blue-400 to-purple-400' : 'bg-gradient-to-t from-blue-500 to-purple-500'
                              } group-hover:shadow-lg transform group-hover:scale-110`}
                            style={{ height: `${predictedHeight}%` }}
                          ></div>

                          {/* Actual bar (only for past periods) */}
                          {item.actual && (
                            <div
                              className="w-3 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t transition-all duration-500 ease-out group-hover:shadow-lg transform group-hover:scale-110"
                              style={{ height: `${actualHeight}%` }}
                            ></div>
                          )}
                        </div>

                        {/* Period label */}
                        <div className="text-xs text-gray-600 text-center mt-2 transform -rotate-45 origin-center">
                          {item.label}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                            <div className="font-semibold">{item.fullLabel || item.label}</div>
                            <div>Predicted: {item.predicted.toLocaleString()}</div>
                            {item.actual && <div>Actual: {item.actual.toLocaleString()}</div>}
                            <div>Confidence: {item.confidence}%</div>
                            <div className="text-xs opacity-75">Period: {item.period}</div>
                            {dateFilterEnabled && (
                              <div className="text-xs opacity-75 mt-1 border-t border-gray-600 pt-1">
                                📅 Date Range: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                              </div>
                            )}
                            {festivalFilterEnabled && selectedFestivals.length > 0 && (
                              <div className="text-xs opacity-75 mt-1 border-t border-gray-600 pt-1">
                                🎉 Active Festivals: {selectedFestivals.length} selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {currentChartData.reduce((sum, item) => sum + item.predicted, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Total Predicted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(currentChartData.reduce((sum, item) => sum + item.confidence, 0) / currentChartData.length)}%
                    </div>
                    <div className="text-xs text-gray-600">Avg Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.max(...currentChartData.map(item => item.predicted)).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Peak {chartTimePeriod === 'hourly' ? 'Hour' : chartTimePeriod === 'daily' ? 'Day' : chartTimePeriod === 'weekly' ? 'Week' : chartTimePeriod === 'monthly' ? 'Month' : 'Year'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulation' && (
        <div className="space-y-6">
          {/* Scenario Planning Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-xl text-white">
                  <Target className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Strategic Scenario Planning & Simulation</h3>
                  <p className="text-gray-600 mt-1">Advanced what-if analysis for executive decision making</p>
                </div>
              </div>

            </div>

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
                              Select festivals from the calendar below to see their impact on predictions
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
                              Select festivals to see their impact on crowd predictions
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
                          const isUpcoming = !isPast && festivalDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Next 30 days
                          
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

                  
                  
                  {/* Calculated Impact */}
                  {/* <div className="mt-4 p-3 bg-white/70 rounded-lg border border-blue-300">
                    <div className="text-sm font-semibold text-gray-700">🧠 Calculated Impact</div>
                    <div className="text-lg font-bold text-blue-600">
                      {calculatedMultiplier > 1 ? '+' : ''}{((calculatedMultiplier - 1) * 100).toFixed(0)}% Load Increase
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Multiplier: {calculatedMultiplier.toFixed(2)}x
                    </div>
                  </div> */}
                </div>
              </div>
              <div className='w-full flex justify-end'>
                <button
                  onClick={() => {
                    setSimulationMode(!simulationMode)
                    // runStrategicAnalysis()

                    const scenarioMultiplier = whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1;
                    const speedMultiplier = simulationSpeed;

                    setPilgrimKPIs(prev => ({
                      ...prev,
                      current: Math.max(0, Math.min(prev.dailyCapacity,
                        prev.current + Math.floor((Math.random() * 200 - 100) * scenarioMultiplier * speedMultiplier))),
                      aiPredictedPeak: Math.max(prev.current,
                        prev.aiPredictedPeak + Math.floor((Math.random() * 100 - 50) * scenarioMultiplier)),
                      satisfactionScore: Math.max(3.0, Math.min(5.0,
                        prev.satisfactionScore + (Math.random() * 0.2 - 0.1) * scenarioMultiplier)),
                      avgDarshanTime: Math.max(8, Math.min(25,
                        prev.avgDarshanTime + (Math.random() * 2 - 1) * scenarioMultiplier)),
                      queueEfficiency: Math.max(70, Math.min(100,
                        prev.queueEfficiency + (Math.random() * 2 - 1) * scenarioMultiplier))
                    }));

                    setForecastData(prev => prev.map(item => ({
                      ...item,
                      predicted: Math.max(500, item.predicted + Math.floor((Math.random() * 200 - 100) * scenarioMultiplier)),
                      confidence: Math.max(70, Math.min(99, item.confidence + Math.floor(Math.random() * 6 - 3)))
                    })));

                    setTimeout(()=>{
                      setSimulationMode(!simulationMode)
                    },1000*Math.random()+1000)

                  }}
                  className={`flex w-1/6 items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${simulationMode
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
                    }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>{simulationMode ? 'Stop Simulation' : 'Run Strategy Analysis'}</span>
                </button>

              </div>
            </div>

            {/* 24-Hour Operations Chart */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h4 className="font-bold text-gray-800 text-lg">24-Hour Operations Trends</h4>
                  {(calculatedMultiplier > 1.1 || (festivalFilterEnabled && selectedFestivals.length > 0)) && (
                    <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-yellow-700 font-medium text-sm">
                        {calculatedMultiplier > 1.1 && `+${((calculatedMultiplier - 1) * 100).toFixed(0)}% Load`}
                        {festivalFilterEnabled && selectedFestivals.length > 0 && ` 🎉 Festival Impact`}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>AI Predicted</span>
                    </div>
                    {simulationMode && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Simulation</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {(() => {
                    // Calculate data points based on date filter
                    let dataPoints = 24; // Default for hourly view
                    let dateRange = [];
                    
                    if (dateFilterEnabled && startDate && endDate) {
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      
                      if (chartTimePeriod === 'daily') {
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                        dataPoints = Math.min(diffDays, 30); // Max 30 days for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setDate(start.getDate() + i);
                          dateRange.push(currentDate);
                        }
                      } else if (chartTimePeriod === 'weekly') {
                        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
                        dataPoints = Math.min(diffWeeks, 12); // Max 12 weeks for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setDate(start.getDate() + (i * 7));
                          dateRange.push(currentDate);
                        }
                      } else if (chartTimePeriod === 'monthly') {
                        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)) + 1;
                        dataPoints = Math.min(diffMonths, 12); // Max 12 months for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setMonth(start.getMonth() + i);
                          dateRange.push(currentDate);
                        }
                      } else if (chartTimePeriod === 'yearly') {
                        const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365)) + 1;
                        dataPoints = Math.min(diffYears, 5); // Max 5 years for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setFullYear(start.getFullYear() + i);
                          dateRange.push(currentDate);
                        }
                      }
                    }
                    
                    return Array.from({ length: dataPoints }, (_, i) => {
                      const hour = i;
                      const currentDate = dateRange[i] || null;
                      
                      // Apply festival multiplier
                      const festivalMultiplier = festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) : 1.0;
                      
                      // Calculate heights with filter impacts
                      const baseCurrentHeight = 35 + Math.sin(i * 0.5) * 25;
                      const currentHeight = Math.max(20, Math.min(90, baseCurrentHeight * calculatedMultiplier * festivalMultiplier + Math.random() * 10));
                      
                      const basePredictedHeight = currentHeight + 12 + Math.sin(i * 0.3) * 18;
                      const predictedHeight = Math.max(20, Math.min(90, basePredictedHeight));
                      
                      const simulationHeight = simulationMode ?
                        Math.max(20, Math.min(90, currentHeight * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1))) :
                        currentHeight;
                      
                      // Calculate actual pilgrim counts for tooltips
                      const currentPilgrims = Math.floor((1200 + Math.sin(i * 0.5) * 400) * calculatedMultiplier * festivalMultiplier);
                      const predictedPilgrims = Math.floor((1400 + Math.sin(i * 0.3) * 500) * calculatedMultiplier * festivalMultiplier);
                      const simulationPilgrims = simulationMode ? 
                        Math.floor(currentPilgrims * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1)) : 
                        currentPilgrims;
                      
                      return (
                        <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                          <div className="flex items-end space-x-1 h-48">
                            <div
                              className={`w-2 bg-blue-500 rounded-t transition-all duration-500 ${
                                calculatedMultiplier > 1.2 || festivalMultiplier > 1.5 ? 'shadow-lg' : ''
                              }`}
                              style={{ height: `${currentHeight}%` }}
                              title={`Current: ${currentPilgrims.toLocaleString()} pilgrims${festivalMultiplier > 1 ? ` (Festival boost: ${festivalMultiplier.toFixed(1)}x)` : ''}${calculatedMultiplier > 1 ? ` (Load: ${calculatedMultiplier.toFixed(1)}x)` : ''}`}
                            ></div>
                            <div
                              className={`w-2 bg-purple-500 rounded-t transition-all duration-500 ${
                                calculatedMultiplier > 1.2 || festivalMultiplier > 1.5 ? 'opacity-90 shadow-lg' : 'opacity-70'
                              }`}
                              style={{ height: `${predictedHeight}%` }}
                              title={`Predicted: ${predictedPilgrims.toLocaleString()} pilgrims${festivalMultiplier > 1 ? ` (Festival impact: ${festivalMultiplier.toFixed(1)}x)` : ''}`}
                            ></div>
                            {simulationMode && (
                              <div
                                className="w-2 bg-green-500 rounded-t animate-pulse transition-all duration-500 shadow-md"
                                style={{ height: `${simulationHeight}%` }}
                                title={`Simulation: ${simulationPilgrims.toLocaleString()} pilgrims`}
                              ></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 transform -rotate-45 origin-center">
                            {dateFilterEnabled && currentDate ? (
                              chartTimePeriod === 'hourly' ? `${hour.toString().padStart(2, '0')}:00` :
                              chartTimePeriod === 'daily' ? currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                              chartTimePeriod === 'weekly' ? `Week ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` :
                              chartTimePeriod === 'monthly' ? currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) :
                              currentDate.getFullYear().toString()
                            ) : (
                              chartTimePeriod === 'hourly' ? `${hour.toString().padStart(2, '0')}:00` :
                              chartTimePeriod === 'daily' ? `Day ${hour + 1}` :
                              chartTimePeriod === 'weekly' ? `Week ${hour + 1}` :
                              chartTimePeriod === 'monthly' ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][hour % 12]}` :
                              `${2025 + hour}`
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 bg-blue-50 rounded-lg ${
                  calculatedMultiplier > 1.2 || (festivalFilterEnabled && selectedFestivals.length > 0) ? 'ring-2 ring-blue-300 bg-blue-100' : ''
                }`}>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.floor(pilgrimKPIs.current * calculatedMultiplier * 
                      (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) : 1.0
                      )
                    ).toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-800">Current Load</div>
                  {(calculatedMultiplier > 1.1 || (festivalFilterEnabled && selectedFestivals.length > 0)) && (
                    <div className="text-xs text-blue-600 mt-1">
                      {calculatedMultiplier > 1.1 && `+${((calculatedMultiplier - 1) * 100).toFixed(0)}%`}
                      {festivalFilterEnabled && selectedFestivals.length > 0 && ` 🎉`}
                    </div>
                  )}
                </div>
                <div className={`p-3 bg-purple-50 rounded-lg ${
                  calculatedMultiplier > 1.2 || (festivalFilterEnabled && selectedFestivals.length > 0) ? 'ring-2 ring-purple-300 bg-purple-100' : ''
                }`}>
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
                  {(calculatedMultiplier > 1.1 || (festivalFilterEnabled && selectedFestivals.length > 0)) && (
                    <div className="text-xs text-purple-600 mt-1">Enhanced forecast</div>
                  )}
                </div>
                {simulationMode && (
                  <div className="p-3 bg-green-50 rounded-lg ring-2 ring-green-300 animate-pulse">
                    <div className="text-lg font-bold text-green-600">
                      {Math.floor(pilgrimKPIs.current * calculatedMultiplier * 
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
            </div>

            {/* Resource Allocation Simulation Chart */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mt-8 border border-indigo-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg text-white">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">Resource Allocation Simulation</h4>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span>Staff Level</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span>Transport</span>
                    </div>
                    {simulationMode && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <span>Emergency</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {(() => {
                    // Calculate data points based on date filter
                    let dataPoints = 24; // Default for hourly view
                    let dateRange = [];
                    
                    if (dateFilterEnabled && startDate && endDate) {
                      const start = new Date(startDate);
                      const end = new Date(endDate);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      
                      if (chartTimePeriod === 'daily') {
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                        dataPoints = Math.min(diffDays, 30); // Max 30 days for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setDate(start.getDate() + i);
                          dateRange.push(currentDate);
                        }
                      } else if (chartTimePeriod === 'weekly') {
                        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7)) + 1;
                        dataPoints = Math.min(diffWeeks, 12); // Max 12 weeks for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setDate(start.getDate() + (i * 7));
                          dateRange.push(currentDate);
                        }
                      } else if (chartTimePeriod === 'monthly') {
                        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)) + 1;
                        dataPoints = Math.min(diffMonths, 12); // Max 12 months for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setMonth(start.getMonth() + i);
                          dateRange.push(currentDate);
                        }
                      } else if (chartTimePeriod === 'yearly') {
                        const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365)) + 1;
                        dataPoints = Math.min(diffYears, 5); // Max 5 years for display
                        for (let i = 0; i < dataPoints; i++) {
                          const currentDate = new Date(start);
                          currentDate.setFullYear(start.getFullYear() + i);
                          dateRange.push(currentDate);
                        }
                      }
                    }
                    
                    return Array.from({ length: dataPoints }, (_, i) => {
                      const hour = i;
                      const currentDate = dateRange[i] || null;
                      
                      // Apply festival multiplier to resource allocation
                      const festivalMultiplier = festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) : 1.0;
                      
                      // Calculate base levels with filter impacts
                      const baseStaffLevel = 40 + Math.sin(i * 0.3) * 20;
                      const staffLevel = Math.max(25, Math.min(95, baseStaffLevel * calculatedMultiplier * festivalMultiplier + Math.random() * 8));
                      
                      const baseTransportLevel = staffLevel - 15 + Math.sin(i * 0.4) * 15;
                      const transportLevel = Math.max(20, Math.min(90, baseTransportLevel * (calculatedMultiplier * 0.8)));
                      
                      const emergencyLevel = simulationMode ? 
                        Math.max(30, Math.min(95, staffLevel * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1) * 0.8)) : 
                        staffLevel;
                      
                      // Calculate actual values for tooltips
                      const staffCount = Math.floor((120 + Math.sin(i * 0.3) * 40) * calculatedMultiplier * festivalMultiplier);
                      const transportCount = Math.floor((45 + Math.sin(i * 0.4) * 15) * calculatedMultiplier);
                      const emergencyCount = simulationMode ? 
                        Math.floor(staffCount * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1) * 0.8) : 
                        staffCount;
                      
                      return (
                        <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                          <div className="flex items-end space-x-1 h-48">
                            <div 
                              className={`w-2 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-500 shadow-sm ${
                                calculatedMultiplier > 1.2 || festivalMultiplier > 1.5 ? 'animate-pulse' : ''
                              }`}
                              style={{height: `${staffLevel}%`}}
                              title={`Staff: ${staffCount} members${festivalMultiplier > 1 ? ` (Festival boost: ${festivalMultiplier.toFixed(1)}x)` : ''}`}
                            ></div>
                            <div 
                              className={`w-2 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t opacity-80 transition-all duration-500 shadow-sm ${
                                calculatedMultiplier > 1.2 ? 'opacity-90' : ''
                              }`}
                              style={{height: `${transportLevel}%`}}
                              title={`Transport: ${transportCount} vehicles${calculatedMultiplier > 1 ? ` (Load factor: ${calculatedMultiplier.toFixed(1)}x)` : ''}`}
                            ></div>
                            {simulationMode && (
                              <div 
                                className="w-2 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t animate-pulse transition-all duration-500 shadow-md"
                                style={{height: `${emergencyLevel}%`}}
                                title={`Emergency: ${emergencyCount} units`}
                              ></div>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 transform -rotate-45 origin-center font-medium">
                            {dateFilterEnabled && currentDate ? (
                              chartTimePeriod === 'hourly' ? `${hour.toString().padStart(2, '0')}:00` :
                              chartTimePeriod === 'daily' ? currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                              chartTimePeriod === 'weekly' ? `Week ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` :
                              chartTimePeriod === 'monthly' ? currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) :
                              currentDate.getFullYear().toString()
                            ) : (
                              chartTimePeriod === 'hourly' ? `${hour.toString().padStart(2, '0')}:00` :
                              chartTimePeriod === 'daily' ? `Day ${hour + 1}` :
                              chartTimePeriod === 'weekly' ? `Week ${hour + 1}` :
                              chartTimePeriod === 'monthly' ? `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][hour % 12]}` :
                              `${2025 + hour}`
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className={`p-3 bg-indigo-50 rounded-lg border border-indigo-200 ${
                  calculatedMultiplier > 1.2 || (festivalFilterEnabled && selectedFestivals.length > 0) ? 'ring-2 ring-indigo-300 bg-indigo-100' : ''
                }`}>
                  <div className="text-lg font-bold text-indigo-700">
                    {Math.floor((120 + Math.random() * 80) * calculatedMultiplier * 
                      (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                        Math.max(...selectedFestivals.map(festivalId => {
                          const festival = ttdFestivals.find(f => f.id === festivalId);
                          return festival ? festival.impact : 1.0;
                        })) : 1.0
                      )
                    )}
                  </div>
                  <div className="text-xs text-indigo-800 font-semibold">Staff Deployed</div>
                  {(calculatedMultiplier > 1.1 || (festivalFilterEnabled && selectedFestivals.length > 0)) && (
                    <div className="text-xs text-indigo-600 mt-1">
                      {calculatedMultiplier > 1.1 && `+${((calculatedMultiplier - 1) * 100).toFixed(0)}% load`}
                      {festivalFilterEnabled && selectedFestivals.length > 0 && (
                        <div>🎉 Festival impact active</div>
                      )}
                    </div>
                  )}
                </div>
                <div className={`p-3 bg-teal-50 rounded-lg border border-teal-200 ${
                  calculatedMultiplier > 1.2 ? 'ring-2 ring-teal-300 bg-teal-100' : ''
                }`}>
                  <div className="text-lg font-bold text-teal-700">
                    {Math.floor((45 + Math.random() * 25) * calculatedMultiplier)}
                  </div>
                  <div className="text-xs text-teal-800 font-semibold">Transport Units</div>
                  {calculatedMultiplier > 1.1 && (
                    <div className="text-xs text-teal-600 mt-1">
                      +{((calculatedMultiplier - 1) * 100).toFixed(0)}% capacity
                    </div>
                  )}
                </div>
                {simulationMode && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 animate-pulse ring-2 ring-orange-300">
                    <div className="text-lg font-bold text-orange-700">
                      {Math.floor((120 + Math.random() * 80) * calculatedMultiplier * 
                        (festivalFilterEnabled && selectedFestivals.length > 0 ? 
                          Math.max(...selectedFestivals.map(festivalId => {
                            const festival = ttdFestivals.find(f => f.id === festivalId);
                            return festival ? festival.impact : 1.0;
                          })) : 1.0
                        ) * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1) * 0.9
                      )}
                    </div>
                    <div className="text-xs text-orange-800 font-semibold">Emergency Response</div>
                    <div className="text-xs text-orange-600 mt-1">Simulation active</div>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default CLevelDashboard;