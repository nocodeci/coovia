import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { KPIs } from '../types/dashboard';

const STORE_ID = 'demo-store-1';
const { width } = Dimensions.get('window');

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color,
  trend
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: string; 
  color: string;
  trend?: { value: number; isPositive: boolean };
}) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon as any} size={24} color={color} />
        {trend && (
          <View style={[styles.trendBadge, { 
            backgroundColor: trend.isPositive ? '#16a34a' : '#ef4444' 
          }]}>
            <Ionicons 
              name={trend.isPositive ? 'trending-up' : 'trending-down'} 
              size={12} 
              color="#ffffff" 
            />
            <Text style={styles.trendText}>{Math.abs(trend.value)}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );
}

function SimpleChart({ data, color }: { data: number[]; color: string }) {
  const maxValue = Math.max(...data);
  const chartHeight = 80;
  
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chart}>
        {data.map((value, index) => {
          const height = (value / maxValue) * chartHeight;
          return (
            <View key={index} style={styles.chartBarContainer}>
              <View 
                style={[
                  styles.chartBar, 
                  { 
                    height: height || 2, 
                    backgroundColor: color,
                    opacity: 0.3 + (value / maxValue) * 0.7
                  }
                ]} 
              />
            </View>
          );
        })}
      </View>
      <View style={styles.chartLabels}>
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
          <Text key={index} style={styles.chartLabel}>{day}</Text>
        ))}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const loadStats = async () => {
    try {
      // Simule des données de statistiques
      const demoStats = {
        revenue: {
          current: 8934.20,
          previous: 7245.80,
          trend: 23.3
        },
        orders: {
          current: 89,
          previous: 67,
          trend: 32.8
        },
        customers: {
          current: 156,
          previous: 142,
          trend: 9.9
        },
        avgOrder: {
          current: 100.38,
          previous: 108.12,
          trend: -7.2
        },
        revenueChart: [1200, 1800, 1400, 2200, 1900, 2400, 2100],
        ordersChart: [12, 18, 14, 22, 19, 24, 21],
        topProducts: [
          { name: 'iPhone 15 Pro', sales: 45, revenue: 53955 },
          { name: 'MacBook Air M3', sales: 12, revenue: 15588 },
          { name: 'AirPods Pro 2', sales: 38, revenue: 10602 },
          { name: 'iPad Pro 12.9"', sales: 8, revenue: 8792 },
          { name: 'Apple Watch Series 9', sales: 15, revenue: 6435 }
        ]
      };
      
      setStats(demoStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [period]);

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const periods = [
    { key: 'day', label: 'Aujourd\'hui' },
    { key: 'week', label: '7 jours' },
    { key: 'month', label: '30 jours' }
  ];

  if (loading || !stats) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]} edges={['bottom']}>
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#60a5fa" />
        }
      >
      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.periodButton,
              period === p.key && styles.periodButtonActive
            ]}
            onPress={() => setPeriod(p.key as any)}
          >
            <Text style={[
              styles.periodText,
              period === p.key && styles.periodTextActive
            ]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Chiffre d'affaires"
          value={`${stats.revenue.current.toFixed(2)}€`}
          subtitle={`vs ${stats.revenue.previous.toFixed(2)}€ (période précédente)`}
          icon="trending-up"
          color="#2563eb"
          trend={{ value: stats.revenue.trend, isPositive: stats.revenue.trend > 0 }}
        />
        
        <StatCard
          title="Commandes"
          value={stats.orders.current.toString()}
          subtitle={`vs ${stats.orders.previous} (période précédente)`}
          icon="receipt"
          color="#16a34a"
          trend={{ value: stats.orders.trend, isPositive: stats.orders.trend > 0 }}
        />
        
        <StatCard
          title="Clients"
          value={stats.customers.current.toString()}
          subtitle={`vs ${stats.customers.previous} (période précédente)`}
          icon="people"
          color="#8b5cf6"
          trend={{ value: stats.customers.trend, isPositive: stats.customers.trend > 0 }}
        />
        
        <StatCard
          title="Panier moyen"
          value={`${stats.avgOrder.current.toFixed(2)}€`}
          subtitle={`vs ${stats.avgOrder.previous.toFixed(2)}€ (période précédente)`}
          icon="card"
          color="#f59e0b"
          trend={{ value: Math.abs(stats.avgOrder.trend), isPositive: stats.avgOrder.trend > 0 }}
        />
      </View>

      {/* Charts */}
      <View style={styles.chartsSection}>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Évolution du chiffre d'affaires</Text>
          <SimpleChart data={stats.revenueChart} color="#2563eb" />
        </View>
        
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Évolution des commandes (produits digitaux)</Text>
          <SimpleChart data={stats.ordersChart} color="#16a34a" />
        </View>
      </View>

      {/* Top Products */}
              <View style={styles.topProductsCard}>
          <Text style={styles.sectionTitle}>Produits digitaux les plus vendus</Text>
        {stats.topProducts.map((product: any, index: number) => (
          <View key={index} style={styles.productRow}>
            <View style={styles.productRank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productSales}>{product.sales} ventes</Text>
            </View>
            <Text style={styles.productRevenue}>{product.revenue.toFixed(0)}€</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="download" size={24} color="#2563eb" />
          <Text style={styles.actionText}>Exporter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="share" size={24} color="#16a34a" />
          <Text style={styles.actionText}>Partager</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionCard}>
          <Ionicons name="settings" size={24} color="#8b5cf6" />
          <Text style={styles.actionText}>Configurer</Text>
        </TouchableOpacity>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 7,
  },
  periodButtonActive: {
    backgroundColor: '#2563eb',
  },
  periodText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  statsGrid: {
    paddingHorizontal: 12,
    gap: 8,
  },
  statCard: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 2,
  },
  trendText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  statTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statSubtitle: {
    color: '#64748b',
    fontSize: 12,
  },
  chartsSection: {
    padding: 16,
    gap: 16,
  },
  chartCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  chartTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    gap: 8,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'end',
    height: 80,
    gap: 4,
  },
  chartBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  chartBar: {
    borderRadius: 2,
    minHeight: 2,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    color: '#64748b',
    fontSize: 10,
    flex: 1,
    textAlign: 'center',
  },
  topProductsCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  productRank: {
    width: 32,
    height: 32,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  productSales: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  productRevenue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
});
