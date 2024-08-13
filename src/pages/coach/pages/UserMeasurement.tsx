import supabase from "@/utils/supabaseClient";
import { Measurement, User } from "interfaces/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserMeasurement = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMeasurement, setNewMeasurement] = useState<Measurement>({
        id: 0,
        userId: 0,
        leftArm: 0,
        rightArm: 0,
        upperWaist: 0,
        lowerWaist: 0,
        leftThigh: 0,
        rightThigh: 0,
        weight: 0,
        height: 0,
        measurementDate: new Date(),
    });

    const fetchUserAndMeasurements = async () => {
        try {
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (userError) {
                throw new Error(userError.message);
            }

            const { data: measurementsData, error: measurementsError } = await supabase
                .from("measurements")
                .select("*")
                .eq("userId", userId);
            // .order('created_at', { ascending: false });

            if (measurementsError) {
                throw new Error(measurementsError.message);
            }

            setUser(userData);
            setMeasurements(measurementsData);
        } catch (err) {
            setError("Error al obtener la información del usuario y las mediciones");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAndMeasurements();
    }, [userId]);

    const handleMeasurementInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMeasurement((prevMeasurement) => ({
            ...prevMeasurement,
            [name]: value,
        }));
    };

    const handleCreateMeasurement = async () => {
        try {
            const { data, error } = await supabase.from("measurements").insert([
                {
                    ...newMeasurement,
                    userId: user?.id,
                    measurementDate: new Date(),
                },
            ]);
            if (error) {
                throw new Error(error.message);
            }
            setMeasurements((prevMeasurements) => [...prevMeasurements, ...(data ?? [])]);
            setNewMeasurement({
                id: 0,
                userId: 0,
                leftArm: 0,
                rightArm: 0,
                upperWaist: 0,
                lowerWaist: 0,
                leftThigh: 0,
                rightThigh: 0,
                weight: 0,
                height: 0,
                measurementDate: new Date(),
            });
        } catch (err) {
            setError("Error al crear la medida");
        }
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
            `

        navigator.clipboard.writeText(message).then(() => {
            alert("Medidas copiadas al portapapeles")
        }).catch(err => {
            console.error('Error al copiar al portapapeles: ', err)
        })
    }


    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Historial de medidas</h1>
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-center">{user?.name} {user?.lastName}</h2>
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
                                {/* <th className="border p-2 whitespace-nowrap">IMC</th> */}
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
                                        {/* <td className="border p-2 text-center">{bmi.toFixed(2)}</td> */}
                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() => {
                                                    copyToClipboard(measurement)
                                                }}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
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
            <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-center">Agregar nuevas medidas</h2>
                <form className="space-y-4">
                    <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="leftArm" className="block mb-1">
                                    Brazo Izquierdo:
                                </label>
                                <input
                                    type="number"
                                    name="leftArm"
                                    value={newMeasurement.leftArm}
                                    onChange={handleMeasurementInputChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="rightArm" className="block mb-1">
                                    Brazo Derecho:
                                </label>
                                <input
                                    type="number"
                                    name="rightArm"
                                    value={newMeasurement.rightArm}
                                    onChange={handleMeasurementInputChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="upperWaist" className="block mb-1">
                                    Cintura Superior:
                                </label>
                                <input
                                    type="number"
                                    name="upperWaist"
                                    value={newMeasurement.upperWaist}
                                    onChange={handleMeasurementInputChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="lowerWaist" className="block mb-1">
                                    Cintura Inferior:
                                </label>
                                <input
                                    type="number"
                                    name="lowerWaist"
                                    value={newMeasurement.lowerWaist}
                                    onChange={handleMeasurementInputChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="leftThigh" className="block mb-1">
                                    Muslo Izquierdo:
                                </label>
                                <input
                                    type="number"
                                    name="leftThigh"
                                    value={newMeasurement.leftThigh}
                                    onChange={handleMeasurementInputChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="rightThigh" className="block mb-1">
                                    Muslo Derecho:
                                </label>
                                <input
                                    type="number"
                                    name="rightThigh"
                                    value={newMeasurement.rightThigh}
                                    onChange={handleMeasurementInputChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={handleCreateMeasurement}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Agregar Medida
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserMeasurement
