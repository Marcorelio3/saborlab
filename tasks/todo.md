# SaborLab Rebuild Tasks

## Phase 1: Foundation

### Task 1: Clean repository structure and configure base settings
**Description**: Remove duplicate files, configure package.json scripts, set up environment variables structure.

**Acceptance criteria:**
- [ ] Repository has clean structure without duplicate CSS/JS
- [ ] .env.example has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- [ ] vite.config.ts configured with base '/saborlab/'
- [ ] package.json scripts are correct

**Dependencies**: None

**Files to create/modify:**
- `vite.config.ts`
- `.env.example`
- `package.json` (scripts review)

---

### Task 2: Set up Supabase connection with seed.sql idempotente
**Description**: Configure Supabase client, apply seed.sql with on conflict (id) do nothing, test connection.

**Acceptance criteria:**
- [ ] `isConfigured` returns true when env vars are set
- [ ] seed.sql applies idempotente no Supabase SQL Editor
- [ ] Database has 35 materials + 9 layouts A4 + 3 user test activities

**Dependencies**: None

**Files to create/modify:**
- `src/lib/supabase.ts`
- `supabase/seed.sql` (verify idempotente)
- `supabase/schema.sql`

---

### Task 3: Configure Vite with base '/saborlab/' for GitHub Pages
**Description**: Set up Vite base path so HashRouter works on GitHub Pages subpath.

**Acceptance criteria:**
- [ ] `base: '/saborlab/'` in vite.config.ts
- [ ] Local dev works with `npm run dev`
- [ ] Build produces correct asset paths

**Dependencies**: Task 1

**Files to create/modify:**
- `vite.config.ts`

---

### Task 4: Set up GitHub Actions workflow with _redirects copy
**Description**: Configure workflow to copy _redirects from public/ to dist/ after build.

**Acceptance criteria:**
- [ ] Workflow runs without errors
- [ ] _redirects file copied to dist/ after build
- [ ] GitHub Pages deploy succeeds

**Dependencies**: Task 1, Task 3

**Files to create/modify:**
- `.github/workflows/deploy.yml` (add cp command)

---

## Checkpoint: Foundation
- [ ] Build: `npm run build` completes successfully
- [ ] GitHub Pages deploy initiates without 404 errors
- [ ] Supabase connection configured and working
- [ ] All env vars in place

---

## Phase 2: Core Layout & Design

### Task 5: Implement main CSS with ui-ux-pro-max design system
**Description**: Create clean CSS with ui-ux-pro-max colors, no duplicates, proper gradients, shadows, and responsive design.

