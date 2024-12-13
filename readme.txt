Games Hub - Adresárová Štruktúra


1. Frontend (FE) Štruktúra
Adresár src/ obsahuje všetky zdrojové súbory frontendovej časti aplikácie.

Hlavné Adresáre a Súbory:
- Hlavné súbory:
    - App.js, App.css, App.test.js: Hlavné komponenty a štýly aplikácie.
    - index.js, index.css: Vstupné body aplikácie.

- Komponenty:
    - Adresár components/: (Implementoval <xplagi00>) Obsahuje menu, ktoré slúži na spúšťanie jednotlivých hier a navigáciu v aplikácii.

- Herné moduly:
    - Adresár games/: Každá hra má svoj vlastný podadresár obsahujúci všetky potrebné súbory.
        - Chess/ (Implementoval <xdacos01>): Šach
        - Blackjack/ (Implementoval <xplagi00>): Blackjack
        - FourInARow/ (Implementoval <xplagi00>): Four in a Row
        - SettlersOfCatan/ (Implementoval <xplagi00>): Settlers of Catan
        - TicTacToe/ (Implementoval <xplagi00>): Tic Tac Toe


2. Backend Štruktúra
Adresár ITU-backend/ obsahuje všetky súbory backendovej časti aplikácie.

Hlavné Adresáre a Súbory:
- Hlavné súbory:
        - index.js: Hlavný backend server.
- Databáza:
    - Adresár db/: (Implementoval <xplagi00>) 
- Modely:
    - Adresár models/: (Implementoval <xplagi00>) 
