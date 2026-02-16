import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Select, Slider } from '../ui';

const energyPeakOptions = [
  'Morning person (5 AM - 11 AM)',
  'Midday peak (11 AM - 3 PM)',
  'Afternoon (3 PM - 7 PM)',
  'Night owl (7 PM - midnight)',
  'Late night (after midnight)',
];

const priorityMethodOptions = [
  'Urgency first (closest deadline)',
  'Importance first (highest impact)',
  'Easiest first (quick wins)',
  'Hardest first (eat the frog)',
  'Mix it up based on mood',
];

const workBlockOptions = [
  'Short bursts (15-25 min, Pomodoro style)',
  'Medium blocks (45-60 min)',
  'Long blocks (2+ hours deep work)',
  'Varies by task',
];

const multitaskingOptions = [
  'Prefer multitasking',
  'Prefer single-tasking (one thing at a time)',
  'Depends on task type',
];

const TaskManagementStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Task Management Style</Text>
      <Text style={styles.subtitle}>How do you work best? (40 sec)</Text>

      <Select
        label="Energy Peak"
        value={data.energyPeak}
        options={energyPeakOptions}
        onSelect={(value) => handleChange('energyPeak', value)}
        placeholder="Select your energy peak time"
      />

      <Select
        label="Priority Method"
        value={data.priorityMethod}
        options={priorityMethodOptions}
        onSelect={(value) => handleChange('priorityMethod', value)}
        placeholder="Select priority method"
      />

      <Select
        label="Work Block Duration"
        value={data.workBlockDuration}
        options={workBlockOptions}
        onSelect={(value) => handleChange('workBlockDuration', value)}
        placeholder="Select work block duration"
      />

      <Select
        label="Multitasking Style"
        value={data.multitasking}
        options={multitaskingOptions}
        onSelect={(value) => handleChange('multitasking', value)}
        placeholder="Select multitasking style"
      />

      <Slider
        label="Procrastination Level"
        value={data.procrastination || 3}
        onChange={(value) => handleChange('procrastination', value)}
        min={1}
        max={5}
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

export default TaskManagementStep;
