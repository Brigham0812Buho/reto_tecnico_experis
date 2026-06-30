export const theme = {
  colors: {
    primary:    '#6366f1',
    background: '#f5f5f5',
    surface:    '#ffffff',
    error:      '#ef4444',
    success:    '#22c55e',
    warning:    '#f59e0b',
    text: {
      primary:   '#1a1a1a',
      secondary: '#6b7280',
      muted:     '#9ca3af',
      white:     '#ffffff',
    },
   priority: {
    Alta:  '#ef4444',
    Media: '#f59e0b',
    Baja:  '#22c55e',
  },
  priorityLight: {
    Alta:  '#fef2f2',
    Media: '#fffbeb',
    Baja:  '#f0fdf4',
  },
status: {
  Pendiente:      '#9ca3af',
  'En progreso':  '#3b82f6',
  Completada:     '#22c55e',
},
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 999,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 16,
    lg: 18,
    xl: 22,
  },
  fontWeight: {
    regular: '400' as const,
    medium:  '500' as const,
    bold:    '600' as const,
  },
};