import React from 'react';
import SettingSvg from "../svg/SettingSvg.jsx";
import ArrowLeft from "../svg/ArrowLeft.jsx";

const Header = ({view, setView}) => {
    return (
        <div className={'flex flex-row justify-between bg-blue-700 p-2 items-center text-white'}>
            {
                view === 'settings' ?
                    <>
                        <p className={'text-lg font-bold'}>Settings</p>
                        <div onClick={() => setView('home')}>
                            <ArrowLeft/>
                        </div>
                    </>
                    :
                    <>
                        <p className={'text-lg font-bold'}>user todo</p>
                        <div onClick={() => setView('settings')}>
                            <SettingSvg/>
                        </div>
                    </>
            }
        </div>
    );
};

export default Header;
