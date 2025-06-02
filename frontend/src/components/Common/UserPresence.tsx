import React from "react";

const UserPresence: React.FC = () => {
  // Placeholder for up to 2 users
  return (
    <div className="flex flex-row items-center gap-6 mt-2 mb-4">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
        <span className="text-sm text-gray-700 font-medium">You</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
        <span className="text-sm text-gray-700 font-medium">User 2</span>
      </div>
    </div>
  );
};

export default UserPresence;
