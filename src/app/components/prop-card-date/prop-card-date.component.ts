import { CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'prop-card-date',
  standalone: true,
  imports: [],
  templateUrl: './prop-card-date.component.html',
  styleUrl: './prop-card-date.component.scss',
})
export class PropCardDateComponent {
  @Input() title!: string;
  @Input() color!: string;
  @Input() content!: string;

  ngOnInit() {}
}
