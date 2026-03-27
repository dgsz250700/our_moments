import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Moment } from '../data/moments';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface MomentCardProps {
  moment: Moment;
}

export function MomentCard({ moment }: MomentCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Image source={moment.image} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.title}>{moment.title}</Text>
        <Text style={styles.meta}>
          {moment.date} • {moment.location}
        </Text>
        <Text style={styles.note} numberOfLines={4}>{moment.note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH, // Explicit width, NOT full screen
    height: height * 0.65, // Explicit height
    backgroundColor: '#fffcf5',
    borderRadius: 16, // Rounded corners
    overflow: 'hidden',
    
    // Soft shadow for a diary page feel
    elevation: 8,
    shadowColor: '#5c4d3c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    
    // Centers the card nicely in the scrolling list space
    alignSelf: 'center', 
    marginHorizontal: width * 0.075, // Makes exactly 1 page snap completely into view per swipe
  },
  image: {
    width: '100%',
    height: '100%', // Main focus
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(50, 40, 30, 0.40)', // Soft elegant overlay
    padding: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  meta: {
    fontSize: 13,
    color: '#fdfbf7',
    marginBottom: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  note: {
    fontSize: 16,
    color: '#fffff0',
    lineHeight: 26,
  },
});
