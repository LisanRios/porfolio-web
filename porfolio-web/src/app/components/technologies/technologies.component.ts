import { Component, OnInit } from '@angular/core';
import { PorfolioService } from '../../service/porfolio.service';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrl: './technologies.component.css'
})
export class TechnologiesComponent implements OnInit {
  tecnologyList: any;
 
  constructor(private datosPorfolio:PorfolioService) {}

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data=> {
      this.tecnologyList = data.tecnology;
    });
  }

}
