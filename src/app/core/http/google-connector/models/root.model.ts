import { Feed } from './feed.model';

export interface Root<T> {
    feed: Feed<T>;
}
