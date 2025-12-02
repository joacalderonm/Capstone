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
    selector: 'app-new-user',
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
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  userForm!: FormGroup;

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
    public dialogRef: MatDialogRef<NewUserComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarUnidades();
    this.cargarRegiones();
    this.cargarCalidadJuridica();
    this.cargarGradoEscala();
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
      rutNumero: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      rutDv: ['', [Validators.required, Validators.pattern(/^[0-9kK]$/)]],
      rol: [null, Validators.required],
      unidad: [null, Validators.required],
      region: [null, Validators.required],
      calidadJuridica: [null, Validators.required],
      gradoEu: [null, Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.validarRutCompleto });
  }

  private validarRutCompleto(formGroup: any) {
    const rutNumero = formGroup.get('rutNumero')?.value;
    const rutDv = formGroup.get('rutDv')?.value;

    if (!rutNumero || !rutDv) return null;

    const cuerpo = rutNumero.toString();
    const dv = rutDv.toString().toLowerCase();

    if (cuerpo.length < 7 || cuerpo.length > 8) return { rutInvalido: true };
    if (!/^\d+$/.test(cuerpo)) return { rutInvalido: true };

    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = suma % 11;
    const dvCalculado = resto === 0 ? '0' : resto === 1 ? 'k' : (11 - resto).toString();
    return dv === dvCalculado ? null : { rutInvalido: true };
  }

  guardarUsuario(): void {
    if (this.userForm.valid) {
      const datos = { ...this.userForm.value };
      this.dialogRef.close(datos);
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
      if (field.errors['pattern']) {
        if (fieldName === 'rutNumero') return 'RUT numérico debe tener 7-8 dígitos';
        if (fieldName === 'rutDv') return 'Dígito verificador debe ser 0-9 o K';
      }
    }
    // Validación de RUT completo
    if (this.userForm.errors?.['rutInvalido'] && (fieldName === 'rutNumero' || fieldName === 'rutDv')) {
      return 'RUT inválido';
    }
    return '';
  }
}