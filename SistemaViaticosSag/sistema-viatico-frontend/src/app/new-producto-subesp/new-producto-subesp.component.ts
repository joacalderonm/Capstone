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
  selector: 'app-new-producto-subesp',
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
  templateUrl: './new-producto-subesp.component.html',
  styleUrls: ['./new-producto-subesp.component.css']
})
export class NewProductoSubespComponent implements OnInit {
  productoForm!: FormGroup;
  tituloFormulario: string = 'Crear Producto Específico';

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewProductoSubespComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      codigo_subesp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      descripcion: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      activo: [true, Validators.required]
    });
  }

  guardarProducto(): void {
    if (this.productoForm.valid) {
      const datos = this.productoForm.value;
      const payload = {
        codigo_subesp: datos.codigo_subesp,
        descripcion: datos.descripcion,
        activo: datos.activo
      };

      this.dialogRef.close(payload);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.productoForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.productoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
