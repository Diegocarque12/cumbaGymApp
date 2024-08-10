import { useEffect, useState } from "react";
import supabase from "../../../utils/supabaseClient";
import type { User, Routine, Measurement } from "../../../../interfaces/types";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Link } from "react-router-dom";
import NewUserForm from "../components/users/NewUserForm";


const Users = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
	const [userMeasurements, setUserMeasurements] = useState<Measurement[]>([]);
	const [searchTerm, setSearchTerm] = useState("");

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const { data, error } = await supabase.from("users").select("*");
			if (error) {
				throw new Error(error.message);
			}
			setUsers(data as User[]);
		} catch (err) {
			setError("Error al obtener los usuarios");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchUserRoutines = async (userId: number) => {
		try {
			const { data, error } = await supabase
				.from("userroutines")
				.select("*, routines(*)")
				.eq("userId", userId);
			if (error) {
				throw new Error(error.message);
			}
			setUserRoutines(data.map((item) => item.routines) as Routine[]);
		} catch (err) {
			// setError("Error al obtener las rutinas del usuario");
		}
	};

	const fetchUserMeasurements = async (userId: number) => {
		try {
			const { data, error } = await supabase
				.from("measurements")
				.select("*")
				.eq("userId", userId);
			if (error) {
				throw new Error(error.message);
			}
			setUserMeasurements(data as Measurement[]);
		} catch (err) {
			// setError("Error al obtener las medidas del usuario");
		}
	};

	const handleUserClick = (user: User) => {
		setSelectedUser(user);
		if (user.id !== undefined) {
			fetchUserRoutines(user.id);
			fetchUserMeasurements(user.id);
		}
	};

	if (isLoading) {
		return <div>Cargando...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container">
			<div className="flex justify-between items-center my-8">
				<h1 className="text-4xl font-bold text-gray-800">Usuarios</h1>
				<Dialog>
					<DialogTrigger>
						<button
							className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg hidden lg:block"
						>
							Agregar Usuario
						</button>
					</DialogTrigger>
					<DialogContent className="max-w-md overflow-y-auto max-h-screen">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold mb-6 text-center text-gray-800">Formulario De Registro</DialogTitle>
							<DialogDescription>
								<NewUserForm />
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div >
			<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
				<div className="mb-6">
					<input
						type="text"
						placeholder="Buscar por nombre..."
						className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{users
						.filter((user) =>
							user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
							user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
						)
						.map((user) => (
							<Dialog key={user.id}>
								<DialogTrigger>
									<div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 cursor-pointer" onClick={() => handleUserClick(user)}>
										<div className="flex flex-col">
											<h2 className="text-xl font-semibold text-gray-800 mb-2">{user.name} {user.lastName}</h2>
											<p className="text-sm text-gray-600">Edad: {user.age}</p>
											<p className="text-sm text-gray-600">Objetivo: {user.goal}</p>
										</div>
									</div>
								</DialogTrigger>
								<DialogContent className="w-full max-w-3xl overflow-y-auto max-h-screen">
									<DialogHeader>
										<DialogTitle className="text-2xl font-bold mb-6 text-center text-gray-800">Detalles del Usuario</DialogTitle>
										<DialogDescription>
											<div>
												<div className="bg-gradient-to-r from-blue-600 to-blue-900 rounded-xl shadow-2xl p-4 sm:p-8 text-white mb-8">
													<div className="flex flex-col sm:flex-row items-center mb-6 justify-between">
														<h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">{selectedUser?.name} {selectedUser?.lastName}</h2>
														<div className="ml-auto">
															<Link to={`/couch/users/${selectedUser?.id}/edit`} className="text-white font-semibold hover:text-blue-200 transition duration-300 ease-in-out">
																<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
																	<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
																</svg>
																Editar
															</Link>
														</div>
													</div>
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
														<div className="bg-white bg-opacity-20 rounded-lg p-4">
															<p className="text-sm uppercase tracking-wide mb-1">Edad</p>
															<p className="text-xl sm:text-2xl font-semibold">{selectedUser?.age} años</p>
														</div>
														<div className="bg-white bg-opacity-20 rounded-lg p-4">
															<p className="text-sm uppercase tracking-wide mb-1">Género</p>
															<p className="text-xl sm:text-2xl font-semibold capitalize">{selectedUser?.gender}</p>
														</div>
														<div className="bg-white bg-opacity-20 rounded-lg p-4">
															<p className="text-sm uppercase tracking-wide mb-1">Objetivo</p>
															<p className="text-xl sm:text-2xl font-semibold capitalize">{selectedUser?.goal}</p>
														</div>
														<div className="bg-white bg-opacity-20 rounded-lg p-4">
															<p className="text-sm uppercase tracking-wide mb-1">Fecha de Inicio</p>
															<p className="text-xl sm:text-2xl font-semibold">
																{selectedUser?.startDate
																	? new Date(selectedUser?.startDate).toLocaleDateString()
																	: "No disponible"}
															</p>
														</div>
													</div>
												</div>
												<h3 className="text-2xl font-bold mt-10 mb-6 text-gray-800">Rutinas</h3>
												<div className="space-y-3 flex flex-col gap-2">
													{userRoutines.length > 0 ? (
														userRoutines.map((routine) => (
															<Link className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out" to={`/couch/routines/${routine.id}`} key={routine.id}>{routine.name}</Link>
														))
													) : (
														<p className="text-gray-600 italic">El usuario no tiene rutinas asignadas.</p>
													)}
												</div>
												<div className="flex flex-col sm:flex-row justify-between items-center h-auto mt-10 mb-6">
													<h3 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Últimas Medidas</h3>
													<Link to={`/couch/users/${user.id}/measurements`}
														className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg"
													>
														Agregar Medida
													</Link>
												</div>
												{userMeasurements.length > 0 ? (
													<ul className="space-y-6">
														{userMeasurements.map((measurement) => (
															<li key={measurement.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
																<p className="text-lg font-semibold mb-3 text-gray-800">
																	<strong>Fecha:</strong>{" "}
																	{measurement.measurementDate
																		? new Date(measurement.measurementDate).toLocaleDateString()
																		: ""}
																</p>
																<div className="grid grid-cols-2 gap-4 mb-6">
																	<span className="text-gray-700"><strong>Peso: </strong>{measurement?.weight ? measurement?.weight : 'NA'} kg</span>
																	<span className="text-gray-700"><strong>Altura: </strong>{measurement?.height ? measurement?.height : 'NA'} cm</span>
																</div>

																<div className="relative w-full sm:w-64 h-96 mx-auto">
																	{selectedUser?.gender === 'masculino' ? (
																		<img src="/assets/men-human-outline.png" alt="Men Silhouette" className="w-full h-full flex justify-center items-center object-contain" />
																	) : (
																		<img src="/assets/woman-human-outline.png" alt="Woman Silhouette" className="w-full h-full flex justify-center items-center object-contain" />
																	)}

																	<span className="absolute top-24 left-4 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.leftArm} cm</span>
																	<span className="absolute top-24 right-4 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.rightArm} cm</span>

																	<span className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.upperWaist} cm</span>
																	<span className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.lowerWaist} cm</span>

																	<span className="absolute bottom-32 left-8 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.leftThigh} cm</span>
																	<span className="absolute bottom-32 right-8 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.rightThigh} cm</span>
																</div>
															</li>
														))}
													</ul>
												) : (
													<p className="text-gray-600 italic">El usuario no tiene medidas registradas.</p>
												)}
											</div>
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						))}
				</div>
			</div>

			<div className="fixed bottom-8 right-8">
				<Dialog>
					<DialogTrigger>
						<button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg block lg:hidden">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							Agregar Usuario
						</button>
					</DialogTrigger>
					<DialogContent className="w-full max-w-md overflow-y-auto max-h-screen">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold mb-6 text-center text-gray-800">Formulario De Registro</DialogTitle>
							<DialogDescription>
								<NewUserForm />
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			</div>
		</div >
	);
};

export default Users;