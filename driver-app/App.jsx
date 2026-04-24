import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import LoginScreen     from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import RidesScreen     from './screens/RidesScreen';
import EarningsScreen  from './screens/EarningsScreen';
import ProfileScreen   from './screens/ProfileScreen';

import { AuthProvider, useAuth } from './context/AuthContext';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

const TabIcon = ({ name, focused }) => (
    <Text style={{ fontSize: 20 }}>
        { name === 'Dashboard' ? '🗺️' :
          name === 'Rides'     ? '🚗' :
          name === 'Earnings'  ? '💰' : '👤' }
    </Text>
);

const DriverTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
            tabBarActiveTintColor: '#1ECB73',
            tabBarInactiveTintColor: '#94a3b8',
            tabBarStyle: { backgroundColor: '#0f172a', borderTopColor: '#1e293b', paddingBottom: 8, height: 65 },
            headerShown: false,
        })}
    >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Rides"     component={RidesScreen} />
        <Tab.Screen name="Earnings"  component={EarningsScreen} />
        <Tab.Screen name="Profile"   component={ProfileScreen} />
    </Tab.Navigator>
);

const RootNav = () => {
    const { driver } = useAuth();
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {driver ? (
                <Stack.Screen name="Main" component={DriverTabs} />
            ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <RootNav />
            </NavigationContainer>
        </AuthProvider>
    );
}
