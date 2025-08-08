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
import { formatFCFA } from '../utils/htmlCleaner';

export default function EditPriceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = (route.params as any) || {};
  const [standardPrice, setStandardPrice] = useState(product?.price?.toString() || '');
  const [promoPrice, setPromoPrice] = useState((product?.price * 0.8)?.toString() || '');

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
            Alert.alert('Succès', 'Prix mis à jour avec succès');
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier les prix</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#16a34a" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Prix standard (FCFA)</Text>
          <TextInput
            style={styles.textInput}
            value={standardPrice}
            onChangeText={setStandardPrice}
            placeholder="Prix standard"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
          />
          {standardPrice && (
            <Text style={styles.previewText}>
              Aperçu : {formatFCFA(parseFloat(standardPrice) || 0)}
            </Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Prix promo (FCFA)</Text>
          <TextInput
            style={styles.textInput}
            value={promoPrice}
            onChangeText={setPromoPrice}
            placeholder="Prix promo"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
          />
          {promoPrice && (
            <Text style={styles.previewText}>
              Aperçu : {formatFCFA(parseFloat(promoPrice) || 0)}
            </Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle" size={20} color="#60a5fa" />
          <Text style={styles.infoText}>
            Le prix promo sera affiché en priorité si défini
          </Text>
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
    marginBottom: 24,
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
  previewText: {
    color: '#60a5fa',
    fontSize: 14,
    marginTop: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoText: {
    color: '#60a5fa',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});
