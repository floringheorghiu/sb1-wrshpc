import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Header({ isDark, onThemeToggle }: HeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <h1 className="text-base font-semibold text-gray-900 dark:text-white">
        Documentation Mapper
      </h1>
      <button
        onClick={onThemeToggle}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}