import {Injectable, viewChild} from '@angular/core';
import {AppToastSampleComponent} from "../../shared/components/toasters/app-toast-sample/app-toast-sample.component";
import {ToasterComponent, ToasterPlacement} from "@coreui/angular";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toasterComponent: ToasterComponent | null = null;

  setToasterComponent(toaster: ToasterComponent) {
    this.toasterComponent = toaster;
  }

  showToast(options: {
    title?: string;
    color?: string;
    delay?: number;
    autohide?: boolean;
  }) {
    if (!this.toasterComponent) {
      console.warn('Toaster component not set.');
      return;
    }

    this.toasterComponent.addToast(AppToastSampleComponent, {
      title: options.title ?? 'Info',
      color: options.color ?? 'info',
      autohide: options.autohide ?? true,
      delay: options.delay ?? 5000,
      placement: ToasterPlacement.TopCenter
    });
  }

}
