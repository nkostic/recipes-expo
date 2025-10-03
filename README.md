# 🍳 Recipe App

A modern React Native app for managing and organizing your favorite recipes. Built with Expo and featuring image upload, ingredients management, and step-by-step cooking instructions.

## ✨ Features

- 📱 **Cross-platform**: iOS and Android support
- 📸 **Image Upload**: Add photos from camera or gallery
- 🥘 **Recipe Management**: Create, edit, and delete recipes
- 📝 **Dynamic Forms**: Add/remove ingredients and cooking steps
- ⏱️ **Prep Time Tracking**: Set preparation time with smart formatting
- 🎨 **Modern UI**: Clean design with enhanced recipe cards
- 💾 **Offline Storage**: Local SQLite database for reliable data persistence
- 🔄 **Real-time Updates**: Automatic data synchronization with React Query

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd recipes-expo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm start
   ```

4. **Run on device/simulator**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📱 How to Use

1. **View Recipes**: Browse your recipe collection on the home screen
2. **Create Recipe**: Tap the "+" button to add a new recipe
3. **Add Details**: Fill in title, author, description, and prep time
4. **Upload Image**: Take a photo or select from gallery
5. **Add Ingredients**: Use the dynamic form to list ingredients
6. **Add Steps**: Create step-by-step cooking instructions
7. **Save & Enjoy**: Your recipe is stored locally and ready to use

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Database**: SQLite with automatic migrations
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Image Handling**: Expo Image Picker + Expo Image
- **Icons**: Expo Vector Icons
- **Linting**: Biome (modern alternative to ESLint/Prettier)

## 📁 Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── recipe/            # Recipe details
│   └── create.tsx         # Create/edit recipe form
├── components/            # Reusable UI components
├── lib/                   # Database and repository layer
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## 🔧 Development

### Code Quality

- **Linting**: `pnpm run lint` (Biome)
- **Type Checking**: TypeScript with strict mode
- **Code Formatting**: Automatic with Biome and EditorConfig

### Database

The app uses SQLite for local storage with automatic schema migrations. The database includes:

- Recipe metadata (title, author, description, prep time)
- Image storage (URI/base64)
- Dynamic ingredients and cooking steps
- Creation and update timestamps

### Key Components

- **RecipeForm**: Dynamic form with image upload and field management
- **RecipeCard**: Enhanced display with thumbnails and metadata
- **Recipe Detail View**: Full-screen recipe display with all information

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler won't start**: Clear cache with `npx expo start --clear`
2. **App won't reload**: Make sure a device/simulator is connected before pressing `r`
3. **Image picker not working**: Ensure camera permissions are granted
4. **Database issues**: Check SQLite migrations in `src/lib/database.ts`

### Development Tips

- Use iOS Simulator for fastest development iteration
- Press `r` in Metro terminal to reload connected apps
- Use `j` to open debugger for troubleshooting
- Shake device to access developer menu

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Expo and React Native
