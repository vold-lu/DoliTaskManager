import React, {useEffect, useRef, useState} from 'react';
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
    const [lastRefFounded, setLastRefFounded] = useState('');

    // Sticky headers refs & heights for auto top calculation
    const searchBarRef = useRef(null);
    const pinnedHeaderRef = useRef(null);
    const tasksHeaderRef = useRef(null);

    const [searchBarHeight, setSearchBarHeight] = useState(0);
    const [pinnedHeaderHeight, setPinnedHeaderHeight] = useState(0);

    // Measure sticky blocks heights on mount and window resize
    useEffect(() => {
        function updateHeights() {
            setSearchBarHeight(searchBarRef.current ? searchBarRef.current.offsetHeight : 0);
            setPinnedHeaderHeight(pinnedHeaderRef.current ? pinnedHeaderRef.current.offsetHeight : 0);
        }

        updateHeights();
        window.addEventListener('resize', updateHeights);
        return () => window.removeEventListener('resize', updateHeights);
    }, []);

    useEffect(() => {
        if (!apiKey || !apiUrl) return;

        const fetchTasks = async () => {
            setIsLoading(true);

            let currentSearchTerm = searchTerm;

            if (searchTerm === '') {
                currentSearchTerm = await findTaskRef();
                if (currentSearchTerm && lastRefFounded !== currentSearchTerm) {
                    setSearchTerm(currentSearchTerm);
                    setLastRefFounded(currentSearchTerm);
                } else {
                    currentSearchTerm = '';
                }
            }

            const params = {search_term: currentSearchTerm};
            if (showOnlyMyTasks === false) {
                params.view_all_tasks = true;
            }
            if (showClosedTasks === true) {
                params.closed_only = true;
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
                    // Priorité à selectedIssue
                    if (url.searchParams.has("selectedIssue")) {
                        return resolve(url.searchParams.get("selectedIssue"));
                    }

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

    // Handlers for scroll into view on section header click
    const handlePinnedHeaderClick = () => {
        pinnedHeaderRef.current && pinnedHeaderRef.current.scrollIntoView({behavior: "smooth", block: "start"});
    };
    const handleTasksHeaderClick = () => {
        tasksHeaderRef.current && tasksHeaderRef.current.scrollIntoView({behavior: "smooth", block: "start"});
    };

    return (
        <div
            className="h-[540px] overflow-hidden bg-blue-50 rounded-xl flex flex-col w-full">
            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-0">
                {/* Search bar sticky */}
                <div ref={searchBarRef}
                     className="sticky z-10 bg-blue-50 pb-2"
                     style={{top: 0}}>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-grow rounded-full border border-gray-300 px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-300"
                            placeholder="Rechercher une tâche…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {/* Section Épinglés sticky header */}
                <div
                    ref={pinnedHeaderRef}
                    className="sticky z-10 bg-blue-50 py-1 cursor-pointer select-none"
                    style={{top: searchBarHeight}}
                    onClick={handlePinnedHeaderClick}
                >
                    <div className="flex items-center gap-1 text-yellow-700 font-semibold text-sm">
                        <span>Épinglés</span>
                        <span className="text-xs font-normal text-gray-400">
              ({pinnedTasks.length})
            </span>
                    </div>
                </div>

                {/* Liste des pinned tasks */}
                <div className="flex flex-col gap-2 px-0 pb-2">
                    {isLoadingPinned && <Loader className="mx-auto text-center"/>}
                    {!isLoadingPinned && pinnedTasks.length === 0 && (
                        <p className="text-gray-400 text-sm">Aucune tâche épinglée.</p>
                    )}
                    {!isLoadingPinned &&
                        pinnedTasks.map((pinnedTask) => (
                            <TaskItem
                                key={pinnedTask.ref}
                                className="bg-yellow-50 border border-yellow-200 rounded-lg shadow px-3 py-2"
                                task={pinnedTask}
                                setTaskPinned={setTaskPinned}
                                selectTask={selectTask}
                                showOnlyMyTasks={showOnlyMyTasks}
                            />
                        ))}
                </div>
                {/* Toutes les tâches sticky header */}
                <div
                    ref={tasksHeaderRef}
                    className="sticky z-10 bg-blue-50 py-1 cursor-pointer select-none"
                    style={{top: searchBarHeight + pinnedHeaderHeight}}
                    onClick={handleTasksHeaderClick}
                >
                    <div className="flex items-center gap-1 text-blue-700 font-semibold text-sm">
                        <span>Toutes les tâches</span>
                        <span className="text-xs font-normal text-gray-400">({tasks.length})</span>
                    </div>
                </div>
                {/* Liste des tasks */}
                <div className="flex flex-col gap-2 w-full pb-2">
                    {isLoading && <Loader className="mx-auto text-center"/>}
                    {!isLoading && tasks.length === 0 && (
                        <p className="text-gray-400 text-sm">Aucun résultat :(</p>
                    )}
                    {!isLoading &&
                        tasks.map((task) => (
                            <TaskItem
                                key={task.ref}
                                className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2"
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
