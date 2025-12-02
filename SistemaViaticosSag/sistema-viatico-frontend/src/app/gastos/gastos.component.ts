import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Importaciones de Angular Material
import { MatDialog } from '@angular/material/dialog';

// Servicios
import { ApiService } from '../services/api.service';

// Componentes
import { EditGastoComponent } from '../edit-gasto/edit-gasto.component';

// Interfaces
interface GastoReembolsableResponse {
  id_gasto_reembolsable: number;
  codigo_gasto: number;
  descripcion_gasto: string;
  codigo_programa: number;
  nombre_programa: string;
  codigo_subesp: string;
  numero_documento: string;
  fecha: string;
  valor: number;
  descripcion: string;
}

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css'
})
export class GastosComponent implements OnInit, OnChanges {
  @Input() idPlantilla!: number;
  @Input() isCerrada: boolean = false;
  @Output() refreshRequested = new EventEmitter<void>();

  gastos: GastoReembolsableResponse[] = [];
  loading: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit(): void {
    if (this.idPlantilla) {
      this.cargarGastos();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPlantilla'] && changes['idPlantilla'].currentValue) {
      this.cargarGastos();
    }
  }

  cargarGastos(): void {
    if (!this.idPlantilla) return;

    this.loading = true;
    this.apiService.getGastosReembolsablesPorPlantilla(this.idPlantilla).subscribe({
      next: (gastos) => {
        this.gastos = gastos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar gastos reembolsables:', error);
        this.gastos = [];
        this.loading = false;
      }
    });
  }

  refreshGastos(): void {
    this.cargarGastos();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  editarGasto(gasto: GastoReembolsableResponse): void {
    this.loading = true;
    this.apiService.getGastoParaEditar(gasto.id_gasto_reembolsable).subscribe({
      next: (gastoEditForm) => {
        this.ngZone.run(() => {
          this.loading = false;
          const dialogRef = this.dialog.open(EditGastoComponent, {
            width: '900px',
            disableClose: true,
            data: { gasto: gastoEditForm }
          });

          dialogRef.afterClosed().subscribe((datosGasto) => {
            if (datosGasto) {
              this.actualizarGasto(gasto.id_gasto_reembolsable, datosGasto);
            }
          });
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al obtener datos para editar gasto:', err);
          this.loading = false;
        });
      }
    });
  }

  private actualizarGasto(gastoId: number, datos: any): void {
    this.loading = true;
    this.apiService.updateGastoReembolsable(gastoId, datos).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Gasto reembolsable actualizado:', response);
          this.refreshGastos();
          this.refreshRequested.emit();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al actualizar gasto reembolsable:', err);
          this.loading = false;
        });
      }
    });
  }

  eliminarGasto(gasto: GastoReembolsableResponse): void {
    this.loading = true;
    this.apiService.deleteGastoReembolsable(gasto.id_gasto_reembolsable).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Gasto reembolsable eliminado:', response);
          this.refreshGastos();
          this.refreshRequested.emit();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error al eliminar gasto reembolsable:', error);
          this.loading = false;
        });
      }
    });
  }
}
