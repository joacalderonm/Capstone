import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

// Importación del componente loading
import { LoadingComponent } from '../components/loading/loading.component';

@Component({
  selector: 'app-new-unidad',
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
  templateUrl: './new-unidad.component.html',
  styleUrls: ['./new-unidad.component.css']
})
export class NewUnidadComponent implements OnInit {
  unidadForm!: FormGroup;
  tituloFormulario: string = 'Crear Unidad';

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewUnidadComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.unidadForm = this.fb.group({
      codigo_unidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      nombre_unidad: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      activo: [true, Validators.required]
    });
  }


  guardarUnidad(): void {
    if (this.unidadForm.valid) {
      const datos = this.unidadForm.value;
      const payload = {
        codigo_unidad: datos.codigo_unidad,
        nombre_unidad: datos.nombre_unidad,
        activo: datos.activo
      };

      this.dialogRef.close(payload);
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