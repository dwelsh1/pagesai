import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

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
      Plugin.create({
        key: new PluginKey('slashCommand'),
        props: {
          handleKeyDown: (view, event) => {
            if (event.key === '/') {
              const { state, dispatch } = view;
              const { selection } = state;
              const { $from } = selection;
              
              // Check if we're at the start of a line or after a space
              const isAtStart = $from.parentOffset === 0;
              const prevChar = $from.nodeBefore?.textContent?.slice(-1);
              const isAfterSpace = prevChar === ' ' || prevChar === '\n';
              
              if (isAtStart || isAfterSpace) {
                // Insert the slash character
                const tr = state.tr.insertText('/');
                dispatch(tr);
                
                // Trigger the slash command
                setTimeout(() => {
                  const event = new CustomEvent('slashCommand', {
                    detail: {
                      editor: this.editor,
                      position: $from.pos
                    }
                  });
                  window.dispatchEvent(event);
                }, 0);
                
                return true;
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});
