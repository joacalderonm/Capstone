import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from '../user/user.component';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
    selector: 'app-sidebarmovil',
    imports: [CommonModule],
    templateUrl: './sidebarmovil.component.html',
    styleUrl: './sidebarmovil.component.css'
})


export class SidebarmovilComponent {
  user$: Observable<User | null>;
  userRol: string | null = null;
  usuarioNombre: string | null = null;
  sidebarVisible: boolean = false;

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.user$ = this.authService.user$;
    this.cargarDatosUsuario();
    this.user$.subscribe(() => {
      this.cargarDatosUsuario();
    });
  }

  cargarDatosUsuario(): void {
    const datos = localStorage.getItem('usuarioDatos');
    if (datos) {
      const usuario = JSON.parse(datos);
      this.usuarioNombre = `${usuario.nombre_usuario} ${usuario.apellido_paterno}`;
      this.userRol = usuario.nombre_rol;
    } else {
      this.usuarioNombre = null;
      this.userRol = null;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  logout(): void {
    this.authService.logout();
  }

  openUserModal() {
    this.dialog.open(UserComponent, {
      width: '400px',
      // Puedes agregar más configuraciones del modal aquí
    });
  }
}
