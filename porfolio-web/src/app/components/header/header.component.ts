import { Component, OnInit } from '@angular/core';
import { PorfolioService } from '../../service/porfolio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html', 
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  miPorfolio:any;
  tituleList:any;
  tecnologyList:any;
  constructor(private datosPorfolio:PorfolioService) {
  
  }

  ngOnInit(): void {
    this.datosPorfolio.obtenerDatos().subscribe(data => {
    //  console.log(data);
      this.miPorfolio = data;
    });     

    this.datosPorfolio.obtenerDatos().subscribe(data=> {
      this.tituleList = data.titule;
    });
  }
}
