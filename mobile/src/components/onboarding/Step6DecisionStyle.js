import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Select, Slider } from '../ui';

const budgetConsciousnessOptions = [
  'Very strict (track every rupee)',
  'Moderately careful',
  'Flexible (don\'t stress about small amounts)',
  'Not concerned about budget',
];

const timeAvailabilityOptions = [
  'Always rushed',
  'Usually have some time',
  'Generally relaxed schedule',
  'Varies day to day',
];

const decisionConfidenceOptions = [
  'Very decisive (make decisions quickly)',
  'Moderately decisive',
  'Often second-guess myself',
  'Very indecisive (struggle with choices)',
];

const DecisionStyleStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Decision-Making Style</Text>
      <Text style={styles.subtitle}>Last step! How do you make decisions? (30 sec)</Text>

      <Slider
        label="Novelty Preference"
        value={data.novelty || 3}
        onChange={(value) => handleChange('novelty', value)}
        min={1}
        max={5}
      />

      <Select
        label="Budget Consciousness"
        value={data.budgetConsciousness}
        options={budgetConsciousnessOptions}
        onSelect={(value) => handleChange('budgetConsciousness', value)}
        placeholder="Select budget consciousness"
      />

      <Select
        label="Time Availability"
        value={data.timeAvailability}
        options={timeAvailabilityOptions}
        onSelect={(value) => handleChange('timeAvailability', value)}
        placeholder="Select time availability"
      />

      <Select
        label="Decision Confidence"
        value={data.decisionConfidence}
        options={decisionConfidenceOptions}
        onSelect={(value) => handleChange('decisionConfidence', value)}
        placeholder="Select decision confidence"
      />
    </ScrollView>
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
});

export default DecisionStyleStep;
