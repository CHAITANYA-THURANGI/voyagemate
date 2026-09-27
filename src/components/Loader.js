import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <p className="text-blue-600 font-bold animate-pulse">Fetching Real-time Data...</p>
    </div>
  );
};

export default Loader;