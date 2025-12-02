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
  selector: 'app-new-programa',
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
  templateUrl: './new-programa.component.html',
  styleUrls: ['./new-programa.component.css']
})
export class NewProgramaComponent implements OnInit {
  programaForm!: FormGroup;
  tituloFormulario: string = 'Crear Programa';

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewProgramaComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.programaForm = this.fb.group({
      codigo_programa: ['', [Validators.required, Validators.min(1)]],
      nombre_programa: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      activo: [true, Validators.required]
    });
  }

  guardarPrograma(): void {
    if (this.programaForm.valid) {
      const datos = this.programaForm.value;
      const payload = {
        codigo_programa: datos.codigo_programa,
        nombre_programa: datos.nombre_programa,
        activo: datos.activo
      };

      this.dialogRef.close(payload);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.programaForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.programaForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return 'El código debe ser mayor a 0';
    }
    return '';
  }
}
