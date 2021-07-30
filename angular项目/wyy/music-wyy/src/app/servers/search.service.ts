
import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServersModule} from './servers.module';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SearchResult} from './data-types/common.types';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: ServersModule
})
export class SearchService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.uri + 'search/suggest', { params })
      .pipe(map((res: { result: SearchResult }) => res.result));
  }

}
