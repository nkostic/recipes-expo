import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for images
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return await ctx.storage.generateUploadUrl();
});

// Get image URL from storage ID
export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Get all recipes for the authenticated user
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const recipes = await ctx.db
      .query("recipes")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    // Resolve image URLs from storage IDs
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => {
        let image = recipe.image;
        if (recipe.imageStorageId) {
          image = (await ctx.storage.getUrl(recipe.imageStorageId)) ?? undefined;
        }
        return { ...recipe, image };
      })
    );

    return recipesWithImages;
  },
});

// Get a single recipe by ID
export const getById = query({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const recipe = await ctx.db.get(args.id);

    // Ensure the recipe belongs to the authenticated user
    if (!recipe || recipe.userId !== identity.subject) {
      return null;
    }

    // Resolve image URL from storage ID
    let image = recipe.image;
    if (recipe.imageStorageId) {
      image = (await ctx.storage.getUrl(recipe.imageStorageId)) ?? undefined;
    }

    return { ...recipe, image };
  },
});

// Create a new recipe
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    author: v.string(),
    datePublished: v.string(),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    ingredients: v.array(v.string()),
    steps: v.array(v.string()),
    prepTimeMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // If we have a storage ID, get the URL
    let image = args.image;
    if (args.imageStorageId) {
      image = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }

    const recipeId = await ctx.db.insert("recipes", {
      userId: identity.subject,
      title: args.title,
      description: args.description,
      author: args.author,
      datePublished: args.datePublished,
      image,
      imageStorageId: args.imageStorageId,
      ingredients: args.ingredients,
      steps: args.steps,
      prepTimeMinutes: args.prepTimeMinutes,
    });

    return recipeId;
  },
});

// Update an existing recipe
export const update = mutation({
  args: {
    id: v.id("recipes"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    author: v.optional(v.string()),
    datePublished: v.optional(v.string()),
    image: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    ingredients: v.optional(v.array(v.string())),
    steps: v.optional(v.array(v.string())),
    prepTimeMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    const existing = await ctx.db.get(id);

    if (!existing || existing.userId !== identity.subject) {
      throw new Error("Recipe not found or access denied");
    }

    // If we have a new storage ID, get the URL and delete old image
    if (args.imageStorageId) {
      // Delete old image if exists
      if (existing.imageStorageId) {
        await ctx.storage.delete(existing.imageStorageId);
      }
      updates.image = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
    }

    // Filter out undefined values
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    await ctx.db.patch(id, filteredUpdates);

    return id;
  },
});

// Delete a recipe
export const remove = mutation({
  args: { id: v.id("recipes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db.get(args.id);

    if (!existing || existing.userId !== identity.subject) {
      throw new Error("Recipe not found or access denied");
    }

    // Delete associated image from storage if exists
    if (existing.imageStorageId) {
      await ctx.storage.delete(existing.imageStorageId);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});

// Search recipes by title
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const recipes = await ctx.db
      .query("recipes")
      .withSearchIndex("search_title", (q) =>
        q.search("title", args.searchTerm).eq("userId", identity.subject)
      )
      .collect();

    // Resolve image URLs from storage IDs
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => {
        let image = recipe.image;
        if (recipe.imageStorageId) {
          image = (await ctx.storage.getUrl(recipe.imageStorageId)) ?? undefined;
        }
        return { ...recipe, image };
      })
    );

    return recipesWithImages;
  },
});
