import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Zap, ZapOff, ShieldCheck } from 'lucide-react-native';

const providers = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Fast multi-model access with reliable throughput and usage insights.',
    icon: Zap,
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-low latency inference tailored for complex reasoning flows.',
    icon: ZapOff,
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Safety-first assistant that keeps conversations grounded and helpful.',
    icon: ShieldCheck,
  },
];

const ProviderSelection = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your AI Provider</Text>
      <Text style={styles.subtitle}>
        Select the provider that will power your recommendations
      </Text>

      <View style={styles.cardsContainer}>
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isSelected = value === provider.id;

          return (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.card,
                isSelected && styles.cardSelected,
              ]}
              onPress={() => onChange(provider.id)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Icon size={24} color={isSelected ? '#ffffff' : '#a1a1aa'} />
                </View>
                {isSelected && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Selected</Text>
                  </View>
                )}
              </View>
              
              <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                {provider.name}
              </Text>
              <Text style={styles.cardDescription}>
                {provider.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#27272a',
  },
  cardSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1e1b2e',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#27272a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSelected: {
    backgroundColor: '#8b5cf6',
  },
  badge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 8,
  },
  cardTitleSelected: {
    color: '#8b5cf6',
  },
  cardDescription: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 20,
  },
});

export default ProviderSelection;
