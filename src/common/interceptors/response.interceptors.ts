import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";

import { StandardResponseDto } from "../dto/response.dto";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<StandardResponseDto<T>> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request>();
        const response = httpContext.getResponse();

        const timestamp = this.formatDate(new Date());
        const path = request.url;

        return next.handle().pipe(
            map((result) => {
                const isPaginated =
                    result && "data" in result && "meta" in result;

                return {
                    success: true,
                    statusCode: response.statusCode,
                    message: "Request successful",
                    timestamp,
                    path,
                    data: isPaginated
                        ? {
                              items: result.data,
                              meta: result.meta,
                          }
                        : {
                              items: result,
                          },
                };
            }),
        );
    }

    private formatDate(date: Date): string {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
        return formatter.format(date).replace(",", "");
    }
}
