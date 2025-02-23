import React, { useState, useEffect } from 'react';
import exerciseTypeList from '../assets/exerciseTypeList.json';

interface ExerciseType {
    id: string;
    name: string;
    muscle: string;
    body_part: string;
    equipment: string[];
    support: string;
}

const WorkoutSelector: React.FC = () => {
    const [workouts, setWorkouts] = useState<ExerciseType[]>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<ExerciseType | null>(null);

    useEffect(() => {
        // JSONからエクササイズデータを設定
        setWorkouts(exerciseTypeList);
    }, []);

    const handleSelect = (workout: ExerciseType) => {
        setSelectedWorkout(workout);
        // TODO: 選択後の遷移処理を追加（例：ルーティング）
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>ワークアウトセッションを選択してください</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {workouts.map((workout) => (
                    <li 
                        key={workout.id} 
                        onClick={() => handleSelect(workout)}
                        style={{ 
                            cursor: 'pointer', 
                            margin: '10px 0', 
                            padding: '10px', 
                            border: '1px solid #ccc' 
                        }}
                    >
                        {workout.name} ({workout.muscle})
                    </li>
                ))}
            </ul>
            {selectedWorkout && (
                <div style={{ marginTop: '20px' }}>
                    <p>選択されたワークアウト: {selectedWorkout.name}</p>
                    <button onClick={() => console.log('ワークアウト開始')}>
                        ワークアウト開始
                    </button>
                </div>
            )}
        </div>
    );
};

export default WorkoutSelector;