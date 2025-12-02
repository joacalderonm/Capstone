import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarmovilComponent } from './sidebarmovil/sidebarmovil.component';


import { LoadingComponent } from './components/loading/loading.component'; 
import { LoadingService } from './services/loading.service';


@Component({
    selector: 'app-root',
    // ✨ 2. Asegúrate de que el componente sea 'standalone' y añade LoadingComponent a los imports
    standalone: true, 
    imports: [
        RouterOutlet, 
        SidebarComponent, 
        CommonModule, 
        FooterComponent, 
        SidebarmovilComponent,
        LoadingComponent // ✨ Añádelo aquí
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SAGViaticosFrontend';
  show: boolean = true;

  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events.subscribe(event => {
      // Mostrar/ocultar loading según el evento de navegación
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.hide();
      }
      this.checkRoute();
    });
  }

  checkRoute() {
    if (this.router.url === '/login') {
      this.show = false;
    } else {
      this.show = true;
    }
  }
}