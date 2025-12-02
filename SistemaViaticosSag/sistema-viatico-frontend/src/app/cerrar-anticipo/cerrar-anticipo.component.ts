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

@Component({
    selector: 'app-cerrar-anticipo',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        // Módulos de PrimeNG actualizados
        InputTextModule,
        SelectModule,
        ButtonModule,
        LoadingComponent
    ],
    templateUrl: './cerrar-anticipo.component.html',
    styleUrls: ['./cerrar-anticipo.component.css']
})
export class CerrarAnticipoComponent implements OnInit {
  cerrarForm!: FormGroup;
  tituloFormulario: string = 'Cierre de Anticipo';
  usuarios: { value: number, label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CerrarAnticipoComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    // Primero obtener la plantilla para saber el id_unidad
    console.log('Datos recibidos en cerrar-anticipo:', this.data);
    if (!this.data || !this.data.id_plantilla) {
      console.error('No se recibió id_plantilla en los datos del modal');
      return;
    }
    this.apiService.getPlantillaPorId(this.data.id_plantilla).subscribe({
      next: (plantilla) => {
        const idUnidad = plantilla.id_unidad;
        // Ahora obtener los firmantes de esa unidad
        this.apiService.getFirmantesPorUnidad(idUnidad).subscribe({
          next: (usuarios) => {
            this.usuarios = usuarios.map((u: any) => ({
              value: u.id_usuario,
              label: u.nombre_completo || `${u.nombre_usuario} ${u.apellido_paterno}`
            }));
          },
          error: (err) => {
            console.error('Error al cargar firmantes:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener plantilla:', err);
      }
    });
  }

  private initForm(): void {
    this.cerrarForm = this.fb.group({
      encargado: [null, Validators.required],
    });
  }

  asignarEncargado(): void {
    if (this.cerrarForm.valid) {
      const idUsuarioSupervisor = this.cerrarForm.value.encargado;
      console.log('Enviando id_usuario_supervisor como query param:', idUsuarioSupervisor);
      this.apiService.firmarAnticipo(this.data.id_plantilla, idUsuarioSupervisor).subscribe({
        next: (response) => {
          console.log('Anticipo firmado exitosamente:', response);
          this.dialogRef.close(true); // Cerrar modal con éxito y recargar datos
        },
        error: (err) => {
          console.error('Error al firmar anticipo:', err);
          console.error('Detalles del error:', err.error);
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.cerrarForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
    }
    return '';
  }
}