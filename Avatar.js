import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Avatar({ size = 40, name, style }) {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Generate consistent color based on name
  const getGradientColors = (name) => {
    const charCode = name.charCodeAt(0);
    const colorIndices = [
      ['#FF8C00', '#F44336'], // Orange to Red
      ['#6A5ACD', '#20B2AA'], // Purple to Teal
      ['#4CAF50', '#FFC107'], // Green to Amber
      ['#F44336', '#6A5ACD'], // Red to Purple
      ['#20B2AA', '#4CAF50'], // Teal to Green
      ['#FFC107', '#FF8C00'], // Amber to Orange
    ];
    return colorIndices[charCode % colorIndices.length];
  };

  const gradientColors = getGradientColors(name);
  
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.initialsContainer, { width: size, height: size, borderRadius: size / 2 }]}
      >
        <Text 
          style={[
            styles.initials, 
            { fontSize: size * 0.4 }
          ]}
        >
          {initials}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#FFFFFF',            // Colors.white replaced
    fontFamily: 'System',         // FontFamily.semiBold replaced
    fontWeight: '600',            // Making it semiBold manually
    textAlign: 'center',
  },
});
