import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

export const Card = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
};

export const Input = ({ label, value, onChangeText, placeholder, keyboardType, style }) => (
  <View style={[styles.inputContainer, style]}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#52525b"
      keyboardType={keyboardType || 'default'}
    />
  </View>
);

export const Select = ({ label, value, options, onSelect, placeholder }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.select}
        onPress={() => setModalVisible(true)}
      >
        <Text style={value ? styles.selectText : styles.selectPlaceholder}>
          {value || placeholder || 'Select...'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.option,
                    value === option && styles.optionSelected,
                  ]}
                  onPress={() => {
                    onSelect(option);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const MultiSelect = ({ label, options, selected, onChange, max, exclusiveOption }) => {
  const handleSelect = (option) => {
    if (exclusiveOption && option === exclusiveOption) {
      onChange([option]);
      return;
    }

    if (selected.includes(exclusiveOption)) {
      onChange([option]);
      return;
    }

    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      if (max && selected.length >= max) {
        return;
      }
      onChange([...selected, option]);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pillsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.pill,
              selected.includes(option) && styles.pillSelected,
            ]}
            onPress={() => handleSelect(option)}
          >
            <Text
              style={[
                styles.pillText,
                selected.includes(option) && styles.pillTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export const Slider = ({ label, value, onChange, min = 1, max = 5 }) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sliderValue}>{value}</Text>
      </View>
      <View style={styles.sliderContainer}>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.sliderDot,
              value >= num && styles.sliderDotActive,
            ]}
            onPress={() => onChange(num)}
          />
        ))}
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>{min}</Text>
        <Text style={styles.sliderLabel}>{max}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
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
    color: '#fafafa',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  select: {
    backgroundColor: '#18181b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  selectText: {
    color: '#fafafa',
    fontSize: 16,
  },
  selectPlaceholder: {
    color: '#52525b',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionSelected: {
    backgroundColor: '#8b5cf6',
  },
  optionText: {
    fontSize: 16,
    color: '#d4d4d8',
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#a1a1aa',
    fontSize: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#27272a',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  pillSelected: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  pillText: {
    color: '#d4d4d8',
    fontSize: 14,
  },
  pillTextSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sliderDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#27272a',
    borderWidth: 2,
    borderColor: '#3f3f46',
  },
  sliderDotActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    color: '#71717a',
    fontSize: 12,
  },
});
