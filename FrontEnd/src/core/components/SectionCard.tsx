import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme/theme';

interface Props {
  children: React.ReactNode;
}

const SectionCard = ({ children }: Props) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius:    theme.borderRadius.md,
    padding:         theme.spacing.md,
    margin:          theme.spacing.md,
    elevation:       2,
  },
});

export default SectionCard;
