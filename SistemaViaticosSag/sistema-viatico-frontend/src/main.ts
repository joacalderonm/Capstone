
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideFunctions(() => getFunctions()),
  ]
})
  .catch((err) => console.error(err));
