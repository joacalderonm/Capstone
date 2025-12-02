import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { RespuestaPlantillaUsuario } from '../interfaces/plantilla';

@Injectable({
  providedIn: 'root'
})
export class PdfFormService {

  constructor(private http: HttpClient) {}

  async generateFormPDF(idPlantilla: number, apiService: any): Promise<void> {
    try {
      // Obtener datos de la plantilla, gastos, anticipos y viáticos
      const results = await Promise.allSettled([
        apiService.getPdfUsuario(idPlantilla).toPromise(),
        apiService.getGastosReembolsablesPorPlantilla(idPlantilla).toPromise(),
        apiService.getPdfAnticipo(idPlantilla).toPromise(),
        apiService.getPdfViatico(idPlantilla).toPromise()
      ]);

      const plantillaRes = results[0];
      const gastosRes = results[1];
      const anticiposRes = results[2];
      const viaticosRes = results[3];

      if (plantillaRes.status !== 'fulfilled' || !plantillaRes.value) {
        throw new Error('No se pudo obtener la información de la plantilla');
      }

      const plantilla = plantillaRes.value[0];
      const gastos = (gastosRes.status === 'fulfilled' ? gastosRes.value : null) || [];
      const anticipos = (anticiposRes.status === 'fulfilled' ? anticiposRes.value : null) || [];
      const viaticos = (viaticosRes.status === 'fulfilled' ? viaticosRes.value : null) || [];

      // Cargar la plantilla PDF base
      const templateBytes = await this.loadTemplatePDF();

      // Rellenar el formulario
      const filledPDF = await this.fillFormFields(templateBytes, plantilla, gastos, anticipos, viaticos);

      // Descargar el PDF
      this.downloadPDF(filledPDF, plantilla);
    } catch (error) {
      console.error('Error generating form PDF:', error);
    }
  }

  private async loadTemplatePDF(): Promise<ArrayBuffer> {
    const response = await this.http.get('/assets/plantilla_base.pdf', { responseType: 'arraybuffer' }).toPromise();
    return response as ArrayBuffer;
  }

