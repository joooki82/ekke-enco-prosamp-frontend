import {Component, Input} from '@angular/core';
import {
  ProgressComponent,
  ToastBodyComponent,
  ToastCloseDirective,
  ToastComponent,
  ToastHeaderComponent
} from "@coreui/angular";
import {
  ToastSampleIconComponent
} from "../../../../views/notifications/toasters/toast-simple/toast-sample-icon.component";

@Component({
  selector: 'app-app-toast-sample',
  imports: [
    ToastHeaderComponent,
    ToastSampleIconComponent
  ],
  templateUrl: './app-toast-sample.component.html',
  styleUrl: './app-toast-sample.component.scss'
})
export class AppToastSampleComponent extends ToastComponent {
  constructor() {
    super();
  }

  @Input() closeButton = true;
  @Input() title = '';
}
