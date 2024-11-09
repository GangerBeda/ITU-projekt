import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function PanelPlayers() {
    return (
        <>
            <div className='icon-container'>
                <FontAwesomeIcon icon={faTimes} className='x-icon' />
            </div>
            <p>Total Cards</p>
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
            <div className='separator' />
            <p>Development Cards</p>
            <div className='card-container'>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
                <div className='card'>0</div>
            </div>
            <div className='separator' />
            <p>Largest Army</p>
            <div className='card-container'>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
            </div>
            <div className='separator' />
            <p>Longest Road</p>
            <div className='card-container'>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
                <div className='card'>
                    <div className='circle'>0</div>
                </div>
            </div>
            <div className='separator' />
        </>
    );
}
