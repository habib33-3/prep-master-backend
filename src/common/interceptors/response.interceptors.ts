import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SuccessResponse } from "../dto/response.dto";

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, SuccessResponse<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<SuccessResponse<T>> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request>();
        const response = httpContext.getResponse();

        const timestamp = this.getFormattedTimestamp();

        return next.handle().pipe(
            map((data) => {
                // If the response data is already an object with a status code, like an error response, handle it
                if (data?.statusCode && data?.message) {
                    return new SuccessResponse<T>({
                        status: response.statusCode,
                        message: this.getMessageByStatus(
                            response.statusCode as number,
                        ),
                        path: request.url,
                        timestamp,
                        data: data,
                    });
                }
                return new SuccessResponse<T>({
                    status: response.statusCode,
                    message: this.getMessageByStatus(
                        response.statusCode as number,
                    ),
                    path: request.url,
                    timestamp,
                    data,
                });
            }),
        );
    }

    private getMessageByStatus(status: number): string {
        const statusMessages: Record<number, string> = {
            200: "Request successful",
            201: "Resource created successfully",
            204: "No content",
        };
        return statusMessages[status] || "Success";
    }

    private getFormattedTimestamp(): string {
        const date = new Date();

        // Calculate the time offset for the Asia/Dhaka timezone (GMT+6)
        const localDate = new Date(
            date.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
        );

        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };

        // Format the timestamp as dd/mm/yy hh:mm:ss
        return localDate.toLocaleString("en-GB", options).replace(",", "");
    }
}
