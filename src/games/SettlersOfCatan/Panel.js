import React, { useState } from 'react';
import './Panel.css';
import PanelResources from './panel/PanelResources';
import PanelPlayers from './panel/PanelPlayers';

export default function Panel(props) {
    const [panel, setPanel] = useState('resources');
    return (
        <div className='panel'>
            {panel === 'resources' ? (
                <PanelResources setPanel={setPanel} setRoll1={props.setRoll1} setRoll2={props.setRoll2} setActivePlayerColor={props.setActivePlayerColor} />
            ) : (
                <PanelPlayers setPanel={setPanel} />
            )}
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
        </div>
    );
}
