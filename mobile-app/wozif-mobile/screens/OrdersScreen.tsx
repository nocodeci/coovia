import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  FlatList,
  PanResponder,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { type Order } from '../types/dashboard'

type FilterKey = 'all' | Order['status']

/* ---------------- Swipeable Order Card ---------------- */

function SwipeableOrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order
  onUpdateStatus: (orderId: string, status: Order['status']) => void
}) {
  const translateX = useRef(new Animated.Value(0)).current
  const canSwipe = order.status === 'pending'

  // Visual progress for the background action (0..1)
  const actionOpacity = translateX.interpolate({
    inputRange: [-80, -20, 0],
    outputRange: [1, 0.4, 0],
    extrapolate: 'clamp',
  })

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        canSwipe && Math.abs(g.dx) > 10 && Math.abs(g.dy) < 10,
      onPanResponderGrant: () => {
        translateX.setOffset((translateX as any)._value || 0)
      },
      onPanResponderMove: (_, g) => {
        if (!canSwipe) return
        if (g.dx < 0) {
          const v = Math.max(g.dx, -80)
          translateX.setValue(v)
        }
      },
      onPanResponderRelease: (_, g) => {
        translateX.flattenOffset()
        if (!canSwipe) {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start()
          return
        }
        if (g.dx < -60) {
          // Mark as paid after full swipe
          Animated.timing(translateX, {
            toValue: -80,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            onUpdateStatus(order.id, 'paid')
            // Reset card position
            setTimeout(() => {
              Animated.timing(translateX, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }).start()
            }, 600)
          })
        } else {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return '#10b981'
      case 'pending':
        return '#f59e0b'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#64748b'
    }
  }
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return 'checkmark-circle'
      case 'pending':
        return 'time'
      case 'cancelled':
        return 'close-circle'
      default:
        return 'help-circle'
    }
  }

  const formattedDate = new Date(order.createdAt).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <View style={styles.swipeContainer}>
      {/* Background action (visible during swipe) */}
      {canSwipe && (
        <Animated.View style={[styles.swipeAction, { opacity: actionOpacity }]}>
          <Ionicons name="checkmark-circle" size={22} color="#0b1220" />
          <Text style={styles.swipeActionText}>Terminer</Text>
        </Animated.View>
      )}

      {/* Foreground card */}
      <Animated.View
        style={[styles.orderCard, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Header row */}
        <View style={styles.orderHeader}>
          <View style={styles.idDate}>
            <Text style={styles.orderId}>#{order.id.slice(-8).toUpperCase()}</Text>
            <Text style={styles.orderDate}>{formattedDate}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
        </View>

        {/* Customer */}
        <View style={styles.orderInfo}>
          <Text style={styles.customerName} numberOfLines={1}>
            {order.customerName}
          </Text>
          <Text style={styles.customerEmail} numberOfLines={1}>
            {order.customerEmail}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>
            {order.total.toFixed(2)} {order.currency}
          </Text>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(order.status) + '33' },
              ]}
            >
              <Ionicons
                name={getStatusIcon(order.status) as any}
                size={14}
                color={getStatusColor(order.status)}
                style={styles.statusIcon}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(order.status) },
                ]}
              >
                {order.status}
              </Text>
            </View>

            {canSwipe && (
              <View style={styles.swipeHint}>
                <Ionicons name="chevron-back" size={12} color="#64748b" />
                <Text style={styles.swipeHintText}>Glisser</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

/* ---------------- Small UI Pieces ---------------- */

function FilterChip({
  label,
  active,
  color,
  onPress,
}: {
  label: string
  active?: boolean
  color?: string
  onPress?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active ? [{ backgroundColor: (color || '#10b981') + '2a' }, styles.chipActive] : styles.chipIdle,
        pressed && Platform.OS === 'ios' ? { opacity: 0.85 } : null,
      ]}
      android_ripple={{ color: 'rgba(148,163,184,0.2)' }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.chipText, active ? [{ color: color || '#10b981' }] : null]}>
        {label}
      </Text>
    </Pressable>
  )
}

function StatPill({
  icon,
  label,
  value,
  accent = '#10b981',
}: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  label: string
  value: string | number
  accent?: string
}) {
  return (
    <View style={[styles.statPill, { borderLeftColor: accent }]}>
      <View style={styles.statPillHead}>
        <Ionicons name={icon} size={14} color={accent} />
        <Text style={styles.statPillLabel}>{label}</Text>
      </View>
      <Text style={styles.statPillValue}>{String(value)}</Text>
    </View>
  )
}

function SkeletonOrderCard() {
  return <View style={styles.skeletonCard} />
}

