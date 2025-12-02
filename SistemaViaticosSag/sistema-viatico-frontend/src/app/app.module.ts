import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; 
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar'; // 🚀 Importación del SnackBar

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAEuN6Js4QasOkyPxrw-N3oupvNq0bAn5A",
  authDomain: "sag-viaticos.firebaseapp.com",
  projectId: "sag-viaticos",
  storageBucket: "sag-viaticos.firebasestorage.app",
  messagingSenderId: "620345640262",
  appId: "1:620345640262:web:01efe3abdd67a9e8fc5147",
  measurementId: "G-7CYRQBL1GQ"
};

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'; 
import { SidebarmovilComponent } from './sidebarmovil/sidebarmovil.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarmovilComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,     
    BrowserAnimationsModule,
    
    // 🌟 INICIALIZACIÓN DE FIREBASE
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    
    // Módulos de Angular Material
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    MatSnackBarModule // 🚀 Se agrega el módulo del SnackBar
  ],
  providers: [], 
  bootstrap: [AppComponent]
})
export class AppModule { }
