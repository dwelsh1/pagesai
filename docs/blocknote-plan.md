# BlockNote Implementation Plan

## Overview
This document outlines the comprehensive plan to implement BlockNote editor with full functionality including floating toolbar, slash commands, and proper integration with our existing UI structure.

## Current Issues to Address

### 1. Header Layout Issues
- **Problem**: Pages section and breadcrumbs are in the same row
- **Solution**: Create separate header sections with proper visual separation
- **Implementation**: Add border/divider between Pages section and breadcrumbs section

### 2. Sidebar Collapse Functionality
- **Problem**: Sidebar toggle (> button) collapses toolbar/page instead of sidebar
- **Solution**: Fix the collapse logic to target the sidebar container
- **Implementation**: Update the sidebar toggle handler to properly control sidebar visibility

### 3. Breadcrumbs Display
- **Problem**: Static "Home / Current Page" display regardless of actual page
- **Solution**: Implement dynamic breadcrumbs with proper navigation
- **Implementation**: 
  - Add home icon
  - Show actual page title
  - Make current page bold
  - Use proper separators (>)

### 4. BlockNote Editor Integration
- **Problem**: Placeholder toolbar instead of full BlockNote functionality
- **Solution**: Implement complete BlockNote editor with floating toolbar
- **Implementation**: Replace current editor with full BlockNote implementation

## BlockNote Implementation Strategy

