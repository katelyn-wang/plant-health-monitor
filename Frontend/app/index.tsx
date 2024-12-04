import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ValuesProvider } from './ValuesContext';
import Plant from './Plant'; // Your Plant page
import Input from './Input'; // Your Input page

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <ValuesProvider>
            <Tab.Navigator initialRouteName="Plant">
                <Tab.Screen name="Plant" component={Plant} options={{ headerShown: false }} />
                <Tab.Screen name="Input" component={Input} options={{ headerShown: false }}/>
            </Tab.Navigator>
        </ValuesProvider>
    );
  }