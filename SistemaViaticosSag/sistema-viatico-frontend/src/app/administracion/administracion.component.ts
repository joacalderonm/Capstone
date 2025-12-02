import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { LoadingComponent } from '../components/loading/loading.component';
import { ApiService } from '../services/api.service';
import { EditCuentaPresupuestariaComponent } from '../edit-cuenta-presupuestaria/edit-cuenta-presupuestaria.component';
import { NewCuentaPresupuestariaComponent } from '../new-cuenta-presupuestaria/new-cuenta-presupuestaria.component';
import { EditMotivoCometidoComponent } from '../edit-motivo-cometido/edit-motivo-cometido.component';
import { NewMotivoCometidoComponent } from '../new-motivo-cometido/new-motivo-cometido.component';
import { EditProductoSubespComponent } from '../edit-producto-subesp/edit-producto-subesp.component';
import { NewProductoSubespComponent } from '../new-producto-subesp/new-producto-subesp.component';
import { NewProgramaComponent } from '../new-programa/new-programa.component';
import { EditProgramaComponent } from '../edit-programa/edit-programa.component';
import { EditUnidadComponent } from '../edit-unidad/edit-unidad.component';
import { NewUnidadComponent } from '../new-unidad/new-unidad.component';
import { EditGradoComponent } from '../edit-grado/edit-grado.component';

// Interfaces para las tablas CRUD
export interface CuentaPresupuestaria {
  id_cuenta_presupuestaria: number;
  codigo_presupuestaria: string;
  nombre_presupuestaria: string;
  activo: boolean;
  fecha_creacion: string;
  fecha_modificacion?: string;
}

export interface MotivoCometido {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ProductoSubesp {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Programa {
  id: number;
  codigo: number;
  nombre: string;
  activo: boolean;
}

export interface Unidad {
  id_unidad: number;
  codigo_unidad: string;
  nombre_unidad: string;
  nombre_jefe: string;
  descripcion?: string;
  activo: boolean;
}

export interface ValorViatico {
  id: number;
  tipo: string;
  valor: number;
}

export interface GradoEscala {
  id_grado: number;
  valor_porcentaje_100: number;
  valor_porcentaje_60: number;
  valor_porcentaje_50: number;
  valor_porcentaje_40: number;
  fecha_efectiva: string;
  fecha_vencimiento: string;
  activo: boolean;
}

// Datos mock para las tablas
const CUENTAS_PRESUPUESTARIAS_DATA: CuentaPresupuestaria[] = [
  { id_cuenta_presupuestaria: 1, codigo_presupuestaria: '1009-4987', nombre_presupuestaria: 'Cuenta 1', activo: true, fecha_creacion: '2024-01-01T00:00:00' },
  { id_cuenta_presupuestaria: 2, codigo_presupuestaria: '1009-4993', nombre_presupuestaria: 'Cuenta 2', activo: true, fecha_creacion: '2024-01-01T00:00:00' },
  { id_cuenta_presupuestaria: 3, codigo_presupuestaria: '1009-4995', nombre_presupuestaria: 'Cuenta 3', activo: true, fecha_creacion: '2024-01-01T00:00:00' },
];

const MOTIVOS_COMETIDO_DATA: MotivoCometido[] = [
  { id: 1, nombre: 'Motivo 1', descripcion: 'Descripción motivo 1', activo: true },
  { id: 2, nombre: 'Motivo 2', descripcion: 'Descripción motivo 2', activo: true },
];

const PRODUCTOS_SUBESP_DATA: ProductoSubesp[] = [
  { id: 1, nombre: 'Producto 1', descripcion: 'Descripción producto 1', activo: true },
  { id: 2, nombre: 'Producto 2', descripcion: 'Descripción producto 2', activo: true },
];

const PROGRAMAS_DATA: Programa[] = [
  { id: 1, codigo: 1, nombre: 'Programa 1', activo: true },
  { id: 2, codigo: 2, nombre: 'Programa 2', activo: true },
];

const UNIDADES_DATA: Unidad[] = [];

const VALORES_VIATICOS_DATA: ValorViatico[] = [
  { id: 1, tipo: 'Tipo 1', valor: 10000 },
  { id: 2, tipo: 'Tipo 2', valor: 20000 },
];

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule],
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit, AfterViewInit {
  // Propiedades para las tablas
  displayedColumnsCuentas: string[] = ['codigo_presupuestaria', 'nombre_presupuestaria', 'activo', 'opciones'];
  dataSourceCuentas = CUENTAS_PRESUPUESTARIAS_DATA;

  // Propiedades para expandir/contraer secciones
  isExpandedCuentas: boolean = false;
  isExpandedMotivos: boolean = false;
  isExpandedUnidades: boolean = false;
  isExpandedProductos: boolean = false;
  isExpandedProgramas: boolean = false;
  isExpandedValores: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCuentasPresupuestarias();
    this.loadMotivosCometido();
    this.loadProductosSubesp();
    this.loadProgramas();
    this.loadUnidades();
    this.loadGradoEscala();
  }

