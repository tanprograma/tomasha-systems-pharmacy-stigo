import { AsyncPipe, DOCUMENT } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, RouterOutlet, AsyncPipe, DropdownLinksComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  document = inject(DOCUMENT);
  shopService = inject(ShopService);
  createLinks = [
    { url: '/admin/create-unit', name: 'unit' },
    { url: '/admin/create-category', name: 'category' },
    { url: '/admin/create-product', name: 'product' },
    { url: '/admin/create-store', name: 'store' },
    { url: '/admin/create-inventory', name: 'inventory' },
    { url: '/admin/create-supplier', name: 'supplier' },
    { url: '/admin/create-users', name: 'users' },
    { url: '/admin/expired', name: 'expired' },
  ];
  appLinks = [
    { url: '/admin', name: 'admin' },
    { url: '/home', name: 'home' },
  ];

  ngOnInit(): void {
    this.authenticate();
  }
  authenticate() {
    const user = this.shopService.getCurrentUser();
    if (user != undefined && user.role == 'admin') {
      return;
    } else {
      this.shopService.logOut();
    }
  }
}
