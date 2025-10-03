import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Loading } from "../../components/Loading";
import { useDeleteRecipe, useRecipe } from "../../hooks/useRecipes";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: recipe, isLoading } = useRecipe(id as string);
  const deleteRecipeMutation = useDeleteRecipe();

  if (!id) {
    router.back();
    return null;
  }

  const handleEdit = () => {
    router.push(`/recipe/edit/${id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRecipeMutation.mutateAsync(id as string);
              Alert.alert("Success", "Recipe deleted successfully!", [
                {
                  text: "OK",
                  onPress: () => router.back(),
                },
              ]);
            } catch (_error) {
              Alert.alert("Error", "Failed to delete recipe. Please try again.");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return <Loading message="Loading recipe..." />;
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: recipe.title,
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                <Ionicons name="pencil" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                <Ionicons name="trash-outline" size={24} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        <View style={styles.metaInfo}>
          <Text style={styles.author}>by {recipe.author}</Text>
          <Text style={styles.date}>{formatDate(recipe.datePublished)}</Text>
        </View>

        {recipe.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.steps.map((step, index) => (
            <View key={`step-${index}-${step.slice(0, 20)}`} style={styles.stepContainer}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
  },
  editButton: {
    marginRight: 8,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metaInfo: {
    marginBottom: 24,
  },
  author: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
    paddingTop: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    marginTop: 16,
  },
});
