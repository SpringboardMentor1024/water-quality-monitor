import React, { useState, useEffect } from 'react';
import { alertsAPI } from '../../services/api';

const HistoricalDataGraphs = () => {
  const [historicalData, setHistoricalData] = useState({
    boil_notice: [],
    contamination: [],
    outage: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedAlertType, setSelectedAlertType] = useState('all');

  useEffect(() => {
    fetchHistoricalData();
  }, [selectedPeriod]);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const data = await alertsAPI.getHistoricalData(selectedPeriod);
      setHistoricalData(data || {
        boil_notice: [],
        contamination: [],
        outage: []
      });
    } catch (error) {
      console.error('Error fetching historical data:', error);
      setHistoricalData({
        boil_notice: [],
        contamination: [],
        outage: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      'boil_notice': '#f97316',
      'contamination': '#dc2626',
      'outage': '#eab308'
    };
    return colors[type] || '#3b82f6';
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      'boil_notice': '🔥',
      'contamination': '☣️',
      'outage': '⚠️'
    };
    return icons[type] || '📊';
  };

  const calculateTotalAlerts = (data) => {
    return Object.values(data).reduce((total, typeData) => {
      return total + typeData.reduce((sum, day) => sum + day.count, 0);
    }, 0);
  };

  const calculateAveragePerDay = (data) => {
    const total = calculateTotalAlerts(data);
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    return (total / days).toFixed(1);
  };

  const SimpleBarChart = ({ data, color, title, icon }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-3">
          <span className="text-lg mr-2">{icon}</span>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        
        <div className="flex items-end space-x-1 h-24 mb-3">
          {data.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center group">
              <div
                className="w-full rounded-t transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: color,
                  height: `${(day.count / maxCount) * 100}%`,
                  minHeight: day.count > 0 ? '4px' : '0px'
                }}
                title={`${day.count} alerts on ${new Date(day.date).toLocaleDateString()}`}
              ></div>
              {(data.length <= 7 ? true : 
                data.length <= 30 ? index % 6 === 0 : 
                index % 15 === 0) && (
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {data.length <= 7 ? 
                    new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }) :
                    new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <span className="text-gray-500">Total:</span>
            <span className="ml-1 font-semibold text-gray-800">{data.reduce((sum, d) => sum + d.count, 0)}</span>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Peak:</span>
            <span className="ml-1 font-semibold text-gray-800">{Math.max(...data.map(d => d.count))}</span>
          </div>
        </div>
      </div>
    );
  };

  const LineChart = ({ data, color, title, icon }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const points = data.map((day, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (day.count / maxCount) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-3">
          <span className="text-lg mr-2">{icon}</span>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        
        <div className="h-24 mb-3 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
            />
            {data.map((day, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - (day.count / maxCount) * 100;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill={color}
                  title={`${day.count} alerts on ${new Date(day.date).toLocaleDateString()}`}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <span className="text-gray-500">Avg:</span>
            <span className="ml-1 font-semibold text-gray-800">{(data.reduce((sum, d) => sum + d.count, 0) / data.length).toFixed(1)}</span>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Trend:</span>
            <span className="ml-1 font-semibold text-gray-800">
              {data[data.length - 1].count > data[0].count ? '📈' : data[data.length - 1].count < data[0].count ? '📉' : '➡️'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const AreaChart = ({ data, color, title, icon }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const points = data.map((day, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (day.count / maxCount) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    const areaPoints = `0,100 ${points} 100,100`;
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-3">
          <span className="text-lg mr-2">{icon}</span>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        
        <div className="h-24 mb-3 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon
              fill={color}
              fillOpacity="0.3"
              points={areaPoints}
            />
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <span className="text-gray-500">Sum:</span>
            <span className="ml-1 font-semibold text-gray-800">{data.reduce((sum, d) => sum + d.count, 0)}</span>
          </div>
          <div className="text-center">
            <span className="text-gray-500">Max:</span>
            <span className="ml-1 font-semibold text-gray-800">{Math.max(...data.map(d => d.count))}</span>
          </div>
        </div>
      </div>
    );
  };

  const PieChart = ({ data, colors, title, icon }) => {
    const total = Object.values(data).reduce((sum, typeData) => 
      sum + typeData.reduce((s, d) => s + d.count, 0), 0
    );
    
    if (total === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center mb-3">
            <span className="text-lg mr-2">{icon}</span>
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          </div>
          <div className="h-20 flex items-center justify-center text-gray-500 text-xs">
            No data available
          </div>
        </div>
      );
    }
    
    const segments = [];
    let currentAngle = 0;
    
    Object.entries(data).forEach(([type, typeData], index) => {
      const value = typeData.reduce((sum, d) => sum + d.count, 0);
      const percentage = (value / total) * 100;
      const angle = (value / total) * 360;
      
      segments.push({
        type,
        value,
        percentage,
        color: colors[type] || '#3b82f6',
        startAngle: currentAngle,
        endAngle: currentAngle + angle
      });
      
      currentAngle += angle;
    });
    
    const createPath = (centerX, centerY, radius, startAngle, endAngle) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M", centerX, centerY,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");
    };
    
    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
      return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
      };
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center mb-3">
          <span className="text-lg mr-2">{icon}</span>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        
        <div className="h-20 mb-3 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80">
            {segments.map((segment, index) => (
              <path
                key={index}
                d={createPath(40, 40, 30, segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="white"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        
        <div className="space-y-1">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="capitalize">{segment.type.replace('_', ' ')}</span>
              </div>
              <span className="font-semibold">{segment.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CombinedChart = ({ data }) => {
    const allDates = data.boil_notice.map(d => d.date);
    const maxCount = Math.max(
      ...data.boil_notice.map(d => d.count),
      ...data.contamination.map(d => d.count),
      ...data.outage.map(d => d.count),
      1
    );

    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 All Alert Types - Combined View</h3>
        
        <div className="flex items-end justify-between h-48 mb-4 px-2">
          {allDates.map((date, index) => (
            <div key={index} className="flex flex-col items-center" style={{ width: `${100/allDates.length - 0.5}%` }}>
              <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                <div
                  className="w-full transition-all duration-200 hover:opacity-80 mb-0.5"
                  style={{
                    backgroundColor: '#dc2626',
                    height: `${(data.contamination[index].count / maxCount) * 50}%`,
                    minHeight: data.contamination[index].count > 0 ? '3px' : '0px'
                  }}
                  title={`Contamination: ${data.contamination[index].count} alerts`}
                ></div>
                <div
                  className="w-full transition-all duration-200 hover:opacity-80 mb-0.5"
                  style={{
                    backgroundColor: '#f97316',
                    height: `${(data.boil_notice[index].count / maxCount) * 50}%`,
                    minHeight: data.boil_notice[index].count > 0 ? '3px' : '0px'
                  }}
                  title={`Boil Notice: ${data.boil_notice[index].count} alerts`}
                ></div>
                <div
                  className="w-full transition-all duration-200 hover:opacity-80"
                  style={{
                    backgroundColor: '#eab308',
                    height: `${(data.outage[index].count / maxCount) * 50}%`,
                    minHeight: data.outage[index].count > 0 ? '3px' : '0px'
                  }}
                  title={`Outage: ${data.outage[index].count} alerts`}
                ></div>
              </div>
              {(allDates.length <= 7 ? true : 
                allDates.length <= 30 ? index % 6 === 0 : 
                index % 20 === 0) && (
                <div className="text-xs text-gray-500 mt-2 text-center transform rotate-45 origin-center">
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span className="font-medium">Contamination</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
            <span className="font-medium">Boil Notice</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span className="font-medium">Outage</span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading historical data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Alert Trends & Historical Data</h1>
        <p className="text-gray-600">Analyze patterns and trends in water quality alerts</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
            <select
              value={selectedAlertType}
              onChange={(e) => setSelectedAlertType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="boil_notice">Boil Notice</option>
              <option value="contamination">Contamination</option>
              <option value="outage">Outage</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Alerts</p>
              <p className="text-2xl font-bold">{calculateTotalAlerts(historicalData)}</p>
            </div>
            <div className="text-3xl opacity-80">📊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Daily Average</p>
              <p className="text-2xl font-bold">{calculateAveragePerDay(historicalData)}</p>
            </div>
            <div className="text-3xl opacity-80">📈</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Peak Day</p>
              <p className="text-2xl font-bold">
                {Math.max(
                  ...Object.values(historicalData).flat().map(d => d.count)
                )}
              </p>
            </div>
            <div className="text-3xl opacity-80">⚡</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {selectedAlertType === 'all' && (
          <CombinedChart data={historicalData} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {selectedAlertType === 'all' && (
            <PieChart
              data={historicalData}
              colors={{
                'boil_notice': getAlertTypeColor('boil_notice'),
                'contamination': getAlertTypeColor('contamination'),
                'outage': getAlertTypeColor('outage')
              }}
              title="Alert Distribution"
              icon="📊"
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'boil_notice') && (
            <SimpleBarChart
              data={historicalData.boil_notice || []}
              color={getAlertTypeColor('boil_notice')}
              title="Boil Notice - Bar"
              icon={getAlertTypeIcon('boil_notice')}
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'boil_notice') && (
            <LineChart
              data={historicalData.boil_notice || []}
              color={getAlertTypeColor('boil_notice')}
              title="Boil Notice - Line"
              icon={getAlertTypeIcon('boil_notice')}
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'contamination') && (
            <SimpleBarChart
              data={historicalData.contamination || []}
              color={getAlertTypeColor('contamination')}
              title="Contamination - Bar"
              icon={getAlertTypeIcon('contamination')}
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'contamination') && (
            <AreaChart
              data={historicalData.contamination || []}
              color={getAlertTypeColor('contamination')}
              title="Contamination - Area"
              icon={getAlertTypeIcon('contamination')}
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'outage') && (
            <SimpleBarChart
              data={historicalData.outage || []}
              color={getAlertTypeColor('outage')}
              title="Outage - Bar"
              icon={getAlertTypeIcon('outage')}
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'outage') && (
            <LineChart
              data={historicalData.outage || []}
              color={getAlertTypeColor('outage')}
              title="Outage - Line"
              icon={getAlertTypeIcon('outage')}
            />
          )}
          
          {(selectedAlertType === 'all' || selectedAlertType === 'boil_notice') && (
            <AreaChart
              data={historicalData.boil_notice || []}
              color={getAlertTypeColor('boil_notice')}
              title="Boil Notice - Area"
              icon={getAlertTypeIcon('boil_notice')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataGraphs;