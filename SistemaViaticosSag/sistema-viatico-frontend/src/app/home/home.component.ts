import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { PdfService } from '../services/pdf.service';
import { PdfFormService } from '../services/pdf-form.service';
import { LoadingService } from '../services/loading.service';
import { RespuestaPlantillaListadoUsuario } from '../interfaces/plantilla';

// Interfaz para los datos de la tabla
export interface PeriodicElement {
  year: number;
  month: string;
  number: number;
  monto: number;
  estado: string;
  id_plantilla: number;
}

// Interfaz para las opciones del select
interface Product {
  name: string;
  code: string;
}

// Interfaz para productos del API
interface ProductoSubesp {
  id_producto_subesp: number;
  codigo_subesp: string;
}

interface MontoProducto {
  codigo_subesp: string;
  monto_total: number;
}

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
      CommonModule,
      CardModule,
      MatTableModule,
      FormsModule,   // Solo necesitamos FormsModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Propiedades para la tabla
  displayedColumns: string[] = ['year', 'month', 'number', 'monto', 'estado', 'opciones'];
  dataSource: PeriodicElement[] = [];

  // Propiedades para los indicadores
  public producto: number = 0;
  public mes: number = 0;
  public ano: number = 0;

  // Propiedades para el mes y año actuales
  public currentMonth: string;
  public currentYear: number;

  // Propiedades para el select
  products: Product[] = [];
  selectedProduct: Product | undefined;
  productosSubesp: ProductoSubesp[] = [];
  montosProducto: MontoProducto[] = [];

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router, private pdfService: PdfService, private pdfFormService: PdfFormService, private loadingService: LoadingService) {
    // Inicialización del mes y año actuales
    const now = new Date();
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.currentMonth = months[now.getMonth()];
    this.currentYear = now.getFullYear();

    // Inicialización de la lista de productos (vacía inicialmente)
    this.products = [];
  }

  async ngOnInit(): Promise<void> {
    console.log('HomeComponent: Iniciando ngOnInit');
    try {
      // Obtener el usuario una sola vez al inicio
      const user = this.authService.getCurrentUser();
      if (!user) {
        console.error('No hay usuario autenticado');
        return;
      }

      const firebaseUid = user.uid;
      const backendUser = await this.apiService.getUsuarioByFirebaseUid(firebaseUid).toPromise();
      if (!backendUser || !backendUser.id_usuario) {
        console.error('No se pudo obtener el usuario del backend');
        return;
      }

      const idUsuario = backendUser.id_usuario;

      // Paso 1: Cargar productos primero (necesario para el select)
      await this.loadProductosSubesp();

      // Paso 2: Ejecutar las demás llamadas HTTP en paralelo
      const promises = [
        this.loadMontos(idUsuario),
        this.loadMontosProducto(idUsuario),
        this.loadPlantillas(idUsuario)
      ];

      await Promise.allSettled(promises);
      console.log('HomeComponent: ngOnInit completado exitosamente');
    } catch (error) {
      console.error('HomeComponent: Error en ngOnInit:', error);
    }
  }

  private async loadMontos(idUsuario: number): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cargar monto total del mes
      this.apiService.getMontoTotalMes(idUsuario).subscribe({
        next: (montoMes) => {
          console.log('Datos del API mes:', montoMes);
          this.mes = montoMes.monto_total || 0;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar monto total del mes:', error);
          reject(error);
        }
      });

      // Cargar monto total del año
      this.apiService.getMontoTotalAno(idUsuario).subscribe({
        next: (montoAno) => {
          console.log('Datos del API año:', montoAno);
          this.ano = montoAno.monto_total || 0;
        },
        error: (error) => {
          console.error('Error al cargar monto total del año:', error);
        }
      });
    });
  }

  private async loadProductosSubesp(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getProductosSubesp().subscribe({
        next: (productos: ProductoSubesp[]) => {
          console.log('Productos subesp cargados:', productos);
          this.productosSubesp = productos;
          // Por ahora solo guardamos los productos, el select se llenará después de combinar con los montos
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar productos subesp:', error);
          reject(error);
        }
      });
    });
  }

  private async loadMontosProducto(idUsuario: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getMontoTotalProductoMes(idUsuario).subscribe({
        next: (montos: MontoProducto[]) => {
          console.log('Datos del API montos producto:', montos);
          this.montosProducto = montos;
          this.combineProductosWithMontos();
          resolve();
        },
        error: (error) => {
          console.error('Error al obtener montos por producto:', error);
          reject(error);
        }
      });
    });
  }

  private combineProductosWithMontos(): void {
    console.log('Combinando productos con montos...');
    console.log('Productos subesp:', this.productosSubesp);
    console.log('Montos producto:', this.montosProducto);

    if (this.productosSubesp.length > 0) {
      // Crear un mapa de montos por codigo_subesp para búsqueda rápida
      const montosMap = new Map<string, number>();
      this.montosProducto.forEach(monto => {
        montosMap.set(monto.codigo_subesp, monto.monto_total);
      });

      // Combinar productos con montos
      this.products = this.productosSubesp.map(producto => {
        const monto = montosMap.get(producto.codigo_subesp) || 0;
        return {
          name: producto.codigo_subesp,
          code: monto.toString() // El valor será el monto
        };
      });

      console.log('Productos combinados:', this.products);

      // Establecer el primer producto como seleccionado por defecto
      if (this.products.length > 0 && !this.selectedProduct) {
        this.selectedProduct = this.products[0];
        this.producto = parseFloat(this.selectedProduct.code) || 0;
        console.log('Producto seleccionado por defecto:', this.selectedProduct);
      }
    } else {
      console.log('No hay productos subesp para combinar');
    }
  }

  private async loadPlantillas(idUsuario: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getPlantillasPorUsuario(idUsuario).subscribe({
        next: (plantillas: RespuestaPlantillaListadoUsuario[]) => {
          console.log('Datos del API plantillas:', plantillas);
          // Mapear los datos del API a la estructura de la tabla
          this.dataSource = plantillas.map(plantilla => {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return {
              year: plantilla.ano,
              month: months[plantilla.mes - 1], // mes es 1-based
              number: plantilla.id_plantilla, // Usar id_plantilla como número de resolución
              monto: plantilla.total_general || 0,
              estado: plantilla.nombre_estado_plantilla,
              id_plantilla: plantilla.id_plantilla
            };
          });
          console.log('DataSource actualizado:', this.dataSource);
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar plantillas:', error);
          reject(error);
        }
      });
    });
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