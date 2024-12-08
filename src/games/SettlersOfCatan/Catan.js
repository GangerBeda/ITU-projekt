import React, { useState } from 'react';
import Board from './Board';
import Panel from './Panel';

export default function Catan() {
    const [activePlayerColor, setActivePlayerColor] = useState('#f00');

    const [roll1, setRoll1] = useState(1);
    const [roll2, setRoll2] = useState(1);
    return (
        <>
            {/*<select value={activePlayerColor} onChange={(e) => setActivePlayerColor(e.target.value)}>
                <option value='#f00'>Red</option>
                <option value='#00f'>Blue</option>
                <option value='#0f0'>Green</option>
                <option value='#ff0'>Yellow</option>
            </select>*/}
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Board activePlayerColor={activePlayerColor} roll1={roll1} roll2={roll2} />

                <Panel setRoll1={setRoll1} setRoll2={setRoll2} setActivePlayerColor={setActivePlayerColor} />
            </div>
        </>
    );
}
