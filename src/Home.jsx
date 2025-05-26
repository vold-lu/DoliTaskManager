import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";
import config from './config.js';
import TaskIcon from "./components/TaskIcon.jsx";
import Star from "./svg/Star.jsx";
import TaskItem from "./components/Taskitem.jsx";

const Home = ({apiUrl, apiKey, showOnlyMyTasks, setView, setSelectedTask}) => {
    const {searchTasks, updateTaskPinned, getPinnedTasks} = useAPIData(apiUrl, apiKey);

    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState([]);
    const [pinnedTasks, setPinnedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!apiKey || !apiUrl) return;

        const fetchTasks = async () => {
            setIsLoading(true);

            let currentSearchTerm = searchTerm;
            if (!searchTerm) {
                currentSearchTerm = await findTaskRef();
                if (currentSearchTerm) {
                    setSearchTerm(currentSearchTerm);
                }
            }

            const params = {search_term: currentSearchTerm};
            if (showOnlyMyTasks === false) {
                params.view_all_tasks = true;
            }

            try {
                const items = await searchTasks(params);
                setTasks(items);
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchPinnedTasks = async () => {
            try {
                const pinnedItems = await getPinnedTasks();
                setPinnedTasks(pinnedItems);
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches épinglées:", error);
            }
        };

        fetchTasks();
        fetchPinnedTasks();
    }, [searchTerm, apiUrl, apiKey, showOnlyMyTasks]);

    const findTaskRef = async () => {
        return new Promise((resolve) => {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0];
                if (!tab || !tab.url) {
                    return resolve('');
                }

                const url = new URL(tab.url);
                const hostname = url.hostname;
                const pathname = url.pathname;

                if (hostname === config.ATLASSIAN_HOSTNAME) {
                    const matches = pathname.match(/([A-Z]+-\d+)/g);
                    if (matches && matches.length) {
                        return resolve(matches[0]);
                    }
                }

                return resolve('');
            });
        });
    };

    function selectTask(currentTask) {
        setSelectedTask(currentTask);
        setView('task');
    }

    async function setTaskPinned(currentTask) {
        setIsLoading(true);
        try {
            await updateTaskPinned(currentTask.ref, !currentTask?.is_pinned);

            const updatedPinnedTasks = await getPinnedTasks();
            setPinnedTasks(updatedPinnedTasks);

            const params = {search_term: searchTerm};
            if (showOnlyMyTasks === false) {
                params.view_all_tasks = true;
            }
            const updatedTasks = await searchTasks(params);
            setTasks(updatedTasks);

        } catch (error) {
            console.error("Erreur lors de la mise à jour du pin:", error);
        } finally {
            setIsLoading(false);
        }
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

            {pinnedTasks && pinnedTasks.length > 0 && (
                <div className="w-full">
                    <h2 className="font-bold mb-1">Épinglés</h2>
                    <div className="flex flex-col gap-1">
                        {pinnedTasks.map((pinnedTask) => (
                            <TaskItem
                                key={pinnedTask.ref}
                                task={pinnedTask}
                                setTaskPinned={setTaskPinned}
                                selectTask={selectTask}
                                showOnlyMyTasks={showOnlyMyTasks}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full">
                <h2 className="font-bold mb-1">Toutes les tâches</h2>
                <div className={'flex flex-col gap-1 w-full overflow-y-auto '}>
                    {isLoading && <Loader className={'mx-auto text-center'}/>}

                    {!isLoading && tasks?.length === 0 && (
                        <div className={'bg-white rounded p-2 w-full'}>
                            <p>Aucun résultat :(</p>
                        </div>
                    )}

                    {!isLoading && tasks.map((task) => (
                        <TaskItem
                            key={task.ref}
                            task={task}
                            setTaskPinned={setTaskPinned}
                            selectTask={selectTask}
                            showOnlyMyTasks={showOnlyMyTasks}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
