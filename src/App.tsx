import React, { useState } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { ProgressBar } from './components/ProgressBar';
import { DocumentationList } from './components/DocumentationList';
import type { Scope, DocumentationItem } from './types/documentation';

const SAMPLE_ITEMS: DocumentationItem[] = [
  {
    name: "Login Button",
    type: "Frame",
    interactions: [
      { trigger: 'click', action: 'Navigate to /dashboard' },
      { trigger: 'hover', action: 'Show tooltip' }
    ]
  },
  {
    name: "Onboarding Modal",
    type: "Frame",
    interactions: [
      { trigger: 'timeout', action: 'Show after 3s' },
      { trigger: 'click', action: 'Close modal' }
    ]
  },
  {
    name: "Navigation Menu",
    type: "Frame",
    interactions: [
      { trigger: 'hover', action: 'Expand submenu' },
      { trigger: 'click', action: 'Navigate to section' }
    ]
  }
];

function App() {
  const [isDark, setIsDark] = useState(false);
  const [scope, setScope] = useState<Scope>('current');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 flex flex-col h-full">
        <Header 
          isDark={isDark} 
          onThemeToggle={() => setIsDark(!isDark)} 
        />
        
        <Controls
          scope={scope}
          onScopeChange={setScope}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {isGenerating && <ProgressBar progress={progress} />}

        <DocumentationList items={SAMPLE_ITEMS} />
      </div>
    </div>
  );
}

export default App;