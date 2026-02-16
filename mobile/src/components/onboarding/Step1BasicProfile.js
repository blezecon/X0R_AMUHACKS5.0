import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input, Select } from '../ui';

const occupationOptions = [
  'Student',
  'Software Engineer',
  'Business Professional',
  'Designer/Creative',
  'Healthcare Worker',
  'Teacher/Professor',
  'Entrepreneur',
  'Homemaker',
  'Other',
];

const genderOptions = [
  'Male',
  'Female',
  'Other',
  'Prefer not to say',
];

const livingOptions = [
  'Live alone',
  'With roommates',
  'With family',
  'With partner',
];

const BasicProfileStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Basic Profile</Text>
      <Text style={styles.subtitle}>Tell us a bit about yourself (30 sec)</Text>

      <Input
        label="Full Name"
        value={data.name}
        onChangeText={(value) => handleChange('name', value)}
        placeholder="Enter your full name"
      />

      <Input
        label="Age"
        value={data.age}
        onChangeText={(value) => handleChange('age', value)}
        placeholder="Enter your age"
        keyboardType="numeric"
      />

      <Select
        label="Gender"
        value={data.gender}
        options={genderOptions}
        onSelect={(value) => handleChange('gender', value)}
        placeholder="Select gender"
      />

      <Select
        label="Occupation"
        value={data.occupation}
        options={occupationOptions}
        onSelect={(value) => handleChange('occupation', value)}
        placeholder="Select occupation"
      />

      {data.occupation === 'Other' && (
        <Input
          label="Specify Occupation"
          value={data.occupationOther}
          onChangeText={(value) => handleChange('occupationOther', value)}
          placeholder="Enter your occupation"
        />
      )}

      <Input
        label="City / Location"
        value={data.location}
        onChangeText={(value) => handleChange('location', value)}
        placeholder="Enter your city"
      />

      <Select
        label="Living Situation"
        value={data.livingSituation}
        options={livingOptions}
        onSelect={(value) => handleChange('livingSituation', value)}
        placeholder="Select living situation"
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

export default BasicProfileStep;
