import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/theme';
import PrimaryButton from './PrimaryButton';

interface Props {
  loading?: boolean;
  error?: string | null;
  retryLabel?: string;
  onRetry?: () => void;
}

const CenteredState = ({ loading, error, retryLabel = 'Reintentar', onRetry }: Props) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        {onRetry ? <PrimaryButton title={retryLabel} onPress={onRetry} /> : null}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  center: {
    flex:           1,
    justifyContent: 'center',
    alignItems:     'center',
  },
  error: {
    color:        theme.colors.error,
    fontSize:     theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
});

export default CenteredState;
