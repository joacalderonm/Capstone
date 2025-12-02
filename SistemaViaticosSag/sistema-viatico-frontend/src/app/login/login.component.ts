import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AuthError } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordField: any = document.getElementById('password');
    if (passwordField) {
      if (this.passwordVisible) {
        passwordField.type = 'text';
      } else {
        passwordField.type = 'password';
      }
    }
  }

  /**
   * Método onLogin actualizado para usar la lógica asíncrona de Firebase.
   */
  async onLogin(form: NgForm): Promise<void> {
    
    if (form.invalid) {
      // Usamos SnackBar para la validación de formularios
      this.showError('Por favor, introduce tu correo y contraseña.');
      return;
    }

    try {
      // 1. Llamada asíncrona al servicio (usando await)
      await this.authService.login(this.email, this.password);

      // 2. Obtener el UID del usuario autenticado
      const user = this.authService.getCurrentUser();
      const uid = user?.uid;
      if (!uid) {
        this.showError('No se pudo obtener el UID del usuario.');
        return;
      }

      // 3. Consultar los datos completos desde el backend
      this.apiService.getUsuarioByFirebaseUid(uid).subscribe({
        next: (usuario) => {
          // Guardar los datos completos del usuario en localStorage
          localStorage.setItem('usuarioDatos', JSON.stringify(usuario));
          console.log('Datos completos del usuario:', usuario);
          // Navegar a home después de obtener y guardar los datos
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.showError('No se pudo obtener los datos completos del usuario.');
          console.error(err);
        }
      });
    } catch (error) {
      // 2. Captura y maneja errores de Firebase
      const authError = error as AuthError;
      let userFriendlyMessage: string;

      // Mapear los códigos de error comunes de Firebase a mensajes amigables
      switch (authError.code) {
        case 'auth/invalid-email':
          userFriendlyMessage = 'El formato del correo electrónico es inválido.';
          break;
        case 'auth/user-disabled':
          userFriendlyMessage = 'Esta cuenta ha sido deshabilitada.';
          break;
        case 'auth/user-not-found':
          userFriendlyMessage = 'No se encontró una cuenta con este correo electrónico.';
          break;
        case 'auth/wrong-password':
          userFriendlyMessage = 'La contraseña es incorrecta.';
          break;
        case 'auth/invalid-credential':
          userFriendlyMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
          break;
        case 'auth/too-many-requests':
          userFriendlyMessage = 'Acceso bloqueado temporalmente debido a demasiados intentos fallidos. Inténtalo más tarde.';
          break;
        case 'auth/network-request-failed':
          userFriendlyMessage = 'Error de conexión. Verifica tu conexión a internet.';
          break;
        default:
          userFriendlyMessage = 'Ocurrió un error inesperado al iniciar sesión. Inténtalo de nuevo.';
          break;
      }
      // 3. Mostrar el error usando el método auxiliar
      this.showError(userFriendlyMessage);
    }
  }

  /**
   * Abre el modal de recuperación de contraseña.
   */
  openForgotPasswordDialog(): void {
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // El modal maneja su propia lógica de envío
      }
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000, // Muestra el mensaje por 5 segundos
      horizontalPosition: 'center',
      verticalPosition: 'bottom', // Lo mostramos en la parte inferior
      panelClass: ['error-snackbar'] // Clase CSS personalizada para el estilo
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['success-snackbar']
    });
  }
}
