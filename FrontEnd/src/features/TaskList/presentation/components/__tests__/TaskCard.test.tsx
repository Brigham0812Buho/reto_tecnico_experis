import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import TaskCard from '../TaskCard';
import { TaskI } from '../../../domain/entities/Task';

describe('TaskCard', () => {
  const task: TaskI = {
    id: 1,
    title: 'Tarea de prueba',
    description: 'Descripción de prueba',
    priorityId: 1,
    priorityName: 'Alta',
    statusId: 1,
    statusName: 'Pending',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: null,
  };

  it('muestra la información de la tarea y notifica al hacer press', async () => {
    const onPress = jest.fn();

    const { getByText } = await render(<TaskCard task={task} onPress={onPress} />);

    expect(getByText('Tarea de prueba')).toBeTruthy();
    expect(getByText('Descripción de prueba')).toBeTruthy();
    expect(getByText('Pendiente')).toBeTruthy();

    fireEvent.press(getByText('Tarea de prueba'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('no muestra descripción cuando viene null y sigue siendo presionable', async () => {
    const onPress = jest.fn();
    const taskWithoutDescription: TaskI = {
      ...task,
      description: null,
    };

    const { getByText, queryByText } = await render(
      <TaskCard task={taskWithoutDescription} onPress={onPress} />,
    );

    expect(getByText('Tarea de prueba')).toBeTruthy();
    expect(queryByText('Descripción de prueba')).toBeNull();
    expect(getByText('Pendiente')).toBeTruthy();

    fireEvent.press(getByText('Tarea de prueba'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
