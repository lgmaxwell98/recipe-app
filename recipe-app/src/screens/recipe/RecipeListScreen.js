import React, { useState, useEffect } from 'react';
import { Text, FlatList, Button, StyleSheet } from 'react-native';
import RecipeTypePicker from '../../utils/RecipeTypePicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from './RecipeCard';

const sampleRecipes = [
  { id: 1, title: 'Chocolate Cake', type: 'Dessert', imageUri: '', ingredients: '', steps: '' },
  { id: 2, title: 'Pasta Carbonara', type: 'Main Course', imageUri: '', ingredients: '', steps: '' },
];

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);
  const [selectedType, setSelectedType] = useState('');

  // useEffect(() => {
  //   if (selectedType) {
  //     setFilteredRecipes(recipes.filter((recipe) => recipe.type === selectedType));
  //   } else {
  //     setFilteredRecipes(recipes);
  //   }
  // }, [selectedType]);
	const renderRecipeList = ({ item }) => <RecipeCard data={item} />;


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('recipes');
        const recipesData = storedRecipes && JSON.parse(storedRecipes);
        const allRecipesData = recipes(recipesData)
        console.log(allRecipesData)
        setRecipes(allRecipesData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();

    const focusListener = navigation.addListener('focus', fetchRecipes);
    return () => focusListener();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <RecipeTypePicker selectedType={selectedType} onTypeChange={setSelectedType} />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeList}
        numColumns={2}
        bounces={false}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />
      <Button title="Add Recipe" onPress={() => navigation.navigate('CreateRecipeScreen', { recipes, setRecipes })} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    borderWidth: 3, 
    borderColor: "green" 
  },
  item: { 
    fontSize: 18, 
    marginVertical: 8 
  },
  columnWrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		// paddingHorizontal: 16
	},
});

export default RecipeListScreen;