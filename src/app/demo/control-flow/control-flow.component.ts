import { NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control-flow',
  standalone: true,
  imports: [NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgFor, FormsModule],
  templateUrl: './control-flow.component.html',
  styleUrl: './control-flow.component.scss'
})
export class ControlFlowComponent {
  show = signal(true);
  station = signal('');
  stations = [
    'Bern', 'Thun', 'Spiez'
  ]

  toggle() {
    this.show.update(s => !s);
  }
}
