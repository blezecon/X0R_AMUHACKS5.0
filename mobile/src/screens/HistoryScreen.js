import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Star, Filter } from 'lucide-react-native';
import { decisionsAPI } from '../api/endpoints';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, meal, task, clothing

  const fetchHistory = async () => {
    try {
      const data = await decisionsAPI.getHistory(20);
      if (data.success && data.data) {
        setHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.type === filter);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'meal': return '🍽️';
      case 'task': return '✅';
      case 'clothing': return '👕';
      default: return '🎯';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'meal': return '#10b981';
      case 'task': return '#3b82f6';
      case 'clothing': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={[styles.typeIcon, { backgroundColor: `${getTypeColor(item.type)}20` }]}>
        <Text style={styles.typeEmoji}>{getTypeIcon(item.type)}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.aiSuggestion || item.suggestion || 'Recommendation'}
        </Text>
        <Text style={styles.itemType}>{item.type?.toUpperCase()}</Text>
        <View style={styles.itemMeta}>
          <Clock size={12} color="#71717a" />
          <Text style={styles.itemDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {item.feedback?.rating && (
            <View style={styles.ratingBadge}>
              <Star size={10} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>{item.feedback.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'meal', label: 'Meals' },
    { id: 'task', label: 'Tasks' },
    { id: 'clothing', label: 'Clothing' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#fafafa" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>History</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fafafa" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Decision History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterTab, filter === f.id && styles.filterTabActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No decisions yet</Text>
          <Text style={styles.emptyText}>
            Start making decisions to see your history here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8b5cf6" />
          }
        />
      )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#18181b',
  },
  filterTabActive: {
    backgroundColor: '#8b5cf6',
  },
  filterText: {
    fontSize: 14,
    color: '#a1a1aa',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  listContainer: {
    padding: 20,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  typeEmoji: {
    fontSize: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemDate: {
    fontSize: 12,
    color: '#71717a',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    marginLeft: 'auto',
  },
  ratingText: {
    fontSize: 12,
    color: '#fbbf24',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
  },
});

export default HistoryScreen;
