# Recipe App - Claude Specification (v2.0)

## Project Overview

Build a React Native Expo app for managing and viewing recipes with cross-platform compatibility (iOS & Android). **Now includes image upload, ingredients management, prep time tracking, and enhanced UI displays.**

## App Architecture & Best Practices

### Modern Expo Stack

- **Expo SDK 54+** with EAS Build
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Expo SQLite** for local data persistence
- **React Query/TanStack Query** for data management and caching
- **Zustand** for lightweight state management
- **Expo Vector Icons** for consistent iconography
- **React Hook Form** with Zod validation for forms
- **Expo Image Picker** for camera/gallery access
- **Expo Image** for optimized image display
- **Biome v2.2.5** for modern linting and formatting

### Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home/Recipe List
│   │   └── _layout.tsx    # Tab layout
│   ├── recipe/            # Recipe details
│   │   └── [id].tsx       # Recipe details page
│   ├── create.tsx         # Create new recipe
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── RecipeCard.tsx     # Enhanced recipe card with image
│   └── RecipeForm.tsx     # Dynamic form with image upload
├── lib/                   # Utilities and configurations
│   ├── database.ts        # SQLite setup with migrations
│   └── recipeRepository.ts # CRUD operations
├── utils/                 # Helper functions
│   └── formatTime.ts      # Time formatting utilities
└── types/                 # TypeScript type definitions
    └── recipe.ts          # Enhanced Recipe interface
