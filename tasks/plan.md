# Implementation Plan: SaborLab Rebuild

## Overview
Rebuild the SaborLab project from scratch, keeping the seed.sql data (35 materials + 9 layouts A4), and improve the editor to be Word-like. Fix all errors, use ui-ux-pro-max design skills, and ensure everything works correctly on GitHub Pages.

## Architecture Decisions
- **Stack**: Vite + React + TypeScript + HashRouter + Supabase + TipTap + idb-keyval + react-rnd
- **Design**: ui-ux-pro-max colors (--brand: #1e293b, --accent: #3b82f6), gradients, modern components
- **Editor**: TipTap with word-like features (formatting, tables, images)
- **Deployment**: GitHub Pages with proper fallback routing
- **Database**: Supabase with seed.sql idempotente (on conflict do nothing)

## Task List

### Phase 1: Foundation
- [ ] Task 1: Clean repository structure and configure base settings
- [ ] Task 2: Set up Supabase connection with seed.sql idempotente
- [ ] Task 3: Configure Vite with base '/saborlab/' for GitHub Pages
- [ ] Task 4: Set up GitHub Actions workflow with _redirects copy

### Checkpoint: Foundation
- [ ] Build succeeds without errors
- GitHub Pages deploy initiates without 404 errors
- Supabase connection configured

### Phase 2: Core Layout & Design
- [ ] Task 5: Implement main CSS with ui-ux-pro-max design system
- [ ] Task 6: Create Hero section with A4 preview and counters
- [ ] Task 7: Build Library grid with cards and subject chips
- [ ] Task 8: Implement Tabs system (Materiais/Atividades)

### Checkpoint: Core Layout
- [ ] Layout renders without errors
- [ ] Design colors applied correctly (--brand, --accent)
- [ ] Navigation works (no 404 on refresh)

### Phase 3: Word-like Editor
- [ ] Task 9: Implement TipTap editor with Word-like features
- [ ] Task 10: Add formatting toolbar (bold, italic, underline, colors)
- [ ] Task 11: Add image insertion and formatting
- [ ] Task 12: Add table creation and editing
- [ ] Task 13: Add link insertion
- [ ] Task 14: Add list (bullet/numbered) support

### Checkpoint: Editor
- [ ] Editor loads without errors
- [ ] Basic formatting works (bold, italic)
- [ ] Image insertion works
- [ ] Table functionality works

### Phase 4: Pages & Routing
- [ ] Task 15: Implement Catalog page (list materials/activities)
- [ ] Task 16: Implement Editor page (Word-like editor)
- [ ] Task 17: Implement Login page (OTP 6 digits)
- [ ] Task 18: Implement Terms page
- [ ] Task 19: Set up HashRouter with proper _redirects for GitHub Pages

### Checkpoint: Pages
- [ ] All pages render correctly
- [ ] Direct URL access works (F5 on /editor, /login, etc.)
- [ ] HashRouter base '/saborlab/' functions

### Phase 5: Seed Data & Supabase
- [ ] Task 19: Apply seed.sql to Supabase (idempotente)
- [ ] Task 20: Configure RLS policies
- [ ] Task 21: Set up storage bucket for material images
- [ ] Task 22: Test material creation and loading

### Checkpoint: Data
- [ ] 35 materials + 9 layouts A4 load from Supabase
- [ ] CRUD operations work
- [ ] Images upload and display

### Phase 6: Polish & Responsiveness
- [ ] Task 23: Implement mobile responsiveness (breakpoints 980px, 700px)
- [ ] Task 24: Add print A4 functionality
- [ ] Task 25: Add focus-visible states for accessibility
- [ ] Task 26: Test all interactions and fix bugs

### Checkpoint: Complete
- [ ] Build succeeds: `npm run build`
- [ ] GitHub Pages deploy green
- [ ] Site functional on `https://marcorelio3.github.io/saborlab/`
- [ ] No console errors
- [ ] Design matches ui-ux-pro-max palette
- [ ] Editor is Word-like
- [ ] Seed data present in site