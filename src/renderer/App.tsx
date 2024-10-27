import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Library } from './pages/Library';
import { Plugins } from './pages/Plugins';
import { Settings } from './pages/Settings';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { ThemeProvider } from './contexts/ThemeContext';
import { ContextMenuProvider } from './contexts/ContextMenuContext';
import './styles.css';

// Initialize theme system
import { getCurrentTheme, applyTheme } from './themes';
const savedTheme = getCurrentTheme();
applyTheme(savedTheme); // Apply theme on app load

function App() {
  return (
    <ThemeProvider>
      <ContextMenuProvider>
        <HashRouter>
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-sidebar flex-shrink-0">
              <Navigation />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 flex flex-col bg-background">
              <main className="flex-1 min-h-0">
                <div className="h-full px-8 py-6 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/library" replace />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/knowledge-base" element={<KnowledgeBase />} />
                    <Route path="/plugins" element={<Plugins />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </HashRouter>
      </ContextMenuProvider>
    </ThemeProvider>
  );
}

export default App;
