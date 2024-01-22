import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-deferred',
  standalone: true,
  imports: [],
  templateUrl: './deferred.component.html',
  styleUrl: './deferred.component.scss'
})
export class DeferredComponent {
  @Input() oldInput?: string;
  state = input.required<'idle' | 'loading'>();
}
