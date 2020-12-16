import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { defaultIfEmpty, map, tap } from 'rxjs/operators';

import { Cache } from '../../../shared/models/cache.model';

@Injectable({
  providedIn: 'root'
})
export class CacheStorageService {

  public getItem<T>(key: string): Observable<T | null> {
    return of(localStorage.getItem(key))
      .pipe(
        defaultIfEmpty(),
        map((v) => {
          if (!!v) {
            const json: Cache<T> = JSON.parse(v);

            return new Date(json.expires).getTime() > Date.now()
              ? json.value
              : null;
          }

          return null;
        })
      );
  }

  public setItem<T>(key: string, expires: Date, value: Observable<T>): Observable<T> {
    return value.pipe(
      tap((v) => {
        const cache: Cache<T> = { expires, value: v };
        localStorage.setItem(key, JSON.stringify(cache));
      })
    );
  }
}
