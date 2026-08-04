'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('ikasi-theme');
    if (savedTheme === 'light') {
      setIsLight(true);
      document.body.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('ikasi-theme', 'dark');
      setIsLight(false);
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('ikasi-theme', 'light');
      setIsLight(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-ikasi-medium/80 border border-ikasi-cool/40 text-ikasi-accent hover:border-ikasi-accent transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
      title={isLight ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
    >
      {isLight ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-amber-400" />}
      <span className="hidden sm:inline">{isLight ? 'Modo Oscuro' : 'Modo Claro'}</span>
    </button>
  );
}
