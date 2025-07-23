/* global chrome */
import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home.jsx";
import './index.css';
import Header from "./components/Header.jsx";
import Settings from "./Settings.jsx";
import Task from "./Task.jsx";

const App = () => {

    const [view, setView] = useState('home');

    const [apiKey, setApiKey] = useState('')
    const [apiUrl, setApiUrl] = useState('')
    const [defaultDuration, setDefaultDuration] = useState(30)
    const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(true);
    const [showClosedTasks, setShowClosedTasks] = useState(false);
    const [pinnedTaskRefs, setPinnedTaskRefs] = useState([]);

    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        chrome.storage.sync.get(['apiKey'], (result) => {
            if (result.apiKey) {
                setApiKey(result.apiKey)
            }
        })

        chrome.storage.sync.get(['apiUrl'], (result) => {
            if (result.apiUrl) {
                setApiUrl(result.apiUrl)
            }
        })

        chrome.storage.sync.get(['showOnlyMyTasks'], (result) => {
            if (result.showOnlyMyTasks !== undefined) {
                setShowOnlyMyTasks(result.showOnlyMyTasks)
            }
        })

        chrome.storage.sync.get(['showClosedTasks'], (result) => {
            if (result.showClosedTasks !== undefined) {
                setShowClosedTasks(result.showClosedTasks)
            }
        })

        chrome.storage.sync.get(['defaultDuration'], (result) => {
            if (result.defaultDuration !== undefined) {
                setDefaultDuration(result.defaultDuration)
            }
        })

        chrome.storage.sync.get(['pinnedTaskRefs'], (result) => {
            if (result.pinnedTaskRefs !== undefined) {
                setPinnedTaskRefs(result.pinnedTaskRefs)
            }
        })
    }, [])

    const saveApiKey = (currentApiKey) => {
        chrome.storage.sync.set({apiKey: currentApiKey}, () => {
            setApiKey(currentApiKey)
        })
    }

    const saveApiUrl = (currentApUrl) => {
        chrome.storage.sync.set({apiUrl: currentApUrl}, () => {
            setApiUrl(currentApUrl)
        })
    }

    const saveShowOnlyMyTasks = (showOnlyMyTasks) => {
        chrome.storage.sync.set({showOnlyMyTasks: showOnlyMyTasks}, () => {
            setShowOnlyMyTasks(showOnlyMyTasks)
        })
    }

    const saveShowClosedTasks = (showClosedTasks) => {
        chrome.storage.sync.set({showClosedTasks: showClosedTasks}, () => {
            setShowClosedTasks(showClosedTasks)
        })
    }

    const saveDefaultDuration = (currentDefaultDuration) => {
        chrome.storage.sync.set({defaultDuration: currentDefaultDuration}, () => {
            setDefaultDuration(currentDefaultDuration)
        })
    }

    const savePinnedTaskRef = (currentPinnedTaskRef, value) => {
        let updatedPinnedTaskRefs;

        if (value) {
            updatedPinnedTaskRefs = [...pinnedTaskRefs];
            if (!updatedPinnedTaskRefs.includes(currentPinnedTaskRef)) {
                updatedPinnedTaskRefs.push(currentPinnedTaskRef);
            }
        } else {
            updatedPinnedTaskRefs = pinnedTaskRefs.filter(ref => ref !== currentPinnedTaskRef);
        }

        chrome.storage.sync.set({pinnedTaskRefs: updatedPinnedTaskRefs}, () => {
            console.log(updatedPinnedTaskRefs)
            setPinnedTaskRefs(updatedPinnedTaskRefs);
        });
    };


    return (
        <>
            <Header view={view} setView={setView} setSelectedTask={setSelectedTask}/>
            <div className={'w-full h-full'}>

                {view === 'home' ?
                    <Home apiKey={apiKey} apiUrl={apiUrl} showOnlyMyTasks={showOnlyMyTasks}
                          showClosedTasks={showClosedTasks}
                          setView={setView} selectedTask={selectedTask}
                          setSelectedTask={setSelectedTask} pinnedTaskRefs={pinnedTaskRefs}
                          savePinnedTaskRef={savePinnedTaskRef}/>
                    :
                    null
                }

                {view === 'settings' ?
                    <Settings setApiKey={saveApiKey} apiKey={apiKey}
                              setApiUrl={saveApiUrl} apiUrl={apiUrl}
                              setShowOnlyMyTasks={saveShowOnlyMyTasks} showOnlyMyTasks={showOnlyMyTasks}
                              setDefaultDuration={saveDefaultDuration} defaultDuration={defaultDuration}
                              setShowClosedTasks={saveShowClosedTasks}
                              showClosedTasks={showClosedTasks}
                    />
                    :
                    null
                }

                {view === 'task' ?
                    <Task apiKey={apiKey} apiUrl={apiUrl} setView={setView} selectedTask={selectedTask}
                          setSelectedTask={setSelectedTask} defaultDuration={defaultDuration}/>
                    :
                    null
                }
            </div>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
