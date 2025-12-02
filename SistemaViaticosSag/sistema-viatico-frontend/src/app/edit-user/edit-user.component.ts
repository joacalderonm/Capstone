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
import { BackendUser, UsuarioEditForm } from '../interfaces/backend-user';

@Component({
    selector: 'app-edit-user',
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
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  userForm!: FormGroup;
  tituloFormulario: string = '';

  roles = [
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Supervisor' },
    { value: 3, label: 'Empleado' }
  ];
  unidades: { value: number, label: string }[] = [];
  regiones: { value: number, label: string }[] = [];
  calidadesJuridicas: { value: number, label: string }[] = [];
  gradosEU: { value: number, label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { user: UsuarioEditForm }
  ) {}

  ngOnInit(): void {
    this.tituloFormulario = this.data.user.titulo_formulario;
    this.initForm();
    this.cargarUnidades();
    this.cargarRegiones();
    this.cargarCalidadJuridica();
    this.cargarGradoEscala();
    this.populateForm();
  }

  cargarGradoEscala(): void {
    this.apiService.getGradoEscala().subscribe({
      next: (grados) => {
        this.gradosEU = grados.map((g: any) => ({
          value: g.id_grado,
          label: String(g.id_grado)
        }));
      },
      error: (err) => {
        console.error('Error al cargar grado escala:', err);
      }
    });
  }

  cargarCalidadJuridica(): void {
    this.apiService.getCalidadJuridica().subscribe({
      next: (calidades) => {
        this.calidadesJuridicas = calidades.map((c: any) => ({
          value: c.id_calidad_juridica,
          label: c.tipo
        }));
      },
      error: (err) => {
        console.error('Error al cargar calidad jurídica:', err);
      }
    });
  }

  cargarRegiones(): void {
    this.apiService.getRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones.map((r: any) => ({
          value: r.id_region,
          label: `${r.codigo_region} ${r.nombre_region}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar regiones:', err);
      }
    });
  }

  cargarUnidades(): void {
    this.apiService.getUnidades().subscribe({
      next: (unidades) => {
        this.unidades = unidades.map((u: any) => ({
          value: u.id_unidad,
          label: `${u.codigo_unidad} ${u.nombre_unidad}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar unidades:', err);
      }
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', Validators.required],
      rol: [null, Validators.required],
      unidad: [null, Validators.required],
      region: [null, Validators.required],
      calidadJuridica: [null, Validators.required],
      gradoEu: [null, Validators.required],
    });
  }

  private populateForm(): void {
    const user = this.data.user;
    this.userForm.patchValue({
      nombre: user.nombre_usuario,
      apellidoPaterno: user.apellido_paterno,
      apellidoMaterno: user.apellido_materno,
      rol: user.id_rol,
      unidad: user.id_unidad,
      region: user.id_region,
      calidadJuridica: user.id_calidad_juridica,
      gradoEu: user.id_grado,
    });
  }


  guardarUsuario(): void {
    if (this.userForm.valid) {
      const datos = { ...this.userForm.value };

      const payload = {
        id_usuario: this.data.user.id_usuario,
        id_rol: datos.rol,
        id_unidad: datos.unidad,
        id_region: datos.region,
        id_calidad_juridica: datos.calidadJuridica,
        id_grado: datos.gradoEu,
        nombre_usuario: datos.nombre,
        apellido_paterno: datos.apellidoPaterno,
        apellido_materno: datos.apellidoMaterno,
        rut: this.data.user.rut, // Mantener el RUT original ya que no es editable
        correo: this.data.user.correo, // Incluir correo que viene del backend
        activo: this.data.user.activo // Incluir estado activo
      };

      this.dialogRef.close(payload);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.values(this.userForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['email']) return 'Formato de correo inválido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
