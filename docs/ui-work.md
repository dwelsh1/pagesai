# UI Redesign Work Plan

## Overview
Complete redesign of the PagesAI interface to match the desired layout with proper header, sidebar, toolbar, and full-width page content.

## Current State Analysis
- Simple textarea editor instead of BlockNote
- Theme toggle in wrong location (sidebar instead of header)
- No breadcrumbs navigation
- No user dropdown with logout
- Page content in separate box instead of full-width
- Missing BlockNote toolbar

## Target Layout Structure

### Header (Top Bar)
- **Left Section**: Pages title, theme toggle (sun/moon), + (new page), templates icon
- **Center Section**: Breadcrumbs navigation (e.g., "Home > LLMs")
- **Right Section**: User avatar/name with dropdown containing logout option

### Main Content Area
- **Left Sidebar**: Search bar and Favorites section (existing)
- **Toolbar Section**: BlockNote formatting toolbar (horizontal)
- **Page Content**: Full-width BlockNote editor (no container box)

## Implementation Tasks

### Phase 1: Header Redesign
1. **Create new header component** (`src/components/header.tsx`)
   - Move theme toggle from sidebar to header
   - Add Pages title
   - Add + button for new page creation
   - Add templates icon (placeholder for future feature)
   - Add breadcrumbs component
   - Add user dropdown with logout

2. **Update layout structure** (`app/(app)/layout.tsx`)
   - Remove theme toggle from sidebar
   - Add new header component
   - Restructure layout to accommodate new header

### Phase 2: BlockNote Integration
1. **Fix BlockNote editor** (`src/components/editor.tsx`)
   - Replace simple textarea with proper BlockNote editor
   - Implement proper content loading/saving with JSON format
   - Add loading states and error handling
   - Ensure SSR compatibility with dynamic imports

2. **Add BlockNote toolbar** (`src/components/blocknote-toolbar.tsx`)
   - Create formatting toolbar component
   - Position between sidebar and page content
   - Include common formatting options (bold, italic, headings, etc.)

### Phase 3: Layout Restructuring
1. **Update main layout** (`app/(app)/layout.tsx`)
   - Remove page content container/box
   - Make page content full-width
   - Position toolbar between sidebar and content
   - Ensure responsive design

2. **Update sidebar** (`src/components/sidebar.tsx`)
   - Keep search and favorites sections
   - Remove theme toggle (moved to header)
   - Ensure proper spacing and layout

### Phase 4: User Management
1. **Create user dropdown** (`src/components/user-dropdown.tsx`)
   - User avatar/name display
   - Dropdown menu with logout option
   - Proper click handling and positioning

2. **Update authentication flow**
   - Ensure logout works from dropdown
   - Handle user state properly
   - Update middleware if needed

## Technical Considerations

### BlockNote Integration
- Use dynamic imports to avoid SSR issues
- Implement proper content serialization (JSON format)
- Handle loading states and error cases
- Ensure toolbar and editor work together

### Layout Responsiveness
- Ensure header works on mobile devices
- Make sidebar collapsible if needed
- Ensure toolbar is accessible on all screen sizes
- Test with different content lengths

### State Management
- Page navigation state for breadcrumbs
- User authentication state
- Theme state (moved from sidebar to header)
- Editor content state

## File Changes Required

### New Files
- `src/components/header.tsx` - Main header component
- `src/components/blocknote-toolbar.tsx` - BlockNote formatting toolbar
- `src/components/user-dropdown.tsx` - User dropdown with logout
- `src/components/breadcrumbs.tsx` - Breadcrumb navigation

### Modified Files
- `app/(app)/layout.tsx` - Main layout restructure
- `src/components/editor.tsx` - Replace with BlockNote editor
- `src/components/sidebar.tsx` - Remove theme toggle, keep search/favorites
- `src/components/theme-toggle.tsx` - Update for header placement

### Dependencies
- Ensure `@blocknote/react` is properly installed
- May need additional BlockNote packages for toolbar
- Update TypeScript types for new components

## Testing Requirements

### Unit Tests
- Test header component functionality
- Test user dropdown interactions
- Test breadcrumb navigation
- Test BlockNote editor integration

### E2E Tests
- Test complete user flow with new layout
- Test theme toggle in header
- Test page creation and editing
- Test logout functionality
- Test responsive design

### Visual Tests
- Take snapshots of new layout
- Test different screen sizes
- Verify accessibility compliance

## Success Criteria
- [ ] Header contains all required elements in correct positions
- [ ] BlockNote editor works properly with toolbar
- [ ] Page content fills full width (no container box)
- [ ] User dropdown works with logout functionality
- [ ] Breadcrumbs show current page hierarchy
- [ ] Theme toggle works from header location
- [ ] Responsive design works on all screen sizes
- [ ] All existing functionality preserved

## Timeline
- **Phase 1**: Header redesign (2-3 hours)
- **Phase 2**: BlockNote integration (3-4 hours)
- **Phase 3**: Layout restructuring (1-2 hours)
- **Phase 4**: User management (1-2 hours)
- **Testing & Polish**: (1-2 hours)

**Total Estimated Time**: 8-13 hours

## Notes
- Prioritize getting BlockNote working first as it's the core functionality
- Ensure backward compatibility with existing pages
- Test thoroughly on different devices and browsers
- Consider accessibility requirements throughout implementation
