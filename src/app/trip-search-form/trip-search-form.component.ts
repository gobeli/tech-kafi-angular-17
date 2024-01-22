import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Trip, TripLocationPoint, Location } from 'ojp-sdk';
import { Observable, filter, finalize, switchMap } from 'rxjs';
import { OjpService } from '../ojp.service';
import { LocationSearchInputComponent } from '../location-search-input/location-search-input.component';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-trip-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, LocationSearchInputComponent, AsyncPipe, DatePipe, MatCardModule, RouterModule, MatProgressSpinnerModule],
  providers: [OjpService],
  templateUrl: './trip-search-form.component.html',
  styleUrl: './trip-search-form.component.scss'
})
export class TripSearchFormComponent {
  ojpService = inject(OjpService);
  trips$: Observable<Trip[]>;
  loading = signal(false);

  searchTimetable = new FormGroup({
    from: new FormControl<Location | null>(null, Validators.required),
    to: new FormControl<Location | null>(null, Validators.required),
  });

  constructor(
  ) {
    this.trips$ = this.searchTimetable.valueChanges.pipe(
      filter(() => this.searchTimetable.valid),
      switchMap(() => this.searchTrip(this.searchTimetable.value))
    );
  }

  searchTrip(form: typeof this.searchTimetable.value) {
    const date = new Date();
    this.loading.set(true);

    return this.ojpService
        .searchTrips(
          new TripLocationPoint(form.from!),
          new TripLocationPoint(form.to!),
          date
        ).pipe(
          finalize(() => this.loading.set(false))
        )
  }
}
