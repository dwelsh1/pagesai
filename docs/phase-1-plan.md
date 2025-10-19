# Phase 1 Plan: Main UI Components

## 📋 **Overview**

This document outlines the implementation plan for the core UI components that will form the main interface of PagesAI - a Notion-style application. The plan focuses on creating four essential components: Header, Footer, Sidebar, and Page Section with BlockNote integration.

## 🎯 **Objectives**

- Create a modern, professional Notion-style interface
- Implement responsive design with mobile support
- Integrate BlockNote editor for rich text editing
- Support light/dark theme switching
- Enable drag & drop functionality for page organization
- Maintain 95%+ test coverage
- Follow accessibility best practices

## 🎨 **Design System Approach**

### **Tailwind CSS Foundation**
- **Utility-first approach** for rapid, consistent development
- **Responsive design** with mobile-first breakpoints
- **Dark mode support** using `dark:` variants
- **Custom CSS variables** for theme switching
- **Consistent spacing** using Tailwind's spacing scale (4px base unit)
- **Typography system** with proper font weights and sizes
- **Color palette** with semantic color tokens

### **shadcn/ui Component Library**
- **Button**: Theme toggle, create page, templates, user dropdown
- **Tooltip**: Hover states for all interactive elements
- **Dropdown Menu**: User dropdown with logout option
- **Breadcrumb**: Dynamic navigation breadcrumbs
- **Separator**: Vertical divider lines
- **Sheet/Drawer**: Mobile sidebar implementation
- **Badge**: Page count display in footer
- **Skeleton**: Loading states for better UX
- **Scroll Area**: Sidebar scrolling with custom scrollbars
- **Resizable**: Sidebar width adjustment
- **Input**: Search functionality
- **Avatar**: User profile display

### **Modern Design Features**
- **Clean, minimal interface** inspired by Notion's design language
- **Smooth animations** and micro-interactions
- **Subtle shadows** and borders for visual hierarchy
- **Consistent hover states** with smooth transitions
- **Focus management** for keyboard navigation
- **Professional typography** with proper line heights
- **Color contrast** meeting WCAG AA standards

### **Theme Integration**
- **CSS custom properties** for light/dark mode colors
- **Tailwind dark mode** classes throughout components
- **shadcn/ui theme** configuration
- **Smooth theme transitions** with CSS transitions
- **System preference detection** for initial theme
- **Theme persistence** in localStorage

## 🏗️ **Component Architecture**

### **1. Header Component**
**Purpose**: Top navigation bar with core actions and user controls

**Features**:
- **Theme Toggle**: Moon/sun icon with smooth transition
- **Create Page Button**: Plus icon with tooltip "Create new page"
- **Templates Button**: Page icon with tooltip "Templates" (disabled for Phase 1)
- **Breadcrumbs**: Dynamic navigation showing current page path
- **User Dropdown**: Avatar, username, and logout option
- **Responsive Design**: Mobile-friendly with hamburger menu

**Technical Implementation**:
- Uses shadcn/ui Button, DropdownMenu, and Breadcrumb components
- Theme context integration
- Responsive breakpoints for mobile
- Keyboard navigation support

### **2. Footer Component**
**Purpose**: Simple footer displaying page statistics

**Features**:
- **Page Counter**: Shows total number of pages
- **Minimal Design**: Non-intrusive, clean appearance
- **Theme Support**: Adapts to light/dark mode

**Technical Implementation**:
- Uses shadcn/ui Badge component
- Real-time page count updates
- Responsive text sizing

### **3. Sidebar Component**
**Purpose**: Hierarchical page navigation with advanced functionality

**Features**:
- **Hierarchical Structure**: Parent-child page relationships
- **Drag & Drop**: Reorder pages and create subpages
- **Collapsible**: Toggle sidebar visibility
- **Resizable**: Adjustable width with min/max constraints
- **Search**: Filter pages by title
- **Favorites**: Star pages for quick access
- **Smooth Animations**: Expand/collapse transitions

