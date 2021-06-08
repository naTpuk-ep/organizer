import { Component } from '@angular/core';
import {DateService} from "./shared/date.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DateService]
})
export class AppComponent {

}