  ngAfterViewInit(): void {
    this.dataSourceProductos.paginator = this.paginator;
  }

  loadCuentasPresupuestarias(): void {
    this.apiService.getCuentasPresupuestarias().subscribe({
      next: (data) => {
        this.dataSourceCuentas = data;
      },
      error: (error) => {
        console.error('Error al cargar cuentas presupuestarias:', error);
      }
    });
  }

  editarCuenta(cuenta: CuentaPresupuestaria): void {
    this.apiService.getCuentaPresupuestariaById(cuenta.id_cuenta_presupuestaria).subscribe({
      next: (cuentaData) => {
        const dialogRef = this.dialog.open(EditCuentaPresupuestariaComponent, {
          width: '600px',
          disableClose: true,
          data: { cuenta: cuentaData }
        });

        dialogRef.afterClosed().subscribe((datosCuenta) => {
          if (datosCuenta) {
            this.actualizarCuenta(datosCuenta);
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar cuenta presupuestaria:', error);
      }
    });
  }

  actualizarCuenta(datos: any): void {
    // Solo enviar los campos que pueden ser actualizados según el schema
    const updateData: any = {};

    if (datos.codigo_presupuestaria !== undefined) {
      updateData.codigo_presupuestaria = datos.codigo_presupuestaria;
    }
    if (datos.nombre_presupuestaria !== undefined) {
      updateData.nombre_presupuestaria = datos.nombre_presupuestaria;
    }
    if (datos.activo !== undefined) {
      updateData.activo = datos.activo;
    }

    this.apiService.updateCuentaPresupuestaria(datos.id_cuenta_presupuestaria, updateData).subscribe({
      next: () => {
        this.loadCuentasPresupuestarias();
      },
      error: (err) => {
        console.error('Error al actualizar cuenta presupuestaria:', err);
      }
    });
  }

  toggleCuentaEstado(cuenta: CuentaPresupuestaria): void {
    const nuevoEstado = !cuenta.activo;
    this.apiService.updateCuentaPresupuestariaEstado(cuenta.id_cuenta_presupuestaria, nuevoEstado).subscribe({
      next: () => {
        cuenta.activo = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado de cuenta presupuestaria:', err);
      }
    });
  }

  toggleMotivoEstado(motivo: MotivoCometido): void {
    const nuevoEstado = !motivo.activo;
    this.apiService.updateMotivoCometidoEstado(motivo.id, nuevoEstado).subscribe({
      next: () => {
        motivo.activo = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado de motivo de cometido:', err);
      }
    });
  }

  toggleUnidadEstado(unidad: Unidad): void {
    const nuevoEstado = !unidad.activo;
    this.apiService.updateUnidadEstado(unidad.id_unidad, nuevoEstado).subscribe({
      next: () => {
        unidad.activo = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado de unidad:', err);
      }
    });
  }

  toggleProductoEstado(producto: ProductoSubesp): void {
    const nuevoEstado = !producto.activo;
    this.apiService.updateProductoSubespEstado(producto.id, nuevoEstado).subscribe({
      next: () => {
        producto.activo = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado de producto subespecie:', err);
      }
    });
  }

  toggleProgramaEstado(programa: Programa): void {
    const nuevoEstado = !programa.activo;
    this.apiService.updateProgramaEstado(programa.id, nuevoEstado).subscribe({
      next: () => {
        programa.activo = nuevoEstado;
      },
      error: (err) => {
        console.error('Error al cambiar estado de programa:', err);
      }
    });
  }

  crearCuenta(): void {
    const dialogRef = this.dialog.open(NewCuentaPresupuestariaComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((datosCuenta) => {
      if (datosCuenta) {
        this.agregarCuenta(datosCuenta);
      }
    });
  }

  agregarCuenta(datos: any): void {
    this.apiService.createCuentaPresupuestaria(datos).subscribe({
      next: () => {
        this.loadCuentasPresupuestarias();
      },
      error: (err) => {
        console.error('Error al crear cuenta presupuestaria:', err);
      }
    });
  }

  crearMotivo(): void {
    const dialogRef = this.dialog.open(NewMotivoCometidoComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((datosMotivo) => {
      if (datosMotivo) {
        this.agregarMotivo(datosMotivo);
      }
    });
  }

  crearProducto(): void {
    const dialogRef = this.dialog.open(NewProductoSubespComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((datosProducto) => {
      if (datosProducto) {
        this.agregarProducto(datosProducto);
      }
    });
  }

  crearPrograma(): void {
    const dialogRef = this.dialog.open(NewProgramaComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((datosPrograma) => {
      if (datosPrograma) {
        this.agregarPrograma(datosPrograma);
      }
    });
  }

  crearUnidad(): void {
    const dialogRef = this.dialog.open(NewUnidadComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((datosUnidad) => {
      if (datosUnidad) {
        this.agregarUnidad(datosUnidad);
      }
    });
  }

  agregarMotivo(datos: any): void {
    this.apiService.createMotivoCometido(datos).subscribe({
      next: () => {
        this.loadMotivosCometido();
      },
      error: (err) => {
        console.error('Error al crear motivo de cometido:', err);
      }
    });
  }

  agregarProducto(datos: any): void {
    this.apiService.createProductoSubesp(datos).subscribe({
      next: () => {
        this.loadProductosSubesp();
      },
      error: (err) => {
        console.error('Error al crear producto subespecie:', err);
      }
    });
  }

  agregarPrograma(datos: any): void {
    this.apiService.createPrograma(datos).subscribe({
      next: () => {
        this.loadProgramas();
      },
      error: (err) => {
        console.error('Error al crear programa:', err);
      }
    });
  }

  agregarUnidad(datos: any): void {
    this.apiService.createUnidad(datos).subscribe({
      next: () => {
        this.loadUnidades();
      },
      error: (err) => {
        console.error('Error al crear unidad:', err);
      }
    });
  }

  editarMotivo(motivo: MotivoCometido): void {
    const dialogRef = this.dialog.open(EditMotivoCometidoComponent, {
      width: '600px',
      disableClose: true,
      data: { motivo: motivo }
    });

    dialogRef.afterClosed().subscribe((datosMotivo) => {
      if (datosMotivo) {
        this.actualizarMotivo(datosMotivo);
      }
    });
  }

  actualizarMotivo(datos: any): void {
    // Solo enviar los campos que pueden ser actualizados según el schema
    const updateData: any = {};

    if (datos.nombre_cometido !== undefined) {
      updateData.nombre_cometido = datos.nombre_cometido;
    }
    if (datos.descripcion_cometido !== undefined) {
      updateData.descripcion_cometido = datos.descripcion_cometido;
    }
    if (datos.activo !== undefined) {
      updateData.activo = datos.activo;
    }

    this.apiService.updateMotivoCometido(datos.id_motivo_cometido, updateData).subscribe({
      next: () => {
        this.loadMotivosCometido();
      },
      error: (err) => {
        console.error('Error al actualizar motivo de cometido:', err);
      }
    });
  }

  editarProducto(producto: ProductoSubesp): void {
    const dialogRef = this.dialog.open(EditProductoSubespComponent, {
      width: '600px',
      disableClose: true,
      data: { producto: producto }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProductosSubesp();
      }
    });
  }


  editarPrograma(programa: Programa): void {
    const dialogRef = this.dialog.open(EditProgramaComponent, {
      width: '600px',
      disableClose: true,
      data: { programa: programa }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProgramas();
      }
    });
  }


  editarUnidad(unidad: Unidad): void {
    const dialogRef = this.dialog.open(EditUnidadComponent, {
      width: '600px',
      disableClose: true,
      data: { unidad: unidad }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUnidades();
      }
    });
  }

  actualizarUnidad(datos: any): void {
    // Solo enviar los campos que pueden ser actualizados según el schema
    const updateData: any = {};

    if (datos.codigo_unidad !== undefined) {
      updateData.codigo_unidad = datos.codigo_unidad;
    }
    if (datos.nombre_unidad !== undefined) {
      updateData.nombre_unidad = datos.nombre_unidad;
    }
    if (datos.descripcion !== undefined) {
      updateData.descripcion = datos.descripcion;
    }

    this.apiService.updateUnidad(datos.id_unidad, updateData).subscribe({
      next: () => {
        this.loadUnidades();
      },
      error: (err) => {
        console.error('Error al actualizar unidad:', err);
      }
    });
  }

  editarValor(valor: ValorViatico): void {
    // TODO: implementar edición de valor viático
  }

  actualizarValores(): void {
    const dialogRef = this.dialog.open(EditGradoComponent, {
      width: '70vw',
      maxWidth: '750px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Lógica después de guardar
        this.loadGradoEscala();
      }
    });
  }

  loadMotivosCometido(): void {
    this.apiService.getMotivosCometido().subscribe({
      next: (data) => {
        this.dataSourceMotivos = data.map(item => ({
          id: item.id_motivo_cometido,
          nombre: item.nombre_cometido,
          descripcion: item.descripcion_cometido,
          activo: item.activo
        }));
      },
      error: (error) => {
        console.error('Error al cargar motivos de cometido:', error);
      }
    });
  }

  loadProductosSubesp(): void {
    this.apiService.getProductosSubesp().subscribe({
      next: (data) => {
        this.dataSourceProductos.data = data.map(item => ({
          id: item.id_producto_subesp,
          nombre: item.codigo_subesp,
          descripcion: item.descripcion,
          activo: item.activo
        }));
      },
      error: (error) => {
        console.error('Error al cargar productos subespecies:', error);
      }
    });
  }

  loadProgramas(): void {
    this.apiService.getProgramas().subscribe({
      next: (data) => {
        this.dataSourceProgramas = data.map(item => ({
          id: item.id_programa,
          codigo: item.codigo_programa,
          nombre: item.nombre_programa,
          activo: item.activo
        }));
      },
      error: (error) => {
        console.error('Error al cargar programas:', error);
      }
    });
  }

  loadUnidades(): void {
    this.apiService.getUnidades().subscribe({
      next: (data) => {
        this.dataSourceUnidades = data;
      },
      error: (error) => {
        console.error('Error al cargar unidades:', error);
      }
    });
  }

  loadGradoEscala(): void {
    this.apiService.getGradoEscala().subscribe({
      next: (data) => {
        this.dataSourceGrados = data;
      },
      error: (error) => {
        console.error('Error al cargar grados escala:', error);
      }
    });
  }

  // Métodos para expandir/contraer secciones
  toggleSectionCuentas(): void {
    this.isExpandedCuentas = !this.isExpandedCuentas;
  }

  toggleSectionMotivos(): void {
    this.isExpandedMotivos = !this.isExpandedMotivos;
  }

  toggleSectionUnidades(): void {
    this.isExpandedUnidades = !this.isExpandedUnidades;
  }

  toggleSectionProductos(): void {
    this.isExpandedProductos = !this.isExpandedProductos;
  }

  toggleSectionProgramas(): void {
    this.isExpandedProgramas = !this.isExpandedProgramas;
  }

  toggleSectionValores(): void {
    this.isExpandedValores = !this.isExpandedValores;
  }

  displayedColumnsMotivos: string[] = ['nombre', 'descripcion', 'activo', 'opciones'];
  dataSourceMotivos = MOTIVOS_COMETIDO_DATA;

  displayedColumnsProductos: string[] = ['nombre', 'descripcion', 'activo', 'opciones'];
  dataSourceProductos = new MatTableDataSource<ProductoSubesp>(PRODUCTOS_SUBESP_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumnsProgramas: string[] = ['codigo', 'nombre', 'activo', 'opciones'];
  dataSourceProgramas = PROGRAMAS_DATA;

  displayedColumnsUnidades: string[] = ['codigo_unidad', 'nombre_unidad', 'nombre_jefe', 'activo', 'opciones'];
  dataSourceUnidades = UNIDADES_DATA;

  displayedColumnsGrados: string[] = ['id_grado', 'valor_porcentaje_100', 'valor_porcentaje_60', 'valor_porcentaje_50', 'valor_porcentaje_40'];
  dataSourceGrados: GradoEscala[] = [];

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
