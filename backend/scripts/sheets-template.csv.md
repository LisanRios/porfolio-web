# Plantilla de Google Sheets

Crea una planilla con estas pestañas y pega cada bloque desde la celda `A1`.

## profile

```csv
key,value
nombre,Lisandro
age,21 años
foto,https://example.com/foto.jpg
position,Programador Full Stack
ubication,Buenos Aires (Argentina)
```

## projects

```csv
id,type,name,date,image,description,link,lenguaje_json,active
portfolio-web,Pagina Web,Portfolio Web,Se actualiza constantemente,https://example.com/portfolio.jpg,Portfolio personal con proyectos y experiencia.,https://github.com/LisanRios/porfolio-web,"[{""name"":""fa-brands fa-angular""},{""name"":""fa-brands fa-css3-alt""}]",TRUE
```

## work

```csv
id,type,name,dateInicio,dateFin,logo,link,description_json,technologies_json,active
municipalidad-fullstack,Programador Full Stack,Municipalidad de San Martin,Marzo 2025,Presente,https://example.com/logo.png,https://sanmartin.gob.ar/,"[{""punto"":""Desarrollo de interfaces y APIs para sistemas internos.""}]","[{""icon"":""fa-brands fa-angular""}]",TRUE
```

## technologies

```csv
id,icon,name,nivel,active
angular,fa-brands fa-angular,Angular,★★★★★,TRUE
typescript,bx bxl-typescript,TypeScript,★★★★☆,TRUE
```

## education

```csv
id,type,name,dateInicio,dateFin,description,active
unsam-tupi,Tecnico Universitario en Programacion Informatica,Universidad Nacional de San Martin,01/02/2022,En curso,Formacion universitaria orientada al desarrollo de software.,TRUE
```
