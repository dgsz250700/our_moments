import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
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

// ─────────────────────────────────────────────────────────────────────────────
// EXPO GO COMPATIBILITY
// ─────────────────────────────────────────────────────────────────────────────
// react-native-maps requires native code and is NOT included in the standard
// Expo Go client (SDK 50+). It works in:
//   • npx expo run:ios / run:android  (local dev build)
//   • EAS Build
// The try/catch below lets the app start normally in Expo Go and shows a
// polished placeholder instead of crashing. No code changes needed when you
// switch to a dev build — the real map renders automatically.
// ─────────────────────────────────────────────────────────────────────────────
let MapView: any = null;
let Marker:  any = null;
let Callout: any = null;
let PROVIDER_GOOGLE: any = null;

try {
  const maps    = require('react-native-maps');
  MapView        = maps.default;
  Marker         = maps.Marker;
  Callout        = maps.Callout;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
} catch {
  // Native module not available — map will show placeholder below
}

const MAP_AVAILABLE = !!MapView;

// ─────────────────────────────────────────────────────────────────────────────

const { width } = Dimensions.get('window');
const IS_DESKTOP = width >= 768;

// Fallback region (USA center) — map recenters on first marker / selection
const DEFAULT_REGION = {
  latitude: 38.5,
  longitude: -96,
  latitudeDelta: 25,
  longitudeDelta: 25,
};

interface MapPanelProps {
  moments: Moment[];
  /** ID of the currently selected memory — map will animate to its marker */
  selectedMomentId?: string | null;
  /** Called when the user taps a marker */
  onMarkerSelect?: (moment: Moment) => void;
}

