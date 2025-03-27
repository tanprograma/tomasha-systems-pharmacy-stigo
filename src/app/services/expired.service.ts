import { inject, Injectable } from '@angular/core';
import { Expired } from '../interfaces/expired';
import { catchError } from 'rxjs';
import { PostResponse } from '../interfaces/post-result';
import { HttpService } from './http.service';
import { UrlService } from './url.service';
@Injectable({
  providedIn: 'root',
})
export class ExpiredService {
  api = inject(UrlService).EXPIRED_API;

  http = inject(HttpService);
  constructor() {}
  getExpired() {
    return this.http
      .get<Expired[]>(`${this.api}`)
      .pipe(
        catchError(
          this.http.handleError<Expired[]>('could not get expired items', [])
        )
      );
  }

  postExpired(data: Expired) {
    return this.http
      .post<Expired, PostResponse<Expired>>(`${this.api}/create`, data)
      .pipe(
        catchError(
          this.http.handleError<PostResponse<Expired>>(
            'could not create expired item',
            {
              status: false,
            }
          )
        )
      );
  }
  postExpireds(data: Expired[]) {
    return this.http
      .post<Expired[], PostResponse<Expired[]>>(`${this.api}/createmany`, data)
      .pipe(
        catchError(
          this.http.handleError<PostResponse<Expired[]>>(
            'could not create expired items',
            {
              result: [],
              status: false,
            }
          )
        )
      );
  }
}
