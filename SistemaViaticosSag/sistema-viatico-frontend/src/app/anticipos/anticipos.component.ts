import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

// Importaciones de Angular Material
import { MatDialog } from '@angular/material/dialog';

// Componentes
import { EditAnticipoComponent } from '../edit-anticipo/edit-anticipo.component';

// Servicios
import { ApiService } from '../services/api.service';

// Interfaces
interface AnticipoResponse {
  id_viatico: number;
  codigo_programa: number;
  codigo_unidad: number;
  codigo_subesp: string;
  codigo_presupuestaria: number;
  nombre_region: string;
  dias_100: number;
  dias_40: number;
  total_viatico: number;
}

@Component({
  selector: 'app-anticipos',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule
  ],
  templateUrl: './anticipos.component.html',
  styleUrl: './anticipos.component.css'
})
export class AnticiposComponent implements OnInit, OnChanges {
  @Input() idPlantilla!: number;
  @Input() isCerrada: boolean = false;
  @Output() refreshRequested = new EventEmitter<void>();

  anticipos: AnticipoResponse[] = [];
  loading: boolean = false;

  constructor(private apiService: ApiService, private dialog: MatDialog, private ngZone: NgZone) {}

  ngOnInit(): void {
    if (this.idPlantilla) {
      this.cargarAnticipos();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idPlantilla'] && changes['idPlantilla'].currentValue) {
      this.cargarAnticipos();
    }
  }

  cargarAnticipos(): void {
    if (!this.idPlantilla) return;

    this.loading = true;
    this.apiService.getAnticiposPorPlantilla(this.idPlantilla).subscribe({
      next: (anticipos) => {
        this.anticipos = anticipos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar anticipos:', error);
        this.anticipos = [];
        this.loading = false;
      }
    });
  }

  refreshAnticipos(): void {
    this.cargarAnticipos();
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

  editarAnticipo(anticipo: AnticipoResponse): void {
    this.apiService.getAnticipoParaEditar(anticipo.id_viatico).subscribe({
      next: (anticipoEditForm) => {
        this.ngZone.run(() => {
          const dialogRef = this.dialog.open(EditAnticipoComponent, {
            width: '900px',
            disableClose: true,
            data: { anticipo: anticipoEditForm }
          });

          dialogRef.afterClosed().subscribe((datosAnticipo) => {
            if (datosAnticipo) {
              this.actualizarAnticipo(anticipo.id_viatico, datosAnticipo);
            }
          });
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al obtener datos para editar anticipo:', err);
        });
      }
    });
  }

  eliminarAnticipo(anticipo: AnticipoResponse): void {
    this.apiService.deleteAnticipo(anticipo.id_viatico).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Anticipo eliminado:', response);
          this.refreshAnticipos();
          this.refreshRequested.emit();
        });
      },
      error: (error) => {
        this.ngZone.run(() => {
          console.error('Error al eliminar anticipo:', error);
        });
      }
    });
  }

  private actualizarAnticipo(anticipoId: number, datos: any): void {
    this.apiService.updateAnticipo(anticipoId, datos).subscribe({
      next: (response) => {
        this.ngZone.run(() => {
          console.log('Anticipo actualizado:', response);
          this.refreshAnticipos();
          this.refreshRequested.emit();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('Error al actualizar anticipo:', err);
          const errorMessage = err.error?.detail || 'Error al actualizar el anticipo. Por favor, inténtelo nuevamente.';
          alert(errorMessage);
        });
      }
    });
  }
}