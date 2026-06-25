export type LogbookEntryResult = "ATTEMPT" | "TOP_ROPE" | "REDPOINT" | "FLASH" | "ONSIGHT";

export interface LogbookEntryRequest {
  userId: number;
  routeId: number;
  attemptDate: string;
  result: LogbookEntryResult;
  notes: string | null;
}

export interface LogbookEntryResponse {
  id: number;
  userId: number;
  routeId: number;
  attemptDate: string;
  result: LogbookEntryResult;
  notes: string | null;
  createdAt: string;
}
