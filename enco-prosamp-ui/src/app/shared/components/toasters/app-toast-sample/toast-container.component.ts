import { Component, OnInit } from '@angular/core';
import { Toast } from './toast.model';
import {ToastComponent} from "./toast.component";
import {NotificationService} from "../../../../services/notification/notification.service";
import {NgForOf} from "@angular/common";
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  imports: [
    ToastComponent,
    NgForOf
  ],
  styleUrls: ['./toast.styles.scss']
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: NotificationService,
              private cdr: ChangeDetectorRef) {
    console.log('NotificationService instance in ToastContainerComponent:', toastService);
  }

  ngOnInit() {
    this.toastService.toastUpdates$.subscribe(toasts => {
      console.log('Received toasts:', toasts);
      this.toasts = [...toasts];  // 🛠 Ensure new array reference
      this.cdr.detectChanges();   // 🛠 Force UI update
    });
  }
}

