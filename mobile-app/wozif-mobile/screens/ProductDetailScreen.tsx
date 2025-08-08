import React, { useMemo, useState } from 'react'
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { type Product } from '../services/api'
import { cleanHtml, formatFCFA, getProductStock } from '../utils/htmlCleaner'

type RouteParams = { product?: Product }

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const { product } = (route.params as RouteParams) || {}
  const [isEditing, setIsEditing] = useState(false)

  // Guard: produit introuvable
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Erreur"
          onBack={() => navigation.goBack()}
          right={null}
        />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={28} color="#ef4444" />
          <Text style={styles.errorText}>Produit non trouvé</Text>
        </View>
      </SafeAreaView>
    )
  }

  const stockCount = useMemo(() => getProductStock(product), [product])
  const inStock = stockCount > 0
  const promoRate = 0.2
  const promoPrice = useMemo(
    () => Math.round(product.price * (1 - promoRate)),
    [product.price]
  )

  const handleSave = () => {
    Alert.alert('Sauvegarder', 'Voulez-vous sauvegarder les modifications ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Sauvegarder',
        onPress: () => {
          setIsEditing(false)
          Alert.alert('Succès', 'Produit mis à jour avec succès')
        },
      },
    ])
  }

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave()
    } else {
      setIsEditing(true)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Détails du produit"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={handleEditToggle} style={styles.iconBtn}>
            <Ionicons
              name={isEditing ? 'checkmark' : 'create-outline'}
              size={22}
              color={isEditing ? '#10b981' : '#e5e7eb'}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: isEditing ? 110 : 32 }}
      >
        {/* Image + overlay badges */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {product.images && product.images.length > 0 ? (
              <Image
                source={{ uri: product.images[0] }}
                style={styles.productImage}
                resizeMode="cover"
                accessibilityLabel="Image du produit"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="image" size={48} color="#64748b" />
                <Text style={styles.placeholderText}>Aucune image</Text>
              </View>
            )}

            {/* overlay gradient substitute */}
            <View style={styles.imageOverlay} />

            <View style={styles.overlayTopRow}>
              <Chip
                icon="folder-outline"
                text={product.category || 'Catégorie'}
              />
            </View>

            <View style={styles.overlayBottomRow}>
              <Chip
                variant={inStock ? 'success' : 'danger'}
                icon={inStock ? 'checkmark-circle' : 'close-circle'}
                text={
                  inStock ? `En stock • ${stockCount}` : 'Rupture de stock'
                }
              />
              <Chip
                variant="neutral"
                icon="pricetags-outline"
                text={formatFCFA(product.price)}
              />
            </View>

            {isEditing && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Changer l'image"
                style={styles.fab}
                onPress={() => {
                  // À implémenter: ouverture du sélecteur d'images
                  Alert.alert('Changer l’image', 'Fonctionnalité à implémenter')
                }}
              >
                <Ionicons name="camera" size={18} color="#0b1220" />
                <Text style={styles.fabText}>Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Titre */}
        <View style={styles.titleSection}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {product.name}
          </Text>
          {product.description ? (
            <Text style={styles.productSubtitle} numberOfLines={2}>
              {cleanHtml(product.description)}
            </Text>
          ) : null}
        </View>

        {/* Sections */}
        <SectionHeader label="Informations" />

        <Row
          icon="document-text-outline"
          title="Description"
          subtitle={
            product.description
              ? cleanHtml(product.description)
              : 'Aucune description'
          }
          onPress={() =>
            navigation.navigate('EditProduct', {
              field: 'description',
              title: 'Description',
              initialValue: product.description || '',
              type: 'textarea',
              placeholder: 'Entrez la description du produit...',
            })
          }
        />

        <Row
          icon="flame"
          iconColor="#f97316"
          title="Promouvoir avec Blaze"
          onPress={() =>
            Alert.alert(
              'Promotion',
              'Faites connaître votre produit avec une promotion ciblée'
            )
          }
          right={<Badge text="-20%" tone="warning" />}
        />

        <Row
          icon="card-outline"
          title="Prix"
          subtitle={
            product.price
              ? `Standard: ${formatFCFA(product.price)}   •   Promo: ${formatFCFA(
                  promoPrice
                )}`
              : 'Non défini'
          }
          onPress={() => navigation.navigate('EditPrice', { product })}
          right={
            <View style={styles.priceRight}>
              {!!product.price && (
                <>
                  <Text style={styles.priceStriked}>
                    {formatFCFA(product.price)}
                  </Text>
                  <Text style={styles.pricePromo}>
                    {formatFCFA(promoPrice)}
                  </Text>
                </>
              )}
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#94a3b8"
                style={{ marginLeft: 6 }}
              />
            </View>
          }
        />

        <Row
          icon="cube-outline"
          title="Stock"
          subtitle={inStock ? 'Disponible' : 'Rupture'}
          onPress={() =>
            navigation.navigate('EditProduct', {
              field: 'stock',
              title: 'Stock',
              initialValue: String(stockCount),
              type: 'number',
              placeholder: 'Quantité en stock',
            })
          }
          right={<Badge text={String(stockCount)} tone={inStock ? 'success' : 'danger'} />}
        />

        <Row
          icon="albums-outline"
          title="Catégories"
          subtitle={product.category || 'Non définie'}
          onPress={() =>
            navigation.navigate('EditProduct', {
              field: 'category',
              title: 'Catégories',
              initialValue: product.category || '',
              type: 'text',
              placeholder: 'Nom de la catégorie',
            })
          }
        />

        <SectionHeader label="Avancé" />

        <Row
          icon="cloud-outline"
          title="Fichiers téléchargeables"
          subtitle="Pas encore de fichier"
          onPress={() => Alert.alert('Fichiers', 'Fonctionnalité à implémenter')}
        />

        <Row
          icon="calendar-outline"
          title="Type de produit"
          subtitle="Téléchargeable"
          onPress={() => Alert.alert('Type', 'Fonctionnalité à implémenter')}
        />

        <Row
          icon="grid-outline"
          title="Champs personnalisés"
          subtitle="Afficher et modifier les champs personnalisés du produit"
          onPress={() => Alert.alert('Champs', 'Fonctionnalité à implémenter')}
        />
      </ScrollView>

      {/* Barre d’actions lorsqu’on édite */}
      {isEditing && (
        <View style={styles.actionBar}>
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            style={[styles.actionBtn, styles.actionBtnGhost]}
          >
            <Ionicons name="close" size={18} color="#cbd5e1" />
            <Text style={styles.actionBtnGhostText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={[styles.actionBtn, styles.actionBtnPrimary]}>
            <Ionicons name="save-outline" size={18} color="#0b1220" />
            <Text style={styles.actionBtnPrimaryText}>Enregistrer</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

/* ---------- UI Sub-components ---------- */

function Header({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: React.ReactNode | null
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Revenir en arrière">
        <Ionicons name="arrow-back" size={22} color="#e5e7eb" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.headerRight}>{right ?? <View style={{ width: 22 }} />}</View>
    </View>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{label}</Text>
    </View>
  )
}

function Row({
  icon,
  iconColor = '#94a3b8',
  title,
  subtitle,
  onPress,
  right,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name']
  iconColor?: string
  title: string
  subtitle?: string
  onPress?: () => void
  right?: React.ReactNode
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: 'rgba(148,163,184,0.15)' }}
      style={({ pressed }) => [
        styles.row,
        pressed && Platform.OS === 'ios' ? { opacity: 0.7 } : null,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={iconColor} style={styles.rowIcon} />
        <View style={styles.rowTexts}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.rowSubtitle} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.rowRight}>
        {right}
        {!right && <Ionicons name="chevron-forward" size={18} color="#94a3b8" />}
      </View>
    </Pressable>
  )
}

function Chip({
  text,
  icon,
  variant = 'neutral',
}: {
  text: string
  icon?: React.ComponentProps<typeof Ionicons>['name']
  variant?: 'neutral' | 'success' | 'danger'
}) {
  const palette =
    variant === 'success'
      ? { bg: 'rgba(16,185,129,0.15)', fg: '#10b981' }
      : variant === 'danger'
      ? { bg: 'rgba(239,68,68,0.15)', fg: '#ef4444' }
      : { bg: 'rgba(148,163,184,0.2)', fg: '#e5e7eb' }
  return (
    <View style={[styles.chip, { backgroundColor: palette.bg }]}>
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={palette.fg}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <Text style={[styles.chipText, { color: palette.fg }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  )
}

function Badge({
  text,
  tone = 'neutral',
}: {
  text: string
  tone?: 'neutral' | 'success' | 'danger' | 'warning'
}) {
  const map = {
    neutral: { bg: 'rgba(148,163,184,0.15)', fg: '#e5e7eb' },
    success: { bg: 'rgba(16,185,129,0.15)', fg: '#10b981' },
    danger: { bg: 'rgba(239,68,68,0.15)', fg: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,0.15)', fg: '#f59e0b' },
  } as const
  const c = map[tone]
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.fg }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  )
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
    alignItems: 'flex-end',
  },

  content: {
    flex: 1,
  },

  imageSection: {
    padding: 14,
    paddingTop: 12,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111827',
    ...shadow(8),
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    backgroundColor: 'rgba(2,6,23,0.35)',
  },
  overlayTopRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  overlayBottomRow: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fab: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#10b981',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fabText: {
    color: '#0b1220',
    fontWeight: '700',
    fontSize: 13,
  },

  titleSection: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
    gap: 6,
  },
  productTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  productSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 20,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionHeaderText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1e293b',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    marginRight: 10,
  },
  rowTexts: {
    flex: 1,
  },
  rowTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceStriked: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 8,
    fontSize: 13,
  },
  pricePromo: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 14,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: '#0b1220',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1e293b',
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnGhost: {
    backgroundColor: 'rgba(148,163,184,0.12)',
  },
  actionBtnGhostText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  actionBtnPrimary: {
    backgroundColor: '#10b981',
  },
  actionBtnPrimaryText: {
    color: '#0b1220',
    fontWeight: '800',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
})

/* Shadow helper for cross-platform elevation */
function shadow(elev: number) {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.18,
      shadowRadius: elev * 0.8,
      shadowOffset: { width: 0, height: Math.ceil(elev / 2) },
    },
    android: { elevation: elev },
    default: {},
  })
}