import React, { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAsync } from '../../../../core/hooks/useAsync';
import { theme } from '../../../../core/theme/theme';
import CenteredState from '../../../../core/components/CenteredState';
import EmptyState from '../../../../core/components/EmptyState';
import TaskCard from '../components/TaskCard';
import { TaskI } from '../../domain/entities/Task';
import { TaskFilterI } from '../../domain/entities/TaskFilter';
import { taskListRepository } from '../../data/repositories/taskRepository';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  onTaskPress: (task: TaskI) => void;
  onFilterPress: () => void;
  filter?: TaskFilterI;
}

const TaskListView = ({ onTaskPress, onFilterPress, filter = {} }: Props) => {
  const insets = useSafeAreaInsets();
  const { data, loading, error, execute } = useAsync(
    () => taskListRepository.getAll(filter)
  );

  useEffect(() => {
    execute();
  }, [filter]);

  if (loading) {
    return <CenteredState loading />;
  }

  if (error) {
    return <CenteredState error={error} onRetry={execute} />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
        <Text style={styles.title}>Tareas</Text>
        <TouchableOpacity onPress={onFilterPress}>
          <Text style={styles.filterBtn}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => onTaskPress(item)} />
        )}
        ListEmptyComponent={<EmptyState message="No hay tareas disponibles." />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    padding:         theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation:       2,
  },
  title: {
    fontSize:   theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color:      theme.colors.text.primary,
  },
  filterBtn: {
    fontSize:   theme.fontSize.md,
    color:      theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },

  list: {
    paddingVertical: theme.spacing.sm,
  },
});

export default TaskListView;