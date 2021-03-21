import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { climaObjeto } from './climaObj';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(private http: HttpClient,) {

  }

  urlContries = "https://restcountries.eu/rest/v2/region/";
  listaCountries = [{
    name: '',
    code: ''
  }];
  mostrarPaises: boolean = false;
  searchText: string = '';
  showAlert: boolean = false;
  mostrarClima: boolean = false;
  textoError: string = "";
  listaRegion = [
    {
      value: "Africa",
      name: "África"
    },
    {
      value: "Americas",
      name: "América"
    },
    {
      value: "Asia",
      name: "Asia"
    },
    {
      value: "Europe",
      name: "Europa"
    },
    {
      value: "Oceania",
      name: "Oceanía"
    },

  ]

  cardWeather: object = {
    "background": "",
    "background-image": ""
    //background: #e1ecff;
    //    background-image: linear-gradient(to left bottom, #d6eef6, #dff0fa, #e7f3fc, #eff6fe, #f6f9ff)
  };

  listaTemp: Array<climaObjeto> = [];

  hoy: climaObjeto = {
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
      fechaName: "",
      fechas: ""
    },
    place: {
      cuidad: "",
      pais: ""
    }
  };

  cargarDatosName(rb: string) {
    let url = this.urlContries + rb;
    this.http.get(url).toPromise().then(data => {
      let lista = JSON.stringify(data);
      let listaCountry = JSON.parse(lista);
      if (listaCountry.length > 0) {
        let listaP = [];
        for (let i = 0; i < listaCountry.length; i++) {
          let a = {
            name: listaCountry[i].name,
            code: listaCountry[i].alpha2Code,
            flag: listaCountry[i].flag
          }
          listaP.push(a);
        }
        this.listaCountries = listaP;
        this.mostrarPaises = true;
      }
      else {
        this.textoError = "ERROR :( - No se ha podido encontrar la ubicación"
        this.showAlert = true;
      }
    }).catch((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
      alert("503 Service Unavailable");

    });
  }

  buscarImg(icono: string) {
    if (icono.includes("d")) {
      switch (icono.replace("d", "")) {
        case "01":
          return "../assets/solDia.png";
        case "02":
          return "../assets/fewCloudsDay.png";
        case "03":
          return "../assets/scatteredCloudsDia.png";
        case "04":
          return "../assets/brokenCloudsdia.png";
        case "09":
          return "../assets/showerRainDay.png";
        case "10":
          return "../assets/rainDia.png";
        case "11":
          return "../assets/thunderDia.png";
        case "13":
          return "../assets/snowDay.png";
        case "50":
          return "../assets/mistDay.png";
        default:
          return "../assets/solDia.png";
      }
    }
    else {
      switch (icono.replace("n", "")) {
        case "01":
          return "../assets/solNoche.png";
        case "02":
          return "../assets/fewCloudsNoche.png";
        case "03":
          return "../assets/scatteredCloudsNoche.png";
        case "04":
          return "../assets/brokenCloudsNoche.png";
        case "09":
          return "../assets/showerRainNoche.png";
        case "10":
          return "../assets/rainNoche.png";
        case "11":
          return "../assets/thunderNoche.png";
        case "13":
          return "../assets/snowNigth.png";
        case "50":
          return "../assets/mistNigth.png";
        default:
          return "../assets/solNoche.png";
      }
    }

  }


  cargarDatosTemp(ciudad: string, pais: string, namePais: string) {
    let url = "http://api.openweathermap.org/data/2.5/forecast?q=" + ciudad + "," + pais + "&appid=b77d320d5d88b90c1fe8fbb3c8f51e2d&units=metric&lang=es";
    this.http.get(url).toPromise().then(data => {
      let lista = JSON.stringify(data);
      let listaCountry = JSON.parse(lista);

      if (listaCountry.cod == "200") {
        let listita = listaCountry.list;
        let lis: Array<climaObjeto> = [];
        for (let i = 0; i < listita.length; i++) {
          let a = (listita[i].dt_txt).split(" ");
          let b = this.cortarString(a[0]);
          let numeroDia = b.getDay();
          let diaSemana = this.diaDeLaSemana(numeroDia);
          let c = this.fechaName(a[0]);
          let imagen = "";
          if (i == 0) {
            imagen = this.buscarImg(listita[0].weather[0].icon);            
          }
          let elem = {
            main: listita[i].main,
            weather: {
              main: listita[i].weather[0].main,
              description: listita[i].weather[0].description,
              icono: "http://openweathermap.org/img/wn/" + listita[i].weather[0].icon + "@2x.png",
              img: imagen
            },
            clouds: listita[i].clouds.all,
            wind: listita[i].wind.speed,
            fecha: {
              fechaDia: b,
              fechaName: diaSemana,
              fechas: c,
            },
            place: {
              cuidad: ciudad,
              pais: namePais
            }
          }
          lis.push(elem);
        }
        let listaTempA = this.listaTiempoArr(lis);
        let fechaHoy = new Date().getDate();
        if (fechaHoy === listaTempA[0].fecha.fechaDia.getDate()) {
          this.listaTemp = listaTempA.slice(1, listaTempA.length - 1);
        }
        else {
          //listaTempA.pop();
          this.listaTemp = listaTempA;
        }
          this.diaHoy(ciudad, pais, namePais);
      }
      else {
        this.textoError = "ERROR :( - No se ha podido encontrar la ubicación"
        this.showAlert = true;
      }
    }).catch((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
      if (err.error.cod == "404") {
        this.textoError = "ERROR :( - No se ha podido encontrar la ciudad"
        this.showAlert = true;
      }
      else {
        this.textoError = "ERROR :( - No se ha podido encontrar la ciudad"
        this.showAlert = true;
      }
    });
  }

  diaHoy(ciudad: string, pais: string, namePais: string) {
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + ciudad + "," + pais + "&appid=b77d320d5d88b90c1fe8fbb3c8f51e2d&units=metric&lang=es";
    this.http.get(url).toPromise().then(data => {
      let lista = JSON.stringify(data);
      let listaCountry = JSON.parse(lista);
     

      if (listaCountry.cod == "200") {
        let dates = new Date();
        let mes = dates.getMonth() + 1;
        let hoyFechita = dates.getFullYear() + "-" + mes + "-" +  dates.getDate();
        let fechaHoy = this.cortarString(hoyFechita);
        let diaSemana = this.diaDeLaSemana(dates.getDay());
        let imagen = this.buscarImg(listaCountry.weather[0].icon);
        let lista: climaObjeto = {
          main: listaCountry.main,
          weather: {
            main: listaCountry.weather[0].main,
            description: listaCountry.weather[0].description,
            icono: "http://openweathermap.org/img/wn/" + listaCountry.weather[0].icon + "@2x.png",
            img: imagen
          },
          clouds: listaCountry.clouds.all,
          wind: listaCountry.wind.speed,
          fecha: {
            fechaDia: fechaHoy,
            fechaName: diaSemana,
            fechas: this.fechaName(hoyFechita)
          },
          place: {
            cuidad: ciudad,
            pais: namePais
          }
        }
        this.hoy = lista;
        this.mostrarPaises = false;
        this.mostrarClima = true;
      }
      else {
        this.textoError = "ERROR :( - No se ha podido encontrar la ubicación"
        this.showAlert = true;
      }
    }).catch((err: HttpErrorResponse) => {
      console.error('An error occurred:', err.error);
      if (err.error.cod == "404") {
        this.textoError = "ERROR :( - No se ha podido encontrar la ciudad"
        this.showAlert = true;
      }
      else {
        this.textoError = "ERROR :( - No se ha podido encontrar la ciudad"
        this.showAlert = true;
      }
    });
  }

  cortarString(ini: string) {
    let a = ini.split("-");
    let mes = parseInt(a[1]) - 1;
    let dates = new Date(parseInt(a[0]), mes, parseInt(a[2]));
    dates.setHours(0,0,0);
    return dates;
  }

  fechaName(ini: string) {
    let a = ini.split("-");
    let fecha = a[0] + " de " + this.mesName(parseInt(a[1])) + " del " + a[2];
    return fecha;
  }

  diaDeLaSemana(dia: number) {
    switch (dia) {
      case 1:
        return "Lunes";
      case 2:
        return "Martes";
      case 3:
        return "Miercoles";
      case 4:
        return "Jueves";
      case 5:
        return "Viernes";
      case 6:
        return "Sabado";
      case 0:
        return "Domingo";
      default:
        return "Error";
    }
  }

  mesName(mes: number) {
    switch (mes) {
      case 1:
        return "Enero";
      case 2:
        return "Febrero";
      case 3:
        return "Marzo";
      case 4:
        return "Abril";
      case 5:
        return "Mayo";
      case 6:
        return "Junio";
      case 7:
        return "Julio";
      case 8:
        return "Agosto";
      case 9:
        return "Septiembre";
      case 10:
        return "Octubre";
      case 11:
        return "Noviembre";
      case 12:
        return "Diciembre";
      default:
        return "Error";
    }
  }

  listaTiempoArr(lis: Array<climaObjeto>) {
    let inicio = lis[0].fecha.fechaDia;
    let lista = [];
    lista.push(lis[0]);
    for (let i = 0; i < lis.length; i++) {
      let b = lis[i].fecha.fechaDia
      if (!(inicio.getTime() === b.getTime())) {
        lista.push(lis[i]);
        inicio = b;
      }
    }
    return lista;
  }

  ngOnInit(): void {

  }

  click(pais: string, cuidad: string) {
    this.showAlert = false;
    if (pais == "" || cuidad == "") {
      this.textoError = "ERROR :( - No puedes dejar elementos en blanco"
      this.showAlert = true;
    }
    else {
      let name = "";
      
      for (let i = 0; i < this.listaCountries.length; i++) {
        if (this.listaCountries[i].code == pais) {
          name = this.listaCountries[i].name;
          break;
        }
      }
      this.listaCountries=[];
      this.cargarDatosTemp(cuidad, pais, name);
    }

  }

  close() {
    this.showAlert = false;
  }


  callType(value: string) {
    this.mostrarClima = false;
    this.cargarDatosName(value);

  }
}
