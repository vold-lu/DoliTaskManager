import TaskIcon from "./TaskIcon.jsx";
import Star from "../svg/Star.jsx";
import React from "react";

const TaskItem = ({className, task, selectTask, showOnlyMyTasks, setTaskPinned}) => {
    return (
        <div
            className={'bg-white rounded py-2 pr-2 w-full cursor-pointer hover:shadow-lg grid grid-cols-8 ' + className}
            onClick={() => selectTask(task)}
        >
            <div className={'col-span-1 flex items-center'}>
                <TaskIcon type={task?.type_code} className={'mx-auto'}/>
            </div>
            <div className={'col-span-7 flex flex-row gap-2 flex-nowrap'}>
                <div className={'grow'}>
                    <p className={'font-bold'}>
                        {task.ref} {!showOnlyMyTasks && task?.user ? '(' + task?.user + ')' : ''}
                    </p>
                    <p className={'text-gray-600'}>
                        {task?.subject}
                    </p>
                </div>
                <div className={'ml-auto flex-shrink-0 '} onClick={(e) => {
                    e.stopPropagation();
                    setTaskPinned(task);
                }}>
                    <Star
                        className={
                            'size-5 ' +
                            (task?.is_pinned ? 'text-yellow-400' : 'text-gray-300')
                        }
                    />
                </div>

            </div>
        </div>
    );
};

export default TaskItem;