```

## Data Models

### Enhanced Recipe Type Definition

```typescript
export interface Recipe {
  id: string;
  title: string;
  description: string;
  author: string;
  datePublished: string; // ISO date string
  image?: string; // URI or base64 string
  ingredients: string[]; // Array of ingredient descriptions
  steps: string[]; // Array of step descriptions
  prepTimeMinutes: number; // Preparation time in minutes
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type CreateRecipeInput = Omit<Recipe, "id" | "createdAt" | "updatedAt">;
export type UpdateRecipeInput = Partial<Omit<Recipe, "id" | "createdAt" | "updatedAt">>;
```

### Enhanced Database Schema (SQLite)

```sql
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  date_published TEXT NOT NULL,
  image TEXT, -- Image URI or base64 string
  ingredients TEXT NOT NULL, -- JSON array of ingredient strings
  steps TEXT NOT NULL, -- JSON array of step strings
  prep_time_minutes INTEGER NOT NULL DEFAULT 0,
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
- FlatList of enhanced recipe cards
- Each card shows:
  - Recipe image thumbnail (if available)
  - Recipe title (bold, 18px)
  - Author name (gray, 14px)
  - Date published (gray, 12px)
  - Prep time badge (formatted as "X hr Y min" or "Y min")
  - Ingredients count indicator
  - Card tap gesture to navigate to details

**Functionality**:

- Display all recipes in chronological order (newest first)
- Pull-to-refresh capability
- Tap recipe card → navigate to `/recipe/[id]`
- Tap "Add Recipe" button → navigate to `/create`
- Image thumbnails with fallback placeholders

### 2. Recipe Details Screen

**Route**: `/recipe/[id]`

**UI Components**:

- Full-screen recipe image (if available)
- Header with recipe title and "Edit" button
- Scrollable content:
  - Recipe title (large, bold)
  - Author and date published
  - Prep time with clock icon
  - Description section
  - Ingredients section (bulleted list)
  - Steps section (numbered list with enhanced formatting)

**Functionality**:

- Display full recipe details with enhanced formatting
- Full-size image display with proper aspect ratio
- Tap "Edit" button → navigate to `/create` with prefilled data
- Back navigation to home screen with proper "Recipes" back title

### 3. Create/Edit Recipe Screen

**Routes**:

- `/create` (new recipe or edit existing when passed recipe data)

**UI Components**:

- Header with "Create Recipe" or "Edit Recipe" title
- Scrollable form with enhanced fields:
  - Image picker (camera/gallery selection with preview)
  - Title (TextInput)
  - Author (TextInput)
  - Date Published (DatePicker with calendar interface)
  - Prep Time (NumberInput with time formatting)
  - Description (TextArea)
  - Ingredients (Dynamic list with add/remove functionality)
  - Steps (Dynamic list with add/remove functionality)
- Save/Update button
- Cancel button
- Delete button (edit mode only)

**Functionality**:

- Enhanced form validation using React Hook Form + Zod
- Image upload from camera or gallery
- Dynamic ingredients and steps management with stable component keys
- Keyboard-friendly input handling (no keyboard closing bug)
- Save to SQLite database with image storage
- Navigate back to details/home on success
- Delete functionality with confirmation

## Technical Implementation Guidelines

### Database Setup

```typescript
// lib/database.ts
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("recipes.db");

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      author TEXT NOT NULL,
      date_published TEXT NOT NULL,
      image TEXT,
      ingredients TEXT NOT NULL,
      steps TEXT NOT NULL,
      prep_time_minutes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Database migrations for existing installations
  try {
    db.execSync(`ALTER TABLE recipes ADD COLUMN image TEXT;`);
  } catch (_e) {
    // Column already exists, ignore
  }

  try {
    db.execSync(`ALTER TABLE recipes ADD COLUMN ingredients TEXT NOT NULL DEFAULT '[]';`);
  } catch (_e) {
    // Column already exists, ignore
  }

  try {
    db.execSync(`ALTER TABLE recipes ADD COLUMN prep_time_minutes INTEGER NOT NULL DEFAULT 0;`);
  } catch (_e) {
    // Column already exists, ignore
  }
};
```

### Enhanced Repository Pattern

```typescript
// lib/recipeRepository.ts
export class RecipeRepository {
  static async getAllRecipes(): Promise<Recipe[]> {
    // Enhanced with image, ingredients, prep time support
  }

  static async getRecipeById(id: string): Promise<Recipe | null> {
    // Enhanced data parsing for new fields
  }

  static async createRecipe(recipe: CreateRecipeInput): Promise<Recipe> {
    // Support for image, ingredients, prep time
  }

  static async updateRecipe(id: string, updates: UpdateRecipeInput): Promise<Recipe> {
    // Partial updates with new field support
  }

  static async deleteRecipe(id: string): Promise<void> {
    // Delete with proper cleanup
  }
}
```

### Image Upload Integration

```typescript
// Image picker functionality
import * as ImagePicker from "expo-image-picker";

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
  });

  if (!result.canceled) {
    setImageUri(result.assets[0].uri);
  }
};
```

### Time Formatting Utilities

```typescript
// utils/formatTime.ts
export const formatPrepTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};
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
│   └── [id] (Recipe Details)
└── create (Create/Edit Recipe - unified)
```

## Key Features Implemented

### ✅ Core Features

- Complete CRUD operations for recipes
- SQLite database with automatic migrations
- TypeScript type safety throughout
- React Query for data management
- Expo Router navigation with proper back button titles

### ✅ Enhanced UI Features

- **Image Upload**: Camera and gallery support with expo-image-picker
- **Dynamic Form Fields**: Add/remove ingredients and steps with stable component keys
- **Enhanced Recipe Cards**: Thumbnails, prep time badges, ingredient counts
- **Full-Screen Image Display**: Optimized with expo-image
- **Time Formatting**: Smart prep time display (e.g., "1 hr 30 min", "45 min")
- **Date Picker**: Calendar interface for date selection
- **Delete Functionality**: Recipe deletion with confirmation

### ✅ Technical Improvements

- **Biome Linting**: Modern linting and formatting setup
- **EditorConfig**: Consistent code style across editors
- **Stable Component Keys**: Fixed keyboard closing issue in form inputs
- **Database Migrations**: Automatic schema updates for existing installations
- **Enhanced Navigation**: Proper header titles and back button text

### ✅ User Experience

- Keyboard-friendly form inputs (no unexpected keyboard closing)
- Pull-to-refresh on recipe list
- Proper loading and error states
- Intuitive navigation flow
- Enhanced visual design with proper spacing and typography

## Performance Considerations

- Use FlatList with proper keyExtractor for large recipe lists
- Implement lazy loading if recipe count grows large
- Use React Query for intelligent caching and background updates
- Optimized image handling with expo-image (WebP support, caching)
- Stable component keys prevent unnecessary re-renders
- SQLite prepared statements for better database performance
- Efficient JSON parsing for ingredients and steps arrays

## Development Notes

- **Tooling**: Modern setup with Biome for linting/formatting instead of ESLint/Prettier
- **Navigation**: Proper back button titles configured in navigation stack
- **Form UX**: Stable component keys prevent keyboard closing during input
- **Database**: Automatic migrations handle schema updates gracefully
- **Images**: Stored as URIs with proper cleanup and fallback handling
- **TypeScript**: Comprehensive type coverage with proper interfaces
- **Testing**: Use Expo development build for testing all features

## Dependencies Installed

```json
{
  "expo-sqlite": "latest",
  "@tanstack/react-query": "latest",
  "zustand": "latest",
  "react-hook-form": "latest",
  "@hookform/resolvers": "latest",
  "zod": "latest",
  "@expo/vector-icons": "latest",
  "expo-router": "latest",
  "expo-image-picker": "latest",
  "expo-image": "latest",
  "@react-native-community/datetimepicker": "latest",
  "@biomejs/biome": "2.2.5"
}
```

## Recent Fixes & Improvements

### ✅ Keyboard Closing Bug Fix

- **Problem**: TextInput components in dynamic form fields (ingredients/steps) would close the keyboard after each character
- **Solution**: Implemented stable component keys using unique IDs instead of content-based keys
- **Implementation**: Created IngredientItem and StepItem interfaces with persistent IDs

### ✅ Navigation Back Button Fix

- **Problem**: Back button showed "(tabs)" instead of "Recipes"
- **Solution**: Added proper title configuration to navigation stack screens

### ✅ Database Schema Evolution

- **Enhancement**: Added automatic migrations for image, ingredients, and prep_time_minutes columns
- **Benefit**: Existing installations upgrade seamlessly without data loss

This specification reflects the current state of a fully functional, feature-rich recipe management app with modern development practices and excellent user experience.
