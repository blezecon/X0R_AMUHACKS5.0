import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Send, CheckCircle } from 'lucide-react-native';
import { feedbackAPI } from '../api/endpoints';

const FeedbackScreen = ({ navigation, route }) => {
  const { decisionId, recommendation } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rate First', 'Please select a star rating before submitting');
      return;
    }

    if (!decisionId) {
      Alert.alert('Error', 'Decision ID not found');
      return;
    }

    setLoading(true);
    try {
      await feedbackAPI.submitFeedback(decisionId, rating, comment.trim() || undefined);
      setSubmitted(true);
      
      // Auto navigate back after 2 seconds
      setTimeout(() => {
        navigation.navigate('Dashboard');
      }, 2000);
    } catch (error) {
      console.error('Feedback submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Dashboard');
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={64} color="#10b981" />
          </View>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successMessage}>
            Your feedback helps us improve recommendations for you.
          </Text>
          <Text style={styles.redirectText}>Redirecting to Dashboard...</Text>
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
        <Text style={styles.headerTitle}>Rate Recommendation</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Recommendation Summary */}
        {recommendation && (
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationLabel}>You chose:</Text>
            <Text style={styles.recommendationTitle}>
              {recommendation.title || recommendation.suggestion}
            </Text>
            {recommendation.description && (
              <Text style={styles.recommendationDescription} numberOfLines={2}>
                {recommendation.description}
              </Text>
            )}
          </View>
        )}

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>How was this recommendation?</Text>
          <Text style={styles.ratingSubtitle}>
            Tap the stars to rate your experience
          </Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => setRating(star)}
              >
                <Star
                  size={40}
                  color={star <= rating ? '#fbbf24' : '#3f3f46'}
                  fill={star <= rating ? '#fbbf24' : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingLabel}>
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent!'}
            {rating === 0 && 'Tap to rate'}
          </Text>
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>
            Additional Comments (Optional)
          </Text>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Tell us more about your experience..."
            placeholderTextColor="#52525b"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (rating === 0 || loading) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={rating === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Send size={20} color="#ffffff" />
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
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
  skipText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  recommendationCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  recommendationLabel: {
    fontSize: 12,
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 8,
  },
  ratingSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fbbf24',
    minHeight: 24,
  },
  commentSection: {
    marginBottom: 24,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fafafa',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    color: '#fafafa',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#064e3b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  redirectText: {
    fontSize: 14,
    color: '#71717a',
  },
});

export default FeedbackScreen;
