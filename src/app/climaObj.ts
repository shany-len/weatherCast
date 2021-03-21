export interface climaObjeto {
    main: any,
    weather: {
      main: string,
      description: string, 
      icono: string,
      img:string
    },
    clouds: number, 
    wind: number, 
    fecha: {
      fechaDia: Date,
      fechaName:string,
      fechas: string
    },
    place: {
        cuidad:string,
        pais:string
    }
  }