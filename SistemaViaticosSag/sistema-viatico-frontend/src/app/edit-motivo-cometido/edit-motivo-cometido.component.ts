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

export interface MotivoCometidoData {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-edit-motivo-cometido',
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
  templateUrl: './edit-motivo-cometido.component.html',
  styleUrls: ['./edit-motivo-cometido.component.css']
})
export class EditMotivoCometidoComponent implements OnInit {
  motivoForm!: FormGroup;
  tituloFormulario: string = 'Editar Motivo de Cometido';
  private currentActivo: boolean = false;

  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditMotivoCometidoComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { motivo: MotivoCometidoData }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMotivoData();
  }

  private initForm(): void {
    this.motivoForm = this.fb.group({
      nombre_cometido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      descripcion_cometido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      activo: [true, Validators.required]
    });
  }

  private loadMotivoData(): void {
    this.apiService.getMotivoCometidoById(this.data.motivo.id).subscribe({
      next: (motivo) => {
        this.currentActivo = motivo.activo;
        this.motivoForm.patchValue({
          nombre_cometido: motivo.nombre_cometido,
          descripcion_cometido: motivo.descripcion_cometido,
          activo: motivo.activo
        });
      },
      error: (error) => {
        console.error('Error al cargar motivo de cometido:', error);
      }
    });
  }

  guardarMotivo(): void {
    if (this.motivoForm.valid) {
      const datos = this.motivoForm.value;
      const payload = {
        id_motivo_cometido: this.data.motivo.id,
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