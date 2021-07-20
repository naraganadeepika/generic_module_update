import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
	url:string =environment.path;
  constructor(public http: HttpClient) { }

  get(endpoint: string, params?: any) {

    return this.http.get(this.url + '/' + endpoint);
  }

  post(endpoint: string, body: any) {
    return this.http.post(this.url + '/' + endpoint, body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(this.url + '/' + endpoint, body);
  }

  delete(endpoint: string) {
    return this.http.delete(this.url + '/' + endpoint);
  }

  patch(endpoint: string, body: any) {
    return this.http.patch(this.url + '/' + endpoint, body);
  }
}
