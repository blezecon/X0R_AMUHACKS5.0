import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

import ProviderSelection from '../components/onboarding/Step0ProviderSelection';
import BasicProfileStep from '../components/onboarding/Step1BasicProfile';
import HealthDietaryStep from '../components/onboarding/Step2HealthDietary';
import WorkScheduleStep from '../components/onboarding/Step3WorkSchedule';
import FoodPreferencesStep from '../components/onboarding/Step4FoodPreferences';
import TaskManagementStep from '../components/onboarding/Step5TaskManagement';
import DecisionStyleStep from '../components/onboarding/Step6DecisionStyle';

const TOTAL_STEPS = 7;

const OnboardingScreen = () => {
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    provider: 'openrouter',
    profile: {
      name: '',
      age: '',
      gender: '',
      occupation: '',
      occupationOther: '',
      location: '',
      livingSituation: '',
    },
    health: {
      dietaryType: '',
      healthGoal: '',
      activityLevel: '',
      eatingPattern: '',
      allergies: [],
      allergyOther: '',
    },
    work: {
      schedule: '',
      location: '',
      commuteTime: '',
      lunchBreak: '',
      stressLevel: 3,
      dailyScheduleType: '',
    },
    foodPreferences: {
      cuisines: [],
      cuisineOther: '',
      spiceTolerance: 3,
      budget: '',
      mealTimings: {
        breakfast: '07:30',
        lunch: '13:00',
        dinner: '20:00',
      },
      cookingHabits: '',
      eatingStyles: [],
    },
    clothingPreferences: {
      fashionStyles: [],
      weatherSensitivity: '',
      colorPreferences: [],
      comfortPriority: 3,
      dressCode: '',
    },
    taskStyle: {
      energyPeak: '',
      priorityMethod: '',
      workBlockDuration: '',
      procrastination: 3,
      multitasking: '',
    },
    decisionStyle: {
      novelty: 3,
      budgetConsciousness: '',
      timeAvailability: '',
      decisionConfidence: '',
    },
  });

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return !!formData.provider;
      case 1:
        return (
          formData.profile.name.trim() &&
          formData.profile.age &&
          formData.profile.gender &&
          formData.profile.occupation &&
          (formData.profile.occupation !== 'Other' || formData.profile.occupationOther.trim()) &&
          formData.profile.location.trim() &&
          formData.profile.livingSituation
        );
      case 2:
        return (
          formData.health.dietaryType &&
          formData.health.healthGoal &&
          formData.health.activityLevel &&
          formData.health.eatingPattern &&
          formData.health.allergies.length > 0
        );
      case 3:
        return (
          formData.work.schedule &&
          formData.work.location &&
          formData.work.commuteTime &&
          formData.work.lunchBreak &&
          formData.work.dailyScheduleType &&
          formData.work.stressLevel
        );
      case 4:
        return (
          formData.foodPreferences.cuisines.length > 0 &&
          formData.foodPreferences.budget &&
          formData.foodPreferences.cookingHabits &&
          formData.foodPreferences.spiceTolerance &&
          formData.foodPreferences.eatingStyles.length > 0
        );
      case 5:
        return (
          formData.taskStyle.energyPeak &&
          formData.taskStyle.priorityMethod &&
          formData.taskStyle.workBlockDuration &&
          formData.taskStyle.multitasking &&
          formData.taskStyle.procrastination
        );
      case 6:
        return (
          formData.decisionStyle.novelty &&
          formData.decisionStyle.budgetConsciousness &&
          formData.decisionStyle.timeAvailability &&
          formData.decisionStyle.decisionConfidence
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      Alert.alert('Incomplete', 'Please fill in all required fields before continuing.');
      return;
    }

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Provide defaults for clothing preferences if not set
      const clothingPrefs = {
        fashionStyles: formData.clothingPreferences.fashionStyles.length > 0 
          ? formData.clothingPreferences.fashionStyles 
          : ['Casual (jeans, t-shirts)'],
        weatherSensitivity: formData.clothingPreferences.weatherSensitivity || 'Moderately sensitive',
        colorPreferences: formData.clothingPreferences.colorPreferences.length > 0
          ? formData.clothingPreferences.colorPreferences
          : ['No preference'],
        comfortPriority: formData.clothingPreferences.comfortPriority || 3,
        dressCode: formData.clothingPreferences.dressCode || 'Casual (anything goes)',
      };

      const payload = {
        provider: formData.provider,
        onboarding: {
          profile: {
            age: parseInt(formData.profile.age, 10),
            gender: formData.profile.gender,
            occupation: formData.profile.occupation,
            ...(formData.profile.occupation === 'Other' && {
              occupationOther: formData.profile.occupationOther,
            }),
            location: formData.profile.location,
            livingSituation: formData.profile.livingSituation,
          },
          health: {
            dietaryType: formData.health.dietaryType,
            allergies: formData.health.allergies,
            ...(formData.health.allergies.includes('Other') && {
              allergyOther: formData.health.allergyOther,
            }),
            healthGoal: formData.health.healthGoal,
            activityLevel: formData.health.activityLevel,
            eatingPattern: formData.health.eatingPattern,
          },
          work: {
            schedule: formData.work.schedule,
            location: formData.work.location,
            commuteTime: formData.work.commuteTime,
            lunchBreak: formData.work.lunchBreak,
            stressLevel: formData.work.stressLevel,
            dailyScheduleType: formData.work.dailyScheduleType,
          },
          foodPreferences: {
            cuisines: formData.foodPreferences.cuisines,
            ...(formData.foodPreferences.cuisines.includes('Other') && {
              cuisineOther: formData.foodPreferences.cuisineOther,
            }),
            spiceTolerance: formData.foodPreferences.spiceTolerance,
            budget: formData.foodPreferences.budget,
            mealTimings: formData.foodPreferences.mealTimings,
            cookingHabits: formData.foodPreferences.cookingHabits,
            eatingStyles: formData.foodPreferences.eatingStyles,
          },
          clothingPreferences: clothingPrefs,
          taskStyle: {
            energyPeak: formData.taskStyle.energyPeak,
            priorityMethod: formData.taskStyle.priorityMethod,
            workBlockDuration: formData.taskStyle.workBlockDuration,
            procrastination: formData.taskStyle.procrastination,
            multitasking: formData.taskStyle.multitasking,
          },
          decisionStyle: {
            novelty: formData.decisionStyle.novelty,
            budgetConsciousness: formData.decisionStyle.budgetConsciousness,
            timeAvailability: formData.decisionStyle.timeAvailability,
            decisionConfidence: formData.decisionStyle.decisionConfidence,
          },
        },
      };
      
      console.log('Submitting onboarding payload:', JSON.stringify(payload, null, 2));

      const result = await completeOnboarding(payload);

      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStepData = (stepKey, newData) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: newData,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProviderSelection
            value={formData.provider}
            onChange={(value) => setFormData({ ...formData, provider: value })}
          />
        );
      case 1:
        return (
          <BasicProfileStep
            data={formData.profile}
            onChange={(data) => updateStepData('profile', data)}
          />
        );
      case 2:
        return (
          <HealthDietaryStep
            data={formData.health}
            onChange={(data) => updateStepData('health', data)}
          />
        );
      case 3:
        return (
          <WorkScheduleStep
            data={formData.work}
            onChange={(data) => updateStepData('work', data)}
          />
        );
      case 4:
        return (
          <FoodPreferencesStep
            data={formData.foodPreferences}
            onChange={(data) => updateStepData('foodPreferences', data)}
          />
        );
      case 5:
        return (
          <TaskManagementStep
            data={formData.taskStyle}
            onChange={(data) => updateStepData('taskStyle', data)}
          />
        );
      case 6:
        return (
          <DecisionStyleStep
            data={formData.decisionStyle}
            onChange={(data) => updateStepData('decisionStyle', data)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  i <= currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepIndicator}>
            Step {currentStep + 1} of {TOTAL_STEPS}
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.backButton, currentStep === 0 && styles.backButtonDisabled]}
            onPress={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={20} color={currentStep === 0 ? '#52525b' : '#fafafa'} />
            <Text style={[styles.backButtonText, currentStep === 0 && styles.backButtonTextDisabled]}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !validateCurrentStep() && styles.nextButtonDisabled]}
            onPress={handleNext}
            disabled={!validateCurrentStep() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {currentStep === TOTAL_STEPS - 1 ? 'Complete' : 'Next'}
                </Text>
                {currentStep === TOTAL_STEPS - 1 ? (
                  <Check size={20} color="#ffffff" />
                ) : (
                  <ChevronRight size={20} color="#ffffff" />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#27272a',
  },
  progressDotActive: {
    backgroundColor: '#8b5cf6',
    width: 24,
  },
  stepIndicator: {
    textAlign: 'center',
    color: '#a1a1aa',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButtonDisabled: {
    opacity: 0.5,
  },
  backButtonText: {
    color: '#fafafa',
    fontSize: 16,
    marginLeft: 4,
  },
  backButtonTextDisabled: {
    color: '#52525b',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: '#27272a',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
