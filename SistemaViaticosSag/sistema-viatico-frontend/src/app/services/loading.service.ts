import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Un BehaviorSubject para emitir el estado de carga actual.
  // Inicia en 'false' (nada está cargando).
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  // Un Observable público para que los componentes puedan suscribirse.
  // Usamos 'asObservable()' para no exponer el Subject directamente.
  public readonly isLoading$ = this._isLoading$.asObservable();

  // Contador de peticiones HTTP activas.
  private requestCount = 0;

  constructor() { }

  /**
   * Muestra el indicador de carga.
   * Incrementa el contador y emite 'true' si es la primera petición.
   */
  show(): void {
    this.requestCount++;
    if (this.requestCount === 1) {
      this._isLoading$.next(true);
    }
  }

  /**
   * Oculta el indicador de carga.
   * Decrementa el contador y emite 'false' cuando no quedan peticiones activas.
   */
  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this._isLoading$.next(false);
    }
  }
}