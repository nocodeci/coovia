import React, { useEffect, useState } from 'react'
import { StyleSheet, StatusBar, View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { Ionicons } from '@expo/vector-icons'

import AuthScreen from './screens/AuthScreen'
import StoreSelectionScreen from './screens/StoreSelectionScreen'
import DashboardScreen from './screens/DashboardScreen'
import ProductsScreen from './screens/ProductsScreen'
import ProductDetailScreen from './screens/ProductDetailScreen'
import EditProductScreen from './screens/EditProductScreen'
import EditPriceScreen from './screens/EditPriceScreen'
import OrdersScreen from './screens/OrdersScreen'
import StatsScreen from './screens/StatsScreen'
import ProfileScreen from './screens/ProfileScreen'
import { type Store } from './services/api'
import { StoreProvider } from './context/StoreContext'
import { StoreInitializer } from './components/StoreInitializer'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function ProductsStack() {
  return (
    <Stack.Navigator
      // 1) Pas de header par défaut sur la pile Produits
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: '#1e293b',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
        headerTintColor: '#ffffff',
      }}
    >
      {/* Liste produits: garde headerShown: false */}
      <Stack.Screen name="ProductsList" component={ProductsScreen} options={{ 
        headerShown: true,
        title: 'Produits',
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: '#1e293b',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: '#ffffff', 
          fontSize: 18, 
          fontWeight: '600' 
        },
        headerTintColor: '#ffffff',
      }} />
      {/* Détails/édition: header actif */}
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: true, title: 'Détails du produit' }}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={{ headerShown: true, title: 'Modifier' }}
      />
      <Stack.Screen
        name="EditPrice"
        component={EditPriceScreen}
        options={{ headerShown: true, title: 'Modifier les prix' }}
      />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // 2) Désactiver le header de niveau Tab (sinon il réserve de la place au-dessus)
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string
          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline'
              break
            case 'Produits':
              iconName = focused ? 'cube' : 'cube-outline'
              break
            case 'Commandes':
              iconName = focused ? 'receipt' : 'receipt-outline'
              break
            case 'Statistiques':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline'
              break
            case 'Profil':
              iconName = focused ? 'person' : 'person-outline'
              break
            default:
              iconName = 'circle'
          }
          return <Ionicons name={iconName as any} size={size} color={color} />
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ 
        title: 'Tableau de bord',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: '#1e293b',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: '#ffffff', 
          fontSize: 18, 
          fontWeight: '600' 
        },
        headerTintColor: '#ffffff',
      }} />
      <Tab.Screen name="Produits" component={ProductsStack} options={{ title: 'Produits' }} />
      <Tab.Screen name="Commandes" component={OrdersScreen} options={{ 
        title: 'Commandes',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: '#1e293b',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: '#ffffff', 
          fontSize: 18, 
          fontWeight: '600' 
        },
        headerTintColor: '#ffffff',
      }} />
      <Tab.Screen name="Statistiques" component={StatsScreen} options={{ 
        title: 'Statistiques',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: '#1e293b',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: '#ffffff', 
          fontSize: 18, 
          fontWeight: '600' 
        },
        headerTintColor: '#ffffff',
      }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ 
        title: 'Profil',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0b1220',
          borderBottomColor: '#1e293b',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: { 
          color: '#ffffff', 
          fontSize: 18, 
          fontWeight: '600' 
        },
        headerTintColor: '#ffffff',
      }} />
    </Tab.Navigator>
  )
}

function Splash() {
  return (
    <View style={styles.splash}>
      <Ionicons name="storefront" size={42} color="#10b981" />
      <Text style={styles.splashText}>Chargement...</Text>
    </View>
  )
}

export default function App() {
  const [authState, setAuthState] = useState<'welcome' | 'auth' | 'store-selection' | 'main'>('welcome')
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setAuthState('auth'), 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleLoginSuccess = () => setAuthState('store-selection')
  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
    setAuthState('main')
  }

  if (authState === 'welcome') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0b1220' }}>
        <StatusBar barStyle="light-content" backgroundColor="#0b1220" />
        <Splash />
      </View>
    )
  }

  if (authState === 'auth') {
    return (
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#0b1220" />
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </NavigationContainer>
    )
  }

  if (authState === 'store-selection') {
    return (
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#0b1220" />
        <StoreSelectionScreen onStoreSelect={handleStoreSelect} />
      </NavigationContainer>
    )
  }

  return (
    <StoreProvider>
      <StoreInitializer selectedStore={selectedStore}>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#0b1220" />
          <MainTabs />
        </NavigationContainer>
      </StoreInitializer>
    </StoreProvider>
  )
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b1220',
  },
  splashText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
})