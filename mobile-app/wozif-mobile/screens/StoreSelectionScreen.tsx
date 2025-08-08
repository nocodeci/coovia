import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../services/api';
import { Store } from '../services/api';

export default function StoreSelectionScreen({ onStoreSelect }: { onStoreSelect: (store: Store) => void }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStores = async () => {
    try {
      const response = await apiService.getStores();
      console.log('Boutiques récupérées:', response);
      setStores(response);
    } catch (error: any) {
      console.error('Erreur lors du chargement des boutiques:', error);
      // Ne pas utiliser de données de démo, laisser la liste vide
      setStores([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStores();
  };

  const handleStoreSelect = (store: Store) => {
    Alert.alert(
      'Sélectionner la boutique',
      `Voulez-vous accéder à "${store.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Sélectionner', onPress: () => onStoreSelect(store) }
      ]
    );
  };

  const handleCreateStore = () => {
    Alert.alert('Créer une boutique', 'Fonctionnalité à implémenter');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement de vos boutiques...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Vos boutiques</Text>
        <Text style={styles.subtitle}>Sélectionnez une boutique pour continuer</Text>
      </View>

      {/* Stores List */}
      <ScrollView 
        style={styles.storesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />
        }
      >
        {stores.length > 0 ? (
          stores.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={styles.storeCard}
              onPress={() => handleStoreSelect(store)}
            >
              <View style={styles.storeInfo}>
                <View style={styles.storeIcon}>
                  <Ionicons name="storefront" size={24} color="#2563eb" />
                </View>
                                 <View style={styles.storeDetails}>
                   <Text style={styles.storeName}>{store.name}</Text>
                   <Text style={styles.storeDescription}>{store.description || 'Aucune description'}</Text>
                   <Text style={styles.storeSlug}>wozif.com/{store.slug}</Text>
                 </View>
              </View>
              <View style={styles.storeStatus}>
                <View style={[styles.statusBadge, { backgroundColor: store.status === 'active' ? '#16a34a' : '#ef4444' }]}>
                  <Text style={styles.statusText}>{store.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="storefront-outline" size={64} color="#94a3b8" />
            <Text style={styles.emptyTitle}>Aucune boutique</Text>
            <Text style={styles.emptySubtitle}>
              Vous n'avez pas encore créé de boutique. Créez votre première boutique pour commencer.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Store Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateStore}>
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.createButtonText}>Créer une nouvelle boutique</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  storesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  storeCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  storeDescription: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  storeSlug: {
    color: '#64748b',
    fontSize: 12,
  },
  storeStatus: {
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  createButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
