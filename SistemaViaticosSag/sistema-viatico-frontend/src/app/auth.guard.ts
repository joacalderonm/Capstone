import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }
        // Obtener datos del usuario desde localStorage
        const datos = localStorage.getItem('usuarioDatos');
        let rol = 'Empleado';
        if (datos) {
          const usuario = JSON.parse(datos);
          rol = usuario.nombre_rol || 'Empleado';
        }
        const path = route.routeConfig?.path;

        // Lógica de acceso por rol
        if (rol === 'Administrador') {
          if ([
            'home',
            'supervision',
            'listado',
            'historial',
            'usuarios',
            'administracion',
            'planilla',
            '**',
            ''
          ].includes(path || '')) {
            return true;
          }
          return this.router.createUrlTree(['/home']);
        }
        if (rol === 'Supervisor') {
          if ([
            'home',
            'supervision',
            'listado',
            'historial',
            'planilla',
            '**',
            ''
          ].includes(path || '')) {
            return true;
          }
          return this.router.createUrlTree(['/home']);
        }
        // Empleado
        if ([
          'home',
          'listado',
          'planilla',
          '**',
          ''
        ].includes(path || '')) {
          return true;
        }
        return this.router.createUrlTree(['/home']);
      })
    );
  }
}