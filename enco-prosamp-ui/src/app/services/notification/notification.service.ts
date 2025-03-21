import {Injectable} from "@angular/core";
import {Subject} from "rxjs";


export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastMessage {
    title?: string;
    type?: ToastType;
}


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private toastSubject = new Subject<ToastMessage>();
    public toastMessages$ = this.toastSubject.asObservable();

    showSuccess(title: string ) {
        this.toastSubject.next({ title, type: 'success' });
    }

    showError( title: string ) {
        this.toastSubject.next({ title, type: 'danger' });
    }

    showInfo(title: string ) {
        this.toastSubject.next({ title, type: 'info' });
    }

    showWarning(title: string ) {
        this.toastSubject.next({ title, type: 'warning' });
    }


}
