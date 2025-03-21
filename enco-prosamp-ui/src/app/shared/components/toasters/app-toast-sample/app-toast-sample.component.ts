import {Component, forwardRef, Input} from '@angular/core';
import {
  ProgressComponent,
  ToastBodyComponent, ToastCloseDirective,
  ToastComponent,
  ToastHeaderComponent
} from "@coreui/angular";
import {ToastSampleIconComponent} from "./toast-sample-icon.component";


@Component({
  selector: 'app-app-toast-sample',
  imports: [
    ToastHeaderComponent,
    ToastSampleIconComponent,
    ToastBodyComponent,
    ProgressComponent,
    ToastSampleIconComponent,
    ToastCloseDirective
  ],
  providers: [{ provide: ToastComponent, useExisting: forwardRef(() => AppToastSampleComponent) }],
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
