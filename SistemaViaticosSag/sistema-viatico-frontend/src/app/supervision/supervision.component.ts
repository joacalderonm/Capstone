import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card'; // Importar CardModule
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { BackendUser } from '../interfaces/backend-user';
import { RespuestaPlantillaListadoUsuario } from '../interfaces/plantilla';
import { PdfService } from '../services/pdf.service';
import { PdfFormService } from '../services/pdf-form.service';
import { LoadingService } from '../services/loading.service';
import { LoadingComponent } from '../components/loading/loading.component';
import { MatDialog } from '@angular/material/dialog';
import { NewSubroganteComponent } from '../new-subrogante/new-subrogante.component';

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

// Interfaz para los datos de la tabla de supervisión
export interface UnidadElement {
  year: number;
  month: string;
  funcionario: string;
  number: number;
  monto: number;
  enlace: string;
  id_plantilla: number;
}

// Interfaz para subrogantes
interface Subrogante {
  id_usuario: number;
  nombre: string;
  rut: string;
}

const ELEMENT_DATA_UNIDAD: UnidadElement[] = [];

@Component({
  selector: 'app-supervision',
  standalone: true, // Convertido a standalone
  imports: [
    CommonModule,
    CardModule,       // Añadido a imports
    MatTableModule,
    FormsModule,      // Añadido a imports
    LoadingComponent
  ],
  templateUrl: './supervision.component.html',
  styleUrls: ['./supervision.component.css']
})
export class SupervisionComponent implements OnInit {
  // Propiedades para los indicadores
  public productounidad: number = 0;
  public mesunidad: number = 2500100;
  public cerradas: string = '0/0';

  // Propiedades para la unidad
  public nombreUnidad: string = '';
  public codigoUnidad: string = '';
  public idUnidad: number = 0;
  public idUsuario: number = 0;

  // Propiedad para el mes actual
  public mesActual: string = '';

  // Propiedades para el select
  products: Product[] = [];
  selectedProduct: Product | undefined;
  productosSubesp: ProductoSubesp[] = [];
  montosProducto: MontoProducto[] = [];

  // Propiedades para la tabla de supervisión
  displayedColumnsUnidad: string[] = ['year', 'month', 'funcionario', 'number', 'monto', 'opciones'];
  dataSourceUnidad: UnidadElement[] = [];

  // Propiedades para la tabla de subrogantes
  displayedColumnsSubrogantes: string[] = ['nombre', 'rut', 'opciones'];
  dataSourceSubrogantes: Subrogante[] = [];

  // Propiedades para filtros de tabla
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private apiService: ApiService, private pdfService: PdfService, private pdfFormService: PdfFormService, private loadingService: LoadingService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarDatosUnidad();
    this.setMesActual();
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

