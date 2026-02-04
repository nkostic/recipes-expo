import type { Doc, Id } from "../../convex/_generated/dataModel";

// Recipe type from Convex (with _id and _creationTime)
export type Recipe = Doc<"recipes">;

// For backwards compatibility in components that expect 'id' instead of '_id'
export interface RecipeWithStringId {
  id: string;
  userId: string;
  title: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateRecipeInput = {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  image?: string;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes: number;
};

export type UpdateRecipeInput = Partial<CreateRecipeInput>;
