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
  selector: 'app-new-cuenta-presupuestaria',
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
  templateUrl: './new-cuenta-presupuestaria.component.html',
  styleUrls: ['./new-cuenta-presupuestaria.component.css']
})
export class NewCuentaPresupuestariaComponent implements OnInit {
  cuentaForm!: FormGroup;
  tituloFormulario: string = 'Crear Cuenta Presupuestaria';

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewCuentaPresupuestariaComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.cuentaForm = this.fb.group({
      codigo_presupuestaria: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      nombre_presupuestaria: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      activo: [true, Validators.required]
    });
  }

  guardarCuenta(): void {
    if (this.cuentaForm.valid) {
      const datos = this.cuentaForm.value;
      const payload = {
        codigo_presupuestaria: datos.codigo_presupuestaria,
        nombre_presupuestaria: datos.nombre_presupuestaria,
        activo: datos.activo
      };

      this.dialogRef.close(payload);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.cuentaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.cuentaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
