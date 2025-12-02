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
  selector: 'app-new-motivo-cometido',
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
  templateUrl: './new-motivo-cometido.component.html',
  styleUrls: ['./new-motivo-cometido.component.css']
})
export class NewMotivoCometidoComponent implements OnInit {
  motivoForm!: FormGroup;
  tituloFormulario: string = 'Crear Motivo de Cometido';

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewMotivoCometidoComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.motivoForm = this.fb.group({
      nombre_cometido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      descripcion_cometido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      activo: [true, Validators.required]
    });
  }

  guardarMotivo(): void {
    if (this.motivoForm.valid) {
      const datos = this.motivoForm.value;
      const payload = {
        nombre_cometido: datos.nombre_cometido,
        descripcion_cometido: datos.descripcion_cometido,
        activo: datos.activo
      };

      this.dialogRef.close(payload);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.motivoForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.motivoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
