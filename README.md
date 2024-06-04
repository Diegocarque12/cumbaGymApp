# CumbaGym

CumbaGym is a web application designed to facilitate the interaction between gym coaches and their clients. It allows coaches to create and manage routines, track client measurements, and assign routines to clients. Clients, on the other hand, can view their assigned routines and personal information.

## Features

- **User Management**: Store personal information about clients, including their national ID, name, last name, age, goal, start date, and gender.
- **Measurement Tracking**: Record body measurements for each client, such as left arm, right arm, upper waist, lower waist, left thigh, and right thigh, along with the measurement date.
- **Routine Creation**: Coaches can create routines with a name and add exercise sets to each routine, specifying the machine name, set number, weight, and repetitions.
- **Routine Assignment**: Establish a many-to-many relationship between users and routines, allowing a user to have multiple routines and a routine to be assigned to multiple users.

## Database Structure

The application uses a relational database to store and manage data. The database consists of the following tables:

- **Users**: Stores personal information about clients.
- **Measurements**: Stores body measurements of clients recorded by the coach.
- **Routines**: Stores the routines created by the coach.
- **ExerciseSets**: Stores the exercise sets within each routine.
- **UserRoutines**: A junction table to establish the many-to-many relationship between users and routines.

For more details on the database structure and table creation, refer to the [Database Description](#database-description) section.

## Getting Started

To run the CumbaGym application locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/your-username/cumbagym.git
```

2. Navigate to the project directory:

```
cd cumbagym
```

3. Install dependencies:

```
pnpm install
```

4. Start the development server:

```
pnpm run dev
```

The application will be available at `http://localhost:3000`.

## Database Description

The database structure and table creation details can be found in the [BD.md](./BD.md) file.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
