import React from 'react';

interface JobListSkeletonProps {
  count?: number;
}

const JobListSkeleton: React.FC<JobListSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index} 
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-5"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="w-12 h-12 mr-4 rounded-md bg-gray-200 animate-pulse"></div>
              <div>
                <div className="h-5 w-32 bg-gray-200 animate-pulse mb-2 rounded-md"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
              </div>
            </div>
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded-full"></div>
          </div>
          
          <div className="mt-4 flex flex-wrap items-center space-x-4">
            <div className="flex items-center">
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
            <div className="flex items-center">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-md"></div>
              <div className="h-6 w-14 bg-gray-200 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobListSkeleton;