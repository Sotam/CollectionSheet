export interface Cache<T> {
    expires: Date;
    value: T;
}
