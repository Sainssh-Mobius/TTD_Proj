import React, { useState } from 'react';
import { Calendar, Clock, Filter, X } from 'lucide-react';

export interface FilterOptions {
  timePeriod: 'hour' | 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  customRange: boolean;
}

interface ChartFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
  showCustomRange?: boolean;
}

const ChartFilters: React.FC<ChartFiltersProps> = ({ 
  onFilterChange, 
  initialFilters = {},
  showCustomRange = true 
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    timePeriod: 'day',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    customRange: false,
    ...initialFilters
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const timePeriods = [
    { id: 'hour', name: 'Last 24 Hours', icon: '⏰' },
    { id: 'day', name: 'Last 7 Days', icon: '📅' },
    { id: 'week', name: 'Last 4 Weeks', icon: '📊' },
    { id: 'month', name: 'Last 12 Months', icon: '📈' }
  ];

  const handleTimePeriodChange = (period: 'hour' | 'day' | 'week' | 'month') => {
    const newFilters = { 
      ...filters, 
      timePeriod: period, 
      customRange: false 
    };
    
    // Auto-set date ranges based on period
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    let startDate = '';

    switch (period) {
      case 'hour':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'day':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'week':
        startDate = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
    }

    newFilters.startDate = startDate;
    newFilters.endDate = endDate;
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCustomRangeToggle = () => {
    const newFilters = { 
      ...filters, 
      customRange: !filters.customRange 
    };
    setFilters(newFilters);
    setShowDatePicker(!filters.customRange);
    onFilterChange(newFilters);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilters = { 
      ...filters, 
      [field]: value,
      customRange: true 
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearCustomRange = () => {
    const newFilters = { 
      ...filters, 
      customRange: false,
      timePeriod: 'day'
    };
    setFilters(newFilters);
    setShowDatePicker(false);
    onFilterChange(newFilters);
  };

  const formatDateRange = () => {
    if (!filters.customRange) {
      const period = timePeriods.find(p => p.id === filters.timePeriod);
      return period?.name || 'Last 7 Days';
    }
    
    const start = new Date(filters.startDate).toLocaleDateString();
    const end = new Date(filters.endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Chart Filters</h3>
        </div>
        <div className="text-sm text-gray-600">
          {formatDateRange()}
        </div>
      </div>

      {/* Time Period Buttons */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Time Period</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {timePeriods.map(period => (
            <button
              key={period.id}
              onClick={() => handleTimePeriodChange(period.id as any)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                filters.timePeriod === period.id && !filters.customRange
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">{period.icon}</span>
                <span className="text-xs leading-tight text-center">{period.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustomRange && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Custom Date Range</h4>
            <button
              onClick={handleCustomRangeToggle}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filters.customRange
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{filters.customRange ? 'Using Custom Range' : 'Use Custom Range'}</span>
            </button>
          </div>

          {(showDatePicker || filters.customRange) && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {filters.customRange && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Selected: {new Date(filters.startDate).toLocaleDateString()} - {new Date(filters.endDate).toLocaleDateString()}
                  </div>
                  <button
                    onClick={clearCustomRange}
                    className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Data updates every 5 minutes
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartFilters;