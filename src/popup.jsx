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
    const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(true);

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

    return (
        <>
            <Header view={view} setView={setView} setSelectedTask={setSelectedTask}/>
            <div className={'w-full h-full p-2 bg-blue-100'}>

                {view === 'home' ?
                    <Home apiKey={apiKey} apiUrl={apiUrl} showOnlyMyTasks={showOnlyMyTasks}
                          setView={setView} selectedTask={selectedTask}
                          setSelectedTask={setSelectedTask}/>
                    :
                    null
                }

                {view === 'settings' ?
                    <Settings setApiKey={saveApiKey} apiKey={apiKey}
                              setApiUrl={saveApiUrl} apiUrl={apiUrl}
                              setShowOnlyMyTasks={saveShowOnlyMyTasks} showOnlyMyTasks={showOnlyMyTasks}/>
                    :
                    null
                }

                {view === 'task' ?
                    <Task apiKey={apiKey} apiUrl={apiUrl} setView={setView} selectedTask={selectedTask}
                          setSelectedTask={setSelectedTask}/>
                    :
                    null
                }
            </div>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>)
