import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TransactionItem } from '../../interfaces/transaction-item';
import { ShopService } from '../../services/shop.service';
import { PropCardComponent } from '../prop-card/prop-card.component';
export interface ReceivedItem {
  date: string;
  src: string;
  destination: string;
  item: string;
  unit: string;
  quantity: number;
}
@Component({
  selector: 'received-info',
  standalone: true,
  imports: [PropCardComponent],
  templateUrl: './received-info.component.html',
  styleUrl: './received-info.component.scss',
})
export class ReceivedInfoComponent {
  @Input() items!: ReceivedItem[];
  parseString(item: number) {
    return `${item}`;
  }
}
