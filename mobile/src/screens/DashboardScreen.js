import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Brain, Settings, History, Star, TrendingUp } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/endpoints';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await userAPI.getStats();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleLogout = () => {
    logout();
  };

  const handleGetRecommendation = () => {
    navigation.navigate('Decision');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  // Default stats if API fails
  const decisionCount = stats?.decisionCount || user?.decisionCount || 0;
  const feedbackCount = stats?.feedbackCount || user?.feedbackCount || 0;
  const averageRating = stats?.averageRating || user?.averageRating || 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleSettings}>
            <Settings size={20} color="#a1a1aa" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <LogOut size={20} color="#a1a1aa" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8b5cf6" />
        }
      >
        <View style={styles.card}>
          <View style={styles.cardIcon}>
            <Brain size={32} color="#8b5cf6" />
          </View>
          <Text style={styles.cardTitle}>Ready to decide?</Text>
          <Text style={styles.cardDescription}>
            Get AI-powered recommendations for meals, tasks, and clothing based on your preferences.
          </Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleGetRecommendation}>
            <Text style={styles.actionButtonText}>Get Recommendation</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{decisionCount}</Text>
            <Text style={styles.statLabel}>Decisions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{feedbackCount}</Text>
            <Text style={styles.statLabel}>Feedback</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {averageRating > 0 ? averageRating.toFixed(1) : '-'}
            </Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionCard} onPress={handleHistory}>
            <History size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>View History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionCard} onPress={handleGetRecommendation}>
            <TrendingUp size={24} color="#10b981" />
            <Text style={styles.quickActionText}>New Decision</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  greeting: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafafa',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 24,
  },
  cardIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1e1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a1a1aa',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#fafafa',
    fontWeight: '500',
  },
});

export default DashboardScreen;
