import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Select, MultiSelect, Slider } from '../ui';

const dietaryOptions = [
  'Non-vegetarian',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Flexitarian',
];

const healthGoalOptions = [
  'Weight loss',
  'Muscle gain/fitness',
  'Maintain current weight',
  'Heart health',
  'Diabetes management',
  'No specific goal',
];

const activityOptions = [
  'Sedentary (desk job, minimal exercise)',
  'Lightly active (light exercise 1-3 days/week)',
  'Moderately active (exercise 3-5 days/week)',
  'Very active (intense exercise 6-7 days/week)',
];

const eatingPatternOptions = [
  '3 regular meals',
  '5-6 small meals (frequent snacker)',
  '2 meals + snacks',
  'Intermittent fasting',
  'Irregular/varies',
];

const allergyOptions = [
  'None',
  'Lactose intolerant',
  'Gluten-free',
  'Nut allergy',
  'Shellfish allergy',
  'Other',
];

const HealthDietaryStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Health & Dietary</Text>
      <Text style={styles.subtitle}>Help us understand your dietary needs (45 sec)</Text>

      <Select
        label="Dietary Type"
        value={data.dietaryType}
        options={dietaryOptions}
        onSelect={(value) => handleChange('dietaryType', value)}
        placeholder="Select dietary type"
      />

      <Select
        label="Health Goal"
        value={data.healthGoal}
        options={healthGoalOptions}
        onSelect={(value) => handleChange('healthGoal', value)}
        placeholder="Select health goal"
      />

      <Select
        label="Activity Level"
        value={data.activityLevel}
        options={activityOptions}
        onSelect={(value) => handleChange('activityLevel', value)}
        placeholder="Select activity level"
      />

      <Select
        label="Eating Pattern"
        value={data.eatingPattern}
        options={eatingPatternOptions}
        onSelect={(value) => handleChange('eatingPattern', value)}
        placeholder="Select eating pattern"
      />

      <MultiSelect
        label="Allergies & Restrictions"
        options={allergyOptions}
        selected={data.allergies || []}
        onChange={(value) => handleChange('allergies', value)}
        exclusiveOption="None"
      />

      {data.allergies?.includes('Other') && (
        <View style={{ marginTop: -8, marginBottom: 16 }}>
          <Text style={styles.sublabel}>Specify other allergies</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>
              {data.allergyOther || 'Not specified'}
            </Text>
          </View>
        </View>
      )}
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
  sublabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  inputText: {
    color: '#d4d4d8',
    fontSize: 16,
  },
});

export default HealthDietaryStep;
