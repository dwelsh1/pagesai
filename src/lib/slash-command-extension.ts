import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export interface SlashCommandOptions {
  suggestion: {
    char: string;
    allowSpaces: boolean;
    startOfLine: boolean;
    decorationTag: string;
    decorationClass: string;
    command: (props: { editor: any; range: any; props: any }) => void;
  };
}

export const SlashCommand = Extension.create<SlashCommandOptions>({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        allowSpaces: false,
        startOfLine: false,
        decorationTag: 'span',
        decorationClass: 'slash-command-decoration',
        command: ({ editor, range, props }) => {
          // This will be handled by the React component
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommand'),
        props: {
              handleKeyDown: (view, event) => {
                if (event.key === '/') {
                  console.log('🔍 Slash key detected');
                  const { state } = view;
                  const { selection } = state;
                  const { $from } = selection;
                  
                  // Check if we're at the start of a line or after a space
                  const isAtStart = $from.parentOffset === 0;
                  const prevChar = $from.nodeBefore?.textContent?.slice(-1);
                  const isAfterSpace = prevChar === ' ' || prevChar === '\n';
                  
                  console.log('🔍 Slash conditions:', {
                    isAtStart,
                    prevChar,
                    isAfterSpace,
                    parentOffset: $from.parentOffset
                  });
                  
                  if (isAtStart || isAfterSpace) {
                    console.log('🔍 Triggering slash command menu');
                    // Don't insert the slash, just trigger the command menu
                    setTimeout(() => {
                      const customEvent = new CustomEvent('slashCommand', {
                        detail: {
                          editor: this.editor,
                          position: $from.pos,
                          view: view
                        }
                      });
                      window.dispatchEvent(customEvent);
                    }, 0);
                    
                    return true; // Prevent the '/' from being inserted
                  }
                }
                return false;
              },
        },
      }),
    ];
  },
});
