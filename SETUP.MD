# Setup guide

Tady je menší postup jak setupnout react appku, když ste to nikdy nedělali. Budete potřebovat [Node.js](https://nodejs.org/en), ověřit si to můžete v terminále pomocí `node -v` a `npm -v`.
Na vaší hře můžete pracovat buď jako na nový appce, takže si vytvoříte novou react appku, nebo prostě dělat jí rovnou do celku jen jako modul navíc.
Pokud budete chtít dělat novou appku, vytvoříte si novej react projekt pomocí příkazu:

    npx create-react-app nova-hra

Když budete chtít dělat hru rovnou v tom projektu, vytvořte si pro ní adresář v `src/games`, ve kterým budete mít hlavní soubor jako `pexeso.js`. Ten by měl vypadat nějak takhle.

    import React, { useState } from 'react';

    function Pexeso() {
        return (
            <div>
                {/* Tady logika a UI atd */}
            </div>
        );
    }

    export default Pexeso;

S implementací hry vám pomůže kámoš chatbot. Hru integrujete do celku tak, že do `src/components/GameLoader.js` přidáte import s vaší hrou,

    import Pexeso from '../games/Pexeso/Pexeso';

přidáte záznam hry do objektu games,

    pexeso: Pexeso

potom v `src/components/Menu.js` přidejte vaší hru do pole games.

    { id: 'pexeso', name: 'Pexeso' }

Když máte tohle, tak můžete appku spustit a měla by vám tam už vyjíždět v tom menu. Jako příklad jsem použil pexeso, ale v projektu by měl bejt už ten blackjack, kde se můžete podívat jak to tam je tohle všechno zaznamenaný v tom GameLoaderu a Menu. Snad sem na nic nezapomněl no, kdyby vám to nešlo nebo ste měli jakejkoliv návrh na zlepšení, tak pište klidně.

## Spouštění projektu

Projekt spouštíte příkazem:

    npm start

když nepůjde, zkuste předtím:

    npm install

a pak znovu start.

## Spúšťanie backendu

    `cd ITU-backend`
    `node index.js`

Ak nepôjde - nezabudnite na

    `npm install`
