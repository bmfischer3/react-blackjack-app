# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# react-blackjack-app

## Things learned with this project
1. Breaking up into separate components after establishing a mvp is probably a good idea. 
2. Debugging is best done by walking through it step by step, what's called and what's passed and talking through it. 
3. Simple, pure functions are generally better --> No outside dependencies that aren't passed as arguments, and produce a single result.
4. When using a dispatch function and a switch-case on the downstream event, 'type' must match in the downstream function. If defined as 'type' it must follow if (action.type) if 'action' is the specified argument after 'state' for the dispatch function.
5. Don't do a main function, shit gets complciated too fast. Keep it simple and break things down to smaller components that can be imported/exported. 
6. Pay attention to what functions need access to. If a reducer is in teh main file, but there's a secondary function elsewhere that calls the dispatcher, the dispatcher has to be passed to that outer function as an argument. Check for multiple dispatchers.  


Curly braces because it's a javascript expression. 
                Secondly, betState is the current state object managed by the reducer hook. 
                betCount is the property of that state. 
                Thus, {state.property} is a dynamicaly rendered value.

betState is the object holding the current state of the reducer. 

                betCount is a key within betState that holds teh numeric value of the player's current bet.

                {betState.betCount} retrieves the value of betCount from betState and injects it into the JSX.



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

Hierarchy of State Management
1. Round Result --> useReducer
   1. Round Status is updated based on the result. 
   2. Message is based based on the result. 
2. 





(For later implementation)...
1. Card Count Quantity
2. True Card Count
3. Player Correct Decisions
4. 


<!-- ## Other Notes

- Round statuses are updated based on the calculation + PlayerStand button. 
- Each function needs to check the roundStatus prior to executing any code, else the status and message on screen may not match what is happening.  -->



# useReducer flow for betting

1. User clicks on "Add 5" to add 5 chips to the betting circle. 
2. The button passes a reference function to modifyBet(5) with a parameter of 5. 
3. The modifyBet function then calls the dispatchBet function that was initialized by the useReducer function. 
4. The dispatchBet function is tied to the reducer and state initialized. The dispatchBet function triggers an update of the state based on the return of dispatchBet. 
   1. With the dispatch function as a trigger for the reducer, it decouples how the update occurs (the reducer logic) from when teh update is triggered (calling dispatch). 
   2. Essentially, useReducer separates the how and when for a state update, maintains the current state, and encapsulates the logic. 
   3. Compared to useState, the "how" is centralized into the betReducer function. The 'when' is simplified to only when the dispatch is called. 

## Parts needed for useReducer

1. Initial state of whatever you're tracking. 
```js
// Stated anywhere in the file. 

const initialCount = { 
   count: 0 
   };

// Also good to define types as constants for clarity and maintainability. 

const ACTIONS = {
    ADD_ONE: 'add_one',
    SUBTRACT_ONE: 'subtract_one'
}


```


2. Initializng the reducer hook.

```js 
// Inside the component (i.e. App), call useReducer to initialize the reducer and state.

const [counterState, dispatchMod] = useReducer(counterReducer, initialCount);

// counterState === the current state managed by the reducer. 
// dispatchMod === function to send actions to the reducer
// counterReducer === function containing teh logic for state updates. 
// initialCount == initial state passed to the reducer. 

```


3. Functions to handle events using the reducer
- Outcome of the function must call the dispatch named in the above Array. 
  - 'dispatchMod' in this case. 

```js

// Simple increment, decrement examples.

  function increment() {
    dispatchMod({ type : ACTIONS.ADD_ONE})
  }

  function decrement() {
    dispatchMod({ type: ACTIONS.SUBTRACT_ONE})

  }

// Parameterized function example for dynamic inputs. 
// Alternative so you can adjust for different values or inputs:
// The event passes in the amount, which will equal one of the cases.

   function modifyBet(amount) {
      switch (amount) {
         case 1:
               dispatchMod({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE })
               break;
         case 5:
               dispatchMod({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_FIVE })
               break;
         case 25:
               dispatchMod({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_TWENTY_FIVE })
               break;
         case 100:
               dispatchMod({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE_HUNDRED })
               break;
         case 'c':
               dispatchMod({ type: BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE })
               break;
         default:
               break;

      }
   }

```



4. Conditional logic
- Must return in the same format as what was initialized in the reducer function. In this case, an object --> "{ count: 1 }"
- state.count is used because the "count" portion is accessed through the "state" object that is passed when useReducer is initialized in step 2. 
  - Look at it as 'counterReducer(state, action)', that 'state' parameter is what's provided by the 'useReducer(counterReducer, initialCount)' where the initialCount constant is 'count'. 'state' is simply the road to get to that state variable. 


Refined Note:
- state.count is used because the "count" property is accessed from the state object, which is passed to the reducer function (counterReducer) when useReducer is initialized in step 2.
- Think of it like this: counterReducer(state, action)—the state parameter in the reducer represents the current state, and it is provided by useReducer(counterReducer, initialCount).
- The initialCount constant defines the structure of the state object as { count: 0 }.
- In this case, state acts as the “road” that leads to the count property, allowing you to access and update its value.


```js

function counterReducer(state, action) {
   switch(action.type) {
      case ACTIONS.ADD_ONE:
         return { 
            count: state.count + 1 
            }
      case ACTIONS.SUBTRACT_ONE:
         return { 
            count: state.count - 1
            }
      default:
         return state
   }
}

// state.count === STATE-OBJECT.PROPERTY-OF-STATE

// The 'state' in the return function represents the 'state' parameter that is passed to the counterReducer function from the useReducer initializer in step 2.

```

5. Connect it all. 


```js
import React, { useReducer } from "react";

// Step 1: Define initial state and actions
const initialCount = { count: 0 };
const ACTIONS = {
  ADD_ONE: "add_one",
  SUBTRACT_ONE: "subtract_one"
};

// Step 4: Write the reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ONE:
      return { count: state.count + 1 };
    case ACTIONS.SUBTRACT_ONE:
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function CounterApp() {
  // Step 2: Initialize the reducer
  const [counterState, dispatchMod] = useReducer(counterReducer, initialCount);

  // Step 3: Create event handlers
  function increment() {
    dispatchMod({ type: ACTIONS.ADD_ONE });
  }

  function decrement() {
    dispatchMod({ type: ACTIONS.SUBTRACT_ONE });
  }

  return (
    <div>
      <h1>Count: {counterState.count}</h1>
      <button onClick={increment}>Add One</button>
      <button onClick={decrement}>Subtract One</button>
    </div>
  );
}

export default CounterApp;

```

