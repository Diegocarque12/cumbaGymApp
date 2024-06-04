Users

This table will store personal information about the clients.
Fields: id (primary key), nationalId, name, lastName, age, goal, startDate, gender
Measurements

This table will store the body measurements of clients recorded by the coach.
Fields: id (primary key), userId (foreign key referencing Users table), leftArm, rightArm, upperWaist, lowerWaist, leftThigh, rightThigh, measurementDate
Routines

This table will store the routines created by the coach.
Fields: id (primary key), name
ExerciseSets

This table will store the exercise sets within each routine.
Fields: id (primary key), routineId (foreign key referencing Routines table), machineName, setNumber, weight, repetitions
UserRoutines

This is a junction table to establish the many-to-many relationship between Users and Routines.
Fields: id (primary key), userId (foreign key referencing Users table), routineId (foreign key referencing Routines table)

Store personal information about clients in the Users table.
Record body measurements for each client in the Measurements table, with a reference to the corresponding user.
Create routines with a name in the Routines table.
Store exercise sets within each routine in the ExerciseSets table, with a reference to the corresponding routine.
Establish a many-to-many relationship between users and routines using the UserRoutines junction table, allowing a user to have multiple routines and a routine to be assigned to multiple users.

-- Users table
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

-- Measurements table
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

-- Routines table
CREATE TABLE Routines (
id SERIAL PRIMARY KEY,
name VARCHAR(100) NOT NULL
);

-- ExerciseSets table
CREATE TABLE ExerciseSets (
id SERIAL PRIMARY KEY,
routineId INT NOT NULL REFERENCES Routines(id),
machineName VARCHAR(100) NOT NULL,
setNumber INT NOT NULL,
weight FLOAT NOT NULL,
repetitions INT NOT NULL
);

-- UserRoutines table (junction table)
CREATE TABLE UserRoutines (
id SERIAL PRIMARY KEY,
userId INT NOT NULL REFERENCES Users(id),
routineId INT NOT NULL REFERENCES Routines(id),
UNIQUE (userId, routineId)
);
