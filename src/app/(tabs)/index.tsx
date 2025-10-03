import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Loading } from '../../components/Loading';
import { RecipeCard } from '../../components/RecipeCard';
import { useRecipes } from '../../hooks/useRecipes';
import type { Recipe } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { data: recipes, isLoading, refetch, isRefetching } = useRecipes();

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleAddRecipe = () => {
    router.push('/create');
  };

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
  );

  if (isLoading) {
    return <Loading message="Loading recipes..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Recipes</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddRecipe}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        renderItem={renderRecipe}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#007AFF" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No recipes yet</Text>
            <Text style={styles.emptySubtext}>Tap the + button to add your first recipe</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
