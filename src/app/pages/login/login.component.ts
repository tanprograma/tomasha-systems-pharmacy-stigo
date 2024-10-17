import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { User } from '../../interfaces/user';
import { Store } from '../../interfaces/store';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  shopService = inject(ShopService);
  appID = inject(PLATFORM_ID);
  formBuilder = inject(FormBuilder);
  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  ngOnInit(): void {
    if (isPlatformBrowser(this.appID)) {
      const store = sessionStorage.getItem('store');
      const user = sessionStorage.getItem('user');
      if (store != null && user != null) {
        this.customRedirect(JSON.parse(user), JSON.parse(store));
      }
    }
  }
  login() {
    const user: User = {
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? '',
    };

    this.shopService.login(user).subscribe((res) => {
      if (res.status) {
        const user = res.result as User;
        this.shopService.setCurrentUser(user);
        this.redirectToStore(user);
      }
      // this.shopService.router.navigate(['/home']);
    });
  }
  customRedirect(user: User, store: Store | undefined) {
    if (
      user.email == 'mainclinic' ||
      user.email == 'eliezermnada@gmail.com' ||
      store == undefined
    ) {
      this.shopService.router.navigate(['/home']);
      return;
    }
    if (store != undefined) {
      this.shopService.router.navigate(['/shop', store.name, store._id]);
    }
  }
  redirectToStore(user: User) {
    this.shopService.getStores().subscribe((stores) => {
      const store = this.findStore(user.email, stores);

      this.customRedirect(user, store);
    });
  }
  findStore(email: string, stores: Store[]) {
    return stores.find((store) => {
      return store.name == email;
    });
  }
}