**Acceptance criteria:**
- [ ] CSS has var(--brand: #1e293b) and var(--accent: #3b82f6)
- [ ] No duplicate CSS rules
- [ ] Gradients: --gradient-primary, --gradient-accent, --gradient-warm
- [ ] Shadows: var(--shadow-md), var(--shadow-lg)
- [ ] Responsive breakpoints at 980px and 700px
- [ ] Print A4 styles work

**Dependencies**: Task 1

**Files to create/modify:**
- `src/styles.css` (rewrite do zero, clean)

---

### Task 6: Create Hero section with A4 preview and counters
**Description**: Build hero section with gradient background, A4 sheet preview, and material/activity counters.

**Acceptance criteria:**
- [ ] Hero renders with gradient background
- [ ] A4 sheet preview displays correctly
- [ ] Counters show material/activity counts
- [ ] Hero-art rotates -2deg as design

**Dependencies**: Task 5

**Files to create/modify:**
- `src/pages/Catalog.tsx` (hero section)

---

### Task 7: Build Library grid with cards and subject chips
**Description**: Create card grid with hover effects, subject chips for filtering, and proper styling.

**Acceptance criteria:**
- [ ] Cards have hover translateY(-6px) effect
- [ ] Subject chips filter materials by category
- [ ] Active chip has white text on accent background
- [ ] Card grid is responsive

**Dependencies**: Task 5

**Files to create/modify:**
- `src/pages/Catalog.tsx` (library section)
- `src/components/MaterialCard.tsx`
- `src/components/LayoutCard.tsx`

---

### Task 8: Implement Tabs system (Materiais/Atividades)
**Description**: Build tabs to switch between materials and activities view.

**Acceptance criteria:**
- [ ] Tabs switch between Materiais and Atividades
- [ ] Tab counts update dynamically
- [ ] Active tab has background var(--brand-soft)
- [ ] Tabs are responsive

**Dependencies**: Task 5

**Files to create/modify:**
- `src/pages/Catalog.tsx` (tabs section)

---

## Checkpoint: Core Layout
- [ ] Layout renders without console errors
- [ ] Design colors applied correctly
- [ ] Navigation works (no 404 on refresh)
- [ ] F5 recarga em qualquer página funciona

---

## Phase 3: Word-like Editor

### Task 9: Implement TipTap editor with Word-like features
**Description**: Set up TipTap editor with starter-kit, enable basic editing capabilities.

**Acceptance criteria:**
- [ ] Editor component renders without errors
- [ ] TipTap with starter-kit is initialized
- [ ] Content can be typed and formatted

**Dependencies**: Task 1

**Files to create/modify:**
- `src/pages/Editor.tsx`
- `src/components/EditorToolbar.tsx`

---

### Task 10: Add formatting toolbar (bold, italic, underline, colors)
**Description**: Add toolbar with buttons for bold, italic, underline, text color, background color.

**Acceptance criteria:**
- [ ] Toolbar buttons appear
- [ ] Bold formatting works (Ctrl+B or button)
- [ ] Italic formatting works (Ctrl+I or button)
- [ ] Underline works
- [ ] Text color changes
- [ ] Background color changes

**Dependencies**: Task 9

**Files to create/modify:**
- `src/components/EditorToolbar.tsx`
- `src/pages/Editor.tsx`

---

### Task 11: Add image insertion and formatting
**Description**: Add ability to insert images into the editor, resize, and format.

**Acceptance criteria:**
- [ ] Image upload dialog works
- [ ] Image inserts at cursor position
- [ ] Image can be resized
- [ ] Image wraps text appropriately

**Dependencies**: Task 9

**Files to create/modify:**
- `src/components/UploadDialog.tsx`
- `src/pages/Editor.tsx`

---

### Task 12: Add table creation and editing
**Description**: Add table button to insert tables, edit rows/columns.

**Acceptance criteria:**
- [ ] Table button in toolbar
- [ ] Can specify rows and columns
- [ ] Table renders in editor
- [ ] Can edit table content

**Dependencies**: Task 9

**Files to create/modify:**
- `src/components/TableDialog.tsx`
- `src/pages/Editor.tsx`

---

### Task 13: Add link insertion
**Description**: Add link button to insert hyperlinks with URL input.

**Acceptance criteria:**
- [ ] Link button in toolbar
- [ ] Can input URL and link text
- [ ] Link inserts at cursor position
- [ ] Link text is underlined and blue

**Dependencies**: Task 9

**Files to create/modify:**
- `src/components/LinkDialog.tsx`
- `src/pages/Editor.tsx`

---

### Task 14: Add list (bullet/numbered) support
**Description**: Add buttons for bullet lists and numbered lists.

**Acceptance criteria:**
- [ ] Bullet list button works
- [ ] Numbered list button works
- [ ] Can toggle between list types
- [ ] List items indent/outdent works

**Dependencies**: Task 9

**Files to create/modify:**
- `src/pages/Editor.tsx` (keybindings or menu)

---

## Checkpoint: Editor
- [ ] Editor loads without errors
- [ ] Basic formatting works (bold, italic)
- [ ] Image insertion works
- [ ] Table functionality works

---

## Phase 4: Pages & Routing

### Task 15: Implement Catalog page (list materials/activities)
**Description**: Build the main library page with filters, search, and grid.

**Acceptance criteria:**
- [ ] Catalog page renders
- [ ] Materials load from Supabase
- [ ] Activities load from Supabase
- [ ] Search field works
- [ ] Subject chips filter correctly
- [ ] Tabs switch between materials/atividades

**Dependencies**: Task 5, Task 7, Task 8

**Files to create/modify:**
- `src/pages/Catalog.tsx` (complete rewrite)

---

### Task 16: Implement Editor page (Word-like editor)
**Description**: Build the editor page with TipTap editor and toolbar.

**Acceptance criteria:**
- [ ] Editor page renders
- [ ] Word-like toolbar appears
- [ ] Editor content area works
- [ ] Save/publish functionality

**Dependencies**: Task 9, Task 10, Task 11, Task 12, Task 13, Task 14

**Files to create/modify:**
- `src/pages/Editor.tsx` (complete)
- `src/components/UploadDialog.tsx`
- `src/components/EditorToolbar.tsx`

---

### Task 17: Implement Login page (OTP 6 digits)
**Description**: Build login page with 6-digit OTP code entry.

**Acceptance criteria:**
- [ ] Login page renders
- [ ] OTP input accepts 6 digits
- [ ] Submit button works
- [ ] Redirect to main site after login

**Dependencies**: Task 1

**Files to create/modify:**
- `src/pages/Login.tsx`

---

### Task 18: Implement Terms page
**Description**: Simple terms and conditions page.

**Acceptance criteria:**
- [ ] Terms page renders
- [ ] Link accessible from header
- [ ] Content displays correctly

**Dependencies**: Task 1

**Files to create/modify:**
- `src/pages/Terms.tsx`

---

### Task 19: Set up HashRouter with proper _redirects for GitHub Pages
**Description**: Ensure all routes work with HashRouter on GitHub Pages.

**Acceptance criteria:**
- [ ] Direct URL access works (F5 on /editor, /login, /termos)
- [ ] _redirects file in dist/
- [ ] GitHub Pages deployment succeeds
- [ ] No 404 errors on direct navigation

**Dependencies**: Task 4, Task 3, All page tasks

**Files to create/modify:**
- `public/_redirects` (ensure correct content)
- `.github/workflows/deploy.yml` (ensure cp command)
- `vite.config.ts` (base: '/saborlab/')

---

## Checkpoint: Pages
- [ ] All pages render correctly
- [ ] Direct URL access works (F5 on /editor, /login, etc.)
- [ ] HashRouter base '/saborlab/' functions
- [ ] GitHub Pages deploy green

---

## Phase 5: Seed Data & Supabase

### Task 20: Apply seed.sql to Supabase (idempotente)
**Description**: Copy seed.sql content to Supabase SQL Editor and run it.

**Acceptance criteria:**
- [ ] 35 materials + 9 layouts A4 in database
- [ ] seed.sql has on conflict (id) do nothing
- [ ] User can query materials and layouts
- [ ] Existing 3 user test activities preserved

**Dependencies**: Task 1

**Files to create/modify:**
- `supabase/seed.sql` (verify content)
- Run in Supabase SQL Editor manually

---

### Task 21: Configure RLS policies
**Description**: Set up Row Level Security policies for materials and layouts tables.

**Acceptance criteria:**
- [ ] Public can read materials and layouts
- [ ] Authenticated users can create/update their own materials
- [ ] RLS policies don't block app functionality

**Dependencies**: Task 20

**Files to create/modify:**
- `supabase/schema.sql` (verify RLS policies)

---

### Task 22: Set up storage bucket for material images
**Description**: Configure Supabase storage bucket for material images.

**Acceptance criteria:**
- [ ] Bucket 'materials' created
- [ ] Public access enabled
- [ ] Image upload works from editor
- [ ] Image public URL generates correctly

**Dependencies**: Task 21

**Files to create/modify:**
- Supabase dashboard > Storage

---

### Task 23: Test material creation and loading
**Description**: Test that the app can create new materials and load them.

**Acceptance criteria:**
- [ ] Can upload new material with image
- [ ] Material appears in catalog
- [ ] Can use material in editor
- [ ] Edit material works

**Dependencies**: Task 20, Task 21, Task 22

**Files to create/modify:**
- Test manually in browser

---

## Checkpoint: Data
- [ ] 35 materials + 9 layouts A4 load from Supabase
- [ ] CRUD operations work
- [ ] Images upload and display
- [ ] RLS policies don't block functionality

---

## Phase 6: Polish & Responsiveness

### Task 24: Implement mobile responsiveness (breakpoints 980px, 700px)
**Description**: Add media queries for mobile devices, adjust layout, hide/show elements appropriately.

**Acceptance criteria:**
- [ ] Layout adjusts at 980px (grid becomes 1 column)
- [ ] Layout adjusts at 700px (header rearranges)
- [ ] Navigation works on mobile
- [ ] Buttons and touch targets are adequate size
- [ ] Hero art hides on mobile < 980px

**Dependencies**: Task 5

**Files to create/modify:**
- `src/styles.css` (add media queries)
- `src/pages/Catalog.tsx` (responsive adjustments)

---

### Task 25: Add print A4 functionality
**Description**: Ensure A4 print layout works correctly, only the A4 sheet prints.

**Acceptance criteria:**
- [ ] CSS @page { size: A4; } works
- [ ] Print button opens print view
- [ ] Only A4 sheet prints (header/footer hidden)
- [ ] Design preserved in print

**Dependencies**: Task 5

**Files to create/modify:**
- `src/styles.css` (print media queries)
- `src/pages/Catalog.tsx` (print trigger)

---

### Task 26: Test all interactions and fix bugs
**Description**: Manual testing of all features, fix any issues found.

**Acceptance criteria:**
- [ ] No console errors
- [ ] All buttons and links work
- [ ] Forms submit correctly
- [ ] Editor functions as expected
- [ ] Supabase data loads and saves
- [ ] No 404 errors

**Dependencies**: All previous tasks

**Files to create/modify:**
- Fix as discovered in all component files

---

## Checkpoint: Complete
- [ ] Build succeeds: `npm run build`
- [ ] GitHub Pages deploy green
- [ ] Site functional on `https://marcorelio3.github.io/saborlab/`
- [ ] No console errors
- [ ] Design matches ui-ux-pro-max palette
- [ ] Editor is Word-like
- [ ] Seed data present in site
- [ ] All pages accessible via direct URL
- [ ] Responsivity works on mobile
- [ ] Print A4 works
- [ ] Accessibility features present

## Final Notes
- This plan breaks the project into small, verifiable tasks (S and M size)
- Each task has acceptance criteria that are testable
- Checkpoints every 3-4 tasks allow for review
- Dependencies are ordered foundation-first
- The plan document is at `tasks/plan.md`
- The task list is at `tasks/todo.md`

**Próximo passo**: Executar Task 1: Clean repository structure and configure base settings