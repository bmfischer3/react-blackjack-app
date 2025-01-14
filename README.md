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

## Betting Logic. 

1. Set the minimum bet (must be 5 dollars. must be a non-negative integer)
2. Bet quantity can be typed in or adjusted by arrows. Later --> Preselected bet options. 
3. Bet quantity is stored as an integer. 
4. Winning amount is calculated from the stored integer. 
5. A "player bank roll" is kept and stored as an integer. 
   1. A bet quantity cannot be bigger than what's available in the bank roll. 
   2. A button is available to re-up the bank roll by 100 units. 
6. Win pays 1:1, blackjack on initial hand pays 3:2, does not pay 3:2 on splits. 

## State Management

States Being Managed:
1. Dealer Hand
2. Player Hand
3. Player Bank Roll
4. Player Bet Selection
5. Player Bet Circle
6. Round Status
7. Round Result
8. Round Message
9. Shoe Card Quantity



(For later implementation)...
1. Card Count Quantity
2. True Card Count
3. Player Correct Decisions
4. 


<!-- ## Other Notes

- Round statuses are updated based on the calculation + PlayerStand button. 
- Each function needs to check the roundStatus prior to executing any code, else the status and message on screen may not match what is happening.  -->
