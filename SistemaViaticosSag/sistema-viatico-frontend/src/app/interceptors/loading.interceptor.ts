import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos nuestro servicio de carga.
  const loadingService = inject(LoadingService);

  // Mostramos el loader antes de que la petición se envíe.
  loadingService.show();

  // Usamos el operador 'finalize' de RxJS.
  // Este bloque de código se ejecutará SIEMPRE que la petición termine,
  // sin importar si fue exitosa o si hubo un error.
  return next(req).pipe(
    finalize(() => {
      // Ocultamos el loader cuando la petición ha finalizado.
      loadingService.hide();
    })
  );
};