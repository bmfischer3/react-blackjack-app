# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# react-blackjack-app


## Data Structures

1. Dealer and player hands are stored as arrays. 
2. Dealer and player scores are calculated when needed from those arrays, but otherwise not stored. 
3. After each of the below actions, the arrays are ran through a function to calculate the score. 
   1. Initial hands for the player and dealer are dealt
   2. Player draws a card
   3. Dealer draws a card


<!-- ## Other Notes

- Round statuses are updated based on the calculation + PlayerStand button. 
- Each function needs to check the roundStatus prior to executing any code, else the status and message on screen may not match what is happening.  -->
