import { Component, Input } from '@angular/core';
import { Toast } from './toast.model';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./toast.styles.scss']
})
export class ToastComponent {
  @Input() toast!: Toast;
}
