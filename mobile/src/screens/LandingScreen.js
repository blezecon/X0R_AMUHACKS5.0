import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, Brain, Shield, ArrowRight } from 'lucide-react-native';

const LandingScreen = ({ navigation }) => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Decisions',
      description: 'Get personalized recommendations for meals, tasks, and clothing based on your preferences.',
    },
    {
      icon: Shield,
      title: 'Your Data, Secure',
      description: 'End-to-end encryption for your API keys and personal information.',
    },
    {
      icon: Sparkles,
      title: 'Learns From You',
      description: 'The more you use it, the better it gets at understanding your preferences.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Sparkles size={48} color="#8b5cf6" />
          </View>
          <Text style={styles.title}>Swiftion</Text>
          <Text style={styles.tagline}>
            Stop wasting mental energy on small decisions. Let AI handle the daily grind.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Icon size={24} color="#8b5cf6" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <ArrowRight size={20} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#1e1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
    maxWidth: 280,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1e1b2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
});

export default LandingScreen;
