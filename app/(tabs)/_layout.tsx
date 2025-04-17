import { Tabs } from 'expo-router';
import { Leaf, Map, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          borderTopColor: '#e9ecef',
        },
        tabBarActiveTintColor: '#2f7d32',
        tabBarInactiveTintColor: '#6c757d',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Soil Stats',
          tabBarIcon: ({ size, color }) => <Leaf size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}