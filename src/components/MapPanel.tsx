import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Moment } from '../data/moments';
import { Fonts } from '../theme/fonts';

// ─────────────────────────────────────────────────────────────────────────────
// GOOGLE MAPS — enable once your API key is configured
// ─────────────────────────────────────────────────────────────────────────────
// Step 1: Add your key to app.json:
//           expo.plugins[react-native-maps].googleMapsApiKey
//           expo.android.config.googleMaps.apiKey
// Step 2: Run `npx expo prebuild --clean && npx expo run:android`
// Step 3: Flip the flag below to `true`
//
// Until then, the map uses the platform default (Apple Maps on iOS,
// OSM-based fallback on Android) — no key required, no crashes.
// ─────────────────────────────────────────────────────────────────────────────
const ENABLE_GOOGLE_MAPS = false; // ← set to true after adding the API key

const { width } = Dimensions.get('window');
const IS_DESKTOP = width >= 768;

// Fallback initial region (USA center) — map recenters on first marker or selection
const DEFAULT_REGION: Region = {
  latitude: 38.5,
  longitude: -96,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

interface MapPanelProps {
  moments: Moment[];
  /** ID of the currently selected memory — map will animate to its marker */
  selectedMomentId?: string | null;
  /** Called when the user taps a marker callout */
  onMarkerSelect?: (moment: Moment) => void;
}

export function MapPanel({ moments, selectedMomentId, onMarkerSelect }: MapPanelProps) {
  const mapRef = useRef<MapView>(null);

  // Moments that have valid coordinates
  const mappable = moments.filter(
    (m) => typeof m.lat === 'number' && typeof m.lng === 'number'
  );

  // Animate map to whichever memory is selected
  useEffect(() => {
    if (!selectedMomentId) return;
    const target = mappable.find((m) => m.id === selectedMomentId);
    if (!target || target.lat === undefined || target.lng === undefined) return;

    mapRef.current?.animateToRegion(
      {
        latitude: target.lat,
        longitude: target.lng,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      },
      600
    );
  }, [selectedMomentId]);

  // Compute an initial region that frames all mapped memories
  const getInitialRegion = (): Region => {
    if (mappable.length === 0) return DEFAULT_REGION;
    if (mappable.length === 1) {
      return {
        latitude: mappable[0].lat!,
        longitude: mappable[0].lng!,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }
    const lats = mappable.map((m) => m.lat!);
    const lngs = mappable.map((m) => m.lng!);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padding = 1.5; // degrees padding around all pins
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: maxLat - minLat + padding,
      longitudeDelta: maxLng - minLng + padding,
    };
  };

  return (
    <View style={styles.wrapper}>
      {/* Panel header */}
      <View style={styles.header}>
        <Text style={styles.panelTitle}>📍 Our Places</Text>
        <Text style={styles.subtitle}>
          {mappable.length} pin{mappable.length !== 1 ? 's' : ''} on the map
        </Text>
      </View>

      {/* ── Real map ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        // Provider is controlled by ENABLE_GOOGLE_MAPS at the top of this file.
        // Default (false) → platform native maps, no API key needed.
        provider={ENABLE_GOOGLE_MAPS ? PROVIDER_GOOGLE : undefined}
        initialRegion={getInitialRegion()}
        mapType="standard"
        showsUserLocation={false}
        showsCompass={false}
        toolbarEnabled={false}
        // Scrapbook-warm tint via map style (neutral, low-contrast to match palette)
        customMapStyle={scrapbookMapStyle}
      >
        {mappable.map((moment) => {
          const isSelected = moment.id === selectedMomentId;
          return (
            <Marker
              key={moment.id}
              coordinate={{ latitude: moment.lat!, longitude: moment.lng! }}
              // Using a custom view marker (modern approach — no deprecated legacy pins)
              onPress={() => onMarkerSelect?.(moment)}
            >
              {/* Custom pin view */}
              <View style={[styles.pin, isSelected && styles.pinSelected]}>
                <Text style={styles.pinEmoji}>📸</Text>
              </View>

              {/* Callout card — shown on tap */}
              <Callout tooltip style={styles.calloutWrapper}>
                <View style={styles.callout}>
                  <Image
                    source={moment.image}
                    style={styles.calloutPhoto}
                    resizeMode="cover"
                  />
                  <View style={styles.calloutBody}>
                    <Text style={styles.calloutTitle} numberOfLines={2}>
                      {moment.title}
                    </Text>
                    <Text style={styles.calloutDate}>{moment.date}</Text>
                    {!!moment.location && (
                      <Text style={styles.calloutLocation} numberOfLines={1}>
                        📍 {moment.location}
                      </Text>
                    )}
                  </View>
                </View>
                {/* Callout tip triangle */}
                <View style={styles.calloutTip} />
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Empty-state overlay when no memories have coordinates */}
      {mappable.length === 0 && (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyText}>
            Add coordinates to a memory{'\n'}for it to appear here
          </Text>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Warm, low-saturation map style to match the scrapbook palette
// Generated via https://mapstyle.withgoogle.com/ — works with PROVIDER_GOOGLE
// With the default Apple Maps provider on iOS, the map renders in its default
// style; this style array will be applied once you switch to PROVIDER_GOOGLE.
// ─────────────────────────────────────────────────────────────────────────────
const scrapbookMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7a6450' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#fffdf8' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d0c0a8' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#ede8db' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#ddd5c4' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a08060' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#d4e0c8' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e0d5c5' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#f8e8c8' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#d8c8a8' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#ddd5c4' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c8dce8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8098a8' }],
  },
];

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fffcf5',
    borderRadius: 12,
    margin: 12,
    marginTop: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ede5d8',
    elevation: 4,
    shadowColor: '#7a6450',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
    // Minimum height so it has presence on desktop
    minHeight: IS_DESKTOP ? 240 : 220,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#ede5d8',
    backgroundColor: '#fffcf5',
  },
  panelTitle: {
    fontSize: 15,
    fontFamily: Fonts.heading,
    color: '#5c4030',
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 11,
    color: '#b09a88',
    fontFamily: Fonts.bodyItalic,
  },
  map: {
    flex: 1,
  },

  // ── Custom marker pin ──
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fffcf5',
    borderWidth: 2,
    borderColor: '#c0845a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#5c4030',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pinSelected: {
    backgroundColor: '#c0845a',
    borderColor: '#5c4030',
    transform: [{ scale: 1.18 }],
  },
  pinEmoji: {
    fontSize: 17,
  },

  // ── Callout card ──
  calloutWrapper: {
    alignItems: 'center',
  },
  callout: {
    flexDirection: 'row',
    backgroundColor: '#fffcf5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ede5d8',
    overflow: 'hidden',
    width: 220,
    elevation: 8,
    shadowColor: '#5c4030',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  calloutPhoto: {
    width: 72,
    height: 80,
  },
  calloutBody: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  calloutTitle: {
    fontSize: 13,
    fontFamily: Fonts.headingItalic,
    color: '#5c4030',
    marginBottom: 4,
    lineHeight: 17,
  },
  calloutDate: {
    fontSize: 10,
    fontFamily: Fonts.label,
    color: '#b09a88',
    marginBottom: 3,
  },
  calloutLocation: {
    fontSize: 10,
    fontFamily: Fonts.bodyItalic,
    color: '#9a8878',
  },
  calloutTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ede5d8',
    marginTop: -1,
  },

  // ── Empty state (when no moments have coordinates) ──
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,241,233,0.75)',
    // Push below header (approx)
    top: 44,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#b09a88',
    textAlign: 'center',
    fontFamily: Fonts.bodyItalic,
    lineHeight: 20,
  },
});
