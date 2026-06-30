import { taskListRepository } from '../taskRepository';
import { taskListDataSource } from '../../datasource/taskRemoteDataSource';

jest.mock('../../datasource/taskRemoteDataSource', () => ({
  taskListDataSource: {
    getAll: jest.fn(),
  },
}));

describe('taskListRepository', () => {
  const mockedGetAll = taskListDataSource.getAll as jest.MockedFunction<
    typeof taskListDataSource.getAll
  >;

  beforeEach(() => {
    mockedGetAll.mockReset();
  });

  it('devuelve los datos del datasource usando el filtro recibido', async () => {
    const filter = { statusId: 1, priorityId: 2 };
    const expectedTasks = [
      {
        id: 1,
        title: 'Tarea de prueba',
        description: 'Descripción de prueba',
        priorityId: 2,
        priorityName: 'Alta',
        statusId: 1,
        statusName: 'Pending',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
      },
    ];

    mockedGetAll.mockResolvedValue(expectedTasks);

    const result = await taskListRepository.getAll(filter);

    expect(mockedGetAll).toHaveBeenCalledWith(filter);
    expect(result).toEqual(expectedTasks);
  });
});
