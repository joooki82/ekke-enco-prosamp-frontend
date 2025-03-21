import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Toast} from "../../shared/components/toasters/app-toast-sample/toast.model";


@Injectable({ providedIn: 'root' })

export class NotificationService {
  private toasts: Toast[] = [];
  private toastSubject = new Subject<Toast[]>();
  toastUpdates$ = this.toastSubject.asObservable();
  private idCounter = 0;

  showToast(type: Toast['type'], message: string, duration = 5000) {
    const toast: Toast = {
      id: ++this.idCounter,
      type,
      message,
      duration
    };
    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);
    console.log('Toast:', toast);
    setTimeout(() => this.removeToast(toast.id), duration);
  }

  removeToast(id: number) {
    console.log(`Removing toast with ID ${id}`);
    this.toasts = this.toasts.filter(t => t.id !== id);
    console.log('Remaining toasts after removal:', this.toasts);
    this.toastSubject.next([...this.toasts]);  // 🛠 Emit new array reference
  }

}
