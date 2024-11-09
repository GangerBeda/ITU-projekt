import React, { useState } from 'react';
import './Panel.css';
import PanelResources from './panel/PanelResources';
import PanelPlayers from './panel/PanelPlayers';

export default function Panel() {
    const [panel, setPanel] = useState('resources');
    return (
        <div className='panel'>
            {panel === 'resources' ? <PanelResources setPanel={setPanel} /> : <PanelPlayers setPanel={setPanel} />}
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
        </div>
    );
}
