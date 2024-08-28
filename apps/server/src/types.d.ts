export type ResponseData<T = {}> = {
    success: boolean;
    error?: string;
} & Partial<T>;
