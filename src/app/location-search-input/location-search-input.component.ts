import { Component, EventEmitter, Output, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable, debounceTime, distinctUntilChanged, filter, switchMap, tap, of } from 'rxjs';
import { OjpService } from '../ojp.service';
import { Location } from 'ojp-sdk';
import { AsyncPipe } from '@angular/common';

const MIN_CHARS = 2;

@Component({
  selector: 'app-location-search-input',
  standalone: true,
  imports: [ MatFormFieldModule, MatAutocompleteModule, MatInputModule, ReactiveFormsModule, AsyncPipe ],
  providers: [
    OjpService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationSearchInputComponent),
      multi: true,
    },
  ],
  templateUrl: './location-search-input.component.html',
  styleUrl: './location-search-input.component.scss'
})
export class LocationSearchInputComponent implements ControlValueAccessor {
  suggestions$: Observable<Location[]>;
  searchInput = new FormControl('');
  disabled = false;
  shouldSearch = true;
  value?: Location;
  locationsCache: { [ref: string]: Location } = {};
  ojpService =  inject(OjpService);
  @Output() selectedLocation = new EventEmitter<Location | null>();

  constructor() {
    this.suggestions$ = this.searchInput.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(() => this.shouldSearch),
      switchMap(term => this.searchJourneyPoint(term))
    );
  }

  searchJourneyPoint(term: string | null) {
    if (term !== null && term.length > MIN_CHARS) {
      return this.ojpService.searchJourneyPoints(term).pipe(
        tap(locations => {
          // This only works for "stops" not generic locations
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.locationsCache = locations.reduce((acc, next) => ({ ...acc, [next.stopPointRef!]: next }), {});
        })
      );
    }

    return of([]);
  }

  optionSelected(ev: MatAutocompleteSelectedEvent) {
    this.shouldSearch = false;
    const location = this.locationsCache[ev.option.value];

    if (location) {
      this.value = location;
      this.searchInput.setValue(location.computeLocationName());
      this._onChange(location);
    }
  }

  autocompleteOpened() {
    this.shouldSearch = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  _onChange = (_: any) => {};
  _onTouched = () => {};

  writeValue(value: Location): void {
    this.value = value;
    this.searchInput.setValue(value?.computeLocationName() ?? '');
  }

  /** Implemented as part of ControlValueAccessor. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    // this.cdr.detectChanges();
  }
}
