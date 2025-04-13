import {Component, OnDestroy, OnInit, QueryList, viewChild, ViewChild, ViewChildren} from '@angular/core';
import {NotificationService, ToastMessage} from "../../../services/notification/notification.service";
import {Subscription} from "rxjs";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  TextColorDirective,
  ToastBodyComponent,
  ToastComponent,
  ToasterComponent,
  ToasterPlacement,
  ToastHeaderComponent
} from "@coreui/angular";
import {ReactiveFormsModule} from "@angular/forms";
import {AppToastSampleComponent} from "./app-toast-sample/app-toast-sample.component";

@Component({
  selector: 'app-toasters',
  imports: [ReactiveFormsModule, ToasterComponent],
  templateUrl: './toasters.component.html',
  styleUrl: './toasters.component.scss'
})
export class ToastersComponent implements OnInit, OnDestroy {

  position = ToasterPlacement.TopEnd;

  @ViewChild(ToasterComponent) toaster?: ToasterComponent;

  private subscription!: Subscription;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.toastMessages$
      .subscribe((toast: ToastMessage) => this.addToast(toast));
  }

  private addToast(toast: ToastMessage) {
    const toastConfig = {
      title: toast.title ?? 'Notification',
      color: "success",
      delay: 5000,
      autohide: true,
      visible: true,
    };
    console.log('toastConfig:', toastConfig);
    const componentRef = this.toaster?.addToast(AppToastSampleComponent, toastConfig, {});
    if (componentRef) {
      componentRef.instance['closeButton'] = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
