import React, {useEffect, useState} from 'react';
import {useAPIData} from "./hooks/api.js";
import Loader from "./components/Loader.jsx";
import TaskIcon from "./components/TaskIcon.jsx";

const Task = ({apiUrl, apiKey, selectedTask, defaultDuration, useEmojiIcons}) => {

    const {getTask, updateTaskTime} = useAPIData(apiUrl, apiKey);

    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdateTaskTimeLoading, setIsUpdateTaskTimeLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(defaultDuration);
    const [note, setNote] = useState('');

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
            setNote('')
        })

    }, [selectedTask])

    function DurationButton({duration, className}) {
        return (
            <div
                className={
                    'px-3 py-2 rounded-md text-xs font-medium text-center cursor-pointer transition-transform duration-150 ' +
                    (selectedDuration == duration
                            ? getBorderColor(task?.type_code) + getBgColor(task?.type_code) + getTextColor(task?.type_code) + getFocusRingColor(task?.type_code) + getBgSelectedColor(task?.type_code)
                            : getBgColor(task?.type_code) + getTextColor(task?.type_code) + getHoverBgColor(task?.type_code)
                    )
                }
                onClick={() => setSelectedDuration(duration)}
            >
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
        return <Loader />
    }

    if (!task) {
        return null;
    }

    const getBorderColor = (type_code) => {
        switch (type_code) {
            case 'SUPPORT_N1':
                return ' border border-yellow-200 ';
            case 'BUG':
                return ' border border-red-200 ';
            case 'SUPPORT_N2':
                return ' border border-orange-200 ';
            case 'FEATURE':
                return ' border border-green-200 ';
            default:
                return ' border border-blue-200 ';
        }
    }

    const getBgColor = (type_code) => {
        switch (type_code) {
            case 'SUPPORT_N1':
                return ' bg-yellow-100 ';
            case 'BUG':
                return ' bg-red-100 ';
            case 'SUPPORT_N2':
                return ' bg-orange-100 ';
            case 'FEATURE':
                return ' bg-green-100 ';
            default:
                return ' bg-blue-100 ';
        }
    }

    const getTextColor = (type_code) => {
        switch (type_code) {
            case 'SUPPORT_N1':
                return ' text-yellow-500 ';
            case 'BUG':
                return ' text-red-500 ';
            case 'SUPPORT_N2':
                return ' text-orange-500 ';
            case 'FEATURE':
                return ' text-green-500 ';
            default:
                return ' text-blue-500 ';
        }
    }

    const getHoverBgColor = (type_code) => {
        switch (type_code) {
            case 'SUPPORT_N1':
                return ' hover:bg-yellow-200 ';
            case 'BUG':
                return ' hover:bg-red-200 ';
            case 'SUPPORT_N2':
                return ' hover:bg-orange-200 ';
            case 'FEATURE':
                return ' hover:bg-green-200 ';
            default:
                return ' hover:bg-blue-200 ';
        }
    }

    const getFocusRingColor = (type_code) => {
        switch (type_code) {
            case 'SUPPORT_N1':
                return ' focus:outline-none focus:ring-2 focus:ring-yellow-300 ';
            case 'BUG':
                return ' focus:outline-none focus:ring-2 focus:ring-red-300 ';
            case 'SUPPORT_N2':
                return ' focus:outline-none focus:ring-2 focus:ring-orange-300 ';
            case 'FEATURE':
                return ' focus:outline-none focus:ring-2 focus:ring-green-300 ';
            default:
                return ' focus:outline-none focus:ring-2 focus:ring-blue-300 ';
        }
    }

    const getBgSelectedColor = (type_code) => {
        switch (type_code) {
            case 'SUPPORT_N1':
                return ' bg-yellow-200 ';
            case 'BUG':
                return ' bg-red-200 ';
            case 'SUPPORT_N2':
                return ' bg-orange-200 ';
            case 'FEATURE':
                return ' bg-green-200 ';
            default:
                return ' bg-blue-200 ';
        }
    }

    const getColor = (type_code) => {
        return getBgColor(type_code) + getTextColor(type_code) + getHoverBgColor(type_code) + getBorderColor(type_code) + getFocusRingColor(type_code);
    }


    return (
        <div className={'p-3 bg-gray-50 h-full'}>
            <h1 className={'text-2xl font-bold mb-2 flex flex-row gap-2 text-center items-center w-full justify-center'}>
                <TaskIcon type={task?.type_code} useEmojiIcons={useEmojiIcons} />
                <span>{task?.ref}</span>
            </h1>
            <div className={'text-center mb-4 px-4 py-2 rounded-lg'}>
                {task?.subject}
            </div>
            <div className={'mx-auto w-80'}>
                <div className={'grid grid-cols-4 gap-1 items-center mb-2'}>
                    <DurationButton duration={5} className={getColor(task?.type_code)} />
                    <DurationButton duration={10} className={getColor(task?.type_code)} />
                    <DurationButton duration={15} className={getColor(task?.type_code)} />
                    <DurationButton duration={20} className={getColor(task?.type_code)} />
                    <DurationButton duration={30} className={getColor(task?.type_code)} />
                    <DurationButton duration={60} className={getColor(task?.type_code)} />
                    <DurationButton duration={120} className={getColor(task?.type_code)} />
                    <input type={'number'} value={selectedDuration}
                           className={'px-3 py-2 rounded-md text-md text-center bg-white ' + getBorderColor(task?.type_code) + getFocusRingColor(task?.type_code)}
                           onChange={(e) => setCustomerDuration(e.target.value)} />
                </div>

                <div className={'grid grid-cols-6 gap-2 items-center h-12 mb-4'}>
                    <div className={'col-span-1 h-full content-center p-2 text-center cursor-pointer rounded bg-white ' + getBorderColor(task?.type_code) + getHoverBgColor(task?.type_code)}
                         onClick={() => updateTime('minus')}>
                        -
                    </div>
                    <div className={'col-span-4 p-2 content-center bg-white text-center rounded h-full'}>
                        {isUpdateTaskTimeLoading
                            ? <Loader />
                            : formatBusinessDuration(task?.time)
                        }
                    </div>
                    <div className={'col-span-1 h-full p-2 content-center text-center cursor-pointer rounded bg-white ' + getBorderColor(task?.type_code) + getHoverBgColor(task?.type_code)}
                         onClick={() => updateTime('plus')}>
                        +
                    </div>
                </div>

                <div className={'grid gap-1 items-center mb-8'}>
                    <input type={'text'} className={'p-2 rounded bg-white'} placeholder={'Note'} value={note}
                           onChange={(e) => setNote(e.target.value)} />
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
