import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ListadoComponent } from './listado/listado.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { PlanillaComponent } from './planilla/planilla.component';
import { PruebasComponent } from './pruebas/pruebas.component'
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HistorialComponent } from './historial/historial.component';
import { SupervisionComponent } from './supervision/supervision.component';
import { AdministracionComponent } from './administracion/administracion.component';

export const routes: Routes = [


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'listado', component: ListadoComponent, canActivate: [AuthGuard] },
  { path: 'historial', component: HistorialComponent, canActivate: [AuthGuard] },
  { path: 'planilla', component: PlanillaComponent, canActivate: [AuthGuard] },
  { path: 'pruebas', component: PruebasComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'supervision', component: SupervisionComponent, canActivate: [AuthGuard] },
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotfoundComponent, canActivate: [AuthGuard] }

];