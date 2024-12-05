import AsyncStorage from '@react-native-async-storage/async-storage';

const saveRecipe = async (recipe) => {
  try {
    // Get existing recipes
    const storedRecipes = await AsyncStorage.getItem('recipes');
    const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];

    // Add the new recipe
    recipes.push(recipe);

    // Save back to AsyncStorage
    await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};
