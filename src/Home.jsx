import React, {useEffect, useState} from 'react';

const Home = () => {

    const [searchTerm, setSearchTerm] = useState('');

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        setTasks([
            {
                'id': 1,
                'ref': 'HCE-123',
            },
            {
                'id': 2,
                'ref': 'HCE-456',
            }

        ])
    }, [tasks]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center">
            <input
                type="text"
                className="border p-2 w-full rounded"
                placeholder="Rechercher référence de la tache"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={'flex flex-col gap-1 w-full'}>
                {
                    tasks.map((task) => {
                        return (
                            <div className={'bg-white rounded p-2 w-full'}>
                                <p>{task.ref}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Home;
