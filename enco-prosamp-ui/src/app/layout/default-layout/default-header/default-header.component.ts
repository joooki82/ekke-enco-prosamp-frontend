import { NgTemplateOutlet } from '@angular/common';
import {Component, computed, inject, input, OnInit} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import Keycloak, {KeycloakProfile} from "keycloak-js";
import {NotificationService} from "../../../services/notification/notification.service";

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit {

  private readonly keycloak = inject(Keycloak);
  public userProfile: KeycloakProfile | null = null;
  public userName: String | undefined = undefined;

  constructor(private notification: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.keycloak.loadUserProfile().then(profile => {
      this.userProfile = profile;
      this.userName = this.userProfile?.username;
      console.log(this.userName);
    }).catch(error => {
      this.notification.showError(error);
    });
  }

  sidebarId = input('sidebar1');


  logout() {
    this.keycloak.logout();
  }

}
