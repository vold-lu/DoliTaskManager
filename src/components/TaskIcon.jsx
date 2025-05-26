import QuestionMarkCircle from "../svg/QuestionMarkCircle.jsx";
import BugAnt from "../svg/BugAnt.jsx";
import ExclamationTriangle from "../svg/ExclamationTriangle.jsx";
import PlusCircle from "../svg/PlusCircle.jsx";
import InformationCircle from "../svg/InformationCircle.jsx";

const Icons = {
    'DEFAULT': InformationCircle,
    'SUPPORT_N1': QuestionMarkCircle,
    'BUG': BugAnt,
    'SUPPORT_N2': ExclamationTriangle,
    'FEATURE': PlusCircle,
}

const IconStyles = {
    'DEFAULT': 'text-blue-500',
    'SUPPORT_N1': 'text-yellow-500',
    'BUG': 'text-red-500',
    'SUPPORT_N2': 'text-orange-500',
    'FEATURE': 'text-green-500',
}

const TaskIcon = ({type, className}) => {
    if (!type || !Icons[type]) {
        type = 'DEFAULT'
    }

    const Icon = Icons[type];
    const iconStyle = IconStyles[type];

    return <Icon className={iconStyle + ' ' + className}/>
};

export default TaskIcon;
