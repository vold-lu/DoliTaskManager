import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";

const Home = ({apiUrl, apiKey, setView, setSelectedTask}) => {

    const {searchTasks} = useAPIData(apiUrl, apiKey);

    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!apiKey || !apiUrl) return;

        setIsLoading(true)
        setTasks([]);

        let params = {
            search_term: searchTerm,
        }

        searchTasks(params).then((items) => {
            setTasks(items)
        }).finally(() => {
            setIsLoading(false)
        })

    }, [searchTerm, apiUrl, apiKey])

    function selectTask(currentTask) {
        setSelectedTask(currentTask);
        setView('task');
    }

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
                {isLoading ?
                    <Loader className={'mx-auto text-center'} />
                    :
                    null
                }
                {!isLoading && tasks?.length === 0 ?
                    <div className={'bg-white rounded p-2 w-full'}>
                        <p>Aucun résultat :(</p>
                    </div>
                    :
                    null
                }
                {
                    tasks.map((task) => {
                        return (
                            <div className={'bg-white rounded p-2 w-full cursor-pointer hover:shadow-lg'} onClick={() => selectTask(task)}>
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
