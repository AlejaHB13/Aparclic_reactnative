import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import VehicleEntryScreen from './VehicleEntryScreen';
import VehicleExitScreen from './VehicleExitScreen';
import PaymentSummaryScreen from './PaymentSummaryScreen';
import ParkingAvailabilityScreen from './ParkingAvailability';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />        
        <Stack.Screen name="VehicleEntry" component={VehicleEntryScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="VehicleExit" component = {VehicleExitScreen} options = {{ headerShown: false }}/>
        <Stack.Screen name = "PaymentSummary" component = {PaymentSummaryScreen} options = {{ headerShown: false}}/>
        <Stack.Screen name = "ParkingAvailability" component = {ParkingAvailabilityScreen} options = {{ headerShown: false}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
