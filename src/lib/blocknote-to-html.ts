/**
 * Converts BlockNote JSON format to HTML for TipTap display
 */

interface BlockNoteTextNode {
  type: 'text';
  text: string;
  styles?: Record<string, boolean>;
}

interface BlockNoteContentNode {
  type: string;
  content?: BlockNoteTextNode[];
  props?: Record<string, any>;
}

type BlockNoteNode = BlockNoteContentNode | BlockNoteTextNode;

export function blockNoteToHtml(blockNoteJson: string | BlockNoteNode[]): string {
  try {
    let blocks: BlockNoteNode[];
    
    if (typeof blockNoteJson === 'string') {
      blocks = JSON.parse(blockNoteJson);
    } else {
      blocks = blockNoteJson;
    }

    if (!Array.isArray(blocks)) {
      return '<p>Invalid content format</p>';
    }

    return blocks.map(block => convertBlockToHtml(block)).join('');
  } catch (error) {
    console.error('Error converting BlockNote to HTML:', error);
    return '<p>Error loading content</p>';
  }
}

function convertBlockToHtml(block: BlockNoteNode): string {
  if (block.type === 'text') {
    const textBlock = block as BlockNoteTextNode;
    return applyTextStyles(textBlock.text, textBlock.styles || {});
  }

  const contentBlock = block as BlockNoteContentNode;
  const content = contentBlock.content || [];
  const innerHtml = content.map(node => convertBlockToHtml(node)).join('');

  switch (contentBlock.type) {
    case 'paragraph':
      return `<p>${innerHtml}</p>`;
    
    case 'heading':
      const level = contentBlock.props?.level || 1;
      return `<h${level}>${innerHtml}</h${level}>`;
    
    case 'bulletListItem':
      return `<li>${innerHtml}</li>`;
    
    case 'numberedListItem':
      return `<li>${innerHtml}</li>`;
    
    case 'checkListItem':
      const checked = contentBlock.props?.checked ? 'checked' : '';
      return `<li><input type="checkbox" ${checked} disabled> ${innerHtml}</li>`;
    
    case 'codeBlock':
      return `<pre><code>${innerHtml}</code></pre>`;
    
    case 'quote':
      return `<blockquote>${innerHtml}</blockquote>`;
    
    case 'divider':
      return '<hr>';
    
    case 'image':
      const src = contentBlock.props?.url || '';
      const alt = contentBlock.props?.caption || '';
      return `<img src="${src}" alt="${alt}" />`;
    
    case 'link':
      const url = contentBlock.props?.url || '#';
      return `<a href="${url}">${innerHtml}</a>`;
    
    default:
      return `<div>${innerHtml}</div>`;
  }
}

function applyTextStyles(text: string, styles: Record<string, boolean>): string {
  let result = text;
  
  if (styles.bold) {
    result = `<strong>${result}</strong>`;
  }
  
  if (styles.italic) {
    result = `<em>${result}</em>`;
  }
  
  if (styles.underline) {
    result = `<u>${result}</u>`;
  }
  
  if (styles.strike) {
    result = `<s>${result}</s>`;
  }
  
  if (styles.code) {
    result = `<code>${result}</code>`;
  }
  
  return result;
}
