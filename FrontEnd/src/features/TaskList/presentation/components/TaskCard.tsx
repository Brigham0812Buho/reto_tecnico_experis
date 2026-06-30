import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';
import StatusBadge from '../../../../core/components/StatusBadge';
import { TaskI } from '../../domain/entities/Task';

interface Props {
  task: TaskI;
  onPress: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  Pending:       'Pendiente',
  'In Progress': 'En progreso',
  Done:          'Completada',
};

const TaskCard = ({ task, onPress }: Props) => {
  const priorityColor      = theme.colors.priority[task.priorityName as keyof typeof theme.colors.priority]      ?? theme.colors.text.muted;
  const priorityBackground = theme.colors.priorityLight[task.priorityName as keyof typeof theme.colors.priorityLight] ?? theme.colors.background;
  const statusColor        = theme.colors.status[task.statusName.replace(' ', '') as keyof typeof theme.colors.status] ?? theme.colors.text.muted;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: priorityColor }]}
      onPress={onPress}
      activeOpacity={0.7}>

      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
        <StatusBadge
          label={task.priorityName}
          color={priorityColor}
          backgroundColor={priorityBackground}
        />
      </View>

      {task.description && (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      )}

      <View style={styles.footer}>
        <StatusBadge
          label={STATUS_LABELS[task.statusName] ?? task.statusName}
          color={statusColor}
          backgroundColor="transparent"
        />
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor:  theme.colors.surface,
    borderRadius:     theme.borderRadius.md,
    borderLeftWidth:  4,
    padding:          theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical:   theme.spacing.xs,
    shadowColor:      '#000',
    shadowOffset:     { width: 0, height: 1 },
    shadowOpacity:    0.06,
    shadowRadius:     4,
    elevation:        2,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    marginBottom:   theme.spacing.sm,
  },
  title: {
    fontSize:    theme.fontSize.md,
    fontWeight:  theme.fontWeight.bold,
    color:       theme.colors.text.primary,
    flex:        1,
    marginRight: theme.spacing.sm,
  },
  description: {
    fontSize:     theme.fontSize.sm,
    color:        theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight:   18,
  },
  footer: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
});

export default TaskCard;