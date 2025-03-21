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
    fade?: boolean;
    placement?: ToasterPlacement;
  }) {
    if (!this.toasterComponent) {
      console.warn('Toaster component not set.');
      return;
    }

    const props: any = {
      title: options.title ?? 'Info',
      color: options.color ?? 'success',
      autohide: options.autohide ?? true,
      delay: options.delay ?? 5000,
      fade: options.fade ?? true,
      placement: options.placement ?? ToasterPlacement.TopCenter,
      visible: true
    };

    // Proper invocation using explicit typing or casting to any:
    this.toasterComponent.addToast(
        AppToastSampleComponent,
        props,  // ✅ Pass everything explicitly here
        {}      // Leave the third parameter empty
    );
  }
}
