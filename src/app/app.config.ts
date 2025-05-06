import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideHttpClient(withFetch()),
    provideRouter(routes),
    provideMomentDateAdapter({
      parse: {
        dateInput: ['DD-MM-YYYY'],
      },
      display: {
        dateInput: 'DD-MM-YYYY',
        monthLabel: undefined,
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
        timeInput: undefined,
        timeOptionLabel: undefined
      }
    })
  ]
};
