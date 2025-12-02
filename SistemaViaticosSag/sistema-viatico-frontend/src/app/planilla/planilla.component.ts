import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../components/loading/loading.component';
import { LoadingService } from '../services/loading.service';
import { RespuestaPlantillaUsuario } from '../interfaces/plantilla';
import { ApiService } from '../services/api.service';
import { NewViaticoComponent } from '../new-viatico/new-viatico.component';
import { ViaticosComponent } from '../viaticos/viaticos.component';
import { NewGastoReembolsableComponent } from '../new-gasto-reembolsable/new-gasto-reembolsable.component';
import { GastosComponent } from '../gastos/gastos.component';
import { CerrarPlanillaComponent } from '../cerrar-planilla/cerrar-planilla.component';
import { CerrarAnticipoComponent } from '../cerrar-anticipo/cerrar-anticipo.component';
import { NewAnticipoComponent } from '../new-anticipo/new-anticipo.component';
import { AnticiposComponent } from '../anticipos/anticipos.component';
import { PdfService } from '../services/pdf.service';
import { PdfFormService } from '../services/pdf-form.service';
import { ViewChild } from '@angular/core';




@Component({
    selector: 'app-planilla',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, LoadingComponent, NewViaticoComponent, ViaticosComponent, NewGastoReembolsableComponent, GastosComponent, NewAnticipoComponent, AnticiposComponent],
    templateUrl: './planilla.component.html',
    styleUrl: './planilla.component.css'
})
export class PlanillaComponent implements OnInit {

  @ViewChild('listadoViaticos') listadoViaticos!: ViaticosComponent;
  @ViewChild('listadoGastos') listadoGastos!: GastosComponent;
  @ViewChild('listadoAnticipos') listadoAnticipos!: AnticiposComponent;

  public fecha: Date;
  public departamento: string = '';
  public director: string = '';
  public regionp: string = '';
  public nombre: string = '';
  public rut: string = '';
  public cjurid: string = '';
  public grado: number = 0;
  public numero: number = 1;

  public datosPlantilla: RespuestaPlantillaUsuario | null = null;
  minDate: Date;
  isExpanded: boolean = false;
  isExpandedGastos: boolean = false;
  isExpandedAnticipo: boolean = false;
  public isCerrada: boolean = false;

  constructor(private router: Router, private loadingService: LoadingService, private apiService: ApiService, private dialog: MatDialog, private pdfService: PdfService, private pdfFormService: PdfFormService) {
    registerLocaleData(localeEs);
    this.fecha = new Date();
    this.minDate = new Date(2024, 9, 1);
  }

  ngOnInit(): void {
    // Verificar si hay datos de plantilla en el estado de navegación
    const navigation = history.state;
    if (navigation && navigation.plantilla) {
      const plantillaData = navigation.plantilla;

      // Si ya tenemos los datos completos (viene de la nueva lógica)
      if (plantillaData.numero_plantilla && plantillaData.nombre_unidad) {
        this.datosPlantilla = plantillaData as RespuestaPlantillaUsuario;
        this.cargarDatosDesdePlantilla(this.datosPlantilla);
      } else {
        // Lógica anterior: plantilla básica (ya no se usa con nueva implementación)
        console.log('Datos de plantilla básica recibidos (no soportados en nueva versión):', plantillaData);
      }
    }

    // Simular carga inicial y actualizar resumen
    this.loadingService.show();
    setTimeout(() => {
      this.loadingService.hide();
      // Forzar actualización del resumen después de la carga inicial
      this.actualizarDatosResumen();
    }, 1000);
  }

  private cargarDatosDesdePlantilla(datos: RespuestaPlantillaUsuario): void {
    // Cargar datos en las propiedades del componente
    this.numero = datos.numero_plantilla;
    this.nombre = datos.nombre_usuario_completo;
    this.rut = datos.rut_completo;
    this.departamento = datos.nombre_unidad; // Cambiar a departamento ya que unidad es number
    this.director = datos.nombre_supervisor_completo;
    this.regionp = datos.nombre_region;
    this.cjurid = datos.tipo;
    this.grado = datos.id_grado;

    // Establecer fecha de creación si existe
    if (datos.fecha_creacion) {
      this.fecha = new Date(datos.fecha_creacion);
    }

    // Actualizar estado de la planilla
    this.actualizarEstado(datos);

    console.log('Datos de plantilla cargados:', datos);
  }

  private actualizarEstado(datos: RespuestaPlantillaUsuario): void {
    // 1 = activa, 2 = cerrada
    this.isCerrada = datos.id_estado_plantilla === 2;
  }




  // Métodos eliminados ya que no se usan en la nueva implementación

  GuardarPlanilla(): void {
    this.router.navigate(['/listado']);
  }

