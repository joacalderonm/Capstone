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
import { EditViaticoComponent } from '../edit-viatico/edit-viatico.component';

// Interfaces
interface ViaticoResponse {
  id_viatico: number;
  codigo_programa: number;
  codigo_unidad: number;
  codigo_subesp: number;
  codigo_presupuestaria: number;
  nombre_region: string;
  dias_100: number;
  dias_40: number;
  total_viatico: number;
}

@Component({
  selector: 'app-viaticos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './viaticos.component.html',
  styleUrl: './viaticos.component.css'
})
export class ViaticosComponent implements OnInit, OnChanges {
  @Input() idPlantilla!: number;
  @Input() isCerrada: boolean = false;
  @Output() refreshRequested = new EventEmitter<void>();

  viaticos: ViaticoResponse[] = [];
  loading: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit(): void {
    if (this.idPlantilla) {
      this.cargarViaticos();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPlantilla'] && changes['idPlantilla'].currentValue) {
      this.cargarViaticos();
    }
  }

  cargarViaticos(): void {
    if (!this.idPlantilla) return;

    this.loading = true;
    this.apiService.getViaticosPorPlantilla(this.idPlantilla).subscribe({
      next: (viaticos) => {
        this.viaticos = viaticos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar viáticos:', error);
        this.viaticos = [];
        this.loading = false;
      }
    });
  }

  refreshViaticos(): void {
    this.cargarViaticos();
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

  editarViatico(viatico: ViaticoResponse): void {
    this.loading = true;
    this.apiService.getViaticoParaEditar(viatico.id_viatico).subscribe({
      next: (viaticoEditForm) => {
        this.ngZone.run(() => {
          this.loading = false;
          const dialogRef = this.dialog.open(EditViaticoComponent, {
            width: '900px',
            disableClose: true,
            data: { viatico: viaticoEditForm }
          });

          dialogRef.afterClosed().subscribe((datosViatico) => {
            if (datosViatico) {
              this.actualizarViatico(viatico.id_viatico, datosViatico);
            }
          });
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al obtener datos para editar viático:', err);
          this.loading = false;
        });
      }
    });
  }

  private actualizarViatico(viaticoId: number, datos: any): void {
    this.loading = true;
    this.apiService.updateViatico(viaticoId, datos).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Viático actualizado:', response);
          this.refreshViaticos();
          this.refreshRequested.emit();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al actualizar viático:', err);
          const errorMessage = err.error?.detail || 'Error al actualizar el viático. Por favor, inténtelo nuevamente.';
          alert(errorMessage);
          this.loading = false;
        });
      }
    });
  }

  eliminarViatico(viatico: ViaticoResponse): void {
    this.loading = true;
    this.apiService.deleteViatico(viatico.id_viatico).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Viático eliminado:', response);
          this.refreshViaticos();
          this.refreshRequested.emit();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error al eliminar viático:', error);
          this.loading = false;
        });
      }
    });
  }
}