import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-new-subrogante',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, SelectModule, ButtonModule],
  templateUrl: './new-subrogante.component.html',
  styleUrl: './new-subrogante.component.css'
})
export class NewSubroganteComponent implements OnInit {
  subroganteForm!: FormGroup;
  usuarios: { value: number, label: string }[] = [];

  constructor(
    private dialogRef: MatDialogRef<NewSubroganteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idUnidad: number },
    private apiService: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarUsuariosNoSubrogantes();
  }

  initForm(): void {
    this.subroganteForm = this.fb.group({
      usuario: [null, Validators.required]
    });
  }

  cargarUsuariosNoSubrogantes(): void {
    this.apiService.getUsuariosUnidad(this.data.idUnidad).subscribe({
      next: (usuarios: any[]) => {
        this.usuarios = usuarios
          .filter(usuario => usuario.es_subrogante === false)
          .map(usuario => ({
            value: usuario.id_usuario,
            label: usuario.nombre_usuario
          }));
      },
      error: (error) => {
        console.error('Error al cargar usuarios no subrogantes:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.subroganteForm.valid) {
      const idUsuario = this.subroganteForm.value.usuario;
      this.apiService.updateSubrogante(idUsuario, true).subscribe({
        next: () => {
          console.log('Usuario convertido a subrogante exitosamente');
          this.dialogRef.close(true); // Cerrar con éxito
        },
        error: (error) => {
          console.error('Error al convertir a subrogante:', error);
          alert('Error al agregar el subrogante. Por favor, inténtelo nuevamente.');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string): string {
    const field = this.subroganteForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
    }
    return '';
  }
}
