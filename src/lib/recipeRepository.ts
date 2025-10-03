import type { CreateRecipeInput, Recipe, UpdateRecipeInput } from "../types";
import { db } from "./database";

interface RecipeRow {
  id: string;
  title: string;
  description: string;
  author: string;
  date_published: string;
  steps: string;
  created_at: string;
  updated_at: string;
}

export function getAllRecipes(): Recipe[] {
  const recipes = db.getAllSync(`
    SELECT * FROM recipes
    ORDER BY created_at DESC
  `) as RecipeRow[];

  return recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    author: recipe.author,
    datePublished: recipe.date_published,
    steps: JSON.parse(recipe.steps),
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
  }));
}

export function getRecipeById(id: string): Recipe | null {
  const recipe = db.getFirstSync("SELECT * FROM recipes WHERE id = ?", [id]) as RecipeRow | null;

  if (!recipe) return null;

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    author: recipe.author,
    datePublished: recipe.date_published,
    steps: JSON.parse(recipe.steps),
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
  };
}

export function createRecipe(input: CreateRecipeInput): Recipe {
  const id = Date.now().toString();
  const now = new Date().toISOString();

  db.runSync(
    `INSERT INTO recipes (id, title, description, author, date_published, steps, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.title,
      input.description,
      input.author,
      input.datePublished,
      JSON.stringify(input.steps),
      now,
      now,
    ]
  );

  return {
    id,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateRecipe(id: string, updates: UpdateRecipeInput): Recipe | null {
  const existing = getRecipeById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated = { ...existing, ...updates, updatedAt: now };

  db.runSync(
    `UPDATE recipes
     SET title = ?, description = ?, author = ?, date_published = ?, steps = ?, updated_at = ?
     WHERE id = ?`,
    [
      updated.title,
      updated.description,
      updated.author,
      updated.datePublished,
      JSON.stringify(updated.steps),
      updated.updatedAt,
      id,
    ]
  );

  return updated;
}

export function deleteRecipe(id: string): boolean {
  const result = db.runSync("DELETE FROM recipes WHERE id = ?", [id]);
  return result.changes > 0;
}
