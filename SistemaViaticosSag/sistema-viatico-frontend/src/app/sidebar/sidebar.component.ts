
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../user/user.component';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  user$: Observable<User | null>;
  userRol: string | null = null;
  usuarioNombre: string | null = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
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

  openUserModal() {
    this.dialog.open(UserComponent, {
      width: '400px',
      // Puedes agregar más configuraciones del modal aquí
    });
  }

  logout(): void {
    this.authService.logout();
    this.limpiarLocalStorage();
  }

  limpiarLocalStorage(): void {
    localStorage.clear();
  }
}
