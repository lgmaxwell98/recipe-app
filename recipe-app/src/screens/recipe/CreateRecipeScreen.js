import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import DropDownPicker from 'react-native-dropdown-picker';
const recipetypes  = require('../../../assets/recipetypes.json');

const CreateRecipeScreen = ({ navigation }) => {

  const [title, setTitle] = useState('');
  const [recipeTypes, setRecipeTypes] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [imageUri, setImageUri] = useState(null);

    // Dropdown states
  const [open, setOpen] = useState(false); // Controls dropdown visibility
  const [items, setItems] = useState([]); // Dropdown options

    // Load recipe types from JSON into dropdown
  useEffect(() => {
    const loadRecipeTypes = () => {
      const dropdownItems = recipetypes.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      setItems(dropdownItems);
    };

    loadRecipeTypes();
  }, []);

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
    if (!title || !recipeTypes || !ingredients || !steps || !imageUri) {
      Alert.alert('Error', 'Please fill all fields and add an image.');
      return;
    }

    try {
      const newRecipe = {
        id: Date.now().toString(),
        title,
        recipeTypes,
        imageUri,
        ingredients: ingredients,
        steps: steps
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >

    <View style={styles.container}>
      <ScrollView
          showsVerticalScrollIndicator={false}
					style={{ backgroundColor: "white" }}
      >
        
        <Text style={styles.label}>Recipe Title:</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter recipe title"
        />

        <Text style={styles.label}>Recipe Type:</Text>
        <DropDownPicker
          open={open}
          value={recipeTypes}
          items={items}
          setOpen={setOpen}
          setValue={setRecipeTypes}
          setItems={setItems}
          placeholder="Select a recipe type"
          containerStyle={{ marginVertical: 10 }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        <Text style={styles.label}>Ingredients:</Text>
        <TextInput
          style={styles.bigInput}
          multiline={true}
          numberOfLines={10}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="e.g., Salt, Pepper, Chicken"
        />

        <Text style={styles.label}>Steps:</Text>
        <TextInput
          multiline={true}
          numberOfLines={10}
          style={styles.bigInput}
          value={steps}
          onChangeText={setSteps}
          placeholder="e.g., 1.... 2.... 3...."
        />

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>
            {imageUri ? 'Edit Image' : 'Pick an Image'}
          </Text>
        </TouchableOpacity>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        )}

        <Button title="Save Recipe" onPress={saveRecipe} />
      </ScrollView>

    </View>
    </KeyboardAvoidingView>

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
    marginVertical: 7,
  },
  bigInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
    height: 100,
    textAlignVertical: 'top'
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
    height: 350,
    marginVertical: 16,
  },
});

export default CreateRecipeScreen;
