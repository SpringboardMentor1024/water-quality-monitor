// src/components/search/SearchEngine.jsx
import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';

const SearchEngine = ({ stations, onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    status: 'all',
    waterSource: 'all'
  });

  const handleSearch = () => {
    onSearch(searchTerm, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const regions = ['all', 'north', 'south', 'east', 'west'];
  const statuses = ['all', 'active', 'warning', 'critical'];
  const waterSources = ['all', 'river', 'lake', 'well', 'tap'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center mb-6">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <h2 className="text-xl font-semibold">Search Water Stations</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by station name, location, or ID..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-2 bg-teal-600 text-white px-4 py-1 rounded hover:bg-teal-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Region
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region.charAt(0).toUpperCase() + region.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Water Source Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Water Source
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.waterSource}
            onChange={(e) => handleFilterChange('waterSource', e.target.value)}
          >
            {waterSources.map(source => (
              <option key={source} value={source}>
                {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing {stations?.length || 0} stations
        </p>
      </div>
    </div>
  );
};

export default SearchEngine;



