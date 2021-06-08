import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  tasks: BehaviorSubject<ITask[]> = new BehaviorSubject([] as ITask[]);

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<void> {
    return this.http
      .get<ITask[]>(`${TasksService.url}/${date.format(FORMAT)}.json`)
      .pipe(map(tasks => {
        this.tasks.next(
          tasks
            ? Object.entries(tasks)
              .map(([key, value]) => ({
                ...value,
                id: key,
              }))
            : [],
        );
      }));
  }

  create(task: ITask): Observable<void> {
    return this.http
      .post<IResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        this.tasks.next([
          ...this.tasks.value,
          {
            ...task,
            id: res.name,
          },
        ]);
      }));
  }

  remove(task: ITask): Observable<void> {
    return this.http
      .delete<void>(`${TasksService.url}/${task.date}/${task.id}.json`)
      .pipe(tap(() => {
        const tasks = this.tasks.value.filter(t => t.id !== task.id);
        this.tasks.next(tasks);
      }));
  }
}
