import supabase from "@/utils/supabaseClient";
import { UserMeasurement as Measurement } from "interfaces/types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const MeasurementDetails = () => {
    const { measurement_id } = useParams<{ measurement_id: string }>();
    const [measurement, setMeasurement] = useState<Measurement | null>(null);
    const [selectedUser, setSelectedUser] = useState<{ gender: string } | null>(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMeasurementData();
    }, [measurement_id]);

    const fetchMeasurementData = async () => {
        if (measurement_id) {
            const { data, error } = await supabase
                .from('measurements')
                .select('*')
                .eq('id', measurement_id)
                .single();
            if (data) {
                setMeasurement(data);
                fetchUserData(data.user_id);
            }
            if (error) console.error('Error fetching measurement data:', error);
            // setLoading(false);
        }
    };

    const fetchUserData = async (userId: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('gender')
            .eq('id', userId)
            .single();
        if (data) setSelectedUser(data);
        if (error) console.error('Error fetching user data:', error);
    };

    // if (loading) return <div>Loading...</div>;

    return (
        <>
            <header className="bg-bg-100 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-text-100">Medidas</h1>
                </div>
            </header>
            <div className="container mx-auto px-4 py-8">
                {measurement ? (
                    <ul className="space-y-6">
                        <li key={measurement.id} className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-md">
                            <p className="text-lg font-semibold mb-3 text-gray-800">
                                <strong>Fecha:</strong>{" "}
                                {measurement.measurement_date
                                    ? new Date(measurement.measurement_date).toLocaleDateString()
                                    : ""}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <span className="text-gray-700"><strong>Peso: </strong>{measurement?.weight ? measurement?.weight : 'NA'} kg</span>
                                <span className="text-gray-700"><strong>Altura: </strong>{measurement?.height ? measurement?.height : 'NA'} cm</span>
                                {/* TODO: Add more measurements here */}
                                {/* <span className="text-gray-700"><strong>IMC: </strong>{measurement?.bmi ? measurement?.bmi : 'NA'}</span>
                            <span className="text-gray-700"><strong>Grasa corporal: </strong>{measurement?.body_fat ? measurement?.body_fat : 'NA'} %</span>
                            <span className="text-gray-700"><strong>Músculo: </strong>{measurement?.muscle_mass ? measurement?.muscle_mass : 'NA'} kg</span>
                            <span className="text-gray-700"><strong>Agua: </strong>{measurement?.water ? measurement?.water : 'NA'} %</span>
                            <span className="text-gray-700"><strong>Edad: </strong>{measurement?.age ? measurement?.age : 'NA'} años</span> */}
                            </div>
                            <div className="relative w-full sm:w-64 h-96 mx-auto">
                                {selectedUser?.gender === 'masculino' ? (
                                    <img src="/assets/men-human-outline.png" alt="Men Silhouette" className="w-full h-full flex justify-center items-center object-contain" />
                                ) : (
                                    <img src="/assets/woman-human-outline.png" alt="Woman Silhouette" className="w-full h-full flex justify-center items-center object-contain" />
                                )}
                                <span className="absolute top-24 left-4 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.left_arm} cm</span>
                                <span className="absolute top-24 right-4 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.right_arm} cm</span>
                                <span className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.upper_waist} cm</span>
                                <span className="absolute top-40 left-1/2 transform -translate-x-1/2 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.lower_waist} cm</span>
                                <span className="absolute bottom-32 left-8 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.left_thigh} cm</span>
                                <span className="absolute bottom-32 right-8 bg-blue-100 px-2 py-1 rounded-full text-sm">{measurement.right_thigh} cm</span>
                            </div>
                        </li>
                    </ul>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-600 italic">No tienes medidas registradas aún, preguntale a tu coach.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default MeasurementDetails;