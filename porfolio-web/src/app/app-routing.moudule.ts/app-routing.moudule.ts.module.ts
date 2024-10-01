import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { ProjectsComponent } from '../components/projects/projects.component';
import { TechnologiesComponent } from '../components/technologies/technologies.component';
import { Page404Component } from '../components/page404/page404.component';

const routes: Routes = [
  {path: '', redirectTo: 'inicio', pathMatch: 'full'},
  {path: 'inicio', component: HeaderComponent},
  {path: 'trabajos', component: ProjectsComponent},
  {path: 'tecnologias', component: TechnologiesComponent},
  {path: '**', component: Page404Component},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingMouduleTsModule { }
