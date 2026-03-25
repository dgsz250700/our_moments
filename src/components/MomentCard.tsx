import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Moment } from '../data/moments';

interface MomentCardProps {
  moment: Moment;
}

export function MomentCard({ moment }: MomentCardProps) {
  return (
    <View style={styles.polaroid}>
      <Image source={moment.image} style={styles.image} />
      <View style={styles.captionArea}>
        <Text style={styles.title}>{moment.title}</Text>
        <Text style={styles.meta}>
          {moment.date} • {moment.location}
        </Text>
        <Text style={styles.note} numberOfLines={2}>{moment.note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  polaroid: {
    backgroundColor: '#ffffff', // Pure white like photo paper
    padding: 12, // White border surrounding the image
    paddingBottom: 24, // Extra thick bottom border for the polaroid caption look
    marginBottom: 36, // Plenty of breathing room between photos
    width: '88%',
    maxWidth: 400,
    alignSelf: 'center',
    
    // Smooth, deep warm shadow to look like physical paper on an album page
    elevation: 8,
    shadowColor: '#bea992', 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: '#f5f1eb', // Warm placeholder
  },
  captionArea: {
    marginTop: 18,
    alignItems: 'center', // Centered text feels more like a written album caption
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2f3542',
    marginBottom: 6,
    fontStyle: 'italic', // Gives a slight romantic, handwritten vibe to defaults
  },
  meta: {
    fontSize: 12,
    color: '#a4b0be',
    marginBottom: 10,
    textTransform: 'uppercase', // Very clean modern typographic touch
    letterSpacing: 1.5,
  },
  note: {
    fontSize: 15,
    color: '#57606f',
    lineHeight: 22,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
