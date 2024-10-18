import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'prop-card-action',
  standalone: true,
  imports: [],
  templateUrl: './prop-card-action.component.html',
  styleUrl: './prop-card-action.component.scss',
})
export class PropCardActionComponent {
  @Input() title?: string;
  @Input() content!: string;
  @Output() onClick = new EventEmitter<boolean>();
  action() {
    this.onClick.emit(true);
  }
}