export function MapPanel({ moments, selectedMomentId, onMarkerSelect }: MapPanelProps) {
  const mapRef = useRef<any>(null);

  // Only moments with valid coordinates appear as pins
  const mappable = moments.filter(
    (m) => typeof m.lat === 'number' && typeof m.lng === 'number'
  );

  // Animate to selected memory
  useEffect(() => {
    if (!MAP_AVAILABLE || !selectedMomentId) return;
    const target = mappable.find((m) => m.id === selectedMomentId);
    if (!target || target.lat === undefined || target.lng === undefined) return;
    mapRef.current?.animateToRegion(
      { latitude: target.lat, longitude: target.lng, latitudeDelta: 0.08, longitudeDelta: 0.08 },
      600
    );
  }, [selectedMomentId]);

  // Fit initial region around all pins
  const getInitialRegion = () => {
    if (mappable.length === 0) return DEFAULT_REGION;
    if (mappable.length === 1) {
      return { latitude: mappable[0].lat!, longitude: mappable[0].lng!, latitudeDelta: 0.5, longitudeDelta: 0.5 };
    }
    const lats = mappable.map((m) => m.lat!);
    const lngs = mappable.map((m) => m.lng!);
    const minLat = Math.min(...lats), maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
    const pad = 1.5;
    return {
      latitude:  (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta:  maxLat - minLat + pad,
      longitudeDelta: maxLng - minLng + pad,
    };
  };

  return (
    <View style={styles.wrapper}>
      {/* Panel header */}
      <View style={styles.header}>
        <Text style={styles.panelTitle}>📍 Our Places</Text>
        <Text style={styles.subtitle}>
          {MAP_AVAILABLE
            ? `${mappable.length} pin${mappable.length !== 1 ? 's' : ''} on the map`
            : 'available in dev build'}
        </Text>
      </View>

      {MAP_AVAILABLE ? (
        // ── Real interactive map (dev build / production) ──
        <>
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
            customMapStyle={ENABLE_GOOGLE_MAPS ? scrapbookMapStyle : undefined}
          >
            {mappable.map((moment) => {
              const isSelected = moment.id === selectedMomentId;
              return (
                <Marker
                  key={moment.id}
                  coordinate={{ latitude: moment.lat!, longitude: moment.lng! }}
                  onPress={() => onMarkerSelect?.(moment)}
                >
                  {/* Custom view pin — modern API, not deprecated */}
                  <View style={[styles.pin, isSelected && styles.pinSelected]}>
                    <Text style={styles.pinEmoji}>📸</Text>
                  </View>

                  {/* Callout preview card */}
                  <Callout tooltip style={styles.calloutWrapper}>
                    <View style={styles.callout}>
                      <Image source={moment.image} style={styles.calloutPhoto} resizeMode="cover" />
                      <View style={styles.calloutBody}>
                        <Text style={styles.calloutTitle} numberOfLines={2}>{moment.title}</Text>
                        <Text style={styles.calloutDate}>{moment.date}</Text>
                        {!!moment.location && (
                          <Text style={styles.calloutLocation} numberOfLines={1}>
                            📍 {moment.location}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.calloutTip} />
                  </Callout>
                </Marker>
              );
            })}
          </MapView>

          {/* Empty overlay when no memories have coordinates */}
          {mappable.length === 0 && (
            <View style={styles.emptyOverlay} pointerEvents="none">
              <Text style={styles.emptyEmoji}>🗺️</Text>
              <Text style={styles.emptyText}>
                Add coordinates to a memory{'\n'}for it to appear here
              </Text>
            </View>
          )}
        </>
      ) : (
        // ── Placeholder (standard Expo Go, no native map module) ──
        <View style={styles.placeholder}>
          <View style={styles.placeholderGrid}>
            <View style={styles.gridH} />
            <View style={[styles.gridH, { top: '50%' }]} />
            <View style={styles.gridV} />
            <View style={[styles.gridV, { left: '50%' }]} />
          </View>

          {/* Pin dots for each mapped memory */}
          {mappable.map((m, i) => (
            <View
              key={m.id}
              style={[
                styles.previewPin,
                { top: `${22 + (i * 31) % 50}%` as any, left: `${18 + (i * 41) % 60}%` as any },
              ]}
            >
              <View style={styles.previewPinHead} />
            </View>
          ))}

          <View style={styles.placeholderOverlay}>
            <Text style={styles.placeholderEmoji}>🗺️</Text>
            <Text style={styles.placeholderTitle}>Map ready</Text>
            <Text style={styles.placeholderBody}>
              Run with{'\n'}
              <Text style={styles.placeholderCode}>expo run:ios</Text>
              {' '}or{' '}
              <Text style={styles.placeholderCode}>expo run:android</Text>
              {'\n'}to see live markers
            </Text>
          </View>
        </View>
      )}

      {/* Location list */}
      {mappable.length > 0 && (
        <View style={styles.locationList}>
          {mappable.map((m) => (
            <View key={m.id} style={styles.locationRow}>
              <Text style={styles.locationPin}>📍</Text>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{m.location}</Text>
                <Text style={styles.locationDate}>{m.date}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Warm scrapbook map style (applies when ENABLE_GOOGLE_MAPS = true) ───────
const scrapbookMapStyle = [
  { elementType: 'geometry',              stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.fill',      stylers: [{ color: '#7a6450' }] },
  { elementType: 'labels.text.stroke',    stylers: [{ color: '#fffdf8' }] },
  { featureType: 'landscape',  elementType: 'geometry',   stylers: [{ color: '#ede8db' }] },
  { featureType: 'poi',        elementType: 'geometry',   stylers: [{ color: '#ddd5c4' }] },
  { featureType: 'poi.park',   elementType: 'geometry',   stylers: [{ color: '#d4e0c8' }] },
  { featureType: 'road',       elementType: 'geometry',   stylers: [{ color: '#ffffff' }] },
  { featureType: 'road',       elementType: 'geometry.stroke', stylers: [{ color: '#e0d5c5' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8e8c8' }] },
  { featureType: 'water',      elementType: 'geometry',   stylers: [{ color: '#c8dce8' }] },
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
    minHeight: IS_DESKTOP ? 320 : 280,
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

  // ── Real map ──
  map: {
    flex: 1,
    minHeight: IS_DESKTOP ? 220 : 180,
  },

  // ── Custom markers ──
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
  pinEmoji: { fontSize: 17 },

  // ── Callout cards ──
  calloutWrapper: { alignItems: 'center' },
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
  calloutPhoto:    { width: 72, height: 80 },
  calloutBody:     { flex: 1, padding: 10, justifyContent: 'center' },
  calloutTitle:    { fontSize: 13, fontFamily: Fonts.headingItalic, color: '#5c4030', marginBottom: 4, lineHeight: 17 },
  calloutDate:     { fontSize: 10, fontFamily: Fonts.label,         color: '#b09a88', marginBottom: 3 },
  calloutLocation: { fontSize: 10, fontFamily: Fonts.bodyItalic,    color: '#9a8878' },
  calloutTip: {
    width: 0, height: 0,
    borderLeftWidth: 8,  borderRightWidth: 8,  borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#ede5d8', marginTop: -1,
  },

  // ── Empty overlay (no coordinates yet, map is live) ──
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,241,233,0.75)',
    top: 44,
  },
  emptyEmoji: { fontSize: 32, marginBottom: 8 },
  emptyText:  { fontSize: 13, color: '#b09a88', textAlign: 'center', fontFamily: Fonts.bodyItalic, lineHeight: 20 },

  // ── Placeholder (Expo Go without native map) ──
  placeholder: {
    flex: 1,
    minHeight: IS_DESKTOP ? 200 : 170,
    backgroundColor: '#f0ead8',
    position: 'relative',
    overflow: 'hidden',
  },
  placeholderGrid: { ...StyleSheet.absoluteFillObject },
  gridH: {
    position: 'absolute', top: '33%', left: 0, right: 0,
    height: 1, backgroundColor: '#e0d4bc',
  },
  gridV: {
    position: 'absolute', left: '33%', top: 0, bottom: 0,
    width: 1, backgroundColor: '#e0d4bc',
  },
  previewPin: { position: 'absolute', alignItems: 'center' },
  previewPinHead: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#c0845a',
    borderWidth: 2, borderColor: '#fff',
  },
  placeholderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(250,247,240,0.82)',
    padding: 16,
  },
  placeholderEmoji: { fontSize: 28, marginBottom: 6 },
  placeholderTitle: {
    fontSize: 14, fontFamily: Fonts.heading,
    color: '#5c4030', marginBottom: 6,
  },
  placeholderBody: {
    fontSize: 11, fontFamily: Fonts.bodyItalic,
    color: '#9a8878', textAlign: 'center', lineHeight: 18,
  },
  placeholderCode: {
    fontFamily: Fonts.label,
    color: '#c0845a',
  },

  // ── Location list (shown in both modes when memories have coordinates) ──
  locationList: {
    borderTopWidth: 1,
    borderTopColor: '#ede5d8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    maxHeight: 110,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e8dc',
  },
  locationPin: { fontSize: 13, marginRight: 10 },
  locationInfo: { flex: 1 },
  locationName: { fontSize: 12, fontFamily: Fonts.label, color: '#5c4030' },
  locationDate: { fontSize: 10, fontFamily: Fonts.bodyItalic, color: '#b09a88', marginTop: 1 },
});
