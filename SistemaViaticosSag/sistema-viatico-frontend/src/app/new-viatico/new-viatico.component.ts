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
import { ViaticoCreate } from '../interfaces/plantilla';

@Component({
  selector: 'app-new-viatico',
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
  templateUrl: './new-viatico.component.html',
  styleUrls: ['./new-viatico.component.css']
})
export class NewViaticoComponent implements OnInit {
  @Input() idPlantilla!: number;
  @Output() viaticoCreated = new EventEmitter<void>();

  viaticoForm!: FormGroup;

  unidades: { value: number, label: string }[] = [];
  programas: { value: number, label: string }[] = [];
  cuentas: { value: number, label: string }[] = [];
  motivos: { value: number, label: string }[] = [];
  regiones: { value: number, label: string }[] = [];
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
    this.viaticoForm = this.fb.group({
      id_unidad: [null, Validators.required],
      id_programa: [null, Validators.required],
      id_cuenta_presupuestaria: [null, Validators.required],
      id_motivo_cometido: [null, Validators.required],
      id_region: [null, Validators.required],
      id_producto_subesp: [null, Validators.required],
      localidad_destino: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      fecha_desde: [null, Validators.required],
      fecha_hasta: [null, Validators.required],
      dias_100: [0, [Validators.required, Validators.min(0)]],
      dias_40: [0, [Validators.required, Validators.min(0)]],
      descripcion_cometido: [''],
      observaciones: ['']
    });

    // Asegurar que los campos numéricos siempre tengan un valor por defecto
    this.viaticoForm.get('dias_100')?.valueChanges.subscribe(value => {
      if (value === null || value === undefined || value === '') {
        this.viaticoForm.patchValue({ dias_100: 0 });
      }
    });

    this.viaticoForm.get('dias_40')?.valueChanges.subscribe(value => {
      if (value === null || value === undefined || value === '') {
        this.viaticoForm.patchValue({ dias_40: 0 });
      }
    });
  }

  private cargarDatos(): void {
    this.cargarUnidades();
    this.cargarProgramas();
    this.cargarCuentas();
    this.cargarMotivos();
    this.cargarRegiones();
    this.cargarProductos();
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

  cargarCuentas(): void {
    this.apiService.getCuentasPresupuestarias().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas.map((c: any) => ({
          value: c.id_cuenta_presupuestaria,
          label: `${c.codigo_presupuestaria} ${c.nombre_presupuestaria}`
        }));
      },
      error: (err) => {
        console.error('Error al cargar cuentas:', err);
      }
    });
  }

  cargarMotivos(): void {
    this.apiService.getMotivosCometido().subscribe({
      next: (motivos) => {
        this.motivos = motivos.map((m: any) => ({
          value: m.id_motivo_cometido,
          label: m.nombre_cometido
        }));
      },
      error: (err) => {
        console.error('Error al cargar motivos:', err);
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


  crearViatico(): void {
    if (this.viaticoForm.valid && this.idPlantilla) {
      const formData = this.viaticoForm.value;

      // Verificar que no ambos días sean 0
      const dias100 = formData.dias_100 || 0;
      const dias40 = formData.dias_40 || 0;

      if (dias100 === 0 && dias40 === 0) {
        alert('No se puede enviar 0 en ambos campos de días (100% y 40%). Al menos uno debe tener un valor mayor a 0.');
        return;
      }

      // Calcular cantidad de días basado en fechas
      const cantidadDias = this.calcularCantidadDias(formData.fecha_desde, formData.fecha_hasta);

      // Validar días 100%
      if (dias100 > cantidadDias) {
        alert(`Los días 100% no pueden superar la cantidad de días del período (${cantidadDias} días).`);
        return;
      }

      // Validar días 40%
      const maxDias40 = cantidadDias + 1; // Puede superar en 1 día (medio día)
      if (dias40 > maxDias40) {
        alert(`Los días 40% no pueden superar ${maxDias40} días (cantidad de días del período + 1).`);
        return;
      }

      // Convertir fechas a formato YYYY-MM-DD
      const fechaDesde = formData.fecha_desde ? this.formatDate(formData.fecha_desde) : '';
      const fechaHasta = formData.fecha_hasta ? this.formatDate(formData.fecha_hasta) : '';

      const viaticoData: ViaticoCreate = {
        id_plantilla: this.idPlantilla,
        id_unidad: formData.id_unidad,
        id_programa: formData.id_programa,
        id_cuenta_presupuestaria: formData.id_cuenta_presupuestaria,
        id_motivo_cometido: formData.id_motivo_cometido,
        id_region: formData.id_region,
        id_producto_subesp: formData.id_producto_subesp,
        id_valor_viatico: 1,
        localidad_destino: formData.localidad_destino,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        dias_100: dias100,
        dias_40: dias40,
        descripcion_cometido: formData.descripcion_cometido || "Sin descripción",
        observaciones: formData.observaciones || "Sin observaciones"
      };

      this.apiService.createViatico(viaticoData).subscribe({
        next: (response) => {
          console.log('Viático creado exitosamente:', response);
          this.resetForm();
          // Emitir evento para actualizar la lista de viáticos
          this.viaticoCreated.emit();
        },
        error: (error) => {
          console.error('Error al crear viático:', error);
          const errorMessage = error.error?.detail || 'Error al crear el viático. Por favor, inténtelo nuevamente.';
          alert(errorMessage);
        }
      });
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
    this.viaticoForm.reset({
      id_unidad: null,
      id_programa: null,
      id_cuenta_presupuestaria: null,
      id_motivo_cometido: null,
      id_region: null,
      id_producto_subesp: null,
      localidad_destino: '',
      fecha_desde: null,
      fecha_hasta: null,
      dias_100: 0,
      dias_40: 0,
      descripcion_cometido: '',
      observaciones: ''
    });
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