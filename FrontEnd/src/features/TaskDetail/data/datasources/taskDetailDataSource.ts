import { TaskI } from "../../../TaskList/domain/entities/Task";

export const taskDetailDataSource = {
  getById: async (id: number): Promise<TaskI> => {
    const response = await fetch(`${process.env.API_BASE_URL}/tasks/${id}`);

    if (!response.ok) throw new Error(`Task ${id} not found`);

    return response.json();
  },
};