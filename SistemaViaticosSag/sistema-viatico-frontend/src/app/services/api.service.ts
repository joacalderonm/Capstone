import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BackendUser, UsuarioEditForm } from '../interfaces/backend-user';
import { PlantillaCreate, RespuestaCreacionPlantilla, RespuestaPlantillaListadoUsuario, RespuestaPlantillaUsuario, ViaticoCreate, AnticipoCreate } from '../interfaces/plantilla';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<BackendUser[]> {
    return this.http.get<BackendUser[]>(`${this.base}/api/v1/usuarios/`);
  }

  createUsuario(usuario: Partial<BackendUser>): Observable<BackendUser> {
    const payload: any = { ...usuario };
    if ('id_autenticador_firebase' in payload) {
      payload.firebase_uid = payload.id_autenticador_firebase;
      delete payload.id_autenticador_firebase;
    }
    return this.http.post<BackendUser>(`${this.base}/api/v1/usuarios/firebase`, payload);
  }

  getUnidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/unidades/`);
  }

  getRegiones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/regiones/`);
  }

  getCalidadJuridica(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/calidad_juridica/`);
  }

  getGradoEscala(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/grado_escala/`);
  }

  getUsuarioByFirebaseUid(firebaseUid: string): Observable<BackendUser> {
    return this.http.get<BackendUser>(`${this.base}/api/v1/usuarios/firebase/${firebaseUid}`);
  }

  updateUsuarioEstado(id: number, activo: boolean): Observable<boolean> {
    return this.http.put<boolean>(`${this.base}/api/v1/usuarios/estado/${id}`, { activo });
  }

  updateUsuario(id: number, usuario: Partial<BackendUser>): Observable<BackendUser> {
    return this.http.put<BackendUser>(`${this.base}/api/v1/usuarios/${id}`, usuario);
  }

  getUsuarioParaEditar(id_usuario: number): Observable<UsuarioEditForm> {
    return this.http.get<UsuarioEditForm>(`${this.base}/api/v1/usuarios/${id_usuario}/editar`);
  }

  createPlantilla(plantilla: PlantillaCreate): Observable<RespuestaCreacionPlantilla> {
    return this.http.post<RespuestaCreacionPlantilla>(`${this.base}/api/v1/plantillas/`, plantilla);
  }

  getPlantillasPorUsuario(idUsuario: number): Observable<RespuestaPlantillaListadoUsuario[]> {
    return this.http.get<RespuestaPlantillaListadoUsuario[]>(`${this.base}/api/v1/plantillas/${idUsuario}`);
  }

  getPlantillaPorId(idPlantilla: number): Observable<RespuestaPlantillaUsuario> {
    return this.http.get<RespuestaPlantillaUsuario>(`${this.base}/api/v1/plantillas/formulario/${idPlantilla}`);
  }

  getCuentasPresupuestarias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/cuenta_presupuestarias/`);
  }

  getCuentaPresupuestariaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/cuenta_presupuestarias/${id}`);
  }

  updateCuentaPresupuestaria(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/cuenta_presupuestarias/${id}`, data);
  }

  updateCuentaPresupuestariaEstado(id: number, activo: boolean): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/cuenta_presupuestarias/estado/${id}`, { activo });
  }

  createCuentaPresupuestaria(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/cuenta_presupuestarias/`, data);
  }

  createMotivoCometido(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/motivo_cometido/`, data);
  }

  createProductoSubesp(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/producto_subesp/`, data);
  }

  createPrograma(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/programas/`, data);
  }

  getMotivosCometido(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/motivo_cometido/`);
  }

  getMotivoCometidoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/motivo_cometido/${id}`);
  }

  updateMotivoCometido(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/motivo_cometido/${id}`, data);
  }

  updateMotivoCometidoEstado(id: number, activo: boolean): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/motivo_cometido/estado/${id}`, { activo });
  }

  getProductosSubesp(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/producto_subesp/`);
  }

  getProductoSubespById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/producto_subesp/${id}`);
  }

  updateProductoSubesp(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/producto_subesp/${id}`, data);
  }

  updateProductoSubespEstado(id: number, activo: boolean): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/producto_subesp/estado/${id}`, { activo });
  }

  getProgramas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/programas/`);
  }

  getProgramaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/programas/${id}`);
  }

  updatePrograma(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/programas/${id}`, data);
  }

  updateProgramaEstado(id: number, activo: boolean): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/programas/estado/${id}`, { activo });
  }

  getUnidadById(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/unidades/${id}`);
  }

  updateUnidad(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/unidades/${id}`, data);
  }

  updateUnidadEstado(id: number, activo: boolean): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/unidades/estado/${id}`, { activo });
  }

  createUnidad(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/unidades/`, data);
  }

  createViatico(viatico: ViaticoCreate): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/viaticos/`, viatico);
  }

  createAnticipo(anticipo: AnticipoCreate): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/anticipos/`, anticipo);
  }

  getValoresViatico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/valor_viatico/`);
  }

  getViaticosPorPlantilla(idPlantilla: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/viaticos/${idPlantilla}`);
  }

  getAnticiposPorPlantilla(idPlantilla: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/anticipos/${idPlantilla}`);
  }

  getViaticoParaEditar(viaticoId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/viaticos/${viaticoId}/editar`);
  }

  updateViatico(viaticoId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/viaticos/${viaticoId}`, data);
  }

  deleteViatico(viaticoId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/v1/viaticos/${viaticoId}`);
  }

  deleteAnticipo(anticipoId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/v1/anticipos/${anticipoId}`);
  }

  getAnticipoParaEditar(anticipoId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/anticipos/${anticipoId}/editar`);
  }

  updateAnticipo(anticipoId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/anticipos/${anticipoId}`, data);
  }

  getTiposGasto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/tipo_gasto/`);
  }

  createGastoReembolsable(gasto: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/gastos_reembolsables/`, gasto);
  }

  getGastosReembolsablesPorPlantilla(idPlantilla: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/gastos_reembolsables/${idPlantilla}`);
  }

  deleteGastoReembolsable(gastoId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/v1/gastos_reembolsables/${gastoId}`);
  }

  getGastoParaEditar(gastoId: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/gastos_reembolsables/${gastoId}/editar`);
  }

  updateGastoReembolsable(gastoId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/gastos_reembolsables/${gastoId}`, data);
  }

  getFirmantesPorUnidad(idUnidad: number): Observable<BackendUser[]> {
    return this.http.get<BackendUser[]>(`${this.base}/api/v1/plantillasplantilla/${idUnidad}/firmantes`);
  }

  cerrarPlantilla(idPlantilla: number, idUsuarioSupervisor: number): Observable<any> {
    const params = new HttpParams().set('id_usuario_supervisor', idUsuarioSupervisor.toString());
    return this.http.put<any>(`${this.base}/api/v1/plantillas/${idPlantilla}/cerrar`, null, { params });
  }

  firmarAnticipo(idPlantilla: number, idUsuarioSupervisor: number): Observable<any> {
    return this.http.post<any>(`${this.base}/api/v1/anticipos/${idPlantilla}/firmar?id_usuario_firma=${idUsuarioSupervisor}`, null);
  }

  getMontoTotalAno(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/plantillas/kpi/monto_total_ano/${idUsuario}`);
  }

  getMontoTotalMes(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/plantillas/kpi/monto_total_mes/${idUsuario}`);
  }

  getMontoTotalProductoMes(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/plantillas/kpi/monto_total_producto_mes/${idUsuario}`);
  }

  getPlantillasPorUnidad(idUnidad: number): Observable<RespuestaPlantillaListadoUsuario[]> {
    return this.http.get<RespuestaPlantillaListadoUsuario[]>(`${this.base}/api/v1/plantillas/${idUnidad}/listado`);
  }

  getMontoTotalMesUnidad(idUnidad: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/plantillas/kpi/monto_total_mes_unidad/${idUnidad}`);
  }

  getConteoPlantilla(idUnidad: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/plantillas/kpi/conteo_plantilla/${idUnidad}`);
  }

  getMontoTotalProductoMesUnidad(idUnidad: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/plantillas/kpi/monto_total_producto_mes_unidad/${idUnidad}`);
  }

  getUsuariosUnidad(idUnidad: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/usuarios/${idUnidad}/unidad`);
  }

  updateSubrogante(idUsuario: number, esSubrogante: boolean): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/usuarios/${idUsuario}/subrogante`, { es_subrogante: esSubrogante });
  }

  updateGradoEscala(data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/v1/grado_escala/`, data);
  }

  getPdfUsuario(idPlantilla: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/pdf/usuario?id_plantilla=${idPlantilla}`);
  }

  getPdfAnticipo(idPlantilla: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/pdf/anticipo?id_plantilla=${idPlantilla}`);
  }

  getPdfViatico(idPlantilla: number): Observable<any> {
    return this.http.get<any>(`${this.base}/api/v1/pdf/viatico?id_plantilla=${idPlantilla}`);
  }

}
