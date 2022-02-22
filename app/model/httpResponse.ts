/**
 * httpResponse
 */

export interface HttpResponse<T> {
    /**
     * status
     */
    status: number;
    /**
     * headers
     */
    headers: { [index: string]: string };
    /**
     * data
     */
    data: T;
    /**
     * result
     */
    result: Result;
}

export interface Result {
    status: number;
    headers: { [index: string]: string };
    data: any;
}
