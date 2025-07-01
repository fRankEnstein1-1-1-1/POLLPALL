import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Card({ 
  children, 
  style, 
  padded = true, 
  elevation = 'md' 
}) {
  return (
    <View 
      style={[
        styles.card, 
        padded && styles.padded,
        styles[elevation],
        style
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', // Colors.white
    borderRadius: 12, // BorderRadius.md (example value)
    overflow: 'hidden',
  },
  padded: {
    padding: 16, // Spacing.md (example value)
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
});
