import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  title: string;
  onPress: () => void;
  style?: object;
}

const PrimaryButton = ({ title, onPress, style }: Props) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor:   theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical:   theme.spacing.sm,
    borderRadius:      theme.borderRadius.sm,
    alignItems:        'center',
  },
  text: {
    color:      theme.colors.text.white,
    fontWeight: theme.fontWeight.medium,
  },
});

export default PrimaryButton;
