import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../services/api';
import { KPIs, Order } from '../types/dashboard';

const STORE_ID = 'demo-store-1';

function Kpi({ label, value, accent = '#2563eb' }: { label: string; value: string; accent?: string }) {
  return (
    <View style={[styles.card, { borderLeftColor: accent }]}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </View>
  );
}

function OrderRow({ total, currency, status, time }: { total: number; currency: string; status: string; time: string }) {
  const date = useMemo(() => new Date(time).toLocaleString('fr-FR'), [time]);
  const color = status === 'paid' ? '#16a34a' : status === 'pending' ? '#f59e0b' : status === 'shipped' ? '#8b5cf6' : '#ef4444';
  
  return (
    <View style={styles.row}>
      <Text style={styles.rowPrimary}>{total.toFixed(2)} {currency}</Text>
      <Text style={[styles.status, { color }]}>{status}</Text>
      <Text style={styles.rowSub}>{date}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [kpisData, ordersData] = await Promise.all([
        apiService.getDashboardKPIs(STORE_ID),
        apiService.getRecentOrders(STORE_ID, 10)
      ]);
      
      setKpis(kpisData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const revenueToday = kpis ? `${kpis.revenueToday.toFixed(2)} €` : '—';
  const revenue7d = kpis ? `${kpis.revenue7d.toFixed(2)} €` : '—';
  const ordersToday = kpis ? `${kpis.ordersToday}` : '—';
  const orders7d = kpis ? `${kpis.orders7d}` : '—';

  const navigateToProducts = () => {
    // TODO: Navigation vers l'écran des produits
    console.log('Navigation vers les produits');
  };

  const navigateToOrders = () => {
    // TODO: Navigation vers l'écran des commandes
    console.log('Navigation vers les commandes');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />
        }
      >
      <Text style={styles.header}>Tableau de bord</Text>

      <View style={styles.kpiGrid}>
        <View style={styles.kpiItem}>
          <Kpi label="CA aujourd'hui" value={revenueToday} accent="#2563eb" />
        </View>
        <View style={styles.kpiItem}>
          <Kpi label="CA 7 jours" value={revenue7d} accent="#7c3aed" />
        </View>
        <View style={styles.kpiItem}>
          <Kpi label="Cmd aujourd'hui" value={ordersToday} accent="#16a34a" />
        </View>
        <View style={styles.kpiItem}>
          <Kpi label="Cmd 7 jours" value={orders7d} accent="#f59e0b" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Commandes récentes</Text>
        <TouchableOpacity onPress={navigateToOrders}>
          <Text style={styles.link}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <OrderRow 
              key={order.id} 
              total={order.total} 
              currency={order.currency} 
              status={order.status} 
              time={order.createdAt} 
            />
          ))
        ) : (
          <Text style={styles.empty}>
            {loading ? 'Chargement...' : 'Aucune commande pour le moment'}
          </Text>
        )}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={navigateToProducts}>
          <Text style={styles.actionText}>Gérer les produits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtnSecondary} onPress={navigateToOrders}>
          <Text style={styles.actionText}>Gérer les commandes</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0b1220' 
  },
  content: { 
    padding: 16 
  },
  header: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 16 
  },
  kpiGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  kpiItem: { 
    width: '48%', 
    marginBottom: 12 
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1f2937',
  },
  kpiLabel: { 
    color: '#94a3b8', 
    fontSize: 12, 
    marginBottom: 4 
  },
  kpiValue: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: '700' 
  },
  sectionHeader: { 
    marginTop: 16, 
    marginBottom: 8, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  sectionTitle: { 
    color: 'white', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  link: { 
    color: '#60a5fa' 
  },
  row: { 
    paddingVertical: 10, 
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderBottomColor: '#1e293b' 
  },
  rowPrimary: { 
    color: 'white', 
    fontWeight: '600' 
  },
  rowSub: { 
    color: '#94a3b8', 
    fontSize: 12 
  },
  status: { 
    fontWeight: '600' 
  },
  empty: { 
    color: '#94a3b8' 
  },
  quickActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 16 
  },
  actionBtn: { 
    width: '48%', 
    backgroundColor: '#2563eb', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  actionBtnSecondary: { 
    width: '48%', 
    backgroundColor: '#334155', 
    padding: 14, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  actionText: { 
    color: 'white', 
    fontWeight: '600' 
  },
});
