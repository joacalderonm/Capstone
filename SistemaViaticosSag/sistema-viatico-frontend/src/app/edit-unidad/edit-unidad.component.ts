import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

// Importación del componente loading
import { LoadingComponent } from '../components/loading/loading.component';

export interface UnidadData {
  id_unidad: number;
  codigo_unidad: string;
  nombre_unidad: string;
  descripcion?: string;
  id_jefe?: number;
}

@Component({
  selector: 'app-edit-unidad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    LoadingComponent
  ],
  templateUrl: './edit-unidad.component.html',
  styleUrls: ['./edit-unidad.component.css']
})
export class EditUnidadComponent implements OnInit {
  unidadForm!: FormGroup;
  tituloFormulario: string = 'Editar Unidad';
  usuariosJefes: any[] = [];
  private currentActivo: boolean = false;

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUnidadComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { unidad: UnidadData }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUnidadData();
  }

  private initForm(): void {
    this.unidadForm = this.fb.group({
      codigo_unidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      nombre_unidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      activo: [true, Validators.required],
      id_jefe: [null]
    });
  }

  private loadUnidadData(): void {
    this.apiService.getUnidadById(this.data.unidad.id_unidad).subscribe({
      next: (unidad) => {
        this.currentActivo = unidad.activo;
        this.unidadForm.patchValue({
          codigo_unidad: unidad.codigo_unidad,
          nombre_unidad: unidad.nombre_unidad,
          activo: unidad.activo,
          id_jefe: unidad.id_jefe
        });
        // Cargar usuarios de la unidad para el select de jefe
        this.loadUsuariosJefes();
      },
      error: (error) => {
        console.error('Error al cargar unidad:', error);
      }
    });
  }

  private loadUsuariosJefes(): void {
    this.apiService.getUsuariosUnidad(this.data.unidad.id_unidad).subscribe({
      next: (usuarios) => {
        this.usuariosJefes = usuarios.map(user => ({
          value: user.id_usuario,
          label: user.nombre_usuario
        }));
      },
      error: (error) => {
        console.error('Error al cargar usuarios jefes:', error);
      }
    });
  }

  guardarUnidad(): void {
    if (this.unidadForm.valid) {
      const datos = this.unidadForm.value;
      const updateData: any = {};

      if (datos.codigo_unidad !== undefined) {
        updateData.codigo_unidad = datos.codigo_unidad;
      }
      if (datos.nombre_unidad !== undefined) {
        updateData.nombre_unidad = datos.nombre_unidad;
      }
      if (datos.activo !== undefined) {
        updateData.activo = datos.activo;
      }
      if (datos.id_jefe !== undefined) {
        updateData.id_jefe = datos.id_jefe;
      }

      this.apiService.updateUnidad(this.data.unidad.id_unidad, updateData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar unidad:', err);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.unidadForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.unidadForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}