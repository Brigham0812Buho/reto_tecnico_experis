import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../../../core/theme/theme';
import { TaskFilterI } from '../../../TaskList/domain/entities/TaskFilter';

interface Props {
  visible: boolean;
  currentFilter: TaskFilterI;
  onApply: (filter: TaskFilterI) => void;
  onClose: () => void;
}

const STATUSES = [
  { id: 1, name: 'Pendiente' },
  { id: 2, name: 'En progreso' },
  { id: 3, name: 'Completada' },
];

const PRIORITIES = [
  { id: 1, name: 'Baja' },
  { id: 2, name: 'Media' },
  { id: 3, name: 'Alta' },
];

const TaskFilterView = ({ visible, currentFilter, onApply, onClose }: Props) => {
  const [statusId,   setStatusId]   = useState<number | undefined>(currentFilter.statusId);
  const [priorityId, setPriorityId] = useState<number | undefined>(currentFilter.priorityId);

  const handleApply = () => {
    onApply({ statusId, priorityId });
    onClose();
  };

  const handleClear = () => {
    setStatusId(undefined);
    setPriorityId(undefined);
    onApply({});
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>

          <View style={styles.header}>
            <Text style={styles.title}>Filtrar tareas</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Estado</Text>
          <View style={styles.options}>
            {STATUSES.map(s => {
              const color   = theme.colors.status[s.name as keyof typeof theme.colors.status];
              const active  = statusId === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[
                    styles.chip,
                    { borderColor: color },
                    active && { backgroundColor: color },
                  ]}
                  onPress={() => setStatusId(active ? undefined : s.id)}>
                  {!active && <View style={[styles.dot, { backgroundColor: color }]} />}
                  <Text style={[styles.chipText, { color: active ? theme.colors.text.white : color }]}>
                    {s.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Prioridad</Text>
          <View style={styles.options}>
            {PRIORITIES.map(p => {
              const color  = theme.colors.priority[p.name as keyof typeof theme.colors.priority];
              const active = priorityId === p.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[
                    styles.chip,
                    { borderColor: color },
                    active && { backgroundColor: color },
                  ]}
                  onPress={() => setPriorityId(active ? undefined : p.id)}>
                  {!active && <View style={[styles.dot, { backgroundColor: color }]} />}
                  <Text style={[styles.chipText, { color: active ? theme.colors.text.white : color }]}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius:  theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   theme.spacing.lg,
  },
  title: {
    fontSize:   theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color:      theme.colors.text.primary,
  },
  closeBtn: {
    fontSize: theme.fontSize.lg,
    color:    theme.colors.text.muted,
  },
  sectionTitle: {
    fontSize:      theme.fontSize.xs,
    fontWeight:    theme.fontWeight.bold,
    color:         theme.colors.text.muted,
    textTransform: 'uppercase',
    marginBottom:  theme.spacing.sm,
  },
  options: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           theme.spacing.sm,
    marginBottom:  theme.spacing.lg,
  },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical:   theme.spacing.xs,
    borderRadius:      theme.borderRadius.full,
    borderWidth:       1.5,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  chipText: {
    fontSize:   theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  actions: {
    flexDirection: 'row',
    gap:           theme.spacing.sm,
    marginTop:     theme.spacing.sm,
  },
  clearBtn: {
    flex:            1,
    paddingVertical: theme.spacing.sm,
    borderRadius:    theme.borderRadius.sm,
    borderWidth:     1,
    borderColor:     theme.colors.text.muted,
    alignItems:      'center',
  },
  clearText: {
    color:      theme.colors.text.secondary,
    fontWeight: theme.fontWeight.medium,
  },
  applyBtn: {
    flex:            1,
    paddingVertical: theme.spacing.sm,
    borderRadius:    theme.borderRadius.sm,
    backgroundColor: theme.colors.primary,
    alignItems:      'center',
  },
  applyText: {
    color:      theme.colors.text.white,
    fontWeight: theme.fontWeight.medium,
  },
});

export default TaskFilterView;