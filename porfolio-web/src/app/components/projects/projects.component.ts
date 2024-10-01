import { Component, OnInit } from '@angular/core';
import { PorfolioService } from '../../service/porfolio.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit{
  projectList:any;
  tecnologyList:any;
  trabajosList:any;
  lengList:any;

  constructor(private datosPorfolio:PorfolioService) {
  
  }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=> {
      this.projectList = data.project;
    });

    this.datosPorfolio.obtenerDatos().subscribe(data=> {
      this.trabajosList = data.trabajo;
    });
  }
}
