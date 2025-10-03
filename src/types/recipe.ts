export interface Recipe {
  id: string;
  title: string;
  description: string;
  author: string;
  datePublished: string; // ISO date string
  steps: string[]; // Array of step descriptions
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecipeInput = Partial<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>;
