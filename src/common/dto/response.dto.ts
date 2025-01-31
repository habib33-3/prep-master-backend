export class StandardResponseDto<T> {
    success: boolean;
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    data?: {
        items: T[];
        meta?: {
            total: number;
            page: number;
            pageSize: number;
        };
    };
    error?: string;
}
