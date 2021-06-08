import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { FORMAT } from './FORMAT';


export interface ITask {
  id?: string
  title: string
  date?: string
}

export interface IResponse {
  name: string
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  static url =
    'https://angular-calendar-2ce84-default-rtdb.asia-southeast1.firebasedatabase.app/';


  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<ITask[]> {
    return this.http
      .get<ITask[]>(`${TasksService.url}/${date.format(FORMAT)}.json`)
      .pipe(map(tasks => {
        if (!tasks) {
          return [];
        }
        return Object.keys(tasks)
          .map((key: any) => ({
            ...tasks[key],
            id: key,
          }));
      }));
  }

  create(task: ITask): Observable<ITask> {
    return (
      this.http
        .post<IResponse>(`${TasksService.url}/${task.date}.json`, task)
        .pipe(map(res => ({
          ...task,
          id: res.name,
        })))
    );
  }

  remove(task: ITask): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`);
  }
}
