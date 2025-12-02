import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AuthError } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password-dialog',
  template: `
    <h2 mat-dialog-title>Recuperar contraseña</h2>
    <mat-dialog-content>
      <p>Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Correo electrónico</mat-label>
        <input matInput type="email" [(ngModel)]="email" name="email" required>
        <mat-icon matSuffix>email</mat-icon>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSend()" [disabled]="!email">Enviar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class ForgotPasswordDialogComponent {
  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSend(): Promise<void> {
    if (!this.email) {
      this.showError('Por favor, introduce tu correo electrónico.');
      return;
    }

    try {
      await this.authService.sendPasswordReset(this.email);
      this.showSuccess('Se ha enviado un enlace de recuperación a tu correo electrónico.');
      this.dialogRef.close(true);
    } catch (error) {
      const authError = error as AuthError;
      let message = 'Error al enviar el enlace de recuperación.';

      switch (authError.code) {
        case 'auth/invalid-email':
          message = 'El formato del correo electrónico es inválido.';
          break;
        case 'auth/user-not-found':
          message = 'No se encontró una cuenta con este correo electrónico.';
          break;
        case 'auth/too-many-requests':
          message = 'Demasiados intentos. Inténtalo más tarde.';
          break;
      }

      this.showError(message);
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
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