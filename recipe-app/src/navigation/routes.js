import { createStackNavigator } from "@react-navigation/stack";
import RecipeListScreen from "../screens/recipe/RecipeListScreen";
import CreateRecipeScreen from "../screens/recipe/CreateRecipeScreen";
import RecipeDetailScreen from "../screens/recipe/RecipeDetailScreen";


const Stack = createStackNavigator();

const Routes = () => {

    return (
		<Stack.Navigator initialRouteName="RecipeListScreen">
				<Stack.Screen
					name="RecipeListScreen"
					component={RecipeListScreen}
					options={{ headerShadowVisible: false, headerTitle: () => null }}
				/>
				<Stack.Screen
					name="CreateRecipeScreen"
					component={CreateRecipeScreen}
					options={{ headerShadowVisible: false, headerTitle: () => null }}
				/>
				<Stack.Screen
					name="RecipeDetailScreen"
					component={RecipeDetailScreen}
					options={{ headerShown: false }}
				/>
		</Stack.Navigator>
	);
};

export default Routes;

