import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallableData } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirebaseUser } from '../interfaces/firebase-user';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly functions: Functions = inject(Functions);

  /**
   * Llama a la Cloud Function 'listUsers' para obtener la lista de usuarios.
   * @returns Un Observable con un array de usuarios.
   */
  getUsuarios(): Observable<FirebaseUser[]> {
    // Obtenemos una referencia a nuestra Cloud Function
    const listUsersFn = httpsCallableData(this.functions, 'listUsers');

    // La llamamos (sin pasarle datos en este caso) y la convertimos en Observable
    return from(listUsersFn({})).pipe(
      map((response: any) => response.users as FirebaseUser[])
    );
  }
}