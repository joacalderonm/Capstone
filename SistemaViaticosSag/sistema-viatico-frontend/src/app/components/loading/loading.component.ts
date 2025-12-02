// src/app/components/loading/loading.component.ts
import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [AsyncPipe, NgIf], // Importamos AsyncPipe y NgIf
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  // Inyectamos el servicio y exponemos su observable directamente a la plantilla.
  constructor(public loadingService: LoadingService) { }
}