export class BaseResponse {
  success: boolean;
  data: any;
  error?: string;

  constructor(data: any) {
    this.success = data.success || true;
    this.data = data.data || data;
    this.error = data.error;
  }
}
