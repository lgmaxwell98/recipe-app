import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';

const RecipeTypePicker = ({ selectedType, onTypeChange }) => {
  const [recipeTypes, setRecipeTypes] = useState([]);

  useEffect(() => {
    const loadRecipeTypes = async () => {
      const file = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'recipetypes.json');
      setRecipeTypes(JSON.parse(file));
    };

    loadRecipeTypes();
  }, []);

  return (
    <View style={styles.container}>
      <Picker selectedValue={selectedType} onValueChange={onTypeChange}>
        <Picker.Item label="All" value="" />
        {recipeTypes.map((type) => (
          <Picker.Item key={type.id} label={type.name} value={type.name} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, borderWidth: 2, borderColor: "red" },
});

export default RecipeTypePicker;
