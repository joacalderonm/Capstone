import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RespuestaPlantillaListadoUsuario } from '../interfaces/plantilla';
import { PdfService } from '../services/pdf.service';
import { PdfFormService } from '../services/pdf-form.service';
import { LoadingService } from '../services/loading.service';
import { LoadingComponent } from '../components/loading/loading.component';

export interface TablaUnidad {
  funcionario: string;
  year: number;
  month: string;
  number: number;
  monto: number;
  enlace: string;
  id_plantilla: number;
}

const DATA: TablaUnidad[] = [];

@Component({
    selector: 'app-historial',
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        FormsModule,
        LoadingComponent
    ],
    templateUrl: './historial.component.html',
    styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  selectedMonth: string = this.months[new Date().getMonth()];

  selectMonth(month: string) {
    this.selectedMonth = month;
    console.log('Month changed to:', this.selectedMonth);
    // Filtrar plantillas por mes seleccionado
    this.cargarPlantillasUnidad();
  }

  // Lógica de tabla y datos
  displayedColumnsUnidad: string[] = ['year', 'month', 'funcionario', 'number', 'monto', 'opciones'];
  dataSourceUnidad = DATA;

  // Lógica de selección de año y carga
  selectedYear: number = new Date().getFullYear();
  years: number[] = [];
  isLoading: boolean = false;

  // Lógica de resumen (puedes adaptar los valores según lo que necesites mostrar)
  public producto: number = 25000;
  public productounidad: number = 380900;
  public mes: number = 100000;
  public mesunidad: number = 2760400;
  public ano: number = 1260000;
  public cerradas: number = 8;

  // Datos de la unidad desde localStorage
  nombre_unidad: string = '';
  codigo_unidad: string = '';
  id_unidad: number = 0;

  constructor(private router: Router, private apiService: ApiService, private pdfService: PdfService, private pdfFormService: PdfFormService, private loadingService: LoadingService) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = 2025; year <= currentYear; year++) {
      this.years.push(year);
    }

    // Cargar datos de la unidad desde localStorage
    this.cargarDatosUnidad();

    // Cargar plantillas de la unidad
    this.cargarPlantillasUnidad();
  }

  cargarDatosUnidad(): void {
    const datos = localStorage.getItem('usuarioDatos');
    if (datos) {
      const usuario = JSON.parse(datos);
      this.nombre_unidad = usuario.nombre_unidad || '';
      this.codigo_unidad = usuario.codigo_unidad || '';
      this.id_unidad = usuario.id_unidad || 0;
    }
  }

  cargarPlantillasUnidad(): void {
    if (!this.id_unidad) {
      console.error('No se encontró el ID de la unidad');
      return;
    }

    this.isLoading = true;

    this.apiService.getPlantillasPorUnidad(this.id_unidad).subscribe({
      next: (plantillas: RespuestaPlantillaListadoUsuario[]) => {
        // Filtrar por año y mes seleccionados
        let plantillasFiltradas = plantillas.filter(p => p.ano === this.selectedYear);

        // Solo filtrar por mes si no es el mes actual (que es el valor por defecto)
        const currentMonthIndex = new Date().getMonth();
        if (this.selectedMonth !== this.months[currentMonthIndex]) {
          // Si se seleccionó un mes específico, filtrar por mes
          const mesIndex = this.months.indexOf(this.selectedMonth) + 1; // +1 porque los meses en la API son 1-based
          plantillasFiltradas = plantillasFiltradas.filter(p => p.mes === mesIndex);
        }

        // Mapear los datos del API a la estructura de la tabla
        this.dataSourceUnidad = plantillasFiltradas.map(plantilla => {
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          return {
            year: plantilla.ano,
            month: months[plantilla.mes - 1], // mes es 1-based
            funcionario: plantilla.nombre_creador || 'N/A',
            number: plantilla.id_plantilla,
            monto: plantilla.total_general || 0,
            enlace: '#',
            id_plantilla: plantilla.id_plantilla
          };
        });

        this.isLoading = false;
        console.log('Plantillas de la unidad cargadas:', this.dataSourceUnidad);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al cargar plantillas de la unidad:', error);
      }
    });
  }

  selectYear(year: number) {
    this.selectedYear = year;
    console.log('Year changed to:', this.selectedYear);
    // Filtrar plantillas por año seleccionado
    this.cargarPlantillasUnidad();
  }

  CrearNuevaPlanilla(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/planilla']);
    }, 2000);
  }

  verPlantilla(idPlantilla: number): void {
    // Mostrar loading mientras se obtienen los datos
    this.loadingService.show();

    // Obtener los datos completos de la plantilla usando el endpoint formulario
    this.apiService.getPlantillaPorId(idPlantilla).subscribe({
      next: (datosCompletos) => {
        this.loadingService.hide();
        // Navegar a planilla con los datos completos de la plantilla
        this.router.navigate(['/planilla'], {
          state: {
            plantilla: {
              ...datosCompletos,
              id_plantilla: idPlantilla
            }
          }
        });
      },
      error: (error) => {
        this.loadingService.hide();
        console.error('Error al obtener datos completos de la plantilla:', error);
        alert('Error al cargar los datos de la plantilla. Por favor, inténtelo nuevamente.');
      }
    });
  }

  descargarPDF(idPlantilla: number): void {
    this.pdfFormService.generateFormPDF(idPlantilla, this.apiService);
  }
}