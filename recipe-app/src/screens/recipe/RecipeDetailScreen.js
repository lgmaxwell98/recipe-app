import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get("window").width;

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [title, setTitle] = useState(recipe.title);
  const [type, setType] = useState(recipe.type);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(', '));
  // const [steps, setSteps] = useState(recipe.steps);
  const [steps, setSteps] = useState(recipe.steps.join('. '));
  const [imageUri, setImageUri] = useState(recipe.imageUri);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const newUri = await saveImageLocally(uri);
      setImageUri(newUri);
    }
  };

  const saveImageLocally = async (uri) => {
    const filename = uri.split('/').pop();
    const newPath = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.copyAsync({ from: uri, to: newPath });
    return newPath;
  };

 const updateRecipe = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      const updatedRecipes = recipes.map((r) =>
        r.id === recipe.id
          ? {
              ...r,
              title,
              type,
              imageUri,
              ingredients: ingredients.split(',').map((item) => item.trim()),
              steps: steps.split('.').map((item) => item.trim()),
            }
          : r
      );

      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      Alert.alert('Success', 'Recipe updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const deleteRecipe = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

      const filteredRecipes = recipes.filter((r) => r.id !== recipe.id);

      await AsyncStorage.setItem('recipes', JSON.stringify(filteredRecipes));
      Alert.alert('Success', 'Recipe deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  console.log('imageUri', imageUri)
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Recipe Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Recipe Type:</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Enter type"
      />

      <Text style={styles.label}>Ingredients (comma-separated):</Text>
      <TextInput
        style={styles.input}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="e.g., Salt, Pepper, Chicken"
      />

      <Text style={styles.label}>Steps (period-separated):</Text>
      <TextInput
        style={styles.input}
        value={steps}
        onChangeText={setSteps}
        placeholder="e.g., Step 1. Step 2. Step 3."
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>
          {imageUri ? 'Change Image' : 'Pick an Image'}
        </Text>
      </TouchableOpacity>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode='contain'/>
      )}

      <Button title="Update Recipe" onPress={updateRecipe} />
      <Button title="Delete Recipe" onPress={deleteRecipe} color="red" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  imagePicker: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: '40%',
    marginVertical: 16,
  },
});

export default RecipeDetailScreen;
