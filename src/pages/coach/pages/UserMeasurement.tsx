import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '@/utils/supabaseClient';
import { Measurement, User } from 'interfaces/types';

const UserMeasurement = () => {
	const { userId } = useParams<{ userId: string }>();
	const [currentUser, setCurrentUser] = useState<User | null>(null)
	const [showForm, setShowForm] = useState(false);
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
	const [newMeasurement, setNewMeasurement] = useState<Omit<Measurement, 'id'>>({
		userId: Number(userId),
		leftArm: 0,
		rightArm: 0,
		upperWaist: 0,
		lowerWaist: 0,
		leftThigh: 0,
		rightThigh: 0,
		measurementDate: new Date().toISOString().split('T')[0],
		weight: 0,
		height: 0,
	});

	useEffect(() => {
		fetchMeasurements();
	}, [userId]);


	useEffect(() => {
		const fetchCurrentUser = async () => {
			const { data, error } = await supabase
				.from('users')
				.select('*')
				.eq('id', userId)
				.single()

			if (error) {
				console.error('Error fetching current user:', error)
			} else {
				setCurrentUser(data)
			}
		}

		fetchCurrentUser()
	}, [userId])

	const fetchMeasurements = async () => {
		const { data, error } = await supabase
			.from('measurements')
			.select('*')
			.eq('userId', userId)
			.order('measurementDate', { ascending: false });

		if (error) {
			console.error('Error fetching measurements:', error);
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
			userId: Number(userId),
			leftArm: 0,
			rightArm: 0,
			upperWaist: 0,
			lowerWaist: 0,
			leftThigh: 0,
			rightThigh: 0,
			measurementDate: new Date().toISOString().split('T')[0],
			weight: 0,
			height: 0,
		});
	};

	const addMeasurement = async () => {
		const { error } = await supabase.from('measurements').insert([newMeasurement]);
		if (error) console.error('Error adding measurement:', error);
	};

	const updateMeasurement = async (measurement: Measurement) => {
		const { error } = await supabase
			.from('measurements')
			.update(measurement)
			.eq('id', measurement.id);
		if (error) console.error('Error updating measurement:', error);
	};

	const deleteMeasurement = async (id: number) => {
		const { error } = await supabase.from('measurements').delete().eq('id', id);
		if (error) {
			console.error('Error deleting measurement:', error);
		} else {
			fetchMeasurements();
		}
	};

	const startEditing = (measurement: Measurement) => {
		setEditingMeasurement(measurement);
	};

	const copyToClipboard = (measurement: Measurement) => {
		const formattedDate = new Date(measurement.measurementDate).toLocaleDateString()
		const bmi = (measurement.weight / Math.pow(measurement.height / 100, 2)).toFixed(2)

		const message = `Medidas (${formattedDate}):
            Peso: ${measurement.weight} kg
            Altura: ${measurement.height} cm
            Brazo Izquierdo: ${measurement.leftArm} cm
            Brazo Derecho: ${measurement.rightArm} cm
            Cintura Superior: ${measurement.upperWaist} cm
            Cintura Inferior: ${measurement.lowerWaist} cm
            Muslo Izquierdo: ${measurement.leftThigh} cm
            Muslo Derecho: ${measurement.rightThigh} cm
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
				<h2 className="text-2xl font-semibold mb-4 text-center">{currentUser?.name} {currentUser?.lastName}</h2>
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
										<td className="border p-2 text-center whitespace-nowrap">{new Date(measurement.measurementDate).toLocaleDateString()}</td>
										<td className="border p-2 text-center">{measurement.weight}</td>
										<td className="border p-2 text-center">{measurement.height}</td>
										<td className="border p-2 text-center">{measurement.leftArm}</td>
										<td className="border p-2 text-center">{measurement.rightArm}</td>
										<td className="border p-2 text-center">{measurement.upperWaist}</td>
										<td className="border p-2 text-center">{measurement.lowerWaist}</td>
										<td className="border p-2 text-center">{measurement.leftThigh}</td>
										<td className="border p-2 text-center">{measurement.rightThigh}</td>
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
										leftArm: lastMeasurement.leftArm,
										rightArm: lastMeasurement.rightArm,
										upperWaist: lastMeasurement.upperWaist,
										lowerWaist: lastMeasurement.lowerWaist,
										leftThigh: lastMeasurement.leftThigh,
										rightThigh: lastMeasurement.rightThigh,
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
							<label htmlFor="leftArm" className="block text-sm font-medium text-gray-700">Brazo Izquierdo (cm)</label>
							<input
								id="leftArm"
								type="number"
								name="leftArm"
								value={editingMeasurement?.leftArm || newMeasurement.leftArm}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del brazo izquierdo"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="rightArm" className="block text-sm font-medium text-gray-700">Brazo Derecho (cm)</label>
							<input
								id="rightArm"
								type="number"
								name="rightArm"
								value={editingMeasurement?.rightArm || newMeasurement.rightArm}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del brazo derecho"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
					</div>
					<div className='flex gap-2'>
						<div className="space-y-2 w-full">
							<label htmlFor="upperWaist" className="block text-sm font-medium text-gray-700">Cintura Superior (cm)</label>
							<input
								id="upperWaist"
								type="number"
								name="upperWaist"
								value={editingMeasurement?.upperWaist || newMeasurement.upperWaist}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida de cintura superior"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="lowerWaist" className="block text-sm font-medium text-gray-700">Cintura Inferior (cm)</label>
							<input
								id="lowerWaist"
								type="number"
								name="lowerWaist"
								value={editingMeasurement?.lowerWaist || newMeasurement.lowerWaist}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida de cintura inferior"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
					</div>
					<div className='flex gap-2'>
						<div className="space-y-2 w-full">
							<label htmlFor="leftThigh" className="block text-sm font-medium text-gray-700">Muslo Izquierdo (cm)</label>
							<input
								id="leftThigh"
								type="number"
								name="leftThigh"
								value={editingMeasurement?.leftThigh || newMeasurement.leftThigh}
								onChange={(e) => handleInputChange(e, !!editingMeasurement)}
								placeholder="Ingrese medida del muslo izquierdo"
								className="form-input block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
							/>
						</div>
						<div className="space-y-2 w-full">
							<label htmlFor="rightThigh" className="block text-sm font-medium text-gray-700">Muslo Derecho (cm)</label>
							<input
								id="rightThigh"
								type="number"
								name="rightThigh"
								value={editingMeasurement?.rightThigh || newMeasurement.rightThigh}
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
						<label htmlFor="measurementDate" className="block text-sm font-medium text-gray-700">Fecha de Medición</label>
						<input
							id="measurementDate"
							type="date"
							name="measurementDate"
							value={editingMeasurement?.measurementDate || newMeasurement.measurementDate}
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

export default UserMeasurement;

