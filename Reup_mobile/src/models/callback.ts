export interface IError {
  message: string;
  code: number;
  data?: any;
}

export interface IActionCallback {
  onSuccess?: (data?: any, identify?: string) => void;
  onFail?: (error?: IError) => void;
}
