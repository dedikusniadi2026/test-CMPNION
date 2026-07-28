import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, ClipboardList, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store';
import { cn } from '../../lib/utils';

const COMMANDS = [
  { id: 'go-dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, action: () => '/', description: 'Navigate to dashboard' },
  { id: 'go-orders', label: 'Go to Orders', icon: ClipboardList, action: () => '/orders', description: 'View all orders' },
  { id: 'toggle-theme', label: 'Toggle Theme', icon: () => null, action: () => 'theme', description: 'Switch between light and dark mode' },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = COMMANDS.filter(
    cmd => cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [commandPaletteOpen]);

  const executeCommand = useCallback((cmdId: string) => {
    const cmd = COMMANDS.find(c => c.id === cmdId);
    if (!cmd) return;

    setCommandPaletteOpen(false);

    if (cmdId === 'toggle-theme') {
      toggleTheme();
    } else {
      const path = cmd.action();
      if (typeof path === 'string') {
        navigate(path);
      }
    }
  }, [navigate, setCommandPaletteOpen, toggleTheme]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      executeCommand(filteredCommands[selectedIndex].id);
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-400">
                  ESC
                </kbd>
              </div>
              <div className="p-2 max-h-72 overflow-y-auto">
                {filteredCommands.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-400">
                    No results found
                  </div>
                ) : (
                  filteredCommands.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                        i === selectedIndex
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      )}
                    >
                      <cmd.icon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="flex-1 text-left">{cmd.label}</span>
                      <span className="text-xs text-gray-400">{cmd.description}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-gray-300" />
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
