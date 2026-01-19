import React from 'react';
import TestMapComponent from '../components/TestMapComponent';

const TestMapPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Map Test Page</h1>
        <TestMapComponent />
      </div>
    </div>
  );
};

export default TestMapPage;