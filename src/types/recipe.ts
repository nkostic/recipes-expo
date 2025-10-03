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
