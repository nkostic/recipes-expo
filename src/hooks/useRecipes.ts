import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import type { CreateRecipeInput, UpdateRecipeInput } from "../types";

// Extended input type that includes imageStorageId
interface CreateRecipeWithStorageInput extends CreateRecipeInput {
  imageStorageId?: Id<"_storage">;
}

interface UpdateRecipeWithStorageInput extends UpdateRecipeInput {
  imageStorageId?: Id<"_storage">;
}

export const useRecipes = () => {
  const recipes = useQuery(api.recipes.getAll);

  return {
    data: recipes,
    isLoading: recipes === undefined,
  };
};

export const useRecipe = (id: string) => {
  const recipe = useQuery(api.recipes.getById, id ? { id: id as Id<"recipes"> } : "skip");

  return {
    data: recipe,
    isLoading: recipe === undefined,
  };
};

export const useCreateRecipe = () => {
  const createRecipeMutation = useMutation(api.recipes.create);

  return {
    mutateAsync: async (input: CreateRecipeWithStorageInput) => {
      return await createRecipeMutation(input);
    },
    isPending: false,
  };
};

export const useUpdateRecipe = () => {
  const updateRecipeMutation = useMutation(api.recipes.update);

  return {
    mutateAsync: async ({ id, updates }: { id: string; updates: UpdateRecipeWithStorageInput }) => {
      await updateRecipeMutation({
        id: id as Id<"recipes">,
        ...updates,
      });
      return { id };
    },
    isPending: false,
  };
};

export const useDeleteRecipe = () => {
  const deleteRecipeMutation = useMutation(api.recipes.remove);

  return {
    mutateAsync: async (id: string) => {
      await deleteRecipeMutation({ id: id as Id<"recipes"> });
      return id;
    },
    isPending: false,
  };
};
