# Recipe App - Claude Specification

## Project Overview

Build a React Native Expo app for managing and viewing recipes with cross-platform compatibility (iOS & Android).

## App Architecture & Best Practices

### Modern Expo Stack

- **Expo SDK 51+** with EAS Build
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Expo SQLite** for local data persistence
- **React Query/TanStack Query** for data management and caching
- **Zustand** for lightweight state management
- **Expo Vector Icons** for consistent iconography
- **React Hook Form** with Zod validation for forms

### Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home/Recipe List
│   │   └── _layout.tsx    # Tab layout
│   ├── recipe/            # Recipe details/edit
│   │   ├── [id].tsx       # Recipe details page
│   │   └── edit/[id].tsx  # Edit recipe page
│   ├── create.tsx         # Create new recipe
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities and configurations
├── store/                 # Zustand stores
└── types/                 # TypeScript type definitions
```

## Data Models

### Recipe Type Definition

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  author: string;
  datePublished: string; // ISO date string
  steps: string[]; // Array of step descriptions
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### Database Schema (SQLite)

```sql
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  date_published TEXT NOT NULL,
  steps TEXT NOT NULL, -- JSON array of strings
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Data Storage Strategy

### Primary Storage: Expo SQLite

- **Why**: Built-in, performant, works offline, cross-platform
- **Implementation**: Use `expo-sqlite/next` for modern API
- **Benefits**:
  - Works on both iOS and Android
  - Offline-first approach
  - Fast queries and data persistence
  - No external dependencies

### Data Layer Architecture

1. **Database Layer**: SQLite with prepared statements
2. **Repository Layer**: Abstract database operations
3. **Query Layer**: React Query for caching and synchronization
4. **State Layer**: Zustand for UI state management

## Screen Specifications

### 1. Home Screen (Recipe List)

**Route**: `/` (tabs/index.tsx)

**UI Components**:

- Header with app title and "Add Recipe" button
- FlatList of recipe cards
- Each card shows:
  - Recipe title (bold, 18px)
  - Author name (gray, 14px)
  - Date published (gray, 12px)
  - Card tap gesture to navigate to details

**Functionality**:

- Display all recipes in chronological order (newest first)
- Pull-to-refresh capability
- Tap recipe card → navigate to `/recipe/[id]`
- Tap "Add Recipe" button → navigate to `/create`

### 2. Recipe Details Screen

**Route**: `/recipe/[id]`

**UI Components**:

- Header with recipe title and "Edit" button
- Scrollable content:
  - Recipe title (large, bold)
  - Author and date published
  - Description section
  - Steps section (numbered list)

**Functionality**:

- Display full recipe details
- Tap "Edit" button → navigate to `/recipe/edit/[id]`
- Back navigation to home screen

### 3. Create/Edit Recipe Screen

**Routes**:

- `/create` (new recipe)
- `/recipe/edit/[id]` (edit existing)

**UI Components**:

- Header with "Create Recipe" or "Save Recipe" title
- Form fields:
  - Title (TextInput)
  - Author (TextInput)
  - Date Published (DatePicker)
  - Description (TextArea)
  - Steps (Dynamic list of TextInputs with add/remove buttons)
- Save button
- Cancel button

**Functionality**:

- Form validation using React Hook Form + Zod
- Dynamic steps management (add/remove steps)
- Save to SQLite database
- Navigate back to details/home on success

## Technical Implementation Guidelines

### Database Setup

```typescript
// lib/database.ts
import * as SQLite from "expo-sqlite/next";

export const db = SQLite.openDatabaseSync("recipes.db");

// Initialize tables
export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      date_published TEXT NOT NULL,
      steps TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
};
```

### Repository Pattern

```typescript
// lib/recipeRepository.ts
export class RecipeRepository {
  static async getAllRecipes(): Promise<Recipe[]> {
    /* implementation */
  }
  static async getRecipeById(id: string): Promise<Recipe | null> {
    /* implementation */
  }
  static async createRecipe(
    recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">
  ): Promise<Recipe> {
    /* implementation */
  }
  static async updateRecipe(
    id: string,
    updates: Partial<Recipe>
  ): Promise<Recipe> {
    /* implementation */
  }
  static async deleteRecipe(id: string): Promise<void> {
    /* implementation */
  }
}
```

### React Query Integration

```typescript
// hooks/useRecipes.ts
export const useRecipes = () => {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: RecipeRepository.getAllRecipes,
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => RecipeRepository.getRecipeById(id),
  });
};
```

## Navigation Structure

```
App
├── (tabs)
│   └── index (Home/Recipe List)
├── recipe
│   ├── [id] (Recipe Details)
│   └── edit/[id] (Edit Recipe)
└── create (Create New Recipe)
```

## Performance Considerations

- Use FlatList with proper keyExtractor for large recipe lists
- Implement lazy loading if recipe count grows large
- Use React Query for intelligent caching
- Optimize images if recipe photos are added later
- Use SQLite prepared statements for better performance

## Future Enhancements (V2+)

- Recipe photos/images
- Categories and tags
- Search and filtering
- Recipe sharing
- Backup/sync to cloud storage
- Recipe ratings and favorites
- Ingredients list with measurements
- Cooking time and difficulty level

## Development Notes

- Start with Expo development build for testing
- Use EAS Build for production builds
- Implement proper error boundaries
- Add loading states for all async operations
- Include proper TypeScript types throughout
- Add unit tests for repository layer
- Consider accessibility (screen readers, etc.)

## Dependencies to Install

```json
{
  "expo-sqlite": "next",
  "@tanstack/react-query": "latest",
  "zustand": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  "zod": "latest",
  "@expo/vector-icons": "latest",
  "expo-router": "latest"
}
```

This specification provides a solid foundation for building a modern, performant React Native Expo app with proper data persistence and cross-platform compatibility.
