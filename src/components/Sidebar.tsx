'use client';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

interface SidebarProps {
  onNewNote: () => void;
  onUpgrade: () => void;
  tenantIsFree: boolean;
}

export default function Sidebar({ onNewNote, onUpgrade, tenantIsFree }: SidebarProps) {
  const { setToken } = useContext(AuthContext);

  return (
    <div className="w-64 p-4 bg-gray-100 dark:bg-gray-800 h-screen flex flex-col justify-between">
      <div>
        <button
          onClick={onNewNote}
          className="w-full mb-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          New Note
        </button>
        {tenantIsFree && (
          <button
            onClick={onUpgrade}
            className="w-full mb-2 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Upgrade to Pro
          </button>
        )}
      </div>
      <button
        onClick={() => setToken(null)}
        className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
