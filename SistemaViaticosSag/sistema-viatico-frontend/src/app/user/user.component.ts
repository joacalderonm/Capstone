import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { BackendUser } from '../interfaces/backend-user';

@Component({
  selector: 'app-user',
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['key', 'value'];
  dataSource: { key: string, value: string }[] = [];

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.apiService.getUsuarioByFirebaseUid(user.uid).subscribe({
          next: (usuario: BackendUser) => {
            this.dataSource = [
              { key: 'Nombre', value: `${usuario.nombre_usuario} ${usuario.apellido_paterno}` },
              { key: 'RUT', value: usuario.rut_completo || '' },
              { key: 'Región', value: usuario.nombre_region || '' },
              { key: 'Unidad', value: usuario.nombre_unidad || '' },
              { key: 'Calidad Jurídica', value: usuario.tipo || '' },
              { key: 'Rol', value: usuario.nombre_rol || '' }
            ];
          },
          error: (error) => {
            console.error('Error al obtener usuario:', error);
          }
        });
      }
    });
  }
}