**Technical Implementation**:
- Uses @dnd-kit for drag and drop
- React Context for page hierarchy state
- Resizable panel implementation
- Virtual scrolling for performance
- Search with debounced input

### **4. Page Section Component**
**Purpose**: Main content area with BlockNote editor integration

**Features**:
- **BlockNote Editor**: Full-featured rich text editor
- **Document Persistence**: Auto-save functionality
- **Real-time Updates**: Live collaboration support
- **Loading States**: Skeleton loaders
- **Error Handling**: Graceful error states

**Technical Implementation**:
- BlockNote core editor integration
- Document state management
- Auto-save with debouncing
- Error boundary implementation

## 🗄️ **Database Schema Extensions**

### **Pages Table**
```sql
model Page {
  id          String   @id @default(cuid())
  title       String
  content     Json?    // BlockNote document JSON
  parentId    String?  // For hierarchical structure
  order       Int      // For drag & drop ordering
  isPublished Boolean  @default(false)
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  parent      Page?    @relation("PageHierarchy", fields: [parentId], references: [id])
  children    Page[]   @relation("PageHierarchy")
  
  @@index([userId])
  @@index([parentId])
  @@index([isFavorite])
}
```

## 📁 **File Structure**

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── PageSection.tsx
│   ├── ui/
│   │   ├── ThemeToggle.tsx
│   │   ├── UserDropdown.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── PageItem.tsx
│   │   └── SearchInput.tsx
│   └── editor/
│       └── BlockNoteEditor.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   └── PageContext.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── usePages.ts
│   └── useDragDrop.ts
├── lib/
│   ├── theme.ts
│   ├── dragDrop.ts
│   └── pageUtils.ts
└── types/
    └── page.ts

