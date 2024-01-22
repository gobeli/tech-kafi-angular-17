import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Trip, TripTimedLeg } from 'ojp-sdk';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [RouterModule, MatCardModule, AsyncPipe, DatePipe],
  templateUrl: './trip.component.html',
  styleUrl: './trip.component.scss'
})
export class TripComponent {
  activatedRoute = inject(ActivatedRoute);
  legs$: Observable<TripTimedLeg[]>;

  constructor() {
    /**
     * This is not a good way to do this, find a way to serialize a trip
     */
    this.legs$ = this.activatedRoute.paramMap
      .pipe(
        map(() => (window.history.state as Trip).legs?.filter(leg => leg.legType === 'TimedLeg') as TripTimedLeg[]),
      )
  }
}
