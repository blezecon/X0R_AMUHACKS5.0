import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Select, Slider } from '../ui';

const scheduleOptions = [
  '9 AM - 5 PM (standard)',
  '10 AM - 6 PM',
  'Flexible hours',
  'Night shift',
  'Freelance/variable',
  'Student schedule',
  'Unemployed/Retired',
];

const locationOptions = [
  'Home (WFH/online classes)',
  'Office/Campus',
  'Hybrid (3-4 days office)',
  'Hybrid (1-2 days office)',
];

const commuteOptions = [
  'No commute (WFH)',
  '0-15 minutes',
  '15-30 minutes',
  '30-60 minutes',
  '60+ minutes',
];

const lunchOptions = [
  '30 minutes',
  '45 minutes',
  '1 hour',
  'More than 1 hour',
  'Flexible/no fixed time',
];

const dailyScheduleOptions = [
  'Meetings/classes heavy',
  'Deep focus work',
  'Mix of both',
  'Mostly customer-facing',
  'Physical/hands-on work',
];

const WorkScheduleStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Work & Schedule</Text>
      <Text style={styles.subtitle}>Tell us about your work routine (40 sec)</Text>

      <Select
        label="Work Schedule"
        value={data.schedule}
        options={scheduleOptions}
        onSelect={(value) => handleChange('schedule', value)}
        placeholder="Select work schedule"
      />

      <Select
        label="Work Location"
        value={data.location}
        options={locationOptions}
        onSelect={(value) => handleChange('location', value)}
        placeholder="Select work location"
      />

      <Select
        label="Commute Time"
        value={data.commuteTime}
        options={commuteOptions}
        onSelect={(value) => handleChange('commuteTime', value)}
        placeholder="Select commute time"
      />

      <Select
        label="Lunch Break"
        value={data.lunchBreak}
        options={lunchOptions}
        onSelect={(value) => handleChange('lunchBreak', value)}
        placeholder="Select lunch break duration"
      />

      <Select
        label="Daily Schedule"
        value={data.dailyScheduleType}
        options={dailyScheduleOptions}
        onSelect={(value) => handleChange('dailyScheduleType', value)}
        placeholder="Select daily schedule type"
      />

      <Slider
        label="Stress Level"
        value={data.stressLevel || 1}
        onChange={(value) => handleChange('stressLevel', value)}
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

export default WorkScheduleStep;
