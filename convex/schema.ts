import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  recipes: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(),
    description: v.string(),
    author: v.string(),
    datePublished: v.string(), // ISO date string
    image: v.optional(v.string()), // URL from Convex storage
    imageStorageId: v.optional(v.id("_storage")), // Convex storage ID
    ingredients: v.array(v.string()), // Array of ingredient descriptions
    steps: v.array(v.string()), // Array of step descriptions
    prepTimeMinutes: v.number(), // Preparation time in minutes
  })
    .index("by_user", ["userId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["userId"],
    }),
});
