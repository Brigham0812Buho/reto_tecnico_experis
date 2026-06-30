import React, { useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAsync } from '../../../../core/hooks/useAsync';
import { theme } from '../../../../core/theme/theme';
import CenteredState from '../../../../core/components/CenteredState';
import SectionCard from '../../../../core/components/SectionCard';
import StatusBadge from '../../../../core/components/StatusBadge';
import { taskDetailRepository } from '../../data/repositories/taskDetailRepository';

interface Props {
  taskId: number;
  onBack: () => void;
}

const TaskDetailView = ({ taskId, onBack }: Props) => {
  const { data, loading, error, execute } = useAsync(
    () => taskDetailRepository.getById(taskId)
  );

  useEffect(() => {
    execute();
  }, [taskId]);

  if (loading) {
    return <CenteredState loading />;
  }

  if (error || !data) {
    return <CenteredState error={error ?? 'Tarea no encontrada.'} onRetry={execute} />;
  }

  const priorityColor = theme.colors.priority[data.priorityName as keyof typeof theme.colors.priority] ?? theme.colors.text.muted;
  const statusColor   = theme.colors.status[data.statusName as keyof typeof theme.colors.status] ?? theme.colors.text.muted;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <SectionCard>
        <Text style={styles.title}>{data.title}</Text>

        <View style={styles.row}>
          <StatusBadge
            label={data.priorityName}
            color={theme.colors.text.white}
            backgroundColor={priorityColor}
          />
          <StatusBadge
            label={data.statusName}
            color={statusColor}
            backgroundColor="transparent"
          />
        </View>

        {data.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{data.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Creado</Text>
          <Text style={styles.meta}>
            {new Date(data.createdAt).toLocaleDateString('es-PE', {
              year:  'numeric',
              month: 'long',
              day:   'numeric',
            })}
          </Text>
        </View>

        {data.updatedAt && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actualizado</Text>
            <Text style={styles.meta}>
              {new Date(data.updatedAt).toLocaleDateString('es-PE', {
                year:  'numeric',
                month: 'long',
                day:   'numeric',
              })}
            </Text>
          </View>
        )}
      </SectionCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: theme.colors.background,
  },
  backBtn: {
    padding: theme.spacing.md,
  },
  backText: {
    fontSize:   theme.fontSize.md,
    color:      theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  title: {
    fontSize:     theme.fontSize.xl,
    fontWeight:   theme.fontWeight.bold,
    color:        theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   theme.spacing.md,
  },

  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize:      theme.fontSize.xs,
    fontWeight:    theme.fontWeight.bold,
    color:         theme.colors.text.muted,
    marginBottom:  theme.spacing.xs,
    textTransform: 'uppercase',
  },
  description: {
    fontSize:   theme.fontSize.md,
    color:      theme.colors.text.secondary,
    lineHeight: 24,
  },
  meta: {
    fontSize: theme.fontSize.sm,
    color:    theme.colors.text.secondary,
  },

});

export default TaskDetailView;