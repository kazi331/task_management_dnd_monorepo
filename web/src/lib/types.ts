export type Status = "backlog" | "progress" | "completed";
export interface Ticket {
  id: number | string;
  title: string;
  status: Status;
  description?: string;
}
export type IdType = string | number;
