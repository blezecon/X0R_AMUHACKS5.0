import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Utensils, CheckSquare, Shirt, Sparkles, Star } from 'lucide-react-native';
import { decisionsAPI } from '../api/endpoints';

const decisionTypes = [
  {
    id: 'meal',
    name: 'Meal',
    description: 'Get food recommendations based on your dietary preferences',
    icon: Utensils,
    color: '#10b981',
  },
  {
    id: 'task',
    name: 'Task',
    description: 'AI will suggest what to tackle next based on your schedule',
    icon: CheckSquare,
    color: '#3b82f6',
  },
  {
    id: 'clothing',
    name: 'Clothing',
    description: 'Outfit suggestions based on weather and your style',
    icon: Shirt,
    color: '#f59e0b',
  },
];

const DecisionScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState(null);

  const handleGetRecommendation = async () => {
    if (!selectedType) {
      Alert.alert('Select Type', 'Please select a decision type first');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const data = await decisionsAPI.getRecommendation(selectedType);
      console.log('Recommendation:', JSON.stringify(data, null, 2));
      
      if (data.success && data.data) {
        setRecommendation(data.data);
      } else {
        setError('Failed to get recommendation');
      }
    } catch (err) {
      console.error('Error getting recommendation:', err);
      setError(err.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setRecommendation(null);
    setError(null);
  };

  if (recommendation) {
    // Backend returns: aiSuggestion, options, confidence, decisionId, type, question
    const aiSuggestion = recommendation.aiSuggestion || 'No suggestion available';
    const options = recommendation.options || [];
    const confidence = recommendation.confidence || 0.5;
    const decisionId = recommendation.decisionId;
    const type = recommendation.type || 'recommendation';
    const question = recommendation.question || 'What should I choose?';
    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#fafafa" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recommendation</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.recommendationCard}>
            <View style={styles.recommendationIcon}>
              <Sparkles size={32} color="#8b5cf6" />
            </View>
            
            {/* Question */}
            <Text style={styles.questionText}>{question}</Text>
            
            {/* Main AI Suggestion */}
            <Text style={styles.recommendationTitle}>
              {aiSuggestion}
            </Text>
            
            {/* Other Options */}
            {options.length > 1 && (
              <View style={styles.optionsContainer}>
                <Text style={styles.optionsLabel}>Other Options:</Text>
                {options.filter(opt => opt !== aiSuggestion).map((option, index) => (
                  <View key={index} style={styles.optionItem}>
                    <Text style={styles.optionText}>• {option}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Confidence Score */}
            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>AI Confidence</Text>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill, 
                    { width: `${confidence * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.confidenceValue}>
                {Math.round(confidence * 100)}%
              </Text>
            </View>

            {/* Provider Info */}
            {recommendation.providerUsed && (
              <Text style={styles.providerText}>
                Powered by {recommendation.providerUsed}
              </Text>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={() => {
                  navigation.navigate('Feedback', {
                    decisionId: decisionId,
                    recommendation: recommendation,
                  });
                }}
              >
                <Text style={styles.acceptButtonText}>I'll take it!</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
                <Text style={styles.retryButtonText}>Try Another</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fafafa" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Recommendation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          What do you need help deciding today?
        </Text>

        <View style={styles.typesContainer}>
          {decisionTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;

            return (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  isSelected && styles.typeCardSelected,
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View style={[styles.typeIcon, { backgroundColor: `${type.color}20` }]}>
                  <Icon size={28} color={type.color} />
                </View>
                <Text style={[styles.typeName, isSelected && styles.typeNameSelected]}>
                  {type.name}
                </Text>
                <Text style={styles.typeDescription}>{type.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.getButton,
            (!selectedType || loading) && styles.getButtonDisabled,
          ]}
          onPress={handleGetRecommendation}
          disabled={!selectedType || loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Sparkles size={20} color="#ffffff" />
              <Text style={styles.getButtonText}>Get AI Recommendation</Text>
            </>
          )}
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 24,
  },
  typesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#27272a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  typeCardSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1e1b2e',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 4,
  },
  typeNameSelected: {
    color: '#8b5cf6',
  },
  typeDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  getButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  getButtonDisabled: {
    opacity: 0.5,
  },
  getButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recommendationCard: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#27272a',
    alignItems: 'center',
  },
  recommendationIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1e1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    textAlign: 'center',
    marginBottom: 12,
  },
  recommendationDescription: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  questionText: {
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  providerText: {
    fontSize: 12,
    color: '#71717a',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  optionsContainer: {
    width: '100%',
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  optionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 12,
  },
  optionItem: {
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
    color: '#d4d4d8',
    lineHeight: 20,
  },
  confidenceContainer: {
    width: '100%',
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 8,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: '#27272a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  reasoningContainer: {
    width: '100%',
    backgroundColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reasoningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#27272a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fafafa',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DecisionScreen;
