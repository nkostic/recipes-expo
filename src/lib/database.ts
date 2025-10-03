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
      steps TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Insert some sample data for testing
  const existingRecipes = db.getAllSync("SELECT COUNT(*) as count FROM recipes");
  const countResult = existingRecipes[0] as { count: number };
  if (countResult.count === 0) {
    insertSampleData();
  }
};

const insertSampleData = () => {
  const sampleRecipes = [
    {
      id: "1",
      title: "Classic Spaghetti Carbonara",
      description: "A traditional Italian pasta dish with eggs, cheese, and pancetta.",
      author: "Chef Mario",
      datePublished: "2024-01-15T10:00:00.000Z",
      steps: [
        "Boil water in a large pot and add salt",
        "Cook spaghetti according to package instructions",
        "Meanwhile, cook pancetta in a large skillet until crispy",
        "Whisk eggs and cheese in a bowl",
        "Drain pasta and add to skillet with pancetta",
        "Remove from heat and quickly stir in egg mixture",
        "Serve immediately with black pepper",
      ],
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
    },
    {
      id: "2",
      title: "Chocolate Chip Cookies",
      description: "Soft and chewy homemade chocolate chip cookies.",
      author: "Baker Jane",
      datePublished: "2024-01-20T14:30:00.000Z",
      steps: [
        "Preheat oven to 375°F (190°C)",
        "Mix butter and sugars until creamy",
        "Beat in eggs and vanilla",
        "Gradually blend in flour, baking soda, and salt",
        "Stir in chocolate chips",
        "Drop rounded tablespoons onto ungreased cookie sheets",
        "Bake 9-11 minutes until golden brown",
        "Cool on baking sheet for 2 minutes before removing",
      ],
      createdAt: "2024-01-20T14:30:00.000Z",
      updatedAt: "2024-01-20T14:30:00.000Z",
    },
  ];

  for (const recipe of sampleRecipes) {
    db.runSync(
      `INSERT INTO recipes (id, title, description, author, date_published, steps, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.id,
        recipe.title,
        recipe.description,
        recipe.author,
        recipe.datePublished,
        JSON.stringify(recipe.steps),
        recipe.createdAt,
        recipe.updatedAt,
      ]
    );
  }
};
