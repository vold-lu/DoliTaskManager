import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";
import TaskIcon from "./components/TaskIcon.jsx";

const Task = ({apiUrl, apiKey, selectedTask, defaultDuration}) => {

    const {getTask, updateTaskTime} = useAPIData(apiUrl, apiKey);

    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateTaskTimeLoading, setIsUpdateTaskTimeLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(defaultDuration);
    const [note, setNote] = useState('');

    useEffect(() => {
        setIsLoading(true)
        setTask(null);

        console.log('HELLO')
        console.log(selectedTask)

        let params = {
            ref: selectedTask.ref,
        }

        getTask(params).then((item) => {
            setTask(item)
        }).finally(() => {
            setIsLoading(false)
            setNote('')
        })

    }, [selectedTask])

    function DurationButton({duration}) {
        return (
            <div
                className={'p-2 rounded text-md text-center cursor-pointer ' + (selectedDuration == duration ? 'bg-blue-700 text-white' : 'bg-white')}
                onClick={() => setSelectedDuration(duration)}>
                {duration} min
            </div>
        )
    }

    function formatBusinessDuration(minutes) {
        const minutesPerDay = 480; // 8 hours * 60 minutes
        const days = Math.floor(minutes / minutesPerDay);
        const remainingMinutes = minutes % minutesPerDay;
        const hours = Math.floor(remainingMinutes / 60);
        const mins = remainingMinutes % 60;

        let result = '';

        if (days > 0) {
            result += `${days} day${days > 1 ? 's' : ''}`;
        }

        if (hours > 0) {
            if (result) result += ' ';
            result += `${hours}h`;
        }

        if (mins > 0) {
            if (result) result += ' ';
            result += `${mins}min`;
        }

        // Case: less than a day and no full hours (e.g., 30min)
        if (!result) {
            result = `${mins}min`;
        }

        return result;
    }

    function updateTime(type) {
        setIsUpdateTaskTimeLoading(true);
        let duration = selectedDuration

        if (type === 'minus') {
            duration = -duration;
        }

        updateTaskTime(task.ref, {duration: duration, note: note}).then(task => {
            setTask(task)
        }).finally(() => {
            setIsUpdateTaskTimeLoading(false)
            setNote('')
        })

    }

    function setCustomerDuration(value) {
        setSelectedDuration(parseInt(value))
    }


    if (isLoading) {
        return <Loader/>
    }

    if (!task) {
        return null;
    }


    return (
        <div>
            <h1 className={'text-2xl font-bold mb-2 flex flex-row gap-2 text-center items-center w-full justify-center'}>
                <TaskIcon type={task.type_code}/>
                <span>{task?.ref}</span>
            </h1>
            <div className={'text-center mb-4 px-4'}>
                {task?.subject}
            </div>
            <div className={'mx-auto w-80'}>
                <div className={'grid grid-cols-4 gap-1 items-center mb-2'}>
                    <DurationButton duration={5}/>
                    <DurationButton duration={10}/>
                    <DurationButton duration={15}/>
                    <DurationButton duration={20}/>
                    <DurationButton duration={30}/>
                    <DurationButton duration={60}/>
                    <DurationButton duration={120}/>
                    <input type={'number'} value={selectedDuration}
                           className={'p-2 rounded text-md text-center bg-white border-2 border-blue-700'}
                           onChange={(e) => setCustomerDuration(e.target.value)}/>
                </div>
                <div className={'grid grid-cols-6 gap-2 items-center h-12 mb-6'}>
                    <div
                        className={'col-span-1 h-full content-center p-2 bg-white text-center hover:bg-blue-700 cursor-pointer rounded hover:text-white'}
                        onClick={() => updateTime('minus')}>
                        -
                    </div>
                    <div className={'col-span-4 p-2 content-center bg-white text-center rounded h-full'}>
                        {isUpdateTaskTimeLoading ?
                            <Loader/>
                            :
                            formatBusinessDuration(task?.time)
                        }
                    </div>
                    <div
                        className={'col-span-1 h-full p-2 content-center bg-white text-center hover:bg-blue-700 cursor-pointer rounded hover:text-white'}
                        onClick={() => updateTime('plus')}>
                        +
                    </div>
                </div>
                <div className={'grid gap-1 items-center mb-8'}>
                    <input type={'text'} className={'p-2 rounded bg-white'} placeholder={'Note'} value={note}
                           onChange={(e) => setNote(e.target.value)}/>
                </div>
                <div className={'mx-auto text-center'}>
                    <a target={'_blank'} className={'text-center text-red-500 hover:underline font-bold'}
                       href={task?.link}>Voir sur Dolibarr</a>
                </div>
            </div>

        </div>
    );
};

export default Task;
