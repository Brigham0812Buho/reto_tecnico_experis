
import { TaskI } from '../../../TaskList/domain/entities/Task';
import { taskDetailDataSource } from '../datasources/taskDetailDataSource';

export const taskDetailRepository = {
  getById: async (id: number): Promise<TaskI> => {
    return taskDetailDataSource.getById(id);
  },
};