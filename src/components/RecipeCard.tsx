import { Image } from "expo-image";
import type React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Recipe } from "../types";
import { formatPrepTime } from "../utils/formatTime";

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        {recipe.image && (
          <Image source={{ uri: recipe.image }} style={styles.thumbnail} contentFit="cover" />
        )}
        <View style={styles.textContent}>
          <Text style={styles.title}>{recipe.title}</Text>
          <Text style={styles.author}>by {recipe.author}</Text>
          <Text style={styles.date}>{formatDate(recipe.datePublished)}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>
              {recipe.ingredients.length} ingredients • {recipe.steps.length} steps •{" "}
              {formatPrepTime(recipe.prepTimeMinutes)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 12,
  },
  textContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  infoRow: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
});
