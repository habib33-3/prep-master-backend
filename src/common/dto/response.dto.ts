export class SuccessResponse<T> {
    status: number;

    /**
     * Descriptive message about the success of the operation.
     */
    message: string;

    /**
     * The API endpoint that generated the response.
     */
    path: string;

    /**
     * The actual data returned by the API.
     */
    data: T;

    /**
     * Timestamp indicating when the response was generated.
     */
    timestamp: string;

    constructor(partial: Partial<SuccessResponse<T>>) {
        this.status = partial.status!;
        this.message = partial.message!;
        this.path = partial.path!;
        this.data = partial.data!;
        this.timestamp = partial.timestamp || new Date().toISOString();
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StandardResponse<T = any> = {
    success: boolean;
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    data?: T; // Present in success responses
    error?: string; // Present in error responses
};
