import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function RecipeLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f8f9fa",
        },
        headerTransparent: false,
        headerBlurEffect: undefined,
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable 
            onPress={() => router.back()} 
            style={({ pressed }) => ({ 
              opacity: pressed ? 0.6 : 1,
              paddingHorizontal: 8,
              paddingVertical: 8,
            })}
          >
            <Ionicons name="chevron-back" size={28} color="#ff6b6b" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerBackTitle: "Recipes",
        }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{
          title: "Edit Recipe",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
