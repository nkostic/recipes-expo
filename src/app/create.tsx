import { Stack, useRouter } from "expo-router";
import { Alert } from "react-native";
import { RecipeForm, type RecipeFormData } from "../components/RecipeForm";
import { useCreateRecipe } from "../hooks/useRecipes";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const createRecipeMutation = useCreateRecipe();

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      await createRecipeMutation.mutateAsync(data);
      Alert.alert("Success", "Recipe created successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (_error) {
      Alert.alert("Error", "Failed to create recipe. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: "Create Recipe" }} />
      <RecipeForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createRecipeMutation.isPending}
      />
    </>
  );
}
