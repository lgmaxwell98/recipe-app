import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import Routes from "./navigation/routes";


const Stack = createStackNavigator()
export default function App() {
  return (
    <NavigationContainer>
      <Routes/>
    </NavigationContainer>
    // <View style={styles.container}>
    //   <Text>Welcome to Recipe App!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
