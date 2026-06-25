export type GradingSystemCategory = "ROPED" | "BOULDER";

export interface GradingSystemRequest {
  name: string;
  category: GradingSystemCategory;
}

export interface GradingSystemResponse {
  id: number;
  name: string;
  category: GradingSystemCategory;
}
