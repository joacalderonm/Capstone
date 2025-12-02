import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-edit-grado',
  imports: [MatDialogModule, ButtonModule, InputNumberModule, ReactiveFormsModule, CommonModule],
  templateUrl: './edit-grado.component.html',
  styleUrl: './edit-grado.component.css'
})
export class EditGradoComponent implements OnInit {

  gradoForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditGradoComponent>,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.gradoForm = this.fb.group({
      id_inicio: [null, Validators.required],
      id_fin: [null, Validators.required],
      valor_porcentaje_100: [null, Validators.required],
      valor_porcentaje_60: [null, Validators.required],
      valor_porcentaje_50: [null, Validators.required],
      valor_porcentaje_40: [null, Validators.required],
      fecha_efectiva: [null, Validators.required],
      fecha_vencimiento: [null, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.gradoForm.valid) {
      const formValue = this.gradoForm.value;
      const fechaEfectiva = this.formatDate(formValue.fecha_efectiva);
      const fechaVencimiento = this.formatDate(formValue.fecha_vencimiento);

      // Preparar el payload único
      const payload = {
        id_inicio: formValue.id_inicio,
        id_fin: formValue.id_fin,
        valor_porcentaje_100: formValue.valor_porcentaje_100,
        valor_porcentaje_60: formValue.valor_porcentaje_60,
        valor_porcentaje_50: formValue.valor_porcentaje_50,
        valor_porcentaje_40: formValue.valor_porcentaje_40,
        fecha_efectiva: fechaEfectiva,
        fecha_vencimiento: fechaVencimiento
      };

      // Enviar la llamada única
      this.apiService.updateGradoEscala(payload).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error al actualizar grados escala:', error);
          alert('Error al actualizar los valores. Por favor, inténtelo nuevamente.');
        }
      });
    }
  }

  private formatDate(date: any): string {
    if (typeof date === 'string') {
      return date; // Ya está en formato YYYY-MM-DD
    }
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return date; // Fallback
  }

}
