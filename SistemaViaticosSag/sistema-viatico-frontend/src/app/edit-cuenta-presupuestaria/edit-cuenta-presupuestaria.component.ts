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

export interface CuentaPresupuestariaData {
  id_cuenta_presupuestaria: number;
  codigo_presupuestaria: string;
  nombre_presupuestaria: string;
  activo: boolean;
}

@Component({
  selector: 'app-edit-cuenta-presupuestaria',
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
  templateUrl: './edit-cuenta-presupuestaria.component.html',
  styleUrls: ['./edit-cuenta-presupuestaria.component.css']
})
export class EditCuentaPresupuestariaComponent implements OnInit {
  cuentaForm!: FormGroup;
  tituloFormulario: string = 'Editar Cuenta Presupuestaria';

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditCuentaPresupuestariaComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { cuenta: CuentaPresupuestariaData }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.populateForm();
  }

  private initForm(): void {
    this.cuentaForm = this.fb.group({
      codigo_presupuestaria: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      nombre_presupuestaria: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      activo: [true, Validators.required]
    });
  }

  private populateForm(): void {
    const cuenta = this.data.cuenta;
    this.cuentaForm.patchValue({
      codigo_presupuestaria: cuenta.codigo_presupuestaria,
      nombre_presupuestaria: cuenta.nombre_presupuestaria,
      activo: cuenta.activo
    });
  }

  guardarCuenta(): void {
    if (this.cuentaForm.valid) {
      const datos = this.cuentaForm.value;
      const payload = {
        id_cuenta_presupuestaria: this.data.cuenta.id_cuenta_presupuestaria,
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
