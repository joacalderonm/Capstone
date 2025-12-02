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

export interface ProductoSubespData {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-edit-producto-subesp',
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
  templateUrl: './edit-producto-subesp.component.html',
  styleUrls: ['./edit-producto-subesp.component.css']
})
export class EditProductoSubespComponent implements OnInit {
  productoForm!: FormGroup;
  tituloFormulario: string = 'Editar Producto Subespecie';
  estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProductoSubespComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { producto: ProductoSubespData }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProductoData();
  }

  private initForm(): void {
    this.productoForm = this.fb.group({
      codigo_subesp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      descripcion: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      activo: [true, Validators.required]
    });
  }

  private loadProductoData(): void {
    this.apiService.getProductoSubespById(this.data.producto.id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue({
          codigo_subesp: producto.codigo_subesp,
          descripcion: producto.descripcion,
          activo: producto.activo
        });
      },
      error: (error) => {
        console.error('Error al cargar producto subespecie:', error);
      }
    });
  }

  guardarProducto(): void {
    if (this.productoForm.valid) {
      const datos = this.productoForm.value;
      const updateData: any = {};

      if (datos.codigo_subesp !== undefined) {
        updateData.codigo_subesp = datos.codigo_subesp;
      }
      if (datos.descripcion !== undefined) {
        updateData.descripcion = datos.descripcion;
      }
      if (datos.activo !== undefined) {
        updateData.activo = datos.activo;
      }

      this.apiService.updateProductoSubesp(this.data.producto.id, updateData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al actualizar producto subespecie:', err);
        }
      });
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