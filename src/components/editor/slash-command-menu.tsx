'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { slashCommands, getFilteredCommands, getCommandsByCategory, SlashCommand } from '@/lib/slash-commands';
import { ChevronRight } from 'lucide-react';

interface SlashCommandMenuProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

export function SlashCommandMenu({ editor, isOpen, onClose, position }: SlashCommandMenuProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = getFilteredCommands(query);
  const commandsByCategory = getCommandsByCategory(filteredCommands);

  // Focus input when menu opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when menu opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  const executeCommand = (command: SlashCommand) => {
    // Execute the command directly
    command.command(editor);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'formatting': return '🎨';
      case 'structure': return '📝';
      case 'alignment': return '↔️';
      case 'media': return '🖼️';
      case 'utility': return '🔧';
      default: return '📋';
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'formatting': return 'Formatting';
      case 'structure': return 'Structure';
      case 'alignment': return 'Alignment';
      case 'media': return 'Media';
      case 'utility': return 'Utility';
      default: return 'Other';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-w-sm w-full"
      style={{
        top: position.top,
        left: position.left,
        maxHeight: '400px',
        overflow: 'hidden'
      }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-100">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search commands..."
          value={query}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Commands List */}
      <div className="max-h-80 overflow-y-auto">
        {Object.entries(commandsByCategory).map(([category, commands]) => {
          if (commands.length === 0) return null;
          
          return (
            <div key={category}>
              {/* Category Header */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
                  <span>{getCategoryIcon(category)}</span>
                  <span>{getCategoryTitle(category)}</span>
                </div>
              </div>

              {/* Commands in Category */}
              {commands.map((command, index) => {
                const globalIndex = filteredCommands.indexOf(command);
                const isSelected = globalIndex === selectedIndex;
                
                return (
                  <div
                    key={command.title}
                    className={`px-3 py-2 cursor-pointer border-b border-gray-50 last:border-b-0 ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded ${
                        isSelected ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <command.icon className={`w-4 h-4 ${
                          isSelected ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${
                          isSelected ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {command.title}
                        </div>
                        <div className={`text-xs ${
                          isSelected ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {command.description}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${
                        isSelected ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* No Results */}
        {filteredCommands.length === 0 && (
          <div className="px-3 py-4 text-center text-gray-500 text-sm">
            No commands found for "{query}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Use ↑↓ to navigate</span>
          <span>Enter to select</span>
        </div>
      </div>
    </div>
  );
}
