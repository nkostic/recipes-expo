import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
} from '../lib/recipeRepository';
import type { CreateRecipeInput, UpdateRecipeInput } from '../types';

export const useRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: () => getAllRecipes(),
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
    enabled: !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecipeInput) => {
      return Promise.resolve(createRecipe(input));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateRecipeInput }) => {
      const result = updateRecipe(id, updates);
      if (!result) throw new Error('Recipe not found');
      return Promise.resolve(result);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', data.id] });
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const success = deleteRecipe(id);
      if (!success) throw new Error('Failed to delete recipe');
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
