import QuestionMarkCircle from "../svg/QuestionMarkCircle.jsx";
import BugAnt from "../svg/BugAnt.jsx";
import ExclamationTriangle from "../svg/ExclamationTriangle.jsx";
import PlusCircle from "../svg/PlusCircle.jsx";

const Icons = {
    'SUPPORT': QuestionMarkCircle,
    'BUG': BugAnt,
    'Developer escalation': ExclamationTriangle,
    'FEATURE': PlusCircle,
}

const IconStyles = {
    'SUPPORT': 'text-yellow-500',
    'BUG': 'text-red-500',
    'Developer escalation': 'text-orange-500',
    'FEATURE': 'text-green-500',
}

const TaskIcon = ({type, className}) => {
    const Icon = Icons[type];
    const iconStyle = IconStyles[type];

    return <Icon className={iconStyle + ' ' + className}/>
};

export default TaskIcon;
