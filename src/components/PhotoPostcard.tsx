import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Moment } from '../data/moments';
import { Fonts } from '../theme/fonts';

const { width } = Dimensions.get('window');
const IS_DESKTOP = width >= 768;

interface PhotoPostcardProps {
  moment: Moment;
  onPress?: () => void;
  isSelected?: boolean;
}

export function PhotoPostcard({ moment, onPress, isSelected }: PhotoPostcardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      style={[styles.postcard, isSelected && styles.postcardSelected]}
    >
      {/* Decorative tape strip at top */}
      <View style={styles.tape} />

      {/* Photo */}
      <View style={styles.photoFrame}>
        <Image source={moment.image} style={styles.photo} resizeMode="cover" />
      </View>

      {/* Postcard body */}
      <View style={styles.body}>
        {/* Divider line */}
        <View style={styles.divider} />

        <Text style={styles.title}>{moment.title}</Text>

        <Text style={styles.note} numberOfLines={3}>
          {moment.note}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.datestamp}>📅 {moment.date}</Text>
          {!!moment.location && (
            <Text style={styles.location}>📍 {moment.location}</Text>
          )}
        </View>
      </View>

      {/* Corner fold decoration */}
      <View style={styles.cornerFold} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  postcard: {
    backgroundColor: '#fffcf5',
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 12,
    elevation: 6,
    shadowColor: '#7a6450',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e8ddd0',
    overflow: 'hidden',
    position: 'relative',
  },
  postcardSelected: {
    borderWidth: 2.5,
    borderColor: '#c0845a',
    // lift it slightly on selection
    shadowOpacity: 0.38,
    shadowRadius: 12,
  },
  tape: {
    position: 'absolute',
    top: -4,
    alignSelf: 'center',
    width: 60,
    height: 20,
    backgroundColor: 'rgba(255, 220, 150, 0.65)',
    borderRadius: 2,
    zIndex: 10,
    transform: [{ rotate: '-1.5deg' }],
  },
  photoFrame: {
    margin: 12,
    marginBottom: 0,
    borderWidth: 3,
    borderColor: '#ffffff',
    // Subtle frame shadow
    shadowColor: '#5c4d3c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: IS_DESKTOP ? 200 : 220,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0d5c5',
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontFamily: Fonts.headingItalic,
    color: '#5c4030',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  note: {
    fontSize: 13,
    fontFamily: Fonts.bodyItalic,
    color: '#7a6a5a',
    lineHeight: 21,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  datestamp: {
    fontSize: 11,
    fontFamily: Fonts.label,
    color: '#9a8878',
    letterSpacing: 0.3,
    backgroundColor: '#f4ede3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  location: {
    fontSize: 11,
    fontFamily: Fonts.label,
    color: '#9a8878',
    letterSpacing: 0.3,
    backgroundColor: '#f4ede3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cornerFold: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderRightWidth: 18,
    borderBottomWidth: 18,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightColor: '#e8ddd0',
    borderBottomColor: '#e8ddd0',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
  },
});
