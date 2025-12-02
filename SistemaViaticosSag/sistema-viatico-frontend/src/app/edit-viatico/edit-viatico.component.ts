import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

// Importación del componente loading
import { LoadingComponent } from '../components/loading/loading.component';

interface ViaticoEditForm {
  id_unidad: number;
  id_programa: number;
  id_cuenta_presupuestaria: number;
  id_motivo_cometido: number;
  id_region: number;
  id_producto_subesp: number;
  localidad_destino: string;
  fecha_desde: string;
  fecha_hasta: string;
  dias_100: number;
  dias_40: number;
  descripcion_cometido: string;
  observaciones?: string;
  titulo_formulario: string;
}

@Component({
  selector: 'app-edit-viatico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    // Módulos de PrimeNG
    InputTextModule,
    SelectModule,
    ButtonModule,
    CheckboxModule,
    LoadingComponent
  ],
  templateUrl: './edit-viatico.component.html',
  styleUrl: './edit-viatico.component.css'
})
export class EditViaticoComponent implements OnInit {
  viaticoForm!: FormGroup;
  tituloFormulario: string = '';

  unidades: { value: number, label: string }[] = [];
  programas: { value: number, label: string }[] = [];
  cuentasPresupuestarias: { value: number, label: string }[] = [];
  motivosCometido: { value: number, label: string }[] = [];
  regiones: { value: number, label: string }[] = [];
  productosSubesp: { value: number, label: string }[] = [];
  opcionesPorcentaje40 = [
    { value: true, label: 'Sí' },
    { value: false, label: 'No' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditViaticoComponent>,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: { viatico: ViaticoEditForm }
  ) {}

  ngOnInit(): void {
    this.tituloFormulario = this.data.viatico.titulo_formulario;
    this.initForm();
    this.cargarUnidades();
    this.cargarProgramas();
    this.cargarCuentasPresupuestarias();
    this.cargarMotivosCometido();
    this.cargarRegiones();
    this.cargarProductosSubesp();
    this.populateForm();
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

  cargarCuentasPresupuestarias(): void {
    this.apiService.getCuentasPresupuestarias().subscribe({
      next: (cuentas) => {
        this.cuentasPresupuestarias = cuentas.map((c: any) => ({
          value: c.id_cuenta_presupuestaria,
          label: `${c.codigo_presupuestaria} ${c.nombre_cuenta}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar cuentas presupuestarias:', err);
      }
    });
  }

  cargarMotivosCometido(): void {
    this.apiService.getMotivosCometido().subscribe({
      next: (motivos) => {
        this.motivosCometido = motivos.map((m: any) => ({
          value: m.id_motivo_cometido,
          label: m.nombre_cometido
        }));
      },
      error: (err) => {
        console.error('Error al cargar motivos cometido:', err);
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

  cargarProductosSubesp(): void {
    this.apiService.getProductosSubesp().subscribe({
      next: (productos) => {
        this.productosSubesp = productos.map((p: any) => ({
          value: p.id_producto_subesp,
          label: `${p.codigo_subesp} ${p.nombre_subesp}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos subesp:', err);
      }
    });
  }

  private initForm(): void {
    this.viaticoForm = this.fb.group({
      unidad: [null, Validators.required],
      programa: [null, Validators.required],
      cuentaPresupuestaria: [null, Validators.required],
      motivoCometido: [null, Validators.required],
      region: [null, Validators.required],
      productoSubesp: [null, Validators.required],
      localidadDestino: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      fechaDesde: [null, Validators.required],
      fechaHasta: [null, Validators.required],
      dias100: [0, [Validators.required, Validators.min(0)]],
      dias40: [0, [Validators.required, Validators.min(0)]],
      descripcionCometido: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      observaciones: ['']
    });
  }

  private populateForm(): void {
    const viatico = this.data.viatico;
    this.viaticoForm.patchValue({
      unidad: viatico.id_unidad,
      programa: viatico.id_programa,
      cuentaPresupuestaria: viatico.id_cuenta_presupuestaria,
      motivoCometido: viatico.id_motivo_cometido,
      region: viatico.id_region,
      productoSubesp: viatico.id_producto_subesp,
      localidadDestino: viatico.localidad_destino,
      fechaDesde: viatico.fecha_desde,
      fechaHasta: viatico.fecha_hasta,
      dias100: viatico.dias_100,
      dias40: viatico.dias_40,
      descripcionCometido: viatico.descripcion_cometido,
      observaciones: viatico.observaciones || ''
    });
  }

  guardarViatico(): void {
    if (this.viaticoForm.valid) {
      const datos = { ...this.viaticoForm.value };

      // Calcular cantidad de días basado en fechas
      const cantidadDias = this.calcularCantidadDias(datos.fechaDesde, datos.fechaHasta);

      // Validar días 100%
      if (datos.dias100 > cantidadDias) {
        alert(`Los días 100% no pueden superar la cantidad de días del período (${cantidadDias} días).`);
        return;
      }

      // Validar días 40%
      const maxDias40 = cantidadDias + 1; // Puede superar en 1 día (medio día)
      if (datos.dias40 > maxDias40) {
        alert(`Los días 40% no pueden superar ${maxDias40} días (cantidad de días del período + 1).`);
        return;
      }

      const payload = {
        id_unidad: datos.unidad,
        id_programa: datos.programa,
        id_cuenta_presupuestaria: datos.cuentaPresupuestaria,
        id_motivo_cometido: datos.motivoCometido,
        id_region: datos.region,
        id_producto_subesp: datos.productoSubesp,
        localidad_destino: datos.localidadDestino,
        fecha_desde: datos.fechaDesde,
        fecha_hasta: datos.fechaHasta,
        dias_100: datos.dias100,
        dias_40: datos.dias40,
        descripcion_cometido: datos.descripcionCometido,
        observaciones: datos.observaciones || null
      };

      this.dialogRef.close(payload);
    } else {
      this.markFormGroupTouched();
    }
  }

  private calcularCantidadDias(fechaDesde: any, fechaHasta: any): number {
    if (!fechaDesde || !fechaHasta) return 0;

    const fechaInicio = new Date(fechaDesde);
    const fechaFin = new Date(fechaHasta);

    // Calcular diferencia en milisegundos
    const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();

    // Convertir a días (1 día = 24 * 60 * 60 * 1000 ms)
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

    // Si las fechas son el mismo día, cuenta como 1 día
    return diferenciaDias >= 0 ? diferenciaDias + 1 : 0;
  }

  private formatDate(date: string): string {
    if (!date) return '';
    return date;
  }

  private markFormGroupTouched(): void {
    Object.values(this.viaticoForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.viaticoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
