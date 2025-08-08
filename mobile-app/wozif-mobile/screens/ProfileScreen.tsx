import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

function ProfileOption({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  color = '#ffffff' 
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
}) {
  return (
    <TouchableOpacity style={styles.optionCard} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const handleStoreSettings = () => {
    Alert.alert('Paramètres de la boutique', 'Fonctionnalité à implémenter');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Fonctionnalité à implémenter');
  };

  const handlePaymentSettings = () => {
    Alert.alert('Moyens de paiement', 'Fonctionnalité à implémenter');
  };

  const handleShippingSettings = () => {
    Alert.alert('Livraison', 'Fonctionnalité à implémenter');
  };

  const handleTaxSettings = () => {
    Alert.alert('Taxes', 'Fonctionnalité à implémenter');
  };

  const handleHelp = () => {
    Alert.alert('Centre d\'aide', 'Fonctionnalité à implémenter');
  };

  const handleContact = () => {
    Alert.alert('Contact', 'Fonctionnalité à implémenter');
  };

  const handleWebsite = () => {
    Linking.openURL('https://wozif.com');
  };

  const handleWebAdmin = () => {
    Linking.openURL('https://app.wozif.com');
  };

  const handleBoutique = () => {
    Linking.openURL('https://my.wozif.com');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => {
          Alert.alert('Déconnecté', 'Vous avez été déconnecté de l\'application');
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="never"
      >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
        <Text style={styles.storeName}>Ma Boutique Demo</Text>
      </View>

      {/* Store Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>127</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1,234</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>€45,678</Text>
          <Text style={styles.statLabel}>CA total</Text>
        </View>
      </View>

      {/* Store Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestion de la boutique</Text>
        
        <ProfileOption
          icon="storefront"
          title="Paramètres de la boutique"
          subtitle="Nom, description, logo"
          onPress={handleStoreSettings}
          color="#2563eb"
        />
        
        <ProfileOption
          icon="card"
          title="Moyens de paiement"
          subtitle="PayDunya, Moneroo, Stripe"
          onPress={handlePaymentSettings}
          color="#16a34a"
        />
        
        <ProfileOption
          icon="car"
          title="Livraison"
          subtitle="Zones, tarifs, délais"
          onPress={handleShippingSettings}
          color="#8b5cf6"
        />
        
        <ProfileOption
          icon="calculator"
          title="Taxes"
          subtitle="TVA, taxes locales"
          onPress={handleTaxSettings}
          color="#f59e0b"
        />
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Préférences</Text>
        
        <ProfileOption
          icon="notifications"
          title="Notifications"
          subtitle="Nouvelles commandes, messages"
          onPress={handleNotifications}
          color="#06b6d4"
        />
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Liens rapides</Text>
        
        <ProfileOption
          icon="desktop"
          title="Administration web"
          subtitle="app.wozif.com"
          onPress={handleWebAdmin}
          color="#64748b"
        />
        
        <ProfileOption
          icon="globe"
          title="Ma boutique publique"
          subtitle="my.wozif.com"
          onPress={handleBoutique}
          color="#0ea5e9"
        />
        
        <ProfileOption
          icon="home"
          title="Site web Wozif"
          subtitle="wozif.com"
          onPress={handleWebsite}
          color="#3b82f6"
        />
      </View>

      {/* Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        
        <ProfileOption
          icon="help-circle"
          title="Centre d'aide"
          subtitle="FAQ, guides, tutoriels"
          onPress={handleHelp}
          color="#10b981"
        />
        
        <ProfileOption
          icon="mail"
          title="Nous contacter"
          subtitle="Support technique"
          onPress={handleContact}
          color="#f59e0b"
        />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Wozif Mobile v1.0.0</Text>
        <Text style={styles.appBuild}>Build 2024.1.0</Text>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#2563eb',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
  },
  storeName: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  appVersion: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  appBuild: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 32,
  },
});
