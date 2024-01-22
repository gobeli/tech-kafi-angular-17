import { Injectable } from '@angular/core';
import { LocationInformationRequest, JourneyRequestParams, TripLocationPoint, JourneyRequest, Trip, StageConfig } from 'ojp-sdk';
import { from, of, Observable } from 'rxjs';


const app_stages: StageConfig = {
  key: 'PROD',
  apiEndpoint: 'https://api.opentransportdata.swiss/ojp2020',
  authBearerKey:
    'eyJvcmciOiI2NDA2NTFhNTIyZmEwNTAwMDEyOWJiZTEiLCJpZCI6Ijk0YTFhNjExYjM5ZjQ4MWNiMGI5MjFiNTgyNmM1ZGFjIiwiaCI6Im11cm11cjEyOCJ9',
};

@Injectable({ providedIn: 'root' })
export class OjpService {
  searchJourneyPoints(term: string) {
    return from(LocationInformationRequest.initWithLocationName(app_stages, term, 'stop').fetchResponse());
  }

  searchTrips(from: TripLocationPoint, to: TripLocationPoint, date: Date) {

    const requestParams = JourneyRequestParams.initWithLocationsAndDate(
      from,
      to,
      [],
      ['monomodal'],
      ['public_transport'],
      date
    );
    if (!requestParams) {
      return of([]);
    }
    requestParams.includeLegProjection = false;

    const request = new JourneyRequest(app_stages, requestParams);
    return new Observable<Trip[]>(subscriber => {
      const aborter = new AbortController();
      // Add abort signal to request as soon as it's possible
      request.fetchResponse((response, error) => {
        if (error) {
          subscriber.error(error);
        } else {
          subscriber.next(response);
        }
        subscriber.complete();
      });

      return () => aborter.abort();
    });
  }
}
