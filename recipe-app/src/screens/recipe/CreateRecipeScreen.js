import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const CreateRecipeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
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

  const saveRecipe = async () => {
    if (!title || !type || !ingredients || !steps || !imageUri) {
      Alert.alert('Error', 'Please fill all fields and add an image.');
      return;
    }

    try {
      const newRecipe = {
        id: Date.now().toString(),
        title,
        type,
        imageUri,
        ingredients: ingredients.split(',').map((item) => item.trim()),
        steps: steps.split('.').map((item) => item.trim()),
      };

      const storedRecipes = await AsyncStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes.push(newRecipe);
      await AsyncStorage.setItem('recipes', JSON.stringify(recipes));

      Alert.alert('Success', 'Recipe added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  return (
    <View style={styles.container}>
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
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}

      <Button title="Save Recipe" onPress={saveRecipe} />
    </View>
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
    height: 200,
    marginVertical: 16,
  },
});

export default CreateRecipeScreen;
