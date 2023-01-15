//TODO : tạo middleware
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /** Interceptor có quyền truy cập vào request/ response trước và sau khi handler route được gọi.
   * Interceptor có thể sữ dụng vào việc:
   * ràng buộc logic bổ sung trước / sau khi thực thi phương thức
   * biến đổi kết quả trả về từ một hàm
   * biến đổi exception được ném ra từ một hàm
   * mở rộng hành vi function cơ bản
   * ghi đè hoàn toàn một function tùy thuộc vào các điều kiện cụ thể (ví dụ: cho mục đích lưu vào bộ nhớ đệm)
   */

  /** Pipes là một hàm được gọi trước khi tới handler route và được sử dụng để chuyển đổi dữ liệu đầu vào
   * transformation: chuyển đổi dữ liệu đầu vào sang dạng mong muốn (ví dụ: từ chuỗi thành số nguyên)
   * validation: đánh giá dữ liệu đầu vào và nếu hợp lệ, chỉ cần chuyển nó qua không thay đổi; nếu không, hãy ném một exception khi dữ liệu không chính xác
   */

  /** Middleware là một hàm được gọi trước khi tới handler route.Bạn có quyền truy cập vào các object request và response cũng như hàm middleware next() trong chu trình request-response của ứng dụng, nhưng bạn không có kết quả của trình handler route. Về cơ bản chúng là các chức năng Middleware thể hiện.
   * Thực thi bất kỳ đoạn code nào.
   * Thực hiện các thay đổi đối với request và response object.
   * Kết thúc chu kỳ request-response.
   * Gọi hàm middleware tiếp theo trong ngăn xếp.
   * Nếu hàm middleware hiện tại không kết thúc chu kỳ request-response, nó phải gọi next() để chuyển quyền điều khiển cho hàm middleware tiếp theo. Nếu không, request sẽ bị treo.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() =>
        Logger.log(
          `${method} - ${url} - ${Date.now() - now}ms`,
          context.getClass().name, // tên class controller đang requests
        ),
      ),
    );
  }
  /**
   * Thứ tự xử lí request sẽ là như sau: Middleware -> Interceptors -> Pipes -> Route Handler -> Interceptors
   * Khi bạn muốn chuyển đổi dữ liệu đầu vào trước khi xữ lý thì hãy chọn Pipes
   * Khi bạn chỉ muốn thực hiện 1 đoạn logic nào đó trước khi handler router thì nên dùng middleware
   * Còn trường hợp bạn muốn xử lí logic gì đó trước và sau handler router thì nên dùng interceptor
   */
}
