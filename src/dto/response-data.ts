export class ResponseData<T> {
  message: string;
  status: string;
  timeRes: Date;
  code: number;
  method: string;
  data: T;
  constructor({
    message,
    status,
    code,
    data,
    timeRes,
    method,
  }: ResponseData<T>) {
    this.message = message;
    this.status = status;
    this.code = code;
    this.data = data;
    this.timeRes = timeRes;
    this.method = method;
  }
}
