import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useEffect, useState } from 'react';
import { SplashScreen } from 'expo-router';
import { fetchSoilData, SoilData } from '../../services/soilDataService';

export default function SoilStats() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchSoilData();
      setSoilData(data);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error fetching soil data:', err);
      setError('Failed to load soil data. Please check your connection and try again.');
      setSoilData(null);
      return false;
    }
  };

  const handleRefresh = async () => {
    const success = await loadData();
    if (success) {
      const interval = setInterval(async () => {
        await loadData();
      }, 30000);
      return () => clearInterval(interval);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await handleRefresh();
    setRefreshing(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startInterval = async () => {
      const success = await loadData();
      if (success) {
        interval = setInterval(async () => {
          await loadData();
        }, 30000);
      }
    };

    startInterval();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (error) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2f7d32']}
            tintColor="#2f7d32"
            progressViewOffset={50}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Soil Health Monitor</Text>
          <Text style={styles.subtitle}>Connection Error</Text>
        </View>
        <View style={[styles.mainCard, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
          <Text style={[styles.cardLabel, { color: '#dc3545' }]}>Connection Error</Text>
          <Text style={styles.cardSubtext}>{error}</Text>
          <TouchableOpacity 
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (!soilData) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2f7d32']}
            tintColor="#2f7d32"
            progressViewOffset={50}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Soil Health Monitor</Text>
          <Text style={styles.subtitle}>Loading Data</Text>
        </View>
        <View style={[styles.mainCard, { alignItems: 'center', justifyContent: 'center', minHeight: 200 }]}>
          <Text style={styles.cardLabel}>Loading Soil Data</Text>
          <Text style={styles.cardSubtext}>Please wait while we connect to the sensor...</Text>
          <TouchableOpacity 
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshButtonText}>Retry Connection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2f7d32']}
          tintColor="#2f7d32"
          progressViewOffset={50}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Soil Health Monitor</Text>
        <Text style={styles.subtitle}>Current Readings</Text>
      </View>
      <View style={styles.mainCard}>
        <Text style={styles.cardLabel}>Predicted Carbon Content</Text>
        <Text style={styles.carbonValue}>{soilData.carbonContent}%</Text>
        <Text style={styles.cardSubtext}>Optimal Range: 3.0-5.0%</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>pH Level</Text>
          <Text style={styles.statValue}>{soilData.ph}</Text>
          <Text style={styles.statUnit}>pH</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Electrical Conductivity</Text>
          <Text style={styles.statValue}>{soilData.electricalConductivity}</Text>
          <Text style={styles.statUnit}>μS/cm</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Phosphorus</Text>
          <Text style={styles.statValue}>{soilData.phosphorus}</Text>
          <Text style={styles.statUnit}>mg/kg</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Nitrogen</Text>
          <Text style={styles.statValue}>{soilData.nitrogen}</Text>
          <Text style={styles.statUnit}>mg/kg</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Potassium</Text>
          <Text style={styles.statValue}>{soilData.potassium}</Text>
          <Text style={styles.statUnit}>mg/kg</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Elevation</Text>
          <Text style={styles.statValue}>{soilData.elevation}</Text>
          <Text style={styles.statUnit}>m</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2f7d32',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  mainCard: {
    margin: 16,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2f7d32',
    marginBottom: 8,
  },
  carbonValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#2f7d32',
    marginBottom: 8,
  },
  cardSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6c757d',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statInner: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#495057',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#212529',
    marginBottom: 2,
  },
  statUnit: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2f7d32',
    textAlign: 'center',
    marginTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  refreshButton: {
    backgroundColor: '#2f7d32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});