# Base de Datos CumbaGym

## Descripción

La base de datos de CumbaGym está diseñada para almacenar y gestionar información relacionada con clientes, medidas corporales, rutinas de ejercicios y la asignación de rutinas a clientes. A continuación, se describen las tablas que componen la base de datos:

### Tabla Users

Esta tabla almacenará la información personal de los clientes.

| Campo      | Tipo        | Descripción                                   |
| ---------- | ----------- | --------------------------------------------- |
| id         | SERIAL      | Clave primaria                                |
| nationalId | VARCHAR(20) | Identificador nacional único (no nulo, único) |
| name       | VARCHAR(50) | Nombre (no nulo)                              |
| lastName   | VARCHAR(50) | Apellido (no nulo)                            |
| age        | INT         | Edad (no nulo)                                |
| goal       | TEXT        | Objetivo                                      |
| startDate  | DATE        | Fecha de inicio (no nulo)                     |
| gender     | VARCHAR(10) | Género (no nulo)                              |

### Tabla Measurements

Esta tabla almacenará las medidas corporales de los clientes registradas por el entrenador.

| Campo           | Tipo   | Descripción                                                  |
| --------------- | ------ | ------------------------------------------------------------ |
| id              | SERIAL | Clave primaria                                               |
| userId          | INT    | Clave foránea que hace referencia a la tabla Users (no nulo) |
| leftArm         | FLOAT  | Medida del brazo izquierdo                                   |
| rightArm        | FLOAT  | Medida del brazo derecho                                     |
| upperWaist      | FLOAT  | Medida de la cintura superior                                |
| lowerWaist      | FLOAT  | Medida de la cintura inferior                                |
| leftThigh       | FLOAT  | Medida del muslo izquierdo                                   |
| rightThigh      | FLOAT  | Medida del muslo derecho                                     |
| measurementDate | DATE   | Fecha de la medición (no nulo)                               |

### Tabla Routines

Esta tabla almacenará las rutinas creadas por el entrenador.

| Campo | Tipo         | Descripción                   |
| ----- | ------------ | ----------------------------- |
| id    | SERIAL       | Clave primaria                |
| name  | VARCHAR(100) | Nombre de la rutina (no nulo) |

### Tabla ExerciseSets

Esta tabla almacenará los conjuntos de ejercicios dentro de cada rutina.

| Campo       | Tipo         | Descripción                                                     |
| ----------- | ------------ | --------------------------------------------------------------- |
| id          | SERIAL       | Clave primaria                                                  |
| routineId   | INT          | Clave foránea que hace referencia a la tabla Routines (no nulo) |
| machineName | VARCHAR(100) | Nombre de la máquina o ejercicio (no nulo)                      |
| setNumber   | INT          | Número de serie o orden (no nulo)                               |
| weight      | FLOAT        | Peso utilizado (no nulo)                                        |
| repetitions | INT          | Número de repeticiones (no nulo)                                |

### Tabla UserRoutines

Esta es una tabla de unión para establecer la relación muchos a muchos entre las tablas Users y Routines.

| Campo     | Tipo   | Descripción                                                     |
| --------- | ------ | --------------------------------------------------------------- |
| id        | SERIAL | Clave primaria                                                  |
| userId    | INT    | Clave foránea que hace referencia a la tabla Users (no nulo)    |
| routineId | INT    | Clave foránea que hace referencia a la tabla Routines (no nulo) |

La restricción `UNIQUE (userId, routineId)` garantiza que no haya duplicados en la combinación de `userId` y `routineId`.

## Funcionalidades

- Almacenar la información personal de los clientes en la tabla `Users`.
- Registrar las medidas corporales de cada cliente en la tabla `Measurements`, con una referencia al usuario correspondiente.
- Crear rutinas con un nombre en la tabla `Routines`.
- Almacenar los conjuntos de ejercicios dentro de cada rutina en la tabla `ExerciseSets`, con una referencia a la rutina correspondiente.
- Establecer una relación muchos a muchos entre usuarios y rutinas utilizando la tabla de unión `UserRoutines`, permitiendo que un usuario tenga múltiples rutinas y que una rutina sea asignada a múltiples usuarios.

## Creación de Tablas

A continuación, se muestra el código SQL para crear las tablas en la base de datos:

```sql
-- Tabla Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    nationalId VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    goal TEXT,
    startDate DATE NOT NULL,
    gender VARCHAR(10) NOT NULL
);

-- Tabla Measurements
CREATE TABLE Measurements (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Users(id),
    leftArm FLOAT,
    rightArm FLOAT,
    upperWaist FLOAT,
    lowerWaist FLOAT,
    leftThigh FLOAT,
    rightThigh FLOAT,
    measurementDate DATE NOT NULL
);

-- Tabla Routines
CREATE TABLE Routines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Tabla ExerciseSets
CREATE TABLE ExerciseSets (
    id SERIAL PRIMARY KEY,
    routineId INT NOT NULL REFERENCES Routines(id),
    machineName VARCHAR(100) NOT NULL,
    setNumber INT NOT NULL,
    weight FLOAT NOT NULL,
    repetitions INT NOT NULL
);

-- Tabla UserRoutines (tabla de unión)
CREATE TABLE UserRoutines (
    id SERIAL PRIMARY KEY,
    userId INT NOT NULL REFERENCES Users(id),
    routineId INT NOT NULL REFERENCES Routines(id),
    UNIQUE (userId, routineId)
);
```

Esta estructura de base de datos permite una gestión eficiente de la información relacionada con clientes, medidas corporales, rutinas de ejercicios y la asignación de rutinas a clientes en la aplicación CumbaGym.
