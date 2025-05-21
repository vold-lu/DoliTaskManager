import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";
import config from './config.js';
import TaskIcon from "./components/TaskIcon.jsx";

const Home = ({apiUrl, apiKey, showOnlyMyTasks, setView, setSelectedTask}) => {

    const {searchTasks} = useAPIData(apiUrl, apiKey);

    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        findTaskRef();
    }, [])

    useEffect(() => {
        if (!apiKey || !apiUrl) return;

        setIsLoading(true)
        setTasks([]);

        let params = {
            search_term: searchTerm,
        }

        if (showOnlyMyTasks === false) {
            params.view_all_tasks = true;
        }

        searchTasks(params).then((items) => {
            setTasks(items)
        }).finally(() => {
            setIsLoading(false)
        })

    }, [searchTerm, apiUrl, apiKey, showOnlyMyTasks])

    function findTaskRef() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            console.log(tabs)
            const tab = tabs[0];
            if (!tab || !tab.url) {
                return;
            }

            const url = new URL(tab.url);
            const hostname = url.hostname;
            const pathname = url.pathname;

            if (hostname === config.ATLASSIAN_HOSTNAME) {
                const matches = pathname.match(/([A-Z]+-\d+)/g);
                if (matches && matches.length) {
                    const ticketRef = matches[matches.length - 1];
                    setSearchTerm(ticketRef);
                }
            }
        });
    }


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
            <div className={'flex flex-col gap-1 w-full overflow-y-auto max-h-[475px]'}>
                {isLoading ?
                    <Loader className={'mx-auto text-center'}/>
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
                            <div key={task.ref}
                                 className={'bg-white rounded py-2 pr-2 w-full cursor-pointer hover:shadow-lg grid grid-cols-8'}
                                 onClick={() => selectTask(task)}>
                                <div className={'col-span-1 flex items-center'}>
                                    <TaskIcon type={task.type_code} className={'mx-auto'}/>
                                </div>
                                <div className={'col-span-7'}>
                                    <p className={'font-bold'}>
                                        {task.ref} {!showOnlyMyTasks ? '(' + task.user + ')' : ''}
                                    </p>
                                    <p className={'text-gray-600'}>
                                        {task.subject}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Home;