/* ---------------- Main Screen ---------------- */

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<FilterKey>('all')

  const loadOrders = async () => {
    try {
      setLoading(true)
      // Demo data
      const demoOrders: Order[] = [
        {
          id: 'ord_1234567890',
          total: 1199.0,
          currency: 'EUR',
          status: 'pending',
          createdAt: new Date().toISOString(),
          customerName: 'Marie Dubois',
          customerEmail: 'marie.dubois@email.com',
        },
        {
          id: 'ord_2345678901',
          total: 279.99,
          currency: 'EUR',
          status: 'paid',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          customerName: 'Jean Martin',
          customerEmail: 'jean.martin@email.com',
        },
        {
          id: 'ord_3456789012',
          total: 1549.5,
          currency: 'EUR',
          status: 'paid',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          customerName: 'Sophie Bernard',
          customerEmail: 'sophie.bernard@email.com',
        },
        {
          id: 'ord_4567890123',
          total: 89.99,
          currency: 'EUR',
          status: 'paid',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          customerName: 'Pierre Durand',
          customerEmail: 'pierre.durand@email.com',
        },
        {
          id: 'ord_5678901234',
          total: 159.0,
          currency: 'EUR',
          status: 'cancelled',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          customerName: 'Laura Garcia',
          customerEmail: 'laura.garcia@email.com',
        },
        {
          id: 'ord_6789012345',
          total: 429.99,
          currency: 'EUR',
          status: 'paid',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          customerName: 'Thomas Leclerc',
          customerEmail: 'thomas.leclerc@email.com',
        },
      ]
      setOrders(demoOrders)
    } catch (e) {
      console.error('Erreur lors du chargement des commandes:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadOrders()
  }

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    Alert.alert('Succès', 'Statut de la commande mis à jour')
  }

  const filteredOrders = useMemo(
    () =>
      filter === 'all' ? orders : orders.filter((o) => o.status === filter),
    [orders, filter]
  )

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      paid: orders.filter((o) => o.status === 'paid').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    }),
    [orders]
  )

  const updatedAt = useMemo(
    () =>
      new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [orders.length]
  )

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.headerSection}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Toutes les commandes</Text>
          <Text style={styles.headerSubtitle}>Dernière mise à jour : {updatedAt}</Text>
        </View>
        <View style={styles.headerActions}>
          <HeaderIcon icon="scan-outline" />
          <HeaderIcon icon="search-outline" />
          <HeaderIcon icon="add-outline" />
        </View>
      </View>

      {/* Quick stats */}
      <View style={styles.quickStats}>
        <StatPill icon="receipt-outline" label="Total" value={counts.all} />
        <StatPill icon="time-outline" label="En attente" value={counts.pending} accent="#f59e0b" />
        <StatPill icon="checkmark-circle-outline" label="Payées" value={counts.paid} />
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <FilterChip
          label={`Toutes (${counts.all})`}
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterChip
          label={`En attente (${counts.pending})`}
          color="#f59e0b"
          active={filter === 'pending'}
          onPress={() => setFilter('pending')}
        />
        <FilterChip
          label={`Payées (${counts.paid})`}
          color="#10b981"
          active={filter === 'paid'}
          onPress={() => setFilter('paid')}
        />
        <FilterChip
          label={`Annulées (${counts.cancelled})`}
          color="#ef4444"
          active={filter === 'cancelled'}
          onPress={() => setFilter('cancelled')}
        />
      </View>

      {/* List */}
      <FlatList
        data={loading ? Array.from({ length: 6 }).map((_, i) => ({ id: `skeleton-${i}` })) : filteredOrders}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item }: { item: any }) =>
          loading ? (
            <SkeletonOrderCard />
          ) : (
            <SwipeableOrderCard order={item as Order} onUpdateStatus={handleUpdateStatus} />
          )
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Aucune commande</Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'all'
                  ? 'Vos commandes de produits digitaux apparaîtront ici'
                  : `Aucune commande avec le statut "${filter}"`}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  )
}

/* ---------------- Header Icon ---------------- */

function HeaderIcon({ icon }: { icon: React.ComponentProps<typeof Ionicons>['name'] }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.headerIconButton,
        pressed && Platform.OS === 'ios' ? { opacity: 0.85 } : null,
      ]}
      android_ripple={{ color: 'rgba(148,163,184,0.2)', borderless: true }}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={18} color="#cbd5e1" />
    </Pressable>
  )
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },

  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0f172a',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1e293b',
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 8,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quickStats: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statPillHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statPillLabel: {
    color: '#94a3b8',
    fontSize: 11,
  },
  statPillValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.12)',
  },
  chipActive: {},
  chipIdle: {},
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 6,
  },
  skeletonCard: {
    height: 96,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },

  swipeContainer: {
    position: 'relative',
  },
  swipeAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 88,
    backgroundColor: '#10b981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeActionText: {
    color: '#0b1220',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  orderCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  idDate: {
    flex: 1,
  },
  orderId: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  orderDate: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginLeft: 10,
  },

  orderInfo: {
    marginBottom: 12,
  },
  customerName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  customerEmail: {
    color: '#94a3b8',
    fontSize: 11.5,
  },

  orderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTotal: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusIcon: {
    marginRight: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  swipeHintText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
  },

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
})