### Phase 1: Package Installation and Setup
Based on the [BlockNote ShadCN example](https://www.blocknotejs.org/examples/basic/shadcn), we need:

```bash
npm install @blocknote/react @blocknote/core @blocknote/shadcn
```

### Phase 2: Core BlockNote Integration

#### 2.1 Basic Editor Setup
```typescript
// src/components/blocknote-editor.tsx
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
```

#### 2.2 Dynamic Import for SSR Compatibility
```typescript
// Use dynamic import to prevent SSR issues
const BlockNoteEditor = dynamic(() => import('./blocknote-editor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});
```

### Phase 3: Advanced Features Implementation

#### 3.1 Floating Toolbar
- **Feature**: Context-aware floating toolbar that appears when text is selected
- **Implementation**: Use BlockNote's built-in floating toolbar
- **Configuration**: Customize toolbar buttons and behavior

#### 3.2 Slash Commands (/)
- **Feature**: Type "/" to open command palette for inserting blocks
- **Available Commands**:
  - Headings (H1, H2, H3)
  - Basic blocks (paragraph, quote, toggle list)
  - Lists (bulleted, numbered)
  - Code blocks
  - Tables
  - Images
  - Custom blocks

#### 3.3 Block Types and Schema
- **Default Blocks**: Paragraph, headings, lists, quotes, code, tables
- **Custom Blocks**: Potentially add custom block types for our use case
- **Schema Configuration**: Customize which blocks are available

#### 3.4 Content Persistence
- **Format**: Store content as BlockNote's JSON format
- **API Integration**: Update existing API to handle BlockNote JSON
- **Migration**: Convert existing text content to BlockNote format

### Phase 4: UI Integration ✅ COMPLETED

#### 4.1 Remove Fixed Toolbar ✅
- **Action**: Remove the current placeholder toolbar section
- **Reason**: BlockNote provides its own floating toolbar

#### 4.2 Full-Width Editor ✅
- **Layout**: Editor should fill the entire content area
- **Styling**: Ensure proper spacing and responsive design

#### 4.3 Theme Integration ✅
- **Dark Mode**: Ensure BlockNote respects our theme system
- **Custom Styling**: Apply our design system colors and fonts

## Technical Implementation Details

### File Structure
```
src/components/
├── blocknote-editor.tsx          # Main BlockNote editor component
├── blocknote-toolbar.tsx         # Custom toolbar (if needed)
└── editor.tsx                    # Updated editor wrapper

app/(app)/
├── layout.tsx                    # Updated layout with proper header sections
└── pages/[id]/page.tsx           # Page component with breadcrumbs

src/lib/
└── blocknote-config.ts           # BlockNote configuration and schemas
```

### Key Components

#### 1. BlockNote Editor Component
```typescript
interface BlockNoteEditorProps {
  pageId: string;
  initialContent?: any;
  onContentChange?: (content: any) => void;
}

export default function BlockNoteEditor({ pageId, initialContent, onContentChange }: BlockNoteEditorProps) {
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: "paragraph",
        content: "Start writing...",
      },
    ],
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={onContentChange}
      shadCNComponents={{
        // Custom ShadCN components if needed
      }}
    />
  );
}
```

#### 2. Updated Layout Structure
```typescript
// app/(app)/layout.tsx
<div className="h-screen flex flex-col">
  {/* Header Section 1: Pages Controls */}
  <div className="border-b">
    <div className="flex items-center space-x-3 px-4 py-3">
      <h1>Pages</h1>
      <ThemeToggle />
      <NewPageButton />
      <TemplatesButton />
      <SidebarToggle />
    </div>
  </div>
  
  {/* Header Section 2: Breadcrumbs and User */}
  <div className="border-b">
    <div className="flex items-center justify-between px-4 py-2">
      <Breadcrumbs />
      <UserDropdown />
    </div>
  </div>
  
  {/* Main Content */}
  <div className="flex-1 flex">
    <Sidebar />
    <main className="flex-1">
      {children}
    </main>
  </div>
</div>
```

#### 3. Dynamic Breadcrumbs Component
```typescript
interface BreadcrumbsProps {
  currentPage?: {
    id: string;
    title: string;
  };
}

export default function Breadcrumbs({ currentPage }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2">
      <HomeIcon />
      <span>Home</span>
      {currentPage && (
        <>
          <span>></span>
          <span className="font-bold">{currentPage.title}</span>
        </>
      )}
    </nav>
  );
}
```

### API Updates

#### Content Storage Format
```typescript
// Update API to handle BlockNote JSON format
interface PageContent {
  contentJson: {
    blocks: Array<{
      type: string;
      content: any;
      props?: any;
    }>;
  };
}
```

#### Migration Strategy
```typescript
// Convert existing text content to BlockNote format
function convertTextToBlockNote(text: string) {
  return [
    {
      type: "paragraph",
      content: text,
    },
  ];
}
```

## Testing Strategy

### Unit Tests
- Test BlockNote editor initialization
- Test content saving and loading
- Test slash command functionality
- Test floating toolbar behavior

### Integration Tests
- Test complete editor workflow
- Test content persistence across page reloads
- Test theme switching with editor

### E2E Tests
- Test creating and editing pages
- Test slash commands and block insertion
- Test floating toolbar interactions
- Test content saving and loading

## Performance Considerations

### Bundle Size
- BlockNote adds significant bundle size
- Use dynamic imports to reduce initial load
- Consider code splitting for editor components

### Memory Management
- Properly dispose of editor instances
- Handle large documents efficiently
- Implement proper cleanup on component unmount

## Accessibility

### Keyboard Navigation
- Ensure all BlockNote features are keyboard accessible
- Test with screen readers
- Implement proper ARIA labels

### Focus Management
- Proper focus handling in editor
- Focus management during toolbar interactions
- Focus restoration after modal interactions

## Rollback Plan

### Fallback Strategy
- Keep current textarea editor as fallback
- Implement feature flags for BlockNote
- Gradual rollout with A/B testing

### Data Migration
- Ensure backward compatibility with existing content
- Implement migration scripts for content format
- Maintain data integrity during transition

## Success Criteria

### Functional Requirements
- [ ] Floating toolbar appears on text selection
- [ ] Slash commands work for all block types
- [ ] Content saves and loads correctly
- [ ] Theme integration works properly
- [ ] Responsive design maintained

### Performance Requirements
- [ ] Editor loads within 2 seconds
- [ ] Content saves within 500ms
- [ ] No memory leaks during extended use
- [ ] Bundle size increase < 500KB

### User Experience Requirements
- [ ] Intuitive slash command interface
- [ ] Smooth floating toolbar animations
- [ ] Consistent with existing UI design
- [ ] Accessible keyboard navigation

## Timeline

### Week 1: Foundation
- Package installation and basic setup
- Dynamic import implementation
- Basic editor integration

### Week 2: Core Features
- Floating toolbar implementation
- Slash commands functionality
- Content persistence

### Week 3: UI Integration
- Header layout fixes
- Breadcrumbs implementation
- Sidebar collapse functionality

### Week 4: Polish and Testing
- Theme integration
- Performance optimization
- Comprehensive testing
- Documentation updates

## Dependencies

### Required Packages
```json
{
  "@blocknote/react": "^0.41.1",
  "@blocknote/core": "^0.41.1",
  "@blocknote/shadcn": "^0.41.1"
}
```

### Existing Dependencies
- Next.js 15 (already installed)
- React 19 (already installed)
- Tailwind CSS (already installed)
- ShadCN UI (already installed)

## Risk Assessment

### High Risk
- **SSR Compatibility**: BlockNote requires client-side rendering
- **Bundle Size**: Significant increase in application size
- **Content Migration**: Existing content format changes

### Medium Risk
- **Performance**: Editor performance with large documents
- **Theme Integration**: Ensuring consistent styling
- **Accessibility**: Maintaining accessibility standards

### Low Risk
- **API Changes**: Minimal changes to existing API structure
- **User Experience**: BlockNote provides excellent UX out of the box

## Conclusion ✅ COMPLETED

This plan provided a comprehensive approach to implementing BlockNote with all requested features. The phased approach ensured minimal disruption to existing functionality while delivering a modern, feature-rich editing experience.

The implementation successfully transformed our simple textarea editor into a powerful, Notion-like editing experience with floating toolbars, slash commands, and rich block-based content editing.

## Final Implementation Status (v0.3.0)

### ✅ All Goals Achieved
- **Header Layout**: Single row with vertical separator and proper breadcrumb positioning
- **BlockNote Integration**: Full editor with floating toolbar and slash commands
- **Theme Consistency**: Proper dark/light mode support throughout
- **Code Block Styling**: Light gray backgrounds for better readability
- **Content Persistence**: JSON format with auto-save functionality
- **UI Polish**: All layout issues resolved and tested

### 🚀 Ready for Release
This implementation represents a complete BlockNote integration with all requested UI improvements. The application now provides a modern, Notion-like editing experience with proper theming and layout.
