import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";

const Task = ({apiUrl, apiKey, selectedTask}) => {

    const {getTask, updateTaskTime} = useAPIData(apiUrl, apiKey);

    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateTaskTimeLoading, setIsUpdateTaskTimeLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(30);


    useEffect(() => {
        setIsLoading(true)
        setTask(null);

        let params = {
            ref: selectedTask.ref,
        }

        getTask(params).then((item) => {
            setTask(item)
        }).finally(() => {
            setIsLoading(false)
        })

    }, [selectedTask])

    function DurationButton({duration}) {
        return (
            <div
                className={'p-2 rounded text-md text-center cursor-pointer ' + (selectedDuration === duration ? 'bg-blue-700 text-white' : 'bg-white')}
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

        updateTaskTime(task.ref, {duration: duration}).then(task => {
            setTask(task)
        }).finally(() => {
            setIsUpdateTaskTimeLoading(false)
        })

    }

    function setCustomerDuration(value) {
        setSelectedDuration(parseInt(value))
    }


    if (isLoading) {
        return <Loader/>
    }

    return (
        <div>
            <h1 className={'text-2xl text-center font-bold mb-4'}>{task?.ref}</h1>
            <div className={'mx-auto w-80'}>
                <div className={'grid grid-cols-4 gap-1 items-center mb-2'}>
                    <DurationButton duration={10}/>
                    <DurationButton duration={30}/>
                    <DurationButton duration={60}/>
                    <input type={'number'} value={selectedDuration} className={'p-2 rounded text-md text-center bg-white'}
                           onChange={(e) => setCustomerDuration(e.target.value)}/>
                </div>
                <div className={'grid grid-cols-6 gap-2 items-center h-12 mb-8'}>
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
                <div className={'mx-auto text-center'}>
                    <a target={'_blank'} className={'text-center text-red-500 hover:underline font-bold'} href={task?.link}>View online</a>
                </div>
            </div>

        </div>
    );
};

export default Task;
