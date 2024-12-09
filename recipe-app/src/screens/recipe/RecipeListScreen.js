import React, { useState, useEffect } from 'react';
import { Text, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from './RecipeCard';
import Button from '../../utils/Button'
import DropDownPicker from 'react-native-dropdown-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from "react-native-vector-icons/Ionicons";
const recipetypes = require('../../../assets/recipetypes.json');
const sampleRecipes = require('../../../assets/sampleRecipeData.json')

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [filteredRecipes, setFilteredRecipes] = useState(sampleRecipes);
  const [filterType, setFilterType] = useState(null);

    // Dropdown state
  const [open, setOpen] = useState(false); // Controls dropdown visibility
  const [items, setItems] = useState([]); // Dropdown options

	const renderRecipeList = ({ item }) => <RecipeCard data={item}  setRecipes={setRecipes}/>;

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('recipes');
        const recipesData = storedRecipes ? JSON.parse(storedRecipes) : [];
        
        // Filter out duplicates based on recipe ID
        const newRecipes = recipesData.filter(
          (recipe) => !recipes.some((existing) => existing.id === recipe.id)
        );

        // Add only new recipes to the existing list
        if (newRecipes.length > 0) {
          setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();

    const focusListener = navigation.addListener('focus', fetchRecipes);
    return () => focusListener();
  }, [navigation, recipes]);

  useEffect(() => {
    // Load recipe types into dropdown items
    const loadRecipeTypes = () => {
      const dropdownItems = [{ label: 'All', value: null }, ...recipetypes.map((type) => ({
        label: type.name,
        value: type.name,
      }))];
      setItems(dropdownItems);
    };

    loadRecipeTypes();
  }, []);


  useEffect(() => {
    if (filterType) {
      const filtered = recipes.filter((recipe) => recipe.recipeTypes === filterType);
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes); // Show all recipes when "All" is selected
    }
  }, [filterType, recipes]);

  return (
    <View style={styles.container}>
      <View style={styles.icons}>
         <Ionicons name="person-circle-outline" color="red" size={36} /> 
         <Ionicons name="notifications-outline" color="red" size={36} /> 

      </View>
      <View style={{paddingTop: 10}}>
        <>
        <Text style={{fontSize: hp(1.9) }}>Welcome, Yuki! </Text>

        <Text style={{fontSize: hp(3.5), fontWeight: "semibold"}}>Discover, Create, and Save</Text>
        <Text style={{fontSize: hp(3.5), fontWeight: "semibold", color:"orange"}}>Recipes</Text>
        </>
      </View>

      <DropDownPicker
        open={open}
        value={filterType}
        items={items}
        setOpen={setOpen}
        setValue={setFilterType}
        setItems={setItems}
        placeholder="Filter by Recipe Type"
        containerStyle={{ marginVertical: 16 }}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
      />
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeList}
        numColumns={2}
        bounces={false}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
      />
      <SafeAreaView>
        			<Button
								title="Add Recipe"
                textStyle={{fontSize: 16}}
								onPress={() => navigation.navigate('CreateRecipeScreen', { 
                    recipes,
                 })}
							>
                Add Recipe
              </Button>
        </SafeAreaView>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "white",
    paddingHorizontal: 16, 
  },
  item: { 
    fontSize: 18, 
    marginVertical: 8 
  },
  columnWrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
	},
  icons: {
    marginHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4
  }
});

export default RecipeListScreen;