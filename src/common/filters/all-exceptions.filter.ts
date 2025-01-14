import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

import { CustomLoggerService } from "src/custom-logger/custom-logger.service";

import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Request, Response } from "express";

type MyResponseObj = {
    success: boolean;
    statusCode: number;
    timestamp: string;
    path: string;
    response: string;
    errorId?: string;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new CustomLoggerService();

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const myResponseObj: MyResponseObj = {
            success: false,
            statusCode: 500,
            timestamp: this.formatDate(new Date()),
            path: request.url,
            response: "",
        };

        // Handle known HTTP exceptions
        if (exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            myResponseObj.response =
                typeof exceptionResponse === "string"
                    ? exceptionResponse
                    : JSON.stringify(exceptionResponse);
        }
        // Handle Prisma validation errors
        else if (exception instanceof PrismaClientValidationError) {
            myResponseObj.statusCode = 422;
            myResponseObj.response = exception.message.replace(/\n/g, " ");
        }
        // Handle Prisma known request errors
        else if (exception instanceof PrismaClientKnownRequestError) {
            myResponseObj.statusCode = 400;

            switch (exception.code) {
                case "P2002":
                    myResponseObj.response =
                        "Unique constraint failed on the field(s): " +
                        this.formatPrismaMeta(exception.meta);
                    break;
                case "P2003":
                    myResponseObj.response =
                        "Foreign key constraint failed on the field(s): " +
                        this.formatPrismaMeta(exception.meta);
                    break;
                case "P2025":
                    myResponseObj.response =
                        "An operation failed because a required record was not found.";
                    break;
                default:
                    myResponseObj.response = exception.message;
                    break;
            }
        }
        // Handle general errors
        else {
            myResponseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

            // Adjust error response based on the environment
            if (process.env.NODE_ENV === "production") {
                myResponseObj.response = "Internal Server Error";
            } else {
                myResponseObj.response =
                    exception instanceof Error
                        ? `${exception.name}: ${exception.message}`
                        : JSON.stringify(exception);
            }
        }

        // Optional: Add unique error ID for tracking
        if (myResponseObj.statusCode >= 500) {
            myResponseObj.errorId = this.generateErrorId();
        }

        response.status(myResponseObj.statusCode).json(myResponseObj);

        // Log error using CustomLoggerService
        const responseString = this.formatExceptionForLogging(
            myResponseObj.response,
        );

        this.logger.error(responseString, AllExceptionsFilter.name);

        super.catch(exception, host);
    }

    private generateErrorId(): string {
        return "error_" + (Math.random() * 1e9).toString(36);
    }

    private formatExceptionForLogging(exception: string | object): string {
        if (typeof exception === "object") {
            try {
                return JSON.stringify(exception, null, 2);
            } catch {
                return "[Unserializable Object]";
            }
        }

        if (typeof exception === "string") {
            return exception;
        }

        return String(exception);
    }

    private formatPrismaMeta(meta: Record<string, unknown>): string {
        if (!meta) return "Unknown fields";

        return Object.values(meta)
            .map((value) => {
                if (value === null || value === undefined) {
                    return "";
                }

                if (typeof value !== "object") {
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string
                    return String(value);
                }

                try {
                    return JSON.stringify(value, (key, val: unknown) => {
                        if (val instanceof Error) {
                            return {
                                message: val.message,
                                name: val.name,
                                stack: val.stack,
                            };
                        }

                        if (Array.isArray(val)) {
                            return val.map((item) =>
                                this.formatPrismaMeta({ item }),
                            );
                        }

                        return val;
                    });
                } catch {
                    return "[Unserializable Object]";
                }
            })
            .join(", ");
    }

    private formatDate(date: Date): string {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
        });
        return formatter.format(date);
    }
}
