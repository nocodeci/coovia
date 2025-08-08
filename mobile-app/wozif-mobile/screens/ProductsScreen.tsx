import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Image,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import apiService, { type Product } from '../services/api'
import { useStore } from '../context/StoreContext'
import { cleanHtml, formatFCFA, getProductStock } from '../utils/htmlCleaner'

type StatusFilter = 'all' | 'active' | 'inactive'

function StatCard({
  icon,
  label,
  value,
  accent = '#10b981',
}: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  value: string
  accent?: string
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: accent }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={16} color={accent} />
        <Text style={[styles.statLabel]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={styles.statValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

function StatusChip({
  label,
  active,
  onPress,
}: {
  label: string
  active?: boolean
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        pressed && Platform.OS === 'ios' ? { opacity: 0.8 } : null,
      ]}
      android_ripple={{ color: 'rgba(148,163,184,0.2)', borderless: false }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextIdle]}>
        {label}
      </Text>
    </Pressable>
  )
}

function ProductCard({
  product,
  onPress,
}: {
  product: Product
  onPress: (product: Product) => void
}) {
  const stock = getProductStock(product)
  const inStock = stock > 0
  const statusActive = product.status === 'active'
  const thumb = product.images?.[0]

  return (
    <Pressable
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.productCard, pressed && Platform.OS === 'ios' ? { opacity: 0.8 } : null]}
      android_ripple={{ color: 'rgba(148,163,184,0.15)' }}
      accessibilityRole="button"
      accessibilityLabel={product.name}
    >
      <View style={styles.cardLeft}>
        <View style={styles.thumb}>
          {thumb ? (
            <Image
              source={{ uri: thumb }}
              style={styles.thumbImage}
              resizeMode="cover"
              accessible
              accessibilityLabel="Image du produit"
            />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Ionicons name="image" size={20} color="#64748b" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardCenter}>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description ? cleanHtml(product.description) : 'Aucune description'}
        </Text>

        <View style={styles.tagsRow}>
          <View style={[styles.badge, { backgroundColor: 'rgba(148,163,184,0.12)' }]}>
            <Ionicons name="pricetags-outline" size={12} color="#cbd5e1" />
            <Text style={[styles.badgeText, { color: '#cbd5e1' }]} numberOfLines={1}>
              {formatFCFA(product.price)}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: inStock ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' },
            ]}
          >
            <Ionicons
              name={inStock ? 'checkmark-circle' : 'close-circle'}
              size={12}
              color={inStock ? '#10b981' : '#ef4444'}
            />
            <Text
              style={[
                styles.badgeText,
                { color: inStock ? '#10b981' : '#ef4444' },
              ]}
              numberOfLines={1}
            >
              {inStock ? `Stock: ${stock}` : 'Rupture'}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              { backgroundColor: statusActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' },
            ]}
          >
            <Ionicons
              name="ellipse"
              size={8}
              color={statusActive ? '#10b981' : '#ef4444'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.badgeText,
                { color: statusActive ? '#10b981' : '#ef4444' },
              ]}
              numberOfLines={1}
            >
              {statusActive ? 'Actif' : 'Inactif'}
            </Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </Pressable>
  )
}

function EmptyState({ onAdd, hasQuery }: { onAdd: () => void; hasQuery: boolean }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={64} color="#94a3b8" />
      <Text style={styles.emptyTitle}>Aucun produit</Text>
      <Text style={styles.emptySubtitle}>
        {hasQuery ? 'Aucun résultat pour votre recherche' : 'Commencez par ajouter votre premier produit'}
      </Text>
      {!hasQuery && (
        <TouchableOpacity onPress={onAdd} style={styles.primaryBtn} accessibilityRole="button">
          <Ionicons name="add" size={16} color="#0b1220" />
          <Text style={styles.primaryBtnText}>Ajouter un produit</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default function ProductsScreen() {
  const navigation = useNavigation<any>()
  const { storeId } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const loadProducts = async () => {
    if (!storeId) {
      console.log('❌ Aucun storeId disponible')
      setProducts([])
      setLoading(false)
      setRefreshing(false)
      return
    }
    try {
      setLoading(true)
      console.log('🛍️ Chargement des produits pour la boutique:', storeId)
      const response = await apiService.getProducts(storeId)
      setProducts(response)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      setProducts([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [storeId])

  const onRefresh = () => {
    setRefreshing(true)
    loadProducts()
  }

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product })
  }

  const handleAddProduct = () => {
    Alert.alert('Ajouter un produit', 'Fonctionnalité à implémenter')
  }

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? p.status === 'active' : p.status !== 'active')
      return matchesQuery && matchesStatus
    })
  }, [products, searchQuery, statusFilter])

  const totalProducts = products.length
  const activeProducts = products.filter((p) => p.status === 'active').length
  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => {
      const stock = getProductStock(p)
      const price = p.price || 0
      return sum + price * stock
    }, 0)
  }, [products])

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard icon="cube" label="Total" value={String(totalProducts)} />
        <StatCard icon="checkmark-circle" label="Actifs" value={String(activeProducts)} />
        <StatCard icon="cash-outline" label="Valeur (CFA)" value={formatFCFA(totalValue)} accent="#f59e0b" />
      </View>

      {/* Search + Add */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn} accessibilityLabel="Effacer la recherche">
              <Ionicons name="close-circle" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddProduct} accessibilityRole="button" accessibilityLabel="Ajouter un produit">
          <Ionicons name="add" size={22} color="#0b1220" />
        </TouchableOpacity>
      </View>

      {/* Quick filters */}
      <View style={styles.filtersRow}>
        <StatusChip label="Tous" active={statusFilter === 'all'} onPress={() => setStatusFilter('all')} />
        <StatusChip label="Actifs" active={statusFilter === 'active'} onPress={() => setStatusFilter('active')} />
        <StatusChip label="Inactifs" active={statusFilter === 'inactive'} onPress={() => setStatusFilter('inactive')} />
      </View>

      {/* Products list */}
      <FlatList
        data={loading ? Array.from({ length: 6 }).map((_, i) => ({ id: `skeleton-${i}` })) : filteredProducts}
        keyExtractor={(item: any) => String(item.id ?? item.name ?? Math.random())}
        renderItem={({ item }: { item: any }) =>
          loading ? (
            <View style={styles.skeletonCard} />
          ) : (
            <ProductCard product={item as Product} onPress={handleProductPress} />
          )
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
        ListEmptyComponent={
          !loading ? (
            <EmptyState onAdd={handleAddProduct} hasQuery={searchQuery.length > 0} />
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  )
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },

  /* Stats */
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 4,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    paddingVertical: 10,
  },
  clearBtn: {
    padding: 6,
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: '#10b981',
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Filters */
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipIdle: {
    backgroundColor: 'rgba(148,163,184,0.12)',
  },
  chipActive: {
    backgroundColor: 'rgba(16,185,129,0.18)',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextIdle: {
    color: '#cbd5e1',
  },
  chipTextActive: {
    color: '#10b981',
  },

  /* List */
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 4,
  },
  skeletonCard: {
    height: 96,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },

  /* Product card */
  productCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLeft: { width: 56 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111827',
  },
  thumbImage: { width: '100%', height: '100%' },
  thumbPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardCenter: {
    flex: 1,
    minHeight: 56,
  },
  productName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  productDescription: {
    color: '#94a3b8',
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e5e7eb',
  },

  /* Empty */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 32,
  },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: {
    color: '#0b1220',
    fontWeight: '800',
  },
})