import { View, Text, StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view coming soon!</Text>
      <Text style={styles.subtext}>This screen will display geographical data and sampling locations.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2f7d32',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});