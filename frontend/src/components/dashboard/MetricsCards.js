import React from 'react';

const MetricsCards = ({ data }) => {
  const calculateMetrics = () => {
    if (!data || data.length === 0) return { total: 0, good: 0, warning: 0, critical: 0, avgPh: 0 };
    
    const total = data.length;
    const good = data.filter(d => d.status === 'good').length;
    const warning = data.filter(d => d.status === 'warning').length;
    const critical = data.filter(d => d.status === 'critical').length;
    const avgPh = (data.reduce((sum, d) => sum + d.ph, 0) / total).toFixed(1);
    
    return { total, good, warning, critical, avgPh };
  };

  const metrics = calculateMetrics();

  const cards = [
    {
      title: 'Total Stations',
      value: metrics.total,
      icon: '📍',
      color: 'bg-blue-500'
    },
    {
      title: 'Good Quality',
      value: metrics.good,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Warnings',
      value: metrics.warning,
      icon: '⚠️',
      color: 'bg-yellow-500'
    },
    {
      title: 'Critical Issues',
      value: metrics.critical,
      icon: '🚨',
      color: 'bg-red-500'
    },
    {
      title: 'Avg pH Level',
      value: metrics.avgPh,
      icon: '🧪',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className={`${card.color} rounded-lg p-2 sm:p-3 mb-2 sm:mb-0 sm:mr-3 lg:mr-4`}>
              <span className="text-white text-lg sm:text-xl">{card.icon}</span>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;