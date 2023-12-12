import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TechnologiesComponent } from './components/technologies/technologies.component';
import { ContactComponent } from './components/contact/contact.component';
import { Page404Component } from './components/page404/page404.component';

const routes: Routes = [
  {path: '', redirectTo: 'Inicio', pathMatch: 'full'},
  {path: 'Inicio', component: HeaderComponent},
  {path: 'Proyectos', component: ProjectsComponent},
  {path: 'Tecnologias', component: TechnologiesComponent},
  {path: 'Contacto', component: ContactComponent}, 
  {path: '**', component: Page404Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
