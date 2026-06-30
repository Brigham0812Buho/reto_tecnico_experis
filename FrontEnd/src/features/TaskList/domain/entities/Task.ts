export interface TaskI {
  id: number;
  title: string;
  description: string | null;
  priorityId: number;
  priorityName: string;
  statusId: number;
  statusName: string;
  createdAt: string;
  updatedAt: string | null;
}