  private async loadMontosProductoUnidad(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.idUnidad) {
        this.apiService.getMontoTotalProductoMesUnidad(this.idUnidad).subscribe({
          next: (montos: MontoProducto[]) => {
            console.log('Datos del API montos producto unidad:', montos);
            this.montosProducto = montos;
            this.combineProductosWithMontos();
            resolve();
          },
          error: (error) => {
            console.error('Error al obtener montos por producto unidad:', error);
            reject(error);
          }
        });
      } else {
        resolve(); // No hay idUnidad, no podemos cargar
      }
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
        this.productounidad = parseFloat(this.selectedProduct.code) || 0;
        console.log('Producto seleccionado por defecto:', this.selectedProduct);
      }
    } else {
      console.log('No hay productos subesp para combinar');
    }
  }

  setMesActual(): void {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const mesActualIndex = new Date().getMonth();
    this.mesActual = meses[mesActualIndex];
  }

  cargarDatosUnidad(): void {
    // Obtener datos del usuario desde localStorage
    const datosUsuario = localStorage.getItem('usuarioDatos');
    if (datosUsuario) {
      const usuario = JSON.parse(datosUsuario);
      console.log('Datos del usuario desde localStorage:', usuario);
      this.nombreUnidad = usuario.nombre_unidad || '';
      this.idUnidad = usuario.id_unidad || 0;
      this.idUsuario = usuario.id_usuario || 0;
      this.codigoUnidad = usuario.codigo_unidad || '';
      console.log('ID de unidad del usuario:', this.idUnidad);
      console.log('ID del usuario:', this.idUsuario);
      console.log('Nombre unidad:', this.nombreUnidad);

      // Cargar productos y montos
      this.loadProductosSubesp().then(() => {
        this.loadMontosProductoUnidad();
      });

      // Cargar el monto total del mes para la unidad
      this.cargarMontoTotalMesUnidad();

      // Cargar el conteo de plantillas
      this.cargarConteoPlantillas();

      // Cargar plantillas de la unidad
      this.cargarPlantillasUnidad();

      // Cargar subrogantes de la unidad
      this.cargarSubrogantesUnidad();
    } else {
      console.error('No hay datos de usuario en localStorage');
    }
  }

  cargarMontoTotalMesUnidad(): void {
    if (this.idUnidad) {
      console.log('Llamando al endpoint con id_unidad:', this.idUnidad);
      this.apiService.getMontoTotalMesUnidad(this.idUnidad).subscribe({
        next: (data: any) => {
          console.log('Respuesta completa del endpoint:', data);
          console.log('Tipo de data:', typeof data);
          console.log('Keys de data:', Object.keys(data));

          // El backend retorna un objeto con la propiedad 'monto_total'
          this.mesunidad = data.monto_total || 0;
          console.log('Valor final asignado a mesunidad:', this.mesunidad);
        },
        error: (error) => {
          console.error('Error al cargar monto total del mes para la unidad:', error);
        }
      });
    } else {
      console.error('No hay idUnidad para llamar al endpoint');
    }
  }

  cargarConteoPlantillas(): void {
    if (this.idUnidad) {
      console.log('Llamando al endpoint conteo_plantilla con id_unidad:', this.idUnidad);
      this.apiService.getConteoPlantilla(this.idUnidad).subscribe({
        next: (data: any) => {
          console.log('Respuesta completa del endpoint conteo_plantilla:', data);
          console.log('Tipo de data:', typeof data);
          console.log('Keys de data:', Object.keys(data));

          // El backend retorna un objeto con 'total_plantillas_cerradas' y 'total_plantillas'
          const cerradas = data.total_plantillas_cerradas || 0;
          const total = data.total_plantillas || 0;
          this.cerradas = `${cerradas}/${total}`;
          console.log('Valor final asignado a cerradas:', this.cerradas);
        },
        error: (error) => {
          console.error('Error al cargar conteo de plantillas:', error);
        }
      });
    } else {
      console.error('No hay idUnidad para llamar al endpoint de conteo');
    }
  }

  cargarPlantillasUnidad(): void {
    if (!this.idUnidad) {
      console.error('No se encontró el ID de la unidad');
      return;
    }

    this.isLoading = true;

    this.apiService.getPlantillasPorUnidad(this.idUnidad).subscribe({
      next: (plantillas: RespuestaPlantillaListadoUsuario[]) => {
        // Mapear los datos del API a la estructura de la tabla
        this.dataSourceUnidad = plantillas.map(plantilla => {
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

  cargarSubrogantesUnidad(): void {
    console.log('Llamando cargarSubrogantesUnidad con idUnidad:', this.idUnidad);
    if (this.idUnidad == null) {
      console.error('No se encontró el ID de la unidad');
      return;
    }

    this.apiService.getUsuariosUnidad(this.idUnidad).subscribe({
      next: (usuarios: any[]) => {
        console.log('Usuarios de la unidad:', usuarios);
        // Filtrar solo los subrogantes
        this.dataSourceSubrogantes = usuarios
          .filter(usuario => usuario.es_subrogante === true)
          .map(usuario => ({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre_usuario,
            rut: usuario.rut_completo
          }));

        console.log('Subrogantes de la unidad cargados:', this.dataSourceSubrogantes);
      },
      error: (error) => {
        console.error('Error al cargar subrogantes de la unidad:', error);
      }
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

  eliminarSubrogante(subrogante: Subrogante): void {
    this.apiService.updateSubrogante(subrogante.id_usuario, false).subscribe({
      next: () => {
        console.log('Subrogante eliminado exitosamente');
        // Recargar la tabla de subrogantes
        this.cargarSubrogantesUnidad();
      },
      error: (error) => {
        console.error('Error al eliminar subrogante:', error);
        alert('Error al eliminar el subrogante. Por favor, inténtelo nuevamente.');
      }
    });
  }

  abrirModalAgregarSubrogante(): void {
    const dialogRef = this.dialog.open(NewSubroganteComponent, {
      width: '400px',
      data: { idUnidad: this.idUnidad }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recargar la tabla de subrogantes si se agregó uno
        this.cargarSubrogantesUnidad();
      }
    });
  }
}