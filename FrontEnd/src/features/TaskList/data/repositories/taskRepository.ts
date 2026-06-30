import { TaskI } from "../../domain/entities/Task";
import { TaskFilterI } from "../../domain/entities/TaskFilter";
import { taskListDataSource } from "../datasource/taskRemoteDataSource";

export const taskListRepository = {
  getAll: async (filter: TaskFilterI): Promise<TaskI[]> => {
    return taskListDataSource.getAll(filter);
  },
};