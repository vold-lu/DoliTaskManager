import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";
import config from './config.js';
import TaskItem from "./components/Taskitem.jsx";

const Home = ({
                  apiUrl,
                  apiKey,
                  showOnlyMyTasks,
                  showClosedTasks,
                  setView,
                  setSelectedTask,
                  pinnedTaskRefs,
                  savePinnedTaskRef
              }) => {
    const {searchTasks, getTask} = useAPIData(apiUrl, apiKey);

    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState([]);
    const [pinnedTasks, setPinnedTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPinned, setIsLoadingPinned] = useState(false);

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

            if (showClosedTasks === true) {
                params.is_closed = true;
            }

            try {
                const items = await searchTasks(params) || [];
                const itemsWithPinned = items.map(item => ({
                    ...item,
                    is_pinned: pinnedTaskRefs?.includes(item.ref) || false
                }));
                setTasks(itemsWithPinned);
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [searchTerm, apiUrl, apiKey, showOnlyMyTasks, pinnedTaskRefs]);

    useEffect(() => {
        if (!apiKey || !apiUrl) return;

        console.log('useEffect fetchPinnedTasks')

        const fetchPinnedTasks = async () => {
            setIsLoadingPinned(true);

            try {
                const tasks = await Promise.all(
                    (pinnedTaskRefs ?? []).map(ref =>
                        getTask({ref}).then(task => {
                            if (task) task.is_pinned = true;
                            return task;
                        })
                    )
                );
                const validTasks = tasks.filter(task => task !== null && task !== undefined);
                setPinnedTasks(validTasks);
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches épinglées:", error);
            } finally {
                setIsLoadingPinned(false);
            }
        };


        fetchPinnedTasks();
    }, [pinnedTaskRefs, apiUrl, apiKey]);

    const findTaskRef = async () => {
        return new Promise((resolve) => {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const tab = tabs[0];
                if (!tab?.url) {
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

    function setTaskPinned(currentTask) {
        savePinnedTaskRef(currentTask.ref, !currentTask.is_pinned);
    }

    return (
        <div className="flex flex-col h-[540px] w-full gap-4">
            <input
                type="text"
                className="border p-2 w-full rounded"
                placeholder="Rechercher référence de la tâche"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {pinnedTasks && (
                <div className="w-full">
                    <h2 className="font-bold mb-1">Épinglés</h2>
                    <div className="flex flex-col gap-1">
                        {isLoadingPinned && <Loader className="mx-auto text-center"/>}

                        {!isLoadingPinned && pinnedTasks.length === 0 && (
                            <p className="text-gray-500">Aucune tâche épinglée.</p>
                        )}

                        {!isLoadingPinned && pinnedTasks.map((pinnedTask) => (
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

            <div className="flex flex-col flex-grow w-full overflow-y-auto">
                <h2 className="font-bold mb-1">Toutes les tâches</h2>
                <div className="flex flex-col gap-1 w-full">
                    {isLoading && <Loader className="mx-auto text-center"/>}

                    {!isLoading && tasks.length === 0 && (
                        <p className="text-gray-500">Aucun résultat :(</p>
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
