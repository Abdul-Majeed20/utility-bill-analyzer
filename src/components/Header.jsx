import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Electricity Bill Analyzer</h1>
        <p className="text-gray-600 mt-2">Upload your bill or enter details manually</p>
      </div>
    </header>
  );
};

export default Header;