  private async fillFormFields(templateBytes: ArrayBuffer, plantilla: any, gastos: any[], anticipos: any[], viaticos: any[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(templateBytes);

    const form = pdfDoc.getForm();

    // Mapear campos del formulario
    const fieldMappings: { [key: string]: string } = {
      fecha: new Date(plantilla.fecha_creacion).toLocaleDateString('es-ES'),
      numero_resolucion: plantilla.numero_plantilla.toString(),
      nombre: plantilla.nombre_usuario,
      rut: plantilla.rut_completo,
      unidad_codigo: plantilla.codigo_unidad.toString(),
      unidad_nombre: plantilla.nombre_unidad,
      calidad_juridica: plantilla.nombre_calidad,
      grado: plantilla.id_grado.toString(),
      region: plantilla.nombre_region,
      mes_rendicion: this.getMesRendicion(plantilla.fecha_creacion),
      nombre_anticipo: plantilla.nombre_usuario,
      nombre_viatico: plantilla.nombre_usuario,
      nombre_gastos: plantilla.nombre_usuario,
      supervisor_viaticos: plantilla.director,
      valor_viatico: this.formatCurrency(plantilla.valor_viatico || 0),
      fecha_gastos: new Date(plantilla.fecha_creacion).toLocaleDateString('es-ES'),
      total_viatico: this.formatCurrency(plantilla.total_viatico || 0),
      total_gastos: this.formatCurrency(plantilla.total_gastos || 0),
      total_liquidacion: this.formatCurrency((plantilla.total_viatico || 0) + (plantilla.total_gastos || 0)),
      total_anticipo: this.formatCurrency(plantilla.total_anticipo || 0),
      total_general: this.formatCurrency(plantilla.total_general || 0),
      saldo: this.getSaldoLabel(plantilla.total_general),
      unidad_gastos: plantilla.codigo_unidad.toString(),
      numero_resolucion_gastos: plantilla.numero_plantilla.toString(),
      total_gastos_2: this.formatCurrency(plantilla.total_gastos || 0),
      supervisor_gastos: plantilla.director
    };

    // Agregar campos de gastos (hasta 10)
    for (let i = 0; i < 10; i++) {
      const gasto = gastos[i];
      fieldMappings[`gasto_numero_documento_${i + 1}`] = gasto?.numero_documento || '';
      fieldMappings[`gasto_fecha_${i + 1}`] = gasto?.fecha ? new Date(gasto.fecha).toLocaleDateString('es-ES') : '';
      fieldMappings[`tipo_gasto_${i + 1}`] = gasto?.descripcion_gasto || '';
      fieldMappings[`programa_${i + 1}`] = gasto?.codigo_programa?.toString() || '';
      fieldMappings[`descripcion_${i + 1}`] = gasto?.descripcion || '';
      fieldMappings[`gasto_valor_${i + 1}`] = gasto?.valor ? this.formatCurrency(gasto.valor) : '';
      fieldMappings[`gasto_prodcuto_${i + 1}`] = gasto?.codigo_subesp || '';
    }

    // Suma de gastos por tipo
    const tiposGasto = [
      "Alimentos y Bebidas",
      "Bencina",
      "Pasajes Nacionales",
      "Peajes y Flete",
      "Serv. Alojamiento",
      "Repuestos y Accesorios para Maquinaria",
      "Otros Gastos",
      "Capacitación",
      "Emergencias Sanitarias",
      "Suelos Degradados",
      "Innovacion Fortalecimiento",
      "Seguro Viaje"
    ];

    const sumasPorTipo: { [key: string]: number } = {};
    tiposGasto.forEach(tipo => sumasPorTipo[tipo] = 0);

    gastos.forEach(gasto => {
      if (gasto?.descripcion_gasto && gasto?.valor) {
        if (sumasPorTipo.hasOwnProperty(gasto.descripcion_gasto)) {
          sumasPorTipo[gasto.descripcion_gasto] += gasto.valor;
        }
      }
    });

    tiposGasto.forEach((tipo, index) => {
      fieldMappings[`total_tipo_gasto_${index + 1}`] = this.formatCurrency(sumasPorTipo[tipo]);
    });

    // Agregar campos de anticipos (hasta 5)
    for (let i = 0; i < 5; i++) {
      const anticipo = anticipos[i];
      fieldMappings[`ant_dias_100_${i + 1}`] = anticipo?.dias_100?.toString() || '';
      fieldMappings[`ant_dias_40_${i + 1}`] = anticipo?.dias_40?.toString() || '';
      fieldMappings[`ant_valor_${i + 1}`] = anticipo?.total_viatico ? this.formatCurrency(anticipo.total_viatico) : '';
      fieldMappings[`ant_region_${i + 1}`] = anticipo?.nombre_region || '';
      fieldMappings[`ant_desde_${i + 1}`] = anticipo?.fecha_desde ? new Date(anticipo.fecha_desde).toLocaleDateString('es-ES') : '';
      fieldMappings[`ant_hasta_${i + 1}`] = anticipo?.fecha_hasta ? new Date(anticipo.fecha_hasta).toLocaleDateString('es-ES') : '';
      fieldMappings[`ant_localidad_${i + 1}`] = anticipo?.localidad_destino || '';
      fieldMappings[`ant_motivo_${i + 1}`] = anticipo?.nombre_cometido || '';
    }

    // Campos únicos del primer anticipo
    const primerAnticipo = anticipos[0];
    fieldMappings['ant_cuenta'] = primerAnticipo?.registro_cuenta_presupuestaria || '';
    fieldMappings['ant_programa'] = primerAnticipo?.codigo_programa?.toString() || '';
    fieldMappings['ant_producto'] = primerAnticipo?.codigo_subesp || '';
    fieldMappings['encargado_anticipo'] = primerAnticipo?.encargado_anticipo || '';

    // Suma total de anticipos
    const totalAnticipos = anticipos.reduce((sum, anticipo) => sum + (anticipo?.total_viatico || 0), 0);
    const totalAnticiposFormateado = this.formatCurrency(totalAnticipos);
    fieldMappings['ant_valor_total'] = totalAnticiposFormateado;
    fieldMappings['ant_valor_total_2'] = totalAnticiposFormateado;
    fieldMappings['ant_valor_total_3'] = totalAnticiposFormateado;

    // Suma total de días
    const totalDias40 = anticipos.reduce((sum, anticipo) => sum + (anticipo?.dias_40 || 0), 0);
    const totalDias100 = anticipos.reduce((sum, anticipo) => sum + (anticipo?.dias_100 || 0), 0);
    fieldMappings['ant_dias_40_total'] = totalDias40.toString();
    fieldMappings['ant_dias_100_total'] = totalDias100.toString();

    // Agregar campos de viáticos (hasta 10)
    for (let i = 0; i < 10; i++) {
      const viatico = viaticos[i];
      fieldMappings[`via_unidad_${i + 1}`] = viatico?.codigo_unidad?.toString() || '';
      fieldMappings[`via_producto_${i + 1}`] = viatico?.codigo_subesp?.toString() || '';
      fieldMappings[`via_desde_${i + 1}`] = viatico?.fecha_desde ? new Date(viatico.fecha_desde).toLocaleDateString('es-ES') : '';
      fieldMappings[`via_hasta_${i + 1}`] = viatico?.fecha_hasta ? new Date(viatico.fecha_hasta).toLocaleDateString('es-ES') : '';
      fieldMappings[`via_cuenta_${i + 1}`] = viatico?.registro_cuenta_presupuestaria || '';
      fieldMappings[`via_dias_100_${i + 1}`] = viatico?.dias_100?.toString() || '';
      fieldMappings[`via_dias_40_${i + 1}`] = viatico?.dias_40?.toString() || '';
      fieldMappings[`via_region_${i + 1}`] = viatico?.nombre_region || '';
      fieldMappings[`via_localidad_${i + 1}`] = viatico?.localidad_destino || '';
      fieldMappings[`via_valor_100_${i + 1}`] = viatico?.valor_porcentaje_100 ? this.formatCurrency(viatico.valor_porcentaje_100) : '';
      fieldMappings[`via_valor_40_${i + 1}`] = viatico?.valor_porcentaje_40 ? this.formatCurrency(viatico.valor_porcentaje_40) : '';
      fieldMappings[`via_total_${i + 1}`] = viatico?.total_viatico ? this.formatCurrency(viatico.total_viatico) : '';
    }

    // Suma total de días de viáticos
    const totalDias100Viaticos = viaticos.reduce((sum, viatico) => sum + (viatico?.dias_100 || 0), 0);
    const totalDias40Viaticos = viaticos.reduce((sum, viatico) => sum + (viatico?.dias_40 || 0), 0);
    fieldMappings['via_dias_100_total'] = totalDias100Viaticos.toString();
    fieldMappings['via_dias_40_total'] = totalDias40Viaticos.toString();

    // Rellenar campos
    Object.entries(fieldMappings).forEach(([fieldName, value]) => {
      try {
        const field = form.getTextField(fieldName);
        if (field) {
          field.setText(value);
          field.setFontSize(8); // Establecer fuente pequeña para que quepa el texto
        } else {
          console.warn(`Campo ${fieldName} no encontrado en el formulario PDF`);
        }
      } catch (error) {
        console.warn(`Campo ${fieldName} no encontrado en el formulario PDF:`, error);
      }
    });

    // Serializar el PDF
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  private downloadPDF(pdfBytes: Uint8Array, plantilla: RespuestaPlantillaUsuario): void {
    const blob = new Blob([pdfBytes.slice()], { type: 'application/pdf' });
    const fecha = new Date(plantilla.fecha_creacion);
    const mes = this.getMonthName(fecha.getMonth() + 1);
    const ano = fecha.getFullYear();
    const filename = `Formulario ${mes} ${ano}.pdf`;
    saveAs(blob, filename);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  private getSaldoLabel(totalGeneral: number | undefined): string {
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

  private getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || 'Mes';
  }

  private getMesRendicion(fechaCreacion: string): string {
    const date = new Date(fechaCreacion);
    const month = this.getMonthName(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${month} ${year}`;
  }
}