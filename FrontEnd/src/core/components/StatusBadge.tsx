import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  label: string;
  color: string;
  backgroundColor?: string;
}

const StatusBadge = ({ label, color, backgroundColor }: Props) => {
  return (
    <View style={[styles.badge, { backgroundColor: backgroundColor ?? theme.colors.surface }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical:   4,
    borderRadius:      theme.borderRadius.full,
  },
  dot: {
    width:        7,
    height:       7,
    borderRadius: 3,
  },
  badgeText: {
    fontSize:   theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
  },
});

export default StatusBadge;
