import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  User, 
  Key, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  Camera
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/endpoints';
import * as ImagePicker from 'expo-image-picker';

const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Profile settings
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);
  
  // AI Provider settings
  const [selectedProvider, setSelectedProvider] = useState(user?.preferredProvider || 'openrouter');
  const [apiKey, setApiKey] = useState('');
  
  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const selectedImage = result.assets[0];
    const base64Image = selectedImage.base64
      ? `data:image/jpeg;base64,${selectedImage.base64}`
      : selectedImage.uri;

    setProfilePhoto(base64Image);

    try {
      await updateUser({ profilePhoto: base64Image });
      Alert.alert('Success', 'Profile picture updated');
    } catch (error) {
      Alert.alert('Error', 'Could not save profile photo locally');
    }
  };

  const providers = [
    { id: 'openrouter', name: 'OpenRouter', description: 'Fast multi-model access' },
    { id: 'groq', name: 'Groq', description: 'Ultra-low latency' },
    { id: 'anthropic', name: 'Anthropic Claude', description: 'Safety-first AI' },
  ];

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    
    // Update local state
    await updateUser({ name: name.trim() });
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleSaveProviderSettings = async () => {
    if (apiKey && apiKey.length < 10) {
      Alert.alert('Error', 'API key seems too short');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updateProviderSettings(selectedProvider, apiKey || undefined);
      await updateUser({ preferredProvider: selectedProvider });
      Alert.alert('Success', 'AI provider settings saved');
      setApiKey(''); // Clear after save
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  };

  const renderSection = (title, children) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#fafafa" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        {renderSection('Profile', (
          <>
            {/* Profile Photo */}
            <View style={styles.profilePhotoContainer}>
              <TouchableOpacity onPress={pickImage} style={styles.profilePhotoWrapper}>
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
                ) : (
                  <View style={styles.profilePhotoPlaceholder}>
                    <User size={40} color="#71717a" />
                  </View>
                )}
                <View style={styles.cameraIconContainer}>
                  <Camera size={16} color="#ffffff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.profilePhotoText}>Tap to change photo</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#52525b"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputReadOnly]}
                value={email}
                editable={false}
                selectTextOnFocus={false}
              />
              <Text style={styles.hint}>Email cannot be changed</Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Save size={18} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </>
        ))}

        {/* AI Provider Section */}
        {renderSection('AI Provider', (
          <>
            <Text style={styles.subsectionLabel}>Select Provider</Text>
            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerCard,
                  selectedProvider === provider.id && styles.providerCardSelected,
                ]}
                onPress={() => setSelectedProvider(provider.id)}
              >
                <View style={styles.providerInfo}>
                  <Text style={[
                    styles.providerName,
                    selectedProvider === provider.id && styles.providerNameSelected,
                  ]}>
                    {provider.name}
                  </Text>
                  <Text style={styles.providerDescription}>{provider.description}</Text>
                </View>
                {selectedProvider === provider.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>API Key (Optional)</Text>
              <View style={styles.apiKeyInput}>
                <TextInput
                  style={[styles.input, styles.apiKeyText]}
                  value={apiKey}
                  onChangeText={setApiKey}
                  placeholder="Enter your API key"
                  placeholderTextColor="#52525b"
                  secureTextEntry={!showApiKey}
                />
                <TouchableOpacity onPress={() => setShowApiKey(!showApiKey)}>
                  {showApiKey ? (
                    <EyeOff size={20} color="#71717a" />
                  ) : (
                    <Eye size={20} color="#71717a" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.hint}>
                Leave empty to use default provider settings
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
              onPress={handleSaveProviderSettings}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Key size={18} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save Provider Settings</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ))}

        {/* Preferences Section */}
        {renderSection('Preferences', (
          <>
            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Bell size={20} color="#a1a1aa" />
                <Text style={styles.preferenceText}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#27272a', true: '#8b5cf6' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.preferenceItem}>
              <View style={styles.preferenceInfo}>
                <Shield size={20} color="#a1a1aa" />
                <Text style={styles.preferenceText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#27272a', true: '#8b5cf6' }}
                thumbColor="#ffffff"
                disabled={true}
              />
            </View>
          </>
        ))}

        {/* About Section */}
        {renderSection('About', (
          <>
            <TouchableOpacity style={styles.aboutItem}>
              <HelpCircle size={20} color="#a1a1aa" />
              <Text style={styles.aboutText}>Help & Support</Text>
              <ChevronRight size={20} color="#71717a" />
            </TouchableOpacity>

            <View style={styles.versionContainer}>
              <Text style={styles.versionLabel}>Version</Text>
              <Text style={styles.versionNumber}>1.0.0</Text>
            </View>
          </>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fafafa',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a1a1aa',
    marginHorizontal: 20,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#18181b',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#fafafa',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  inputReadOnly: {
    color: '#e4e4e7',
    backgroundColor: '#1f1f23',
    borderColor: '#3f3f46',
  },
  hint: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  subsectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a1a1aa',
    marginBottom: 12,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#27272a',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  providerCardSelected: {
    borderColor: '#8b5cf6',
    backgroundColor: '#1e1b2e',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fafafa',
    marginBottom: 2,
  },
  providerNameSelected: {
    color: '#8b5cf6',
  },
  providerDescription: {
    fontSize: 13,
    color: '#a1a1aa',
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8b5cf6',
    marginLeft: 8,
  },
  apiKeyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27272a',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  apiKeyText: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  preferenceText: {
    fontSize: 16,
    color: '#fafafa',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  aboutText: {
    flex: 1,
    fontSize: 16,
    color: '#fafafa',
    marginLeft: 12,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
  },
  versionLabel: {
    fontSize: 16,
    color: '#a1a1aa',
  },
  versionNumber: {
    fontSize: 16,
    color: '#71717a',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27272a',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default SettingsScreen;
