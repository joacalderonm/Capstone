import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RespuestaPlantillaUsuario } from '../interfaces/plantilla';
import jsPDF from 'jspdf';

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

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private apiService: ApiService) {}

  async generatePDF(idPlantilla: number): Promise<void> {
    try {
      const results = await Promise.allSettled([
        this.apiService.getPlantillaPorId(idPlantilla).toPromise(),
        this.apiService.getViaticosPorPlantilla(idPlantilla).toPromise(),
        this.apiService.getGastosReembolsablesPorPlantilla(idPlantilla).toPromise(),
        this.apiService.getAnticiposPorPlantilla(idPlantilla).toPromise()
      ]);

      const plantillaRes = results[0];
      const viaticosRes = results[1];
      const gastosRes = results[2];
      const anticiposRes = results[3];

      if (plantillaRes.status !== 'fulfilled' || !plantillaRes.value) {
        throw new Error('No se pudo obtener la información de la plantilla');
      }

      const plantilla = plantillaRes.value;
      const viaticos = (viaticosRes.status === 'fulfilled' ? viaticosRes.value : null) || [];
      const gastos = (gastosRes.status === 'fulfilled' ? gastosRes.value : null) || [];
      const anticipos = (anticiposRes.status === 'fulfilled' ? anticiposRes.value : null) || [];

      const fecha = new Date(plantilla.fecha_creacion);
      const mes = this.getMonthName(fecha.getMonth() + 1);
      const ano = fecha.getFullYear();
      const filename = `Planilla ${mes} ${ano}.pdf`;

      const doc = new jsPDF();
      let y = 20;

      // Título
      doc.setFontSize(18);
      doc.text('Planilla de Viáticos', 20, y);
      y += 20;

      // Información General
      doc.setFontSize(14);
      doc.text('Información General:', 20, y);
      y += 10;
      doc.setFontSize(12);
      const infoLines = this.formatPlantillaInfo(plantilla).split('\n');
      infoLines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 7;
      });
      y += 10;

      // Anticipos
      doc.setFontSize(14);
      doc.text('Anticipos:', 20, y);
      y += 10;
      doc.setFontSize(12);
      const anticipoLines = this.formatAnticipos(anticipos).split('\n');
      anticipoLines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 7;
      });
      y += 10;

      // Viáticos
      doc.setFontSize(14);
      doc.text('Viáticos:', 20, y);
      y += 10;
      doc.setFontSize(12);
      const viaticoLines = this.formatViaticos(viaticos).split('\n');
      viaticoLines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 7;
      });
      y += 10;

      // Gastos
      doc.setFontSize(14);
      doc.text('Gastos:', 20, y);
      y += 10;
      doc.setFontSize(12);
      const gastoLines = this.formatGastos(gastos).split('\n');
      gastoLines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 7;
      });
      y += 10;

      // Resumen
      doc.setFontSize(14);
      doc.text('Resumen:', 20, y);
      y += 10;
      doc.setFontSize(12);
      const resumenLines = this.formatResumen(plantilla).split('\n');
      resumenLines.forEach((line: string) => {
        doc.text(line, 20, y);
        y += 7;
      });

      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  private formatPlantillaInfo(plantilla: RespuestaPlantillaUsuario): string {
    return `
Fecha: ${new Date(plantilla.fecha_creacion).toLocaleDateString('es-ES')}
Nº Resolución: ${plantilla.numero_plantilla}
Unidad: ${plantilla.codigo_unidad}
Departamento: ${plantilla.nombre_unidad}
Autorizado por: ${plantilla.nombre_supervisor_completo}
Nombre: ${plantilla.nombre_usuario_completo}
RUT: ${plantilla.rut_completo}
Región: ${plantilla.nombre_region}
Calidad Jurídica: ${plantilla.tipo}
Grado: ${plantilla.id_grado}
    `.trim();
  }

  private formatAnticipos(anticipos: AnticipoResponse[]): string {
    if (anticipos.length === 0) return 'Sin anticipos';

    return anticipos.map(a =>
      `Programa: ${a.codigo_programa}, Unidad: ${a.codigo_unidad}, Subesp: ${a.codigo_subesp}, Presupuestaria: ${a.codigo_presupuestaria}, Región: ${a.nombre_region}, Días 100%: ${a.dias_100}, Días 40%: ${a.dias_40}, Total: ${this.formatCurrency(a.total_viatico)}`
    ).join('\n');
  }

  private formatViaticos(viaticos: ViaticoResponse[]): string {
    if (viaticos.length === 0) return 'Sin viáticos';

    return viaticos.map(v =>
      `Programa: ${v.codigo_programa}, Unidad: ${v.codigo_unidad}, Subesp: ${v.codigo_subesp}, Presupuestaria: ${v.codigo_presupuestaria}, Región: ${v.nombre_region}, Días 100%: ${v.dias_100}, Días 40%: ${v.dias_40}, Total: ${this.formatCurrency(v.total_viatico)}`
    ).join('\n');
  }

  private formatGastos(gastos: GastoReembolsableResponse[]): string {
    if (gastos.length === 0) return 'Sin gastos';

    return gastos.map(g =>
      `Código: ${g.codigo_gasto}, Descripción: ${g.descripcion_gasto}, Programa: ${g.codigo_programa}, Subesp: ${g.codigo_subesp}, Documento: ${g.numero_documento}, Fecha: ${g.fecha}, Valor: ${this.formatCurrency(g.valor)}, Descripción: ${g.descripcion}`
    ).join('\n');
  }

  private formatResumen(plantilla: RespuestaPlantillaUsuario): string {
    return `
Total Viático: ${this.formatCurrency(plantilla.total_viatico)}
Total Gastos: ${this.formatCurrency(plantilla.total_gastos)}
Total Anticipo: ${this.formatCurrency(plantilla.total_anticipo)}
Total General: ${this.formatCurrency(plantilla.total_general)}
    `.trim();
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  private getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || 'Mes';
  }
}
