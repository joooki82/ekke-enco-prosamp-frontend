import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective, ToasterComponent
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import {NotificationService} from "../../services/notification/notification.service";
import {ToastersComponent} from "../../shared/components/toasters/toasters.component";
import Keycloak from "keycloak-js";
import {UserService} from "../../services/user/user.service";
import {tap} from "rxjs/operators";

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
    ToastersComponent
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = [...navItems];

  constructor(private userService: UserService) {}


  ngOnInit(): void {
    this.userService.sync("syncUser").pipe(
      tap((response: any) => console.log("HTTP Status:", response?.status))
    ).subscribe({
      next: (data) => console.log("Data received:", data),
      error: (err) => console.error("Error occurred:", err),
      complete: () => console.log("Sync completed")
    });
  }

}
