import React, { useState, useMemo } from 'react';
import ChartFilters, { FilterOptions } from './ChartFilters';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  timestamp: Date;
  category?: string;
}

interface FilterableChartProps {
  title: string;
  data: ChartData[];
  chartType: 'line' | 'bar' | 'pie' | 'area';
  color?: string;
  showFilters?: boolean;
  height?: string;
  icon?: React.ReactNode;
}

const FilterableChart: React.FC<FilterableChartProps> = ({
  title,
  data,
  chartType,
  color = 'blue',
  showFilters = true,
  height = 'h-64',
  icon
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    timePeriod: 'day',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    customRange: false
  });

  const formatGroupLabel = (key: string, period: string): string => {
    const parts = key.split('-').map(Number);
    const date = new Date(parts[0], parts[1], parts[2] || 1, parts[3] || 0);

    switch (period) {
      case 'hour':
        return date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric',
          hour12: true 
        });
      case 'day':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      case 'week':
        const weekEnd = new Date(date);
        weekEnd.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      default:
        return key;
    }
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply date range filter
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999); // Include the entire end date

    filtered = filtered.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Group data based on time period
    if (!filters.customRange) {
      const now = new Date();
      const groupedData: { [key: string]: ChartData[] } = {};

      filtered.forEach(item => {
        let groupKey = '';
        const itemDate = new Date(item.timestamp);

        switch (filters.timePeriod) {
          case 'hour':
            groupKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}-${itemDate.getHours()}`;
            break;
          case 'day':
            groupKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}`;
            break;
          case 'week':
            const weekStart = new Date(itemDate);
            weekStart.setDate(itemDate.getDate() - itemDate.getDay());
            groupKey = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
            break;
          case 'month':
            groupKey = `${itemDate.getFullYear()}-${itemDate.getMonth()}`;
            break;
        }

        if (!groupedData[groupKey]) {
          groupedData[groupKey] = [];
        }
        groupedData[groupKey].push(item);
      });

      // Aggregate grouped data
      filtered = Object.entries(groupedData).map(([key, items]) => {
        const avgValue = items.reduce((sum, item) => sum + item.value, 0) / items.length;
        const firstItem = items[0];
        
        return {
          label: formatGroupLabel(key, filters.timePeriod),
          value: Math.round(avgValue),
          timestamp: firstItem.timestamp,
          category: firstItem.category
        };
      });
    }

    return filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data, filters]);

  const getChartIcon = () => {
    if (icon) return icon;
    
    switch (chartType) {
      case 'line':
        return <TrendingUp className="w-5 h-5" />;
      case 'bar':
        return <BarChart3 className="w-5 h-5" />;
      case 'pie':
        return <PieChart className="w-5 h-5" />;
      case 'area':
        return <Activity className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
      blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
      green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600' },
      red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' },
      yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-600' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' },
      indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-600' },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(color);
  const maxValue = Math.max(...filteredData.map(d => d.value));

  const renderChart = () => {
    if (filteredData.length === 0) {
      return (
        <div className={`${height} flex items-center justify-center text-gray-500`}>
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No data available for selected period</p>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
      case 'area':
        return (
          <div className={`${height} flex items-end space-x-1 px-4 py-4`}>
            {filteredData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative flex-1 w-full flex items-end">
                  <div
                    className={`w-full ${colors.bg} rounded-t-sm transition-all duration-300 group-hover:opacity-80 relative`}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center transform -rotate-45 origin-center">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        );

      case 'bar':
        return (
          <div className={`${height} flex items-end space-x-2 px-4 py-4`}>
            {filteredData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="relative flex-1 w-full flex items-end">
                  <div
                    className={`w-full ${colors.bg} rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative`}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  {item.label.length > 8 ? `${item.label.substring(0, 8)}...` : item.label}
                </div>
              </div>
            ))}
          </div>
        );

      case 'pie':
        const total = filteredData.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;
        
        return (
          <div className={`${height} flex items-center justify-center`}>
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {filteredData.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const angle = (percentage / 100) * 360;
                  const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
                  const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
                  const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                  const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  const pathData = [
                    `M 50 50`,
                    `L ${x1} ${y1}`,
                    `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                    'Z'
                  ].join(' ');
                  
                  const slice = (
                    <path
                      key={index}
                      d={pathData}
                      fill={`hsl(${(index * 360) / filteredData.length}, 70%, 60%)`}
                      stroke="white"
                      strokeWidth="0.5"
                      className="hover:opacity-80 transition-opacity"
                    />
                  );
                  
                  currentAngle += angle;
                  return slice;
                })}
              </svg>
              
              {/* Legend */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 space-y-1">
                {filteredData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: `hsl(${(index * 360) / filteredData.length}, 70%, 60%)` }}
                    ></div>
                    <span className="text-gray-600">
                      {item.label}: {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
                {filteredData.length > 5 && (
                  <div className="text-xs text-gray-500">
                    +{filteredData.length - 5} more
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Chart Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gray-100 ${colors.text}`}>
              {getChartIcon()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-600">
                {filteredData.length} data points • {filters.customRange ? 'Custom range' : filters.timePeriod}
              </p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">
              {filteredData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <ChartFilters
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </div>
      )}

      {/* Chart Content */}
      <div className="p-6">
        {renderChart()}
      </div>

      {/* Chart Footer with Additional Stats */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {filteredData.length > 0 ? Math.max(...filteredData.map(d => d.value)).toLocaleString() : '0'}
            </div>
            <div className="text-xs text-gray-600">Peak</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {filteredData.length > 0 ? Math.round(filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length).toLocaleString() : '0'}
            </div>
            <div className="text-xs text-gray-600">Average</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              {filteredData.length > 0 ? Math.min(...filteredData.map(d => d.value)).toLocaleString() : '0'}
            </div>
            <div className="text-xs text-gray-600">Minimum</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterableChart;