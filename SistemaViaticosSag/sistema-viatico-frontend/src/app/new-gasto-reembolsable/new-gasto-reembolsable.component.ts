import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CardModule } from 'primeng/card';

// Importación del componente loading
import { LoadingComponent } from '../components/loading/loading.component';

// Servicios
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-new-gasto-reembolsable',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Módulos de PrimeNG
    InputTextModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    CardModule,
    LoadingComponent
  ],
  templateUrl: './new-gasto-reembolsable.component.html',
  styleUrls: ['./new-gasto-reembolsable.component.css']
})
export class NewGastoReembolsableComponent implements OnInit {
  @Input() idPlantilla!: number;
  @Output() gastoCreated = new EventEmitter<void>();

  gastoForm!: FormGroup;

  tiposGasto: { value: number, label: string }[] = [];
  programas: { value: number, label: string }[] = [];
  productos: { value: number, label: string }[] = [];

  minDate: Date = new Date(2024, 9, 1);

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDatos();
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

  private cargarDatos(): void {
    this.cargarTiposGasto();
    this.cargarProgramas();
    this.cargarProductos();
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
          label: `${p.codigo_programa} ${p.nombre_programa}`
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
          label: `${p.codigo_subesp} - ${p.descripcion}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }

  crearGasto(): void {
    if (this.gastoForm.valid && this.idPlantilla) {
      const formData = this.gastoForm.value;

      // Convertir fecha a formato YYYY-MM-DD
      const fecha = formData.fecha ? this.formatDate(formData.fecha) : '';

      const gastoData = {
        id_plantilla: this.idPlantilla,
        id_tipo_gasto: formData.id_tipo_gasto,
        id_programa: formData.id_programa,
        id_producto_subesp: formData.id_producto_subesp,
        numero_documento: formData.numero_documento,
        fecha: fecha,
        valor: parseFloat(formData.valor),
        descripcion: formData.descripcion
      };

      this.apiService.createGastoReembolsable(gastoData).subscribe({
        next: (response) => {
          console.log('Gasto reembolsable creado exitosamente:', response);
          this.resetForm();
          // Emitir evento para actualizar la lista de gastos
          this.gastoCreated.emit();
        },
        error: (error) => {
          console.error('Error al crear gasto reembolsable:', error);
          alert('Error al crear el gasto reembolsable. Por favor, inténtelo nuevamente.');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private formatDate(date: any): string {
    if (!date) return '';

    // Si es un string, convertir a Date
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Verificar que sea una fecha válida
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      console.error('Fecha inválida:', date);
      return '';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private resetForm(): void {
    this.gastoForm.reset();
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