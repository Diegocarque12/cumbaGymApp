import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '@/utils/supabaseClient';
import { UserMeasurement, User } from 'interfaces/types';

const Measurement = () => {
	const { user_id } = useParams<{ user_id: string }>();
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [showForm, setShowForm] = useState(false);
	const [measurements, setMeasurements] = useState<UserMeasurement[]>([]);
	const [editingMeasurement, setEditingMeasurement] = useState<UserMeasurement | null>(null);
	const [newMeasurement, setNewMeasurement] = useState<Omit<UserMeasurement, 'id'>>({
		user_id: Number(user_id),
		left_arm: 0,
		right_arm: 0,
		upper_waist: 0,
		lower_waist: 0,
		left_thigh: 0,
		right_thigh: 0,
		measurement_date: new Date().toISOString().split('T')[0],
		weight: 0,
		height: 0,
	});

	useEffect(() => {
		fetchMeasurements();
	}, [user_id]);


	useEffect(() => {
		const fetchCurrentUser = async () => {
			const { data, error } = await supabase
				.from('profiles')
				.select('*')
				.eq('id', user_id)
				.single()

			if (error) {
				console.error('Error fetching current user:', error)
			} else {
				setCurrentUser(data)
			}
		}

		fetchCurrentUser()
	}, [user_id])

	const fetchMeasurements = async () => {
		const { data, error } = await supabase
			.from('profile_measurements')
			.select('*')
			.eq('user_id', user_id)
			.order('measurement_date', { ascending: false });

		if (error) {
			console.error('Error fetching profile_measurements:', error);
		} else {
			setMeasurements(data || []);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
		const { name, value } = e.target;
		if (isEditing && editingMeasurement) {
			setEditingMeasurement({ ...editingMeasurement, [name]: value });
		} else {
			setNewMeasurement({ ...newMeasurement, [name]: value });
		}
	};

	const handleSubmit = async (e: React.FormEvent, isEditing: boolean) => {
		e.preventDefault();
		if (isEditing && editingMeasurement) {
			await updateMeasurement(editingMeasurement);
		} else {
			await addMeasurement();
		}
		fetchMeasurements();
		setEditingMeasurement(null);
		setNewMeasurement({
			user_id: Number(user_id),
			left_arm: 0,
			right_arm: 0,
			upper_waist: 0,
			lower_waist: 0,
			left_thigh: 0,
			right_thigh: 0,
			measurement_date: new Date().toISOString().split('T')[0],
			weight: 0,
			height: 0,
		});
	};

	const addMeasurement = async () => {
		const { error } = await supabase.from('profile_measurements').insert([newMeasurement]);
		if (error) console.error('Error adding measurement:', error);
	};

	const updateMeasurement = async (measurement: UserMeasurement) => {
		const { error } = await supabase
			.from('profile_measurements')
			.update(measurement)
			.eq('id', measurement.id);
		if (error) console.error('Error updating measurement:', error);
	};

	const deleteMeasurement = async (id: number) => {
		const { error } = await supabase.from('profile_measurements').delete().eq('id', id);
		if (error) {
			console.error('Error deleting measurement:', error);
		} else {
			fetchMeasurements();
		}
	};

	const startEditing = (measurement: UserMeasurement) => {
		setEditingMeasurement(measurement);
	};

	const copyToClipboard = (measurement: UserMeasurement) => {
		const formattedDate = new Date(measurement.measurement_date).toLocaleDateString()
		const bmi = (measurement.weight / Math.pow(measurement.height / 100, 2)).toFixed(2)

		const message = `Medidas (${formattedDate}):
            Peso: ${measurement.weight} kg
            Altura: ${measurement.height} cm
            Brazo Izquierdo: ${measurement.left_arm} cm
            Brazo Derecho: ${measurement.right_arm} cm
            Cintura Superior: ${measurement.upper_waist} cm
            Cintura Inferior: ${measurement.lower_waist} cm
            Muslo Izquierdo: ${measurement.left_thigh} cm
            Muslo Derecho: ${measurement.right_thigh} cm
            BMI: ${bmi}
            `
		navigator.clipboard.writeText(message).then(() => {
			alert("Medidas copiadas al portapapeles")
		}).catch(err => {
			console.error('Error al copiar al portapapeles: ', err)
		})
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6 text-center">Historial de medidas</h1>
			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4 text-center">{currentUser?.first_name} {currentUser?.last_name}</h2>
				<div className="overflow-x-auto">
					<table className="w-full border-collapse">
						<thead>
							<tr className="bg-gray-200">
								<th className="border p-2 whitespace-nowrap">Fecha</th>
								<th className="border p-2 whitespace-nowrap">Peso (kg)</th>
								<th className="border p-2 whitespace-nowrap">Altura (cm)</th>
								<th className="border p-2 whitespace-nowrap">Brazo Izq (cm)</th>
								<th className="border p-2 whitespace-nowrap">Brazo Der (cm)</th>
								<th className="border p-2 whitespace-nowrap">Cintura Sup (cm)</th>
								<th className="border p-2 whitespace-nowrap">Cintura Inf (cm)</th>
								<th className="border p-2 whitespace-nowrap">Muslo Izq (cm)</th>
								<th className="border p-2 whitespace-nowrap">Muslo Der (cm)</th>
								<th className="border p-2 whitespace-nowrap">IMC</th>
								<th className="border p-2 whitespace-nowrap">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{measurements.map((measurement) => {
								const bmi = measurement.weight / Math.pow(measurement.height / 100, 2)
								return (
									<tr key={measurement.id}>
										<td className="border p-2 text-center whitespace-nowrap">{new Date(measurement.measurement_date).toLocaleDateString()}</td>
										<td className="border p-2 text-center">{measurement.weight}</td>
										<td className="border p-2 text-center">{measurement.height}</td>
										<td className="border p-2 text-center">{measurement.left_arm}</td>
										<td className="border p-2 text-center">{measurement.right_arm}</td>
										<td className="border p-2 text-center">{measurement.upper_waist}</td>
										<td className="border p-2 text-center">{measurement.lower_waist}</td>
										<td className="border p-2 text-center">{measurement.left_thigh}</td>
										<td className="border p-2 text-center">{measurement.right_thigh}</td>
										<td className="border p-2 text-center">{bmi.toFixed(2)}</td>
										<td className="border p-2 text-center flex gap-2">
											<button
												onClick={() => {
													copyToClipboard(measurement)
												}}
												className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
											>
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex items-center" viewBox="0 0 20 20" fill="currentColor">
													<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
													<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
												</svg>
											</button>
											<button onClick={() => startEditing(measurement)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex items-center" viewBox="0 0 20 20" fill="currentColor">
													<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
												</svg>
											</button>
											<button onClick={() => deleteMeasurement(measurement.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex items-center" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
												</svg>
											</button>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				</div>
			</div>
			<button
				onClick={() => setShowForm(!showForm)}
				className="mb-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
			>
				{showForm ? 'Ocultar Formulario' : 'Mostrar Formulario'}
			</button>
			{showForm && (

				<form onSubmit={(e) => handleSubmit(e, !!editingMeasurement)} className="space-y-6 max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
					<div className='flex justify-end w-full'>
						<button
							type="button"
							onClick={() => {
								if (measurements.length > 0) {
									const lastMeasurement = measurements[measurements.length - 1]
									setNewMeasurement({
										...newMeasurement,
										weight: lastMeasurement.weight,
										height: lastMeasurement.height,
										left_arm: lastMeasurement.left_arm,
										right_arm: lastMeasurement.right_arm,
										upper_waist: lastMeasurement.upper_waist,
										lower_waist: lastMeasurement.lower_waist,
										left_thigh: lastMeasurement.left_thigh,
										right_thigh: lastMeasurement.right_thigh,
									})
								}
							}}
							className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
								<path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
							</svg>
							Copiar Últimos Valores
						</button>
					</div>

					<div className='flex gap-2 w-full'>
						<div className="space-y-2 w-full">
							<label htmlFor="left_arm" className="block text-sm font-medium text-gray-700">Brazo Izquierdo (cm)</label>
							<input
								id="left_arm"
								type="number"
								name="left_arm"
								value={editingMeasurement?.left_arm || newMeasurement.left_arm}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del brazo izquierdo"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="right_arm" className="block text-sm font-medium text-gray-700">Brazo Derecho (cm)</label>
							<input
								id="right_arm"
								type="number"
								name="right_arm"
								value={editingMeasurement?.right_arm || newMeasurement.right_arm}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del brazo derecho"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
					</div>
					<div className='flex gap-2'>
						<div className="space-y-2 w-full">
							<label htmlFor="upper_waist" className="block text-sm font-medium text-gray-700">Cintura Superior (cm)</label>
							<input
								id="upper_waist"
								type="number"
								name="upper_waist"
								value={editingMeasurement?.upper_waist || newMeasurement.upper_waist}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida de cintura superior"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="lower_waist" className="block text-sm font-medium text-gray-700">Cintura Inferior (cm)</label>
							<input
								id="lower_waist"
								type="number"
								name="lower_waist"
								value={editingMeasurement?.lower_waist || newMeasurement.lower_waist}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida de cintura inferior"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
					</div>
					<div className='flex gap-2'>
						<div className="space-y-2 w-full">
							<label htmlFor="left_thigh" className="block text-sm font-medium text-gray-700">Muslo Izquierdo (cm)</label>
							<input
								id="left_thigh"
								type="number"
								name="left_thigh"
								value={editingMeasurement?.left_thigh || newMeasurement.left_thigh}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del muslo izquierdo"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="right_thigh" className="block text-sm font-medium text-gray-700">Muslo Derecho (cm)</label>
							<input
								id="right_thigh"
								type="number"
								name="right_thigh"
								value={editingMeasurement?.right_thigh || newMeasurement.right_thigh}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del muslo derecho"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
					</div>
					<div className='flex gap-2'>
						<div className="space-y-2 w-full">
							<label htmlFor="weight" className="block text-sm font-medium text-gray-700">Peso (kg)</label>
							<input
								id="weight"
								type="number"
								name="weight"
								value={editingMeasurement?.weight || newMeasurement.weight}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese peso"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="height" className="block text-sm font-medium text-gray-700">Altura (cm)</label>
							<input
								id="height"
								type="number"
								name="height"
								value={editingMeasurement?.height || newMeasurement.height}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese altura"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label htmlFor="measurement_date" className="block text-sm font-medium text-gray-700">Fecha de Medición</label>
						<input
							id="measurement_date"
							type="date"
							name="measurement_date"
							value={editingMeasurement?.measurement_date || newMeasurement.measurement_date}
							onChange={(e) => handleInputChange(e, !!editingMeasurement)}
							className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
						/>
					</div>
					<button
						type="submit"
						className="w-full px-4 py-2 text-white font-semibold bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
					>
						{editingMeasurement ? 'Actualizar' : 'Agregar'} Medición
					</button>
				</form>
			)}
		</div>
	);
};

export default Measurement;

