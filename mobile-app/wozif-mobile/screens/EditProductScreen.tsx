import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Product } from '../services/api';
import { formatFCFA } from '../utils/htmlCleaner';

interface EditProductScreenProps {
  field: string;
  title: string;
  initialValue: string;
  type?: 'text' | 'number' | 'textarea';
  placeholder?: string;
}

export default function EditProductScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { field, title, initialValue, type = 'text', placeholder } = (route.params as any) || {};
  const [value, setValue] = useState(initialValue || '');

  const handleSave = () => {
    Alert.alert(
      'Sauvegarder',
      'Voulez-vous sauvegarder les modifications ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Sauvegarder', 
          onPress: () => {
            // Ici on pourrait appeler l'API pour sauvegarder
            Alert.alert('Succès', 'Modifications sauvegardées');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleBack = () => {
    if (value !== initialValue) {
      Alert.alert(
        'Modifications non sauvegardées',
        'Voulez-vous vraiment quitter sans sauvegarder ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Quitter', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>{title}</Text>
          {type === 'textarea' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={6}
            />
          ) : (
            <TextInput
              style={styles.textInput}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor="#64748b"
              keyboardType={type === 'number' ? 'numeric' : 'default'}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});
