import { Component } from '@angular/core';
import {  ReactiveFormsModule } from '@angular/forms';


interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    imports: [ ReactiveFormsModule ]
})
export class DashboardComponent {

}
