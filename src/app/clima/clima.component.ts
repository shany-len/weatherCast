import { Component, OnInit, Input } from '@angular/core';
import { climaObjeto } from '../climaObj';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.css']
})
export class ClimaComponent implements OnInit {
  @Input() listaTemp: Array<climaObjeto> = [];

  @Input() hoy:climaObjeto = {
    main: null,
    weather: {
      main: "",
      description: "",
      icono: "",
      img: ""
    },
    clouds: 0,
    wind: 0,
    fecha: {
      fechaDia: new Date(),
      fechaName:"",
      fechas:""
    },
    place:{
      cuidad:"",
      pais:""
    }
  };

  valor:object = {
    "background": "",
    "background-size": "cover",
    "color":""
     
  }
  constructor() { }

  ngOnInit(): void {
    let a = "url("+this.hoy.weather.img+")";
    let color = "black";
    if(a.includes("Noche") || a.includes("Nigth")){
      color="white";
    }
    this.valor = {
      "background": a,
      "background-size": "cover",
     
    }
  }

}
