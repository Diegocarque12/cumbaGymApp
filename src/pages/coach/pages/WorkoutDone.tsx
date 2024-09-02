import Confetti from 'react-confetti';

const WorkoutDone = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6 text-green-600">Workout Complete!</h1>
            <p className="text-xl mb-8">Great job! You've finished your workout.</p>
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-4">Workout Summary</h2>
                <ul className="list-disc list-inside mb-6">
                    <li>Duration: 45 minutes</li>
                    <li>Calories burned: 300</li>
                    <li>Exercises completed: 5</li>
                </ul>
                <a href='/coach/dashboard' className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Back to Dashboard
                </a>
            </div>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={200}
            />
        </div>
    )
}

export default WorkoutDone
