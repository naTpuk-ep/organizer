import {
  Component, OnInit,
} from '@angular/core';
import { DateService } from '../shared/date.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ITask, TasksService } from '../shared/tasks.service';
import { FORMAT } from '../shared/FORMAT';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  form: FormGroup | undefined;
  tasks: ITask[] = [];

  constructor(
    public dateService: DateService,
    public taskService: TasksService,
  ) {
  }

  ngOnInit(): void {
    this.dateService.date
      .pipe(switchMap(value => this.taskService.load(value)))
      .subscribe(tasks => {
        this.tasks = tasks;
      });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  submit() {
    const { title } = this.form?.value;
    const task: ITask = {
      title,
      date: this.dateService.date.value.format(FORMAT),
    };
    this.taskService.create(task)
      .subscribe(task => {
        this.tasks.push(task);
        this.form?.reset();
      }, error => {
        console.error(error);
      });
  }

  remove(task: ITask) {
    this.taskService.remove(task)
      .subscribe(() => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      }, error => {
        console.error(error);
      });
  }
}
