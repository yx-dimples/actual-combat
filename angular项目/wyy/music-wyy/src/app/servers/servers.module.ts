import {InjectionToken, NgModule} from '@angular/core';
import {httpInterceptorsProvides} from './http-interceptors';
import {environment} from '../../environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken');

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    { provide: API_CONFIG, useValue: environment.production ? '/' : '/api/' },
    httpInterceptorsProvides
  ],
})
export class ServersModule { }
