import { useMutation } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface UploadResult {
  storageId: Id<"_storage">;
  localUri: string;
}

export function useImageUpload() {
  const generateUploadUrl = useMutation(api.recipes.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant permission to access your photo library");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    return result.assets[0];
  };

  const takePhoto = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please grant permission to access your camera");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    return result.assets[0];
  };

  const uploadImage = async (
    imageAsset: ImagePicker.ImagePickerAsset
  ): Promise<UploadResult | null> => {
    try {
      setIsUploading(true);

      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // Fetch the image as a blob
      const response = await fetch(imageAsset.uri);
      const blob = await response.blob();

      // Upload to Convex storage
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": imageAsset.mimeType ?? "image/jpeg",
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await uploadResponse.json();

      return {
        storageId,
        localUri: imageAsset.uri,
      };
    } catch (error) {
      console.error("Failed to upload image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const pickAndUploadImage = async (): Promise<UploadResult | null> => {
    const imageAsset = await pickImage();
    if (!imageAsset) return null;
    return uploadImage(imageAsset);
  };

  const takeAndUploadPhoto = async (): Promise<UploadResult | null> => {
    const imageAsset = await takePhoto();
    if (!imageAsset) return null;
    return uploadImage(imageAsset);
  };

  return {
    pickImage,
    takePhoto,
    uploadImage,
    pickAndUploadImage,
    takeAndUploadPhoto,
    isUploading,
  };
}
