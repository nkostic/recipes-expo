import type React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { Recipe } from '../types';

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
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.author}>by {recipe.author}</Text>
      <Text style={styles.date}>{formatDate(recipe.datePublished)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});
