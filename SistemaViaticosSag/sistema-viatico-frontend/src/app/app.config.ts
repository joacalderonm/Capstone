import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';

// Importaciones de Firebase y AngularFire
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth'; 

import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura'; 


import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './interceptors/loading.interceptor';



// Objeto de configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAEuN6Js4QasOkyPxrw-N3oupvNq0bAn5A",
  authDomain: "sag-viaticos.firebaseapp.com",
  projectId: "sag-viaticos",
  storageBucket: "sag-viaticos.firebasestorage.app",
  messagingSenderId: "620345640262",
  appId: "1:620345640262:web:01efe3abdd67a9e8fc5147",
  measurementId: "G-7CYRQBL1GQ"
};

const CustomAura = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e7f0ff',
      100: '#c2d9ff',
      200: '#9ec2ff',
      300: '#7aacff',
      400: '#5795ff',
      500: '#337eff',
      600: '#0D6EFD',
      700: '#0b5ed7',
      800: '#094ead',
      900: '#073e84',
      950: '#042a59',
    },
  },
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),     
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()), 

    provideAnimationsAsync(),
    provideAnimations(),
    // Angular Material
    importProvidersFrom(MatDialogModule),
    providePrimeNG({
      theme: {
        preset: CustomAura,
        options: {
          prefix: 'p',
          darkModeSelector: false,
          cssLayer: false,
        },
      },
    })
  ]
};