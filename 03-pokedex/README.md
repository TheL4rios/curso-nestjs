<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo
1. Clonar el repositorio
2. Ejecutar
```
npm i
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la DB
```
docker-compose up -d
```

5. Reconstruir la base de datos con la semilla
```
http://localhost:3000/api/v1/seed
```

## Stack usado
* MongoDB
* Nest