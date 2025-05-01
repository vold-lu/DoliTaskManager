import React from 'react';

const Settings = ({apiKey, setApiKey, apiUrl, setApiUrl}) => {
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <label className={'w-full'}>
                URL de l'API
                <input
                    type="text"
                    name={'apiUrl'}
                    className="border p-2 w-full rounded"
                    placeholder="https://localhost"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                />
            </label>

            <label className={'w-full'}>
                clef API
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="1337"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
            </label>
        </div>
    );
};

export default Settings;
