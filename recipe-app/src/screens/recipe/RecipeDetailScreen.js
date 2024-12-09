import React, { useState, useEffect} from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const recipetypes = require('../../../assets/recipetypes.json');
const screenWidth = Dimensions.get("window").width;

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe, setRecipes } = route.params;
  const [title, setTitle] = useState(recipe.title);
  console.log('recipe data', recipe)
  const [recipeTypes, setRecipeTypes] = useState(recipe.recipeTypes);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [steps, setSteps] = useState(recipe.steps);
  const [imageUri, setImageUri] = useState(recipe.imageUri);

	const insets = useSafeAreaInsets();

  // Dropdown states
  const [open, setOpen] = useState(false); // Controls dropdown visibility
  const [items, setItems] = useState([]); // Dropdown options

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
              recipeTypes,
              imageUri,
              ingredients: ingredients,
              steps: steps
            }
          : r
      );

      await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);
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
      setRecipes(filteredRecipes);
      Alert.alert('Success', 'Recipe deleted successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "white", flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.imagePickerText}>
              {imageUri ? "Edit Image" : "Pick an Image"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Recipe Title:</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />

          <Text style={styles.label}>Recipe Type:</Text>
          <DropDownPicker
            open={open}
            value={recipeTypes}
            items={items}
            setOpen={setOpen}
            setValue={setRecipeTypes}
            setItems={setItems}
            containerStyle={{ marginBottom: 16 }}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />

          <Text style={styles.label}>Ingredients:</Text>
          <TextInput
            style={styles.bigInput}
            multiline
            numberOfLines={10}
            value={ingredients}
            onChangeText={setIngredients}
            placeholder="e.g., Salt, Pepper, Chicken"
          />

          <Text style={styles.label}>Steps:</Text>
          <TextInput
            style={styles.bigInput}
            multiline
            numberOfLines={10}
            value={steps}
            onChangeText={setSteps}
            placeholder="e.g., Step 1. Step 2. Step 3."
          />
 
          <View style={[styles.buttonStyle, {paddingBottom: insets.bottom}]}>
            <Button
              title="Update Recipe"
              style={{ backgroundColor: "blue" }}
              onPress={updateRecipe}
            />
            <Button
              title="Delete Recipe"
              color="red"
              onPress={deleteRecipe}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>

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
    padding: 10,
    paddingHorizontal: -10,
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
    marginVertical: 3,
  },
  buttonStyle: {
    paddingTop: 10,
    marginHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  }
});

export default RecipeDetailScreen;