tests/
├── components/
│   ├── layout/
│   ├── ui/
│   └── editor/
├── contexts/
├── hooks/
└── lib/
```

## 🧪 **Testing Strategy**

### **Unit Tests (95%+ Coverage)**
- **Component Rendering**: Test all components render correctly
- **User Interactions**: Test clicks, hovers, keyboard navigation
- **Theme Switching**: Test light/dark mode transitions
- **Drag & Drop**: Test page reordering and hierarchy changes
- **Error Handling**: Test error states and recovery
- **Accessibility**: Test ARIA labels, keyboard navigation

### **Integration Tests**
- **Component Communication**: Test context providers and consumers
- **State Management**: Test state updates across components
- **API Interactions**: Test page CRUD operations
- **Theme Persistence**: Test theme saving and loading

### **Test Data Attributes**
All interactive elements will include `data-testid` attributes:
- `data-testid="theme-toggle"`
- `data-testid="create-page-button"`
- `data-testid="user-dropdown"`
- `data-testid="page-item-{id}"`
- `data-testid="sidebar-toggle"`
- `data-testid="search-input"`

## ♿ **Accessibility Features**

### **Keyboard Navigation**
- **Tab Order**: Logical tab sequence through all interactive elements
- **Keyboard Shortcuts**: Power user features (Ctrl+N for new page)
- **Focus Management**: Proper focus handling in modals and dropdowns
- **Skip Links**: Quick navigation to main content

### **Screen Reader Support**
- **ARIA Labels**: Descriptive labels for all interactive elements
- **ARIA Roles**: Proper semantic roles for complex components
- **Live Regions**: Announce dynamic content changes
- **Descriptive Text**: Clear descriptions for complex interactions

### **Visual Accessibility**
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)
- **Focus Indicators**: Clear visual focus states
- **High Contrast Mode**: Support for high contrast themes
- **Text Scaling**: Support for browser zoom up to 200%

## ⚡ **Performance Optimizations**

### **Rendering Performance**
- **React.memo**: Memoize expensive components
- **useMemo/useCallback**: Optimize expensive calculations
- **Virtual Scrolling**: For large page lists in sidebar
- **Lazy Loading**: Load pages on demand

### **Network Performance**
- **Debounced Search**: Optimize search API calls
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: Cache page data and user preferences
- **Bundle Splitting**: Code splitting for better loading

### **Memory Management**
- **Cleanup**: Proper cleanup of event listeners
- **Memory Leaks**: Prevent memory leaks in drag & drop
- **Garbage Collection**: Optimize object creation

## 🚀 **Implementation Phases**

### **Phase 1A: Core Components (Week 1)**
- [ ] Set up theme system and context
- [ ] Create Header component with theme toggle
- [ ] Create Footer component with page count
- [ ] Create basic Sidebar with page list
- [ ] Create PageSection with BlockNote integration
- [ ] Implement basic responsive design

### **Phase 1B: Advanced Features (Week 2)**
- [ ] Add drag & drop functionality to sidebar
- [ ] Implement sidebar collapse/expand
- [ ] Add breadcrumb navigation
- [ ] Create user dropdown with logout
- [ ] Add search functionality
- [ ] Implement error handling and loading states

### **Phase 1C: Polish & Testing (Week 3)**
- [ ] Write comprehensive unit tests
- [ ] Add integration tests
- [ ] Implement accessibility improvements
- [ ] Add performance optimizations
- [ ] Refine theme and animations
- [ ] Add tooltips to all interactive elements

## 🔧 **Technical Dependencies**

### **New Packages Required**
```json
{
  "@blocknote/core": "^0.15.0",
  "@blocknote/react": "^0.15.0",
  "@blocknote/mantine": "^0.15.0",
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "react-resizable-panels": "^2.0.0",
  "framer-motion": "^11.0.0"
}
```

### **shadcn/ui Components to Add**
- Button
- Tooltip
- DropdownMenu
- Breadcrumb
- Separator
- Sheet
- Badge
- Skeleton
- ScrollArea
- Resizable
- Input
- Avatar

## 📊 **Success Metrics**

### **Code Quality**
- **Test Coverage**: 95%+ for all components
- **TypeScript**: 100% type coverage, no `any` types
- **ESLint**: Zero linting errors
- **Performance**: Lighthouse score 90+

### **User Experience**
- **Accessibility**: WCAG AA compliance
- **Responsive**: Works on all screen sizes
- **Performance**: < 100ms interaction response
- **Theme**: Smooth theme transitions

### **Functionality**
- **Drag & Drop**: Smooth page reordering
- **Search**: < 200ms search response
- **Auto-save**: < 1s save delay
- **Error Handling**: Graceful error recovery

## 🔮 **Future Enhancements**

### **Phase 2 Features**
- **Page Templates**: Pre-built page layouts
- **Advanced Search**: Full-text search with SQLite FTS5
- **Collaboration**: Real-time editing indicators
- **Page History**: Version history and restore
- **Export Options**: Markdown, PDF, HTML export

### **Phase 3 Features**
- **Custom Icons**: User-defined page icons
- **Page Tags**: Categorization system
- **Advanced Filtering**: Filter by date, tags, author
- **Keyboard Shortcuts**: Power user features
- **Page Analytics**: View counts and edit history

## 📝 **Recommendations**

### **Design Improvements**
1. **Micro-interactions**: Add subtle animations for better UX
2. **Loading States**: Implement skeleton loaders for all async operations
3. **Empty States**: Create engaging empty state designs
4. **Error States**: Design user-friendly error messages
5. **Success States**: Provide clear feedback for user actions

### **Technical Improvements**
1. **State Management**: Consider Zustand for complex state
2. **Caching**: Implement React Query for server state
3. **Monitoring**: Add error tracking and performance monitoring
4. **Analytics**: Track user interactions for insights
5. **PWA**: Consider Progressive Web App features

### **Accessibility Improvements**
1. **Screen Reader**: Test with actual screen readers
2. **Keyboard Only**: Ensure full keyboard navigation
3. **Voice Control**: Test with voice control software
4. **High Contrast**: Test with high contrast themes
5. **Zoom**: Test with browser zoom up to 200%

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: After Phase 1A completion
