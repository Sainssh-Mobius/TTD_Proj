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

  // Realistic Scenario State
  const [dayType, setDayType] = useState('normal-day');
  const [ttdSpecialDays, setTtdSpecialDays] = useState<string[]>([]);
  const [regionalFestivals, setRegionalFestivals] = useState<string[]>([]);
  const [calculatedMultiplier, setCalculatedMultiplier] = useState(1.0);

  // Time-Specific Forecasting State
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('06:30');
  const [timeSlotPredictions, setTimeSlotPredictions] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState('weather-crisis');

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

  const handleCheckboxChange = (key: string, checked: boolean) => {
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
                <h3 className="text-xl font-bold text-gray-800">24-Hour Pilgrim Flow Forecast</h3>
                <div className="flex space-x-2">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm transition-colors">
                    Hourly
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm transition-colors">
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
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-gray-600">Future</span>
                  </div>
                </div>

                {/* Chart */}
                <div className="grid grid-cols-12 gap-2 h-48">
                  {forecastData.filter((_, i) => i % 2 === 0).map((item, i) => {



                    const maxValue = Math.max(...forecastData.map(d => d.predicted));
                    const predictedHeight = (item.predicted / maxValue) * 100;
                    const actualHeight = item.actual ? (item.actual / maxValue) * 100 : 0;
                    const currentHour = new Date().getHours();
                    const itemHour = parseInt(item.hour.split(':')[0]);
                    const isPast = itemHour <= currentHour;

                    return (
                      <div key={i} className="flex flex-col justify-end group cursor-pointer">
                        <div className="relative h-full flex items-end justify-center space-x-1">
                          {/* Predicted bar */}
                          <div
                            className={`w-3 rounded-t transition-all duration-300 ${isPast ? 'bg-gradient-to-t from-blue-400 to-purple-400' : 'bg-gradient-to-t from-blue-500 to-purple-500'
                              } group-hover:shadow-lg`}
                            style={{ height: `${predictedHeight}%` }}
                          ></div>

                          {/* Actual bar (only for past hours) */}
                          {item.actual && (
                            <div
                              className="w-3 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t transition-all duration-300 group-hover:shadow-lg"
                              style={{ height: `${actualHeight}%` }}
                            ></div>
                          )}
                        </div>

                        {/* Hour label */}
                        <div className="text-xs text-gray-600 text-center mt-2 transform -rotate-45 origin-center">
                          {item.hour}
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
                      {forecastData.reduce((sum, item) => sum + item.predicted, 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Total Predicted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {Math.round(forecastData.reduce((sum, item) => sum + item.confidence, 0) / forecastData.length)}%
                    </div>
                    <div className="text-xs text-gray-600">Avg Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.max(...forecastData.map(item => item.predicted)).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Peak Hour</div>
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

              {/* <button
                onClick={runStrategicAnalysis}


                // onClick={runStrategicAnalysis}

                className="w-fit flex space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg"
              >
                <Activity className="w-5 h-5" />
                <span>{simulationMode ? 'Stop Strategy Analysis' : 'Run Strategy Analysis'}</span>
              </button> */}
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Simulation Controls */}
              <div className="space-y-6">
                {/* <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-800 mb-4">Simulation Controls</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                      <select
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={2}>2x</option>
                        <option value={5}>5x</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weather</label>
                      <select
                        value={currentWeather}
                        onChange={(e) => setCurrentWeather(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="rain">Rainy</option>
                        <option value="heatwave">Heat Wave</option>
                      </select>
                    </div>
                  </div>
                </div> */}

                {/* Realistic Scenario Builder */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 flex flex-row justify-between">
                  <h5 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Realistic Scenario Builder</span>
                  </h5>
                  <div className='flex flex-row justify-evenly w-2/3'>
                    {/* Day Type Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🗓️ Day Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {dayTypes.map(day => (
                          <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="dayType"
                              value={day.id}
                              checked={dayType === day.id}
                              onChange={(e) => setDayType(e.target.value)}
                              className="text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{day.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* TTD Special Days */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🛕 TTD Special Days</label>
                      <div className="space-y-1">
                        {ttdSpecialDaysConfig.map(day => (
                          <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ttdSpecialDays.includes(day.id)}
                              onChange={() => handleTtdSpecialDayToggle(day.id)}
                              className="text-purple-600"
                            />
                            <span className="text-sm text-gray-700">{day.name}</span>
                          </label>
                        ))}
                      </div>

                    </div>

                    {/* Regional Festivals */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">🌍 Regional Festivals</label>
                      <div className="space-y-1">
                        {regionalFestivalsConfig.map(festival => (
                          <label key={festival.id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={regionalFestivals.includes(festival.id)}
                              onChange={() => handleRegionalFestivalToggle(festival.id)}
                              className="text-green-600"
                            />
                            <span className="text-sm text-gray-700">{festival.name}</span>
                          </label>
                        ))}
                      </div>

                    </div>
                  </div>



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

              {/* Strategic Scenarios */}


              {/* Analysis Results */}
              {/* <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-lg flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Strategic Insights</span>
                </h4>

                {simulationResults ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700">Active Scenario</div>
                      <div className="text-lg font-bold text-purple-600">{simulationResults.scenario}</div>
                      {simulationResults.dayType && (
                        <div className="text-xs text-gray-600 mt-1">Day: {simulationResults.dayType}</div>
                      )}
                      {simulationResults.specialDays.length > 0 && (
                        <div className="text-xs text-purple-600 mt-1">Special: {simulationResults.specialDays.join(', ')}</div>
                      )}
                      {simulationResults.regionalFestivals.length > 0 && (
                        <div className="text-xs text-green-600 mt-1">Regional: {simulationResults.regionalFestivals.join(', ')}</div>
                      )}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700">Total Multiplier</div>
                      <div className="text-lg font-bold text-blue-600">{simulationResults.calculatedMultiplier.toFixed(2)}x</div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700">Revenue Impact</div>
                      <div className="text-lg font-bold text-green-600">₹{(simulationResults.projectedRevenue / 1000000).toFixed(1)}M</div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700">ROI Change</div>
                      <div className="text-lg font-bold text-blue-600">{simulationResults.roiImpact.toFixed(1)}%</div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <div className="text-sm font-semibold text-gray-700">Capacity Strain</div>
                      <div className="text-lg font-bold text-yellow-600">{simulationResults.capacityStrain.toFixed(1)}%</div>
                    </div>

                    {simulationResults.overbookingRisk > 0 && (
                      <div className="p-4 bg-red-50 rounded-xl">
                        <div className="text-sm font-semibold text-gray-700">Overbooking Risk</div>
                        <div className="text-lg font-bold text-red-600">{simulationResults.overbookingRisk}%</div>
                      </div>
                    )}

                    {simulationResults.strategicRecommendations.length > 0 && (
                      <div className="p-4 bg-amber-50 rounded-xl">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Strategic Actions</div>
                        <ul className="text-xs text-amber-800 space-y-1">
                          {simulationResults.strategicRecommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-1">
                              <span>•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Run analysis to see strategic insights</p>
                  </div>
                )}
              </div> */}
            </div>

            {/* Prediction vs Actual Analysis */}
            {/* <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Prediction vs Actual</span>
              </h4>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-blue-800">Hourly Accuracy</span>
                    <span className="text-lg font-bold text-blue-600">{predictionAccuracy.hourly.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-blue-700">
                    Predicted: {predictionAccuracy.hourly.predicted.toLocaleString()} |
                    Actual: {predictionAccuracy.hourly.actual.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-800">Daily Accuracy</span>
                    <span className="text-lg font-bold text-green-600">{predictionAccuracy.daily.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-green-700">
                    Predicted: {predictionAccuracy.daily.predicted.toLocaleString()} |
                    Actual: {predictionAccuracy.daily.actual.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-purple-800">Weekly Accuracy</span>
                    <span className="text-lg font-bold text-purple-600">{predictionAccuracy.weekly.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="text-xs text-purple-700">
                    Predicted: {predictionAccuracy.weekly.predicted.toLocaleString()} |
                    Actual: {predictionAccuracy.weekly.actual.toLocaleString()}
                  </div>
                </div>
              </div>
            </div> */}

            {/* 24-Hour Operations Chart */}
            <div className="bg-gray-50 rounded-xl p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-gray-800 text-lg">24-Hour Operations Trends</h4>
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
                    {/* {simulationMode && (
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Simulation</span>
                      </div>
                    )} */}
                  </div>


                </div>
              </div>

              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i;
                    const currentHeight = Math.max(20, Math.min(90, 35 + Math.sin(i * 0.5) * 25 + Math.random() * 10));
                    const predictedHeight = Math.max(20, Math.min(90, currentHeight + 12 + Math.sin(i * 0.3) * 18));
                    const simulationHeight = simulationMode ?
                      Math.max(20, Math.min(90, currentHeight * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1))) :
                      currentHeight;
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div
                            className="w-2 bg-blue-500 rounded-t transition-all duration-500"
                            style={{ height: `${currentHeight}%` }}
                            title={`Current: ${Math.floor(1200 + Math.sin(i * 0.5) * 400)} pilgrims`}
                          ></div>
                          <div
                            className="w-2 bg-purple-500 rounded-t opacity-70 transition-all duration-500"
                            style={{ height: `${predictedHeight}%` }}
                            title={`Predicted: ${Math.floor(1400 + Math.sin(i * 0.3) * 500)} pilgrims`}
                          ></div>
                          {simulationMode && (
                            <div
                              className="w-2 bg-green-500 rounded-t animate-pulse transition-all duration-500"
                              style={{ height: `${simulationHeight}%` }}
                              title={`Simulation: ${Math.floor((1200 + Math.sin(i * 0.5) * 400) * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1))} pilgrims`}
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center">
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{pilgrimKPIs.current.toLocaleString()}</div>
                  <div className="text-xs text-blue-800">Current Load</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{pilgrimKPIs.aiPredictedPeak.toLocaleString()}</div>
                  <div className="text-xs text-purple-800">AI Predicted</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {Math.floor(pilgrimKPIs.current * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1)).toLocaleString()}
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
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i;
                    const staffLevel = Math.max(25, Math.min(85, 40 + Math.sin(i * 0.3) * 20 + Math.random() * 12));
                    const transportLevel = Math.max(25, Math.min(85, staffLevel - 15 + Math.sin(i * 0.4) * 15));
                    const emergencyLevel = simulationMode ? 
                      Math.max(30, Math.min(95, staffLevel * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1) * 0.8)) : 
                      staffLevel;
                    
                    return (
                      <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                        <div className="flex items-end space-x-1 h-48">
                          <div 
                            className="w-2 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t transition-all duration-500 shadow-sm"
                            style={{height: `${staffLevel}%`}}
                            title={`Staff: ${Math.floor(120 + Math.sin(i * 0.3) * 40)} members`}
                          ></div>
                          <div 
                            className="w-2 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t opacity-80 transition-all duration-500 shadow-sm"
                            style={{height: `${transportLevel}%`}}
                            title={`Transport: ${Math.floor(45 + Math.sin(i * 0.4) * 15)} vehicles`}
                          ></div>
                          {simulationMode && (
                            <div 
                              className="w-2 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t animate-pulse transition-all duration-500 shadow-md"
                              style={{height: `${emergencyLevel}%`}}
                              title={`Emergency: ${Math.floor((120 + Math.sin(i * 0.3) * 40) * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1) * 0.8)} units`}
                            ></div>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 transform -rotate-45 origin-center font-medium">
                          {hour.toString().padStart(2, '0')}:00
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="text-lg font-bold text-indigo-700">{Math.floor(120 + Math.random() * 80)}</div>
                  <div className="text-xs text-indigo-800 font-semibold">Staff Deployed</div>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="text-lg font-bold text-teal-700">{Math.floor(45 + Math.random() * 25)}</div>
                  <div className="text-xs text-teal-800 font-semibold">Transport Units</div>
                </div>
                {simulationMode && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 animate-pulse">
                    <div className="text-lg font-bold text-orange-700">
                      {Math.floor((120 + Math.random() * 80) * (whatIfScenarios.find(s => s.id === whatIfScenario)?.multiplier || 1) * 0.9)}
                    </div>
                    <div className="text-xs text-orange-800 font-semibold">Emergency Response</div>
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