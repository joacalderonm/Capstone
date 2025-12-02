import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { PlantillaCreate, RespuestaCreacionPlantilla, RespuestaPlantillaListadoUsuario } from '../interfaces/plantilla';
import { LoadingService } from '../services/loading.service';

@Component({
    selector: 'app-listado',
    templateUrl: './listado.component.html',
    styleUrl: './listado.component.css',
    imports: [CommonModule, FormsModule]
})
export class ListadoComponent implements OnInit {
   selectedYear: number = new Date().getFullYear();
   years: number[] = [];
   plantillas: RespuestaPlantillaListadoUsuario[] = [];
   isLoading: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private loadingService: LoadingService
  ) {} // Inyecta el enrutador


  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = 2025; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.cargarPlantillas();
  }

  selectYear(year: number) {
    this.selectedYear = year;
    console.log('Year changed to:', this.selectedYear);
    this.cargarPlantillas();
  }

  getNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || 'Mes desconocido';
  }

  cargarPlantillas(): void {
    // Obtener los datos completos del usuario desde localStorage
    const usuarioDatos = localStorage.getItem('usuarioDatos');
    if (!usuarioDatos) {
      alert('No se encontraron los datos del usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    try {
      const usuario = JSON.parse(usuarioDatos);
      const idUsuario = usuario.id_usuario;

      if (!idUsuario) {
        alert('No se encontró el ID del usuario en los datos almacenados. Por favor, inicie sesión nuevamente.');
        return;
      }

      this.isLoading = true;

      this.apiService.getPlantillasPorUsuario(idUsuario).subscribe({
        next: (plantillas: RespuestaPlantillaListadoUsuario[]) => {
          // Filtrar por año seleccionado
          this.plantillas = plantillas.filter(p => p.ano === this.selectedYear);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al cargar plantillas:', error);
          // No mostrar alert para errores de carga - solo loggear
        }
      });
    } catch (error) {
      this.isLoading = false;
      console.error('Error al parsear datos del usuario:', error);
      alert('Error al procesar los datos del usuario. Por favor, inicie sesión nuevamente.');
    }
  }

  CrearNuevaPlanilla(): void {
    // Obtener los datos completos del usuario desde localStorage
    const usuarioDatos = localStorage.getItem('usuarioDatos');
    if (!usuarioDatos) {
      alert('No se encontraron los datos del usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    try {
      const usuario = JSON.parse(usuarioDatos);
      const idUsuario = usuario.id_usuario;

      if (!idUsuario) {
        alert('No se encontró el ID del usuario en los datos almacenados. Por favor, inicie sesión nuevamente.');
        return;
      }

      this.loadingService.show();

      const plantillaData: PlantillaCreate = {
        id_usuario: parseInt(idUsuario, 10)
      };

      // Paso 1: Crear la plantilla
      this.apiService.createPlantilla(plantillaData).subscribe({
        next: (respuestaCreacion) => {
          const idPlantilla = respuestaCreacion.id_plantilla;
          if (!idPlantilla) {
            this.loadingService.hide();
            alert('Error: No se pudo obtener el ID de la plantilla creada.');
            return;
          }

          // Paso 2: Obtener los datos completos de la plantilla
          this.apiService.getPlantillaPorId(idPlantilla).subscribe({
            next: (datosPlantilla) => {
              this.loadingService.hide();
              // Navegar a planilla con los datos completos de la plantilla
              this.router.navigate(['/planilla'], {
                state: {
                  plantilla: {
                    ...datosPlantilla,
                    id_plantilla: idPlantilla
                  }
                }
              });
            },
            error: (error) => {
              this.loadingService.hide();
              console.error('Error al obtener datos de la plantilla:', error);
              alert('Plantilla creada pero error al cargar datos. Por favor, inténtelo nuevamente.');
            }
          });
        },
        error: (error) => {
          this.loadingService.hide();
          console.error('Error al crear plantilla:', error);
          alert('Error al crear la plantilla. Por favor, inténtelo nuevamente.');
        }
      });
    } catch (error) {
      this.loadingService.hide();
      console.error('Error al parsear datos del usuario:', error);
      alert('Error al procesar los datos del usuario. Por favor, inicie sesión nuevamente.');
    }
  }

  navegarAEditar(plantilla: RespuestaPlantillaListadoUsuario): void {
    this.loadingService.show();

    // Obtener los datos completos de la plantilla usando el endpoint formulario
    this.apiService.getPlantillaPorId(plantilla.id_plantilla).subscribe({
      next: (datosCompletos) => {
        this.loadingService.hide();
        // Navegar a planilla con los datos completos de la plantilla
        this.router.navigate(['/planilla'], {
          state: {
            plantilla: {
              ...datosCompletos,
              id_plantilla: plantilla.id_plantilla
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
}