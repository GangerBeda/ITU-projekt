import React, { useState } from 'react';
import { HexGrid, Layout, Hexagon, GridGenerator } from 'react-hexgrid';
import './Catan.css';

export default function Catan() {
    const hexClicked = (hexId) => {
        let element = document.getElementById(hexId);
        console.log(element);
    };

    return (
        <div className='container'>
            <HexGrid width={800} height={800} viewBox='-50 -50 100 100'>
                <Layout size={{ x: 10, y: 10 }} spacing={1.1} flat={false}>
                    {GridGenerator.hexagon(2).map((hex, i) => {
                        return <Hexagon id={i} key={i} q={hex.q} r={hex.r} s={hex.s} onClick={() => hexClicked(i)} className={'hexagon'} />;
                    })}
                </Layout>
            </HexGrid>
        </div>
    );
}
