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

  // Add new columns to existing table if they don't exist
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
      image: null,
      ingredients: [
        "400g spaghetti",
        "200g pancetta or guanciale",
        "3 large eggs",
        "100g Pecorino Romano cheese, grated",
        "Black pepper to taste",
        "Salt for pasta water",
      ],
      steps: [
        "Boil water in a large pot and add salt",
        "Cook spaghetti according to package instructions",
        "Meanwhile, cook pancetta in a large skillet until crispy",
        "Whisk eggs and cheese in a bowl",
        "Drain pasta and add to skillet with pancetta",
        "Remove from heat and quickly stir in egg mixture",
        "Serve immediately with black pepper",
      ],
      prepTimeMinutes: 25,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
    },
    {
      id: "2",
      title: "Chocolate Chip Cookies",
      description: "Soft and chewy homemade chocolate chip cookies.",
      author: "Baker Jane",
      datePublished: "2024-01-20T14:30:00.000Z",
      image: null,
      ingredients: [
        "2 1/4 cups all-purpose flour",
        "1 tsp baking soda",
        "1 tsp salt",
        "1 cup butter, softened",
        "3/4 cup granulated sugar",
        "3/4 cup brown sugar",
        "2 large eggs",
        "2 tsp vanilla extract",
        "2 cups chocolate chips",
      ],
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
      prepTimeMinutes: 45,
      createdAt: "2024-01-20T14:30:00.000Z",
      updatedAt: "2024-01-20T14:30:00.000Z",
    },
  ];

  for (const recipe of sampleRecipes) {
    db.runSync(
      `INSERT INTO recipes (id, title, description, author, date_published, image, ingredients, steps, prep_time_minutes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        recipe.id,
        recipe.title,
        recipe.description,
        recipe.author,
        recipe.datePublished,
        recipe.image,
        JSON.stringify(recipe.ingredients),
        JSON.stringify(recipe.steps),
        recipe.prepTimeMinutes,
        recipe.createdAt,
        recipe.updatedAt,
      ]
    );
  }
};
