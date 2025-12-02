// src/app/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  signOut,
  authState,
  sendPasswordResetEmail
} from '@angular/fire/auth';
import { Observable } from 'rxjs'; // 👈 Asegúrate de que esta importación exista
import { getIdTokenResult } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router: Router = inject(Router);
  // Inyectamos el servicio de Autenticación de Firebase (Auth)
  private auth: Auth = inject(Auth);

  // Observable que emite el estado de autenticación del usuario (User o null)
  public user$: Observable<User | null> = authState(this.auth);

  constructor() { 
    // Si necesitas hacer algo con el router, puedes inyectarlo aquí o en el constructor si no usas inject()
  }

  /**
   * Intenta iniciar sesión con email y contraseña en Firebase.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // No navegar aquí, se maneja en el componente de login después de obtener datos
    } catch (error) {
      // Lanza el error para que el componente de Login lo maneje
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual en Firebase.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

   /**
   * Devuelve el usuario actual de Firebase Auth.
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Envía un email de recuperación de contraseña.
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Devuelve una promesa con los custom claims del usuario actual.
   */
  async getCurrentUserClaims(): Promise<any> {
    const user = this.getCurrentUser();
    if (!user) return null;
    const tokenResult = await getIdTokenResult(user);
    return tokenResult.claims;
  }
}