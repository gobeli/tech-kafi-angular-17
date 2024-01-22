---
revealOptions:
  transition: slide
  markdown:
    breaks: true
---

<style>
  .fragment.blur {
    filter: blur(5px);
  }
  .fragment.blur.visible {
    filter: none;
  }
</style>


# Angluar 17
---

## News
  * Neuer control flow
  * Deferrable views
  * Signals stable
  * [angular.dev](https://angular.dev) / Neuer look
---

## Neuer control flow
  * Block-Template Syntax
  * Kein runtime footprint (wie bei `ngIf` etc)
    <!-- Transformed zur compile time -->
    <!-- Magically dissappearing -->
  * Besseres typechecking (narrowing)
  * Keine zusätzlichen imports nötig
    <!-- Nur relevant bei Standalone components, welche nicht CommonModule importieren. -->
    <!-- Diese müssen z.B. ngIf explizit als import auffüḧren -->
  * Bessere Performance
----
### NgIf
```html
<span *ngIf="show(); else oldTemplateSyntax">
  NgIf == true
</span>
<ng-template #oldTemplateSyntax>
  NgIf == false
</ng-template>
```

```html
@if (show()) {
  <span>if == true</span>
} @else {
  <span>if == false</span>
}
```
<!-- .element: class="fragment custom blur" -->

----

### NgSwitch
```html
<div [ngSwitch]="station()">
  <p *ngSwitchCase="'Bern'">ngSwitchCase Bern</p>
  <p *ngSwitchCase="'Thun'">ngSwitchCase Thun</p>
  <p *ngSwitchDefault>{{station()}}</p>
</div>
```

```html
@switch (station()) {
  @case ('Bern') {
    <p>case Bern</p>
  }
  @case ('Thun') {
    <p>case Thun</p>
  }
  @default {
    <p>{{station()}}</p>
  }
}
```
<!-- .element: class="fragment custom blur" -->
----
### NgFor
```html
<ul>
  <li *ngFor="let station of stations">NgFor {{station}}</li>
  <li *ngIf="stations.length === 0">No stations</li>
</ul>
```

<!-- Keine trackBy fn kann zu performance issues führen, deshalb nun required -->
<!-- Bessere diffing perf -->
```html
<ul>
  @for (station of stations; track $index) {
    <li>for {{station}}</li>
  } @empty {
    <li>No stations</li>
  }
</ul>
```
<!-- .element: class="fragment custom blur" -->

----

<!-- Automigration (nicht getestet von mir ;)  -->
```sh
ng generate @angular/core:control-flow
```
---

## Deferrable views

- Laden der Komponenten "aufschieben"
- Nur möglich mit standalone components

```html
@defer {
  <large-component />
}
```

----

### Placeholder
- Angezeigt bevor der deferred Block geladen wird
- Geswapped sobald der Block geladen wurde

```html
@defer {  
  <large-component />
} @placeholder {
  <div>Placeholder</div>
}
```
----

### Loading
- Angezeigt während der deferred Block geladen wird
- Geswapped sobald der Block geladen wurde
- `after` / `minimum` um flackern zu vermeiden

```html
@defer {  
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

----

### Error
- Wenn beim laden etwas schief geht

```html
@defer {  
  <large-component />
} @error {
  <p>Failed to load the component</p>
}
```

----

### Triggers
- `on` condition, wenn built-in triggers verwendet werden
- `when` für eine custom boolean expression 
- Können auch kombiniert werden
  - z.B. `@defer (on viewport; on timer(5s))` <!-- Wenn der Content in den viewport kommt ODER 5s verstreichen -->

----

### Built-in triggers
- on idle <!-- Default / sobald der Browser in einem "idle" state ist  -->
- on viewport <!-- Wenn der deferrte Block in den Viewport kommt -->
- on interaction <!-- Wenn mit einem spezifizierten Element interagiert wird (default placeholder) -->
- on hover <!-- Wenn über einem spezifizierten Element gehovered wird (default placeholder) -->
- on immediate <!-- Sofort nach dem Rendering der Komponente -->
- on timer <!-- Nach einer bestimmten Zeit -->

---
## Signals
- `signal()` stable
- Signal Inputs
- Kein zone.js in der Zukunft?



```js
@Input({ required: true }) state: string;
```

```ts
name = input.required<string>();
```

---

## Bonus: View Transitions
- Experimental
- [Browser API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) wird gebraucht 

```ts
bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(appRoutes, withViewTransitions())
    ]
  }
);
```
