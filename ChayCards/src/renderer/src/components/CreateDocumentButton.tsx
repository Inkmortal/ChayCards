import React, { useState, useRef, useEffect } from 'react';

interface Plugin {
  type: string;
  displayName: string;
}

interface CreateDocumentButtonProps {
  onCreateDocument: (type: string) => void;
}

export const CreateDocumentButton: React.FC<CreateDocumentButtonProps> = ({ onCreateDocument }) => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPlugins = async () => {
      const pluginsData = await window.electron.ipcRenderer.invoke('get-plugins');
      setPlugins(pluginsData);
    };
    loadPlugins();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPlugins = plugins.filter(plugin =>
    plugin.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={buttonRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <span>Create Document</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded border-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search document types..."
              autoFocus
            />
          </div>

          <ul className="max-h-60 overflow-auto py-1">
            {filteredPlugins.map((plugin) => (
              <li
                key={plugin.type}
                onClick={() => {
                  onCreateDocument(plugin.type);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {plugin.displayName}
              </li>
            ))}
            {filteredPlugins.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No document types found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
