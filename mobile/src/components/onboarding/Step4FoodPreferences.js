import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Select, MultiSelect, Slider } from '../ui';

const cuisineOptions = [
  'Indian (North)',
  'Indian (South)',
  'Chinese',
  'Italian',
  'Mexican',
  'Thai',
  'Japanese',
  'Mediterranean',
  'American/Fast food',
  'Middle Eastern',
  'Korean',
  'Continental',
  'Other',
];

const budgetOptions = [
  '₹50-100 (very budget)',
  '₹100-200 (budget-conscious)',
  '₹200-300 (moderate)',
  '₹300-500 (comfortable)',
  '₹500+ (flexible)',
];

const cookingOptions = [
  'Never cook (always eat out/order)',
  'Rarely cook (1-2 times/week)',
  'Sometimes cook (3-4 times/week)',
  'Often cook (5-6 times/week)',
  'Always cook at home',
];

const eatingStyleOptions = [
  'Quick meals (under 15 min)',
  'Sit-down dining',
  'Street food',
  'Fine dining (occasional)',
  'Meal prep/batch cooking',
  'Home-cooked food',
];

const formatTime = (hours, minutes) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const TimePicker = ({ label, value, onChange }) => {
  const [hours, minutes] = value ? value.split(':').map(Number) : [7, 30];

  const timeOptions = [];
  for (let h = 5; h <= 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      timeOptions.push(formatTime(h, m));
    }
  }

  return (
    <View style={styles.timePickerContainer}>
      <Text style={styles.timeLabel}>{label}</Text>
      <View style={styles.timeOptions}>
        {timeOptions.slice(0, 8).map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeOption,
              value === time && styles.timeOptionSelected,
            ]}
            onPress={() => onChange(time)}
          >
            <Text
              style={[
                styles.timeOptionText,
                value === time && styles.timeOptionTextSelected,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const FoodPreferencesStep = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Food Preferences</Text>
      <Text style={styles.subtitle}>Customize your meal recommendations (60 sec)</Text>

      <MultiSelect
        label="Favourite Cuisines (Max 4)"
        options={cuisineOptions}
        selected={data.cuisines || []}
        onChange={(value) => handleChange('cuisines', value)}
        max={4}
      />

      {data.cuisines?.includes('Other') && (
        <View style={{ marginTop: -8, marginBottom: 16 }}>
          <Text style={styles.sublabel}>Specify other cuisines</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>
              {data.cuisineOther || 'Not specified'}
            </Text>
          </View>
        </View>
      )}

      <Select
        label="Budget"
        value={data.budget}
        options={budgetOptions}
        onSelect={(value) => handleChange('budget', value)}
        placeholder="Select budget range"
      />

      <Select
        label="Cooking Frequency"
        value={data.cookingHabits}
        options={cookingOptions}
        onSelect={(value) => handleChange('cookingHabits', value)}
        placeholder="Select cooking frequency"
      />

      <Slider
        label="Spice Tolerance"
        value={data.spiceTolerance || 3}
        onChange={(value) => handleChange('spiceTolerance', value)}
        min={1}
        max={5}
      />

      <Text style={styles.sectionLabel}>Meal Times</Text>
      <View style={styles.mealTimesContainer}>
        <TimePicker
          label="Breakfast"
          value={data.mealTimings?.breakfast || '07:30'}
          onChange={(time) =>
            handleChange('mealTimings', { ...data.mealTimings, breakfast: time })
          }
        />
        <TimePicker
          label="Lunch"
          value={data.mealTimings?.lunch || '13:00'}
          onChange={(time) =>
            handleChange('mealTimings', { ...data.mealTimings, lunch: time })
          }
        />
        <TimePicker
          label="Dinner"
          value={data.mealTimings?.dinner || '20:00'}
          onChange={(time) =>
            handleChange('mealTimings', { ...data.mealTimings, dinner: time })
          }
        />
      </View>

      <MultiSelect
        label="Eating Styles (Pick up to 3)"
        options={eatingStyleOptions}
        selected={data.eatingStyles || []}
        onChange={(value) => handleChange('eatingStyles', value)}
        max={3}
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
    marginBottom: 12,
  },
  mealTimesContainer: {
    gap: 12,
    marginBottom: 16,
  },
  timePickerContainer: {
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d4d4d8',
    marginBottom: 8,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  timeOptionSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  timeOptionText: {
    color: '#d4d4d8',
    fontSize: 14,
  },
  timeOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
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

export default FoodPreferencesStep;
