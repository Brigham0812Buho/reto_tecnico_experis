
import { TaskI } from "../../domain/entities/Task";
import { TaskFilterI } from "../../domain/entities/TaskFilter";

export const taskListDataSource = {
  getAll: async (filter: TaskFilterI): Promise<TaskI[]> => {
    const params = new URLSearchParams();

    if (filter.statusId)   params.append('statusId',   String(filter.statusId));
    if (filter.priorityId) params.append('priorityId', String(filter.priorityId));

    const response = await fetch(`${process.env.API_BASE_URL}/tasks?${params.toString()}`);

    if (!response.ok) throw new Error('Failed to fetch tasks');

    return response.json();
  },
};