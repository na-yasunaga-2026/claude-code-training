/**
 * API成功レスポンス
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * APIエラーレスポンス
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

/**
 * APIレスポンス型
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * ヘルスチェックレスポンス
 */
export interface HealthCheckResponse {
  status: "ok";
  timestamp: string;
}

export type OshiExpenseCategory = "グッズ" | "遠征" | "配信" | "その他";

export interface OshiExpense {
  id: string;
  date: string; // ISO 8601 "YYYY-MM-DD"
  amount: number;
  category: OshiExpenseCategory;
  oshi: string;
  memo?: string;
}
