import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CustomLoggerService {
    private readonly logger = new Logger(CustomLoggerService.name);

    private getFormattedTimestamp(): string {
        const options: Intl.DateTimeFormatOptions = {
            timeZoneName: "short",
            hour12: false,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };

        const date = new Date();
        const locale = "en-GB"; // "en-GB" formats as dd/mm/yyyy

        // Get formatted timestamp with dynamic locale and time zone handling
        const formattedDate = new Intl.DateTimeFormat(locale, options).format(
            date,
        );

        return formattedDate;
    }

    private logMessage(
        level: "log" | "error" | "warn" | "debug" | "verbose",
        message: string | object,
        context?: string,
        stack?: string,
    ) {
        const timestamp = this.getFormattedTimestamp();
        const safeContext = context ?? "General";

        if (typeof message === "object") {
            const formattedMessage = JSON.stringify(message, null, 2); // Pretty print the object
            if (level === "error") {
                const safeStack = stack ?? "No stack trace available";
                if (process.env.NODE_ENV === "production") {
                    this.logger.error(
                        `[${timestamp}] [${safeContext}]\nResponse:\n${formattedMessage}`,
                    );
                } else {
                    this.logger.error(
                        `[${timestamp}] [${safeContext}]\nResponse:\n${formattedMessage}`,
                        safeStack,
                    );
                }
            } else {
                this.logger[level](
                    `[${timestamp}] [${safeContext}]\nResponse:\n${formattedMessage}`,
                );
            }
        } else if (level === "error" && process.env.NODE_ENV !== "production") {
            this.logger.error(
                `[${timestamp}] [${safeContext}] ${message}`,
                stack,
            );
        } else {
            this.logger[level](`[${timestamp}] [${safeContext}] ${message}`);
        }
    }

    log(message: string | object, context?: string) {
        this.logMessage("log", message, context);
    }

    error(message: string | object, context?: string, stack?: string) {
        this.logMessage("error", message, context, stack);
    }

    warn(message: string, context?: string) {
        this.logMessage("warn", message, context);
    }

    debug(message: string, context?: string) {
        this.logMessage("debug", message, context);
    }

    verbose(message: string, context?: string) {
        this.logMessage("verbose", message, context);
    }
}
