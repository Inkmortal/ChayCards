import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { 
    name: 'Library', 
    to: '/library', 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )
  },
  {
    name: 'Knowledge Base',
    to: '/knowledge-base',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  { 
    name: 'Plugins', 
    to: '/plugins',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    )
  },
  { 
    name: 'Settings', 
    to: '/settings',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

export function Navigation() {
  const location = useLocation();

  return (
    <div className="flex h-full min-h-0 flex-col border-r border-border bg-surface">
      {/* Logo area */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <span className="text-xl font-semibold text-primary">ChayCards</span>
      </div>

      {/* Sidebar content */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 w-full ${
                isActive 
                  ? 'bg-primary-bg text-primary shadow-sm'
                  : 'text-text-light hover:bg-surface-hover hover:text-text-dark'
              }`}
            >
              <span className={`flex-shrink-0 ${
                isActive ? 'text-primary' : 'text-text-light'
              }`}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div className="flex shrink-0 border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-bg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-primary">U</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-dark truncate">User Name</p>
            <p className="text-xs text-text-light truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
