import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { DropdownLinksComponent } from '../../components/dropdown-links/dropdown-links.component';
import { DOCUMENT } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { InventoryService } from '../../services/inventory.service';
import { ShopService } from '../../services/shop.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterOutlet, DropdownLinksComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  route = inject(ActivatedRoute);

  shopService = inject(ShopService);

  shopLinks: { name: string; url: string }[] = [
    {
      name: 'dispense',
      url: `sell`,
    },

    {
      name: 'create request',
      url: `create-requests`,
    },
    {
      name: 'issue requests',
      url: `issue-requests`,
    },

    {
      name: 'create purchase',
      url: `create-purchase`,
    },
    {
      name: 'receive purchase',
      url: `receive-purchase`,
    },
    {
      name: 'manage inventory',
      url: `manage-inventory`,
    },
  ];
  appLinks: { name: string; url: string }[] = [
    {
      name: 'home',
      url: `/home`,
    },

    {
      name: 'admin',
      url: `/admin`,
    },
  ];
  statisticsLinks: { name: string; url: string }[] = [
    { name: 'dispensed', url: '' },
    { name: 'purchases', url: 'purchases' },
    { name: 'requests', url: 'requests' },
    { name: 'received', url: 'received' },
    { name: 'inventories', url: 'inventories' },
  ];

  ngOnInit(): void {
    if (this.shopService.getCurrentUser() != undefined) {
      this.configStore();
    } else {
      this.shopService.logOut();
    }
  }
  configStore() {
    // sets universal store name and id

    const { store_name, store_id } = this.getStoreConfig();
    this.shopLinks = this.shopLinks.map((link) => {
      if (link.url == '')
        return { ...link, url: `/shop/${store_name}/${store_id}` };
      return { ...link, url: `/shop/${store_name}/${store_id}/${link.url}` };
    });
    // statistics base url
    const base_url = `/shop/${store_name}/${store_id}/statistics`;
    this.statisticsLinks = this.statisticsLinks.map((link) => {
      if (link.url == '') return { ...link, url: base_url };
      return { ...link, url: `${base_url}/${link.url}` };
    });
    this.shopService.setCurrentStore({ store_name, store_id });

    this.shopService.storeConfig.update((s) => ({
      ...s,
      store_name,
      store_id,
    }));

    // console.log(store_id, store_name);
  }
  getStoreConfig() {
    const store = {
      store_name: this.route.snapshot.paramMap.get('name') as string,
      store_id: this.route.snapshot.paramMap.get('id') as string,
    };
    this.shopService.setCurrentStore(store);
    return store;
  }
}