  CerrarPlanilla(): void {
    const dialogRef = this.dialog.open(CerrarPlanillaComponent, {
      width: '500px',
      data: { id_plantilla: this.datosPlantilla?.id_plantilla }
    });

    // Escuchar cuando se cierre el modal para recargar datos
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // La planilla fue cerrada exitosamente, recargar datos
        this.recargarDatosPlantilla();
      }
    });
  }


  modalAbierto: boolean = false;

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  onViaticoCreated(): void {
    if (this.listadoViaticos) {
      this.listadoViaticos.refreshViaticos();
    }
    // Recargar los datos de la plantilla para actualizar el resumen
    this.recargarDatosPlantilla();
  }

  private recargarDatosPlantilla(): void {
    if (this.datosPlantilla?.id_plantilla) {
      this.apiService.getPlantillaPorId(this.datosPlantilla.id_plantilla).subscribe({
        next: (datosActualizados) => {
          // Mantener el id_plantilla original para evitar que se pierda
          const idPlantillaOriginal = this.datosPlantilla!.id_plantilla;
          this.datosPlantilla = { ...datosActualizados, id_plantilla: idPlantillaOriginal };
          // Actualizar estado después de recargar
          this.actualizarEstado(this.datosPlantilla);
          console.log('Datos de plantilla recargados:', this.datosPlantilla);
        },
        error: (error) => {
          console.error('Error al recargar datos de plantilla:', error);
        }
      });
    }
  }

  onRefreshRequested(): void {
    if (this.listadoViaticos) {
      this.listadoViaticos.refreshViaticos();
    }
    // Recargar los datos de la plantilla para actualizar el resumen
    this.recargarDatosPlantilla();
  }

  onRefreshRequestedGastos(): void {
    if (this.listadoGastos) {
      this.listadoGastos.refreshGastos();
    }
    // Recargar los datos de la plantilla para actualizar el resumen
    this.recargarDatosPlantilla();
  }

  onRefreshRequestedAnticipos(): void {
    if (this.listadoAnticipos) {
      this.listadoAnticipos.refreshAnticipos();
    }
    // Recargar los datos de la plantilla para actualizar el resumen
    this.recargarDatosPlantilla();
  }

  onGastoCreated(): void {
    if (this.listadoGastos) {
      this.listadoGastos.refreshGastos();
    }
    // Recargar los datos de la plantilla para actualizar el resumen
    this.recargarDatosPlantilla();
    // Asegurar que el id_plantilla esté disponible para futuros usos
    console.log('ID de plantilla después de crear gasto:', this.datosPlantilla?.id_plantilla);
  }

  onAnticipoCreated(): void {
    if (this.listadoAnticipos) {
      this.listadoAnticipos.refreshAnticipos();
    }
    // Recargar los datos de la plantilla para actualizar el resumen
    this.recargarDatosPlantilla();
    console.log('Anticipo creado exitosamente');
  }

  toggleSection(): void {
    this.isExpanded = !this.isExpanded;
  }

  toggleSectionGastos(): void {
    this.isExpandedGastos = !this.isExpandedGastos;
  }

  toggleSectionAnticipo(): void {
    this.isExpandedAnticipo = !this.isExpandedAnticipo;
  }

  formatCurrency(amount: number | undefined): string {
    if (amount === undefined || amount === null) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  getSaldoLabel(totalGeneral: number | undefined): string {
    if (totalGeneral === undefined || totalGeneral === null) {
      return 'SIN SALDO';
    }
    if (totalGeneral > 0) {
      return 'SALDO A FAVOR';
    } else if (totalGeneral < 0) {
      return 'SALDO EN CONTRA';
    } else {
      return 'SIN SALDO';
    }
  }

  getSaldoValue(totalGeneral: number | undefined): number {
    if (totalGeneral === undefined || totalGeneral === null) {
      return 0;
    }
    return Math.abs(totalGeneral);
  }

  private actualizarDatosResumen(): void {
    // Forzar actualización del resumen llamando a recargarDatosPlantilla
    this.recargarDatosPlantilla();
  }

  asignarEncargadoAnticipo(): void {
    const dialogRef = this.dialog.open(CerrarAnticipoComponent, {
      width: '500px',
      data: { id_plantilla: this.datosPlantilla?.id_plantilla }
    });

    // Escuchar cuando se cierre el modal para recargar datos
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // El anticipo fue firmado exitosamente, recargar datos
        this.recargarDatosPlantilla();
      }
    });
  }

  exportToPDF(): void {
    if (this.datosPlantilla?.id_plantilla) {
      this.pdfService.generatePDF(this.datosPlantilla.id_plantilla);
    }
  }

  exportToFormPDF(): void {
    if (this.datosPlantilla?.id_plantilla) {
      this.pdfFormService.generateFormPDF(this.datosPlantilla.id_plantilla, this.apiService);
    }
  }
}
