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
  loading = false;

  constructor(
    public dateService: DateService,
    public taskService: TasksService,
  ) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.dateService.date
      .pipe(switchMap(value => this.taskService.load(value)))
      .subscribe({
        next: () => {
          this.loading = false;
        },
      });
    this.taskService.tasks.subscribe(tasks => {
      this.tasks = tasks;
    });
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
    });
  }

  submit() {
    if (!this.loading) {
      this.loading = true;
      const { title } = this.form?.value;
      const task: ITask = {
        title,
        date: this.dateService.date.value.format(FORMAT),
      };
      this.taskService.create(task)
        .subscribe(() => {
          this.loading = false;
          this.form?.reset();
        }, error => {
          this.loading = false;
          console.error(error);
        });
    }
  }

  remove(task: ITask) {
    this.loading = true;
    this.taskService.remove(task)
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.error(err);
        },
      });
  }
}
