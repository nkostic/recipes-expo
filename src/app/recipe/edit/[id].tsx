import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Alert } from "react-native";
import { Loading } from "../../../components/Loading";
import { RecipeForm, type RecipeFormData } from "../../../components/RecipeForm";
import { useRecipe, useUpdateRecipe } from "../../../hooks/useRecipes";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: recipe, isLoading } = useRecipe(id as string);
  const updateRecipeMutation = useUpdateRecipe();

  if (!id) {
    router.back();
    return null;
  }

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      await updateRecipeMutation.mutateAsync({
        id: id as string,
        updates: data,
      });
      Alert.alert("Success", "Recipe updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (_error) {
      Alert.alert("Error", "Failed to update recipe. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <Loading message="Loading recipe..." />;
  }

  if (!recipe) {
    return (
      <>
        <Stack.Screen options={{ title: "Recipe Not Found" }} />
        <Loading message="Recipe not found" />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Edit Recipe" }} />
      <RecipeForm
        initialData={recipe}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={updateRecipeMutation.isPending}
      />
    </>
  );
}
