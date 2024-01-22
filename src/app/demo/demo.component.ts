import { Component, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { DeferredComponent } from './deferred/deferred.component';
import { TripSearchFormComponent } from '../trip-search-form/trip-search-form.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [FormsModule, DeferredComponent, MatProgressSpinnerModule, TripSearchFormComponent, MatButtonModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent {
  state = signal<'idle' | 'loading'>('idle')
}
