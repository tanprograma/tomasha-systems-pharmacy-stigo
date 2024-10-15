import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  signal,
  PLATFORM_ID,
} from '@angular/core';

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { Store } from './interfaces/store';
import { ShopService } from './services/shop.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  document = inject(DOCUMENT);

  // route=inject(ActivatedRoute)
  title = 'HARDWARE';

  ngOnInit(): void {}
}
