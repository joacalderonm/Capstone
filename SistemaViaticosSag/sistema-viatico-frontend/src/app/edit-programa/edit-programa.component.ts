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

export interface ProgramaData {
  id: number;
  codigo: number;
  nombre: string;
}

@Component({
  selector: 'app-edit-programa',
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
  templateUrl: './edit-programa.component.html',
  styleUrls: ['./edit-programa.component.css']
})
export class EditProgramaComponent implements OnInit {
  programaForm!: FormGroup;
  tituloFormulario: string = 'Editar Programa';
  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProgramaComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { programa: ProgramaData }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProgramaData();
  }

  private initForm(): void {
    this.programaForm = this.fb.group({
      codigo_programa: ['', [Validators.required, Validators.min(1)]],
      nombre_programa: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      activo: [true, Validators.required]
    });
  }

  private loadProgramaData(): void {
    this.apiService.getProgramaById(this.data.programa.id).subscribe({
      next: (programa) => {
        this.programaForm.patchValue({
          codigo_programa: programa.codigo_programa,
          nombre_programa: programa.nombre_programa,
          activo: programa.activo
        });
      },
      error: (error) => {
        console.error('Error al cargar programa:', error);
      }
    });
  }

  guardarPrograma(): void {
    if (this.programaForm.valid) {
      const datos = this.programaForm.value;
      const updateData: any = {};

      if (datos.codigo_programa !== undefined) {
        updateData.codigo_programa = datos.codigo_programa;
      }
      if (datos.nombre_programa !== undefined) {
        updateData.nombre_programa = datos.nombre_programa;
      }
      if (datos.activo !== undefined) {
        updateData.activo = datos.activo;
      }

      this.apiService.updatePrograma(this.data.programa.id, updateData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar programa:', err);
        }
      });
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