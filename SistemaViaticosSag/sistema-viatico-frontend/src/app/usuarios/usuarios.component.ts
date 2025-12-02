import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { ApiService } from '../services/api.service';
import { BackendUser, UsuarioEditForm } from '../interfaces/backend-user';
import { FirebaseUser } from '../interfaces/firebase-user';
import { MatDialog } from '@angular/material/dialog';
import { NewUserComponent } from '../new-user/new-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { LoadingComponent } from '../components/loading/loading.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  // Segunda tabla: columnas y datos desde backend
  displayedColumnsBackend: string[] = [
    'nombre_completo', 'rut', 'correo', 'rol', 'estado', 'opciones'
  ];
  dataSourceBackend: BackendUser[] = [];
  filteredBackend: BackendUser[] = [];
  selectedRol: string = '';
  selectedEstado: string = '';

  getNombreCompleto(user: BackendUser): string {
    return `${user.nombre_usuario} ${user.apellido_paterno} ${user.apellido_materno || ''}`.trim();
  }

  getRolName(id_rol: number): string {
    switch (id_rol) {
      case 1: return 'Administrador';
      case 2: return 'Supervisor';
      case 3: return 'Empleado';
      default: return 'Desconocido';
    }
  }

  displayedColumnsUsuarios: string[] = [
    'email', 'displayName', 'rol', 'disabled', 'opciones'
  ];
  dataSourceUsuarios: FirebaseUser[] = [];
  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private usuariosService: UsuariosService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerUsuariosBackend();
  }

  obtenerUsuariosBackend(): void {
    this.apiService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.dataSourceBackend = usuarios;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios del backend:', err);
        this.isLoading = false;
      }
    });
  }

  onRoleFilterChange(value: string): void {
    this.selectedRol = value;
    this.applyFilters();
  }

  onStatusFilterChange(value: string): void {
    this.selectedEstado = value;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredBackend = this.dataSourceBackend.filter(user => {
      const roleMatch = !this.selectedRol ||
        (this.selectedRol === 'admin' && user.nombre_rol === 'Administrador') ||
        (this.selectedRol === 'supervisor' && user.nombre_rol === 'Supervisor') ||
        (this.selectedRol === 'usuario' && user.nombre_rol === 'Empleado');

      const statusMatch = !this.selectedEstado ||
        (this.selectedEstado === 'activo' && user.activo) ||
        (this.selectedEstado === 'inactivo' && !user.activo);

      return roleMatch && statusMatch;
    });
  }

  obtenerUsuarios(): void {
    this.isLoading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.dataSourceUsuarios = usuarios;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
        this.isLoading = false;
      }
    });
  }

  crearUsuario(): void {
    const dialogRef = this.dialog.open(NewUserComponent, {
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((datosUsuario) => {
      if (datosUsuario) {
        this.agregarUsuario(datosUsuario);
      }
    });
  }

  agregarUsuario(datos: any): void {
    this.isLoading = true;
    // Preparar payload para backend (ahora incluye password)
    const backendPayload = {
      password: datos.password,
      id_rol: datos.rol,
      id_unidad: datos.unidad,
      id_region: datos.region,
      id_calidad_juridica: datos.calidadJuridica,
      id_grado: datos.gradoEu,
      nombre_usuario: datos.nombre,
      apellido_paterno: datos.apellidoPaterno,
      apellido_materno: datos.apellidoMaterno,
      rut_numero: Number(datos.rutNumero),
      rut_dv: datos.rutDv.toLowerCase(),
      correo: datos.correo
    };
    // Mostrar en consola el formato y tipo de cada campo
    console.log('Datos enviados al backend:', backendPayload);
    Object.entries(backendPayload).forEach(([key, value]) => {
      console.log(`${key}:`, value, 'Tipo:', typeof value);
    });
    this.apiService.createUsuario(backendPayload).subscribe({
      next: () => {
        this.obtenerUsuariosBackend();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al crear usuario en backend:', err);
        this.isLoading = false;
      }
    });
  }

  toggleUsuarioEstado(user: BackendUser): void {
    const nuevoEstado = !user.activo;
    this.apiService.updateUsuarioEstado(user.id_usuario, nuevoEstado).subscribe({
      next: () => {
        user.activo = nuevoEstado;
        this.applyFilters(); // Reaplicar filtros después del cambio
      },
      error: (err) => {
        console.error('Error al cambiar estado del usuario:', err);
      }
    });
  }

  editarUsuario(user: BackendUser): void {
    this.isLoading = true;
    this.cdr.detectChanges(); // Forzar detección de cambios para evitar ExpressionChangedAfterItHasBeenCheckedError
    this.apiService.getUsuarioParaEditar(user.id_usuario).subscribe({
      next: (usuarioEditForm: UsuarioEditForm) => {
        this.isLoading = false;
        // Agregar el id_usuario faltante a la respuesta del backend
        usuarioEditForm.id_usuario = user.id_usuario;
        const dialogRef = this.dialog.open(EditUserComponent, {
          width: '800px',
          disableClose: true,
          data: { user: usuarioEditForm }
        });

        dialogRef.afterClosed().subscribe((datosUsuario) => {
          if (datosUsuario) {
            this.actualizarUsuario(datosUsuario);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener datos para editar usuario:', err);
        this.isLoading = false;
      }
    });
  }

  actualizarUsuario(datos: any): void {
    this.isLoading = true;
    console.log('Payload a enviar:', datos); // Debug
    this.apiService.updateUsuario(datos.id_usuario, datos).subscribe({
      next: (usuarioActualizado) => {
        // Recargar la lista completa para asegurar que todos los campos estén actualizados
        this.obtenerUsuariosBackend();
        // El loading se maneja en obtenerUsuariosBackend
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.isLoading = false;
      }
    });
  }

}