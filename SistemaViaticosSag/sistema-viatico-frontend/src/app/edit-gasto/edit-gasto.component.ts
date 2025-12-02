import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

// Importación del componente loading
import { LoadingComponent } from '../components/loading/loading.component';

interface GastoEditForm {
  id_gasto_reembolsable: number;
  id_tipo_gasto: number;
  id_programa: number;
  id_producto_subesp: number;
  numero_documento: string;
  fecha: string;
  valor: number;
  descripcion: string;
  titulo_formulario: string;
}

@Component({
  selector: 'app-edit-gasto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    // Módulos de PrimeNG
    InputTextModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    LoadingComponent
  ],
  templateUrl: './edit-gasto.component.html',
  styleUrl: './edit-gasto.component.css'
})
export class EditGastoComponent implements OnInit {
  gastoForm!: FormGroup;
  tituloFormulario: string = '';

  tiposGasto: { value: number, label: string }[] = [];
  programas: { value: number, label: string }[] = [];
  productos: { value: number, label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditGastoComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { gasto: GastoEditForm }
  ) {}

  ngOnInit(): void {
    this.tituloFormulario = this.data.gasto.titulo_formulario;
    this.initForm();
    this.cargarTiposGasto();
    this.cargarProgramas();
    this.cargarProductos();
    this.populateForm();
  }

  cargarTiposGasto(): void {
    this.apiService.getTiposGasto().subscribe({
      next: (tipos) => {
        this.tiposGasto = tipos.map((t: any) => ({
          value: t.id_tipo_gasto,
          label: t.descripcion_gasto
        }));
      },
      error: (err) => {
        console.error('Error al cargar tipos de gasto:', err);
      }
    });
  }

  cargarProgramas(): void {
    this.apiService.getProgramas().subscribe({
      next: (programas) => {
        this.programas = programas.map((p: any) => ({
          value: p.id_programa,
          label: String(p.codigo_programa)  // Solo mostrar código
        }));
      },
      error: (err) => {
        console.error('Error al cargar programas:', err);
      }
    });
  }

  cargarProductos(): void {
    this.apiService.getProductosSubesp().subscribe({
      next: (productos) => {
        this.productos = productos.map((p: any) => ({
          value: p.id_producto_subesp,
          label: p.descripcion || p.codigo_subesp  // Usar descripción si existe, sino código
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  private initForm(): void {
    this.gastoForm = this.fb.group({
      id_tipo_gasto: [null, Validators.required],
      id_programa: [null, Validators.required],
      id_producto_subesp: [null, Validators.required],
      numero_documento: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      fecha: [null, Validators.required],
      valor: [null, [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]]
    });
  }

  private populateForm(): void {
    const gasto = this.data.gasto;
    this.gastoForm.patchValue({
      id_tipo_gasto: gasto.id_tipo_gasto,
      id_programa: gasto.id_programa,
      id_producto_subesp: gasto.id_producto_subesp,
      numero_documento: gasto.numero_documento,
      fecha: gasto.fecha,
      valor: gasto.valor,
      descripcion: gasto.descripcion
    });
  }

  guardarGasto(): void {
    if (this.gastoForm.valid) {
      const datos = { ...this.gastoForm.value };

      const payload = {
        id_tipo_gasto: datos.id_tipo_gasto,
        id_programa: datos.id_programa,
        id_producto_subesp: datos.id_producto_subesp,
        numero_documento: datos.numero_documento,
        fecha: datos.fecha,
        valor: parseFloat(datos.valor),
        descripcion: datos.descripcion
      };

      // Enviar la información al endpoint PUT
      this.apiService.updateGastoReembolsable(this.data.gasto.id_gasto_reembolsable, payload).subscribe({
        next: (response) => {
          console.log('Gasto reembolsable actualizado exitosamente:', response);
          this.dialogRef.close(payload);
        },
        error: (error) => {
          console.error('Error al actualizar gasto reembolsable:', error);
          alert('Error al actualizar el gasto reembolsable. Por favor, inténtelo nuevamente.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.gastoForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.gastoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return 'El valor debe ser mayor o igual a 0';
    }
    return '';
  }
}
