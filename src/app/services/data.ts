import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

//Injectable =>it is means the service available in all project
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'https://www.themuse.com/api/public/jobs?page=2'; // api link
  constructor(private http: HttpClient) {} // when i want to 'GET, POST, PUT, DELETE ' you should using HttpClient always using with service..always private because i used insid just my class'Data'

  getJobs(): Observable<any[]> {
    //Observable<any[]==> the getJobs() function return data like async so should use subscribe
    return this.http //return obj
      .get<any>(this.apiUrl)
      .pipe(map((response) => response.results));
  }
}
