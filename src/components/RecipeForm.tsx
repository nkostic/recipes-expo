import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import type React from "react";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { CreateRecipeInput } from "../types";

interface RecipeFormProps {
  initialData?: Partial<CreateRecipeInput>;
  onSubmit: (data: CreateRecipeInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const RecipeForm: React.FC<RecipeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [datePublished, setDatePublished] = useState(
    initialData?.datePublished ? new Date(initialData.datePublished) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [steps, setSteps] = useState<string[]>(initialData?.steps || [""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!author.trim()) {
      newErrors.author = "Author is required";
    }

    if (!datePublished) {
      newErrors.datePublished = "Date is required";
    }

    const validSteps = steps.filter((step) => step.trim() !== "");
    if (validSteps.length === 0) {
      newErrors.steps = "At least one step is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    } else {
      Alert.alert("Error", "A recipe must have at least one step");
    }
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const formattedData: CreateRecipeInput = {
      title: title.trim(),
      description: description.trim(),
      author: author.trim(),
      datePublished: datePublished.toISOString(),
      steps: steps.filter((step) => step.trim() !== ""),
    };

    onSubmit(formattedData);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          onChangeText={setTitle}
          value={title}
          placeholder="Enter recipe title"
          placeholderTextColor="#999"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Author *</Text>
        <TextInput
          style={[styles.input, errors.author && styles.inputError]}
          onChangeText={setAuthor}
          value={author}
          placeholder="Enter author name"
          placeholderTextColor="#999"
        />
        {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date Published *</Text>
        <TouchableOpacity
          style={[styles.input, errors.datePublished && styles.inputError]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>{datePublished.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={datePublished}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDatePublished(selectedDate);
              }
            }}
          />
        )}
        {errors.datePublished && <Text style={styles.errorText}>{errors.datePublished}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.textArea, errors.description && styles.inputError]}
          onChangeText={setDescription}
          value={description}
          placeholder="Enter recipe description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.section}>
        <View style={styles.stepsHeader}>
          <Text style={styles.label}>Steps *</Text>
          <TouchableOpacity onPress={addStep} style={styles.addStepButton}>
            <Ionicons name="add" size={20} color="#007AFF" />
            <Text style={styles.addStepText}>Add Step</Text>
          </TouchableOpacity>
        </View>

        {steps.map((step, index) => (
          <View key={`step-input-${index}-${step.slice(0, 10)}`} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepNumber}>Step {index + 1}</Text>
              {steps.length > 1 && (
                <TouchableOpacity onPress={() => removeStep(index)} style={styles.removeStepButton}>
                  <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={styles.textArea}
              onChangeText={(value) => updateStep(index, value)}
              value={step}
              placeholder={`Enter step ${index + 1}`}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        ))}
        {errors.steps && <Text style={styles.errorText}>{errors.steps}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>{isSubmitting ? "Saving..." : "Save Recipe"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 80,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 4,
  },
  stepsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addStepButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addStepText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 4,
  },
  stepContainer: {
    marginBottom: 16,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  removeStepButton: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
