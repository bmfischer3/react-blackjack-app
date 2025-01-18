import { useState, useRef, useEffect, useReducer } from "react";
import "./App.css";
import { PlayerActions } from "./components/Player";
import { Calculations } from "./components/Calculations";


const GAME_STATUS = {
    START_SHOE: 'start_shoe',
    START_ROUND: 'start_round',
    DEAL_INIT_HAND: 'deal_init_hand',
    START_PLAYER_TURN: 'start_player_turn',
    START_DEALER_TURN: 'start_dealer_turn',
    COMPLETE_ROUND: 'complete_round',

}

const PLAYER_ACTIONS = {
    PLAYER_HIT: 'player_hit',
    PLAYER_STAND: 'player_stand',
    PLAYER_DOUBLE_DOWN: 'player_double_down',
    PLAYER_SPLIT: 'player_split'
}

const PLAYER_PAYOUT_ACTIONS = {
    PLAYER_BLACKJACK_PAYOUT: 'player_blackjack_payout',
    PLAYER_WIN_PAYOUT: 'player_win_payout',
    PLAYER_DOUBLE_DOWN_WIN_PAYOUT: 'player_double_down_win_payout',
}

const BET_CIRCLE_ACTIONS = {
    BET_CIRCLE_PLUS_ONE: 'bet_circle_plus_one',
    BET_CIRCLE_PLUS_FIVE: 'bet_circle_plus_five',
    BET_CIRCLE_PLUS_TWENTY_FIVE: 'bet_circle_plus_twenty_five',
    BET_CIRCLE_PLUS_ONE_HUNDRED: 'bet_circle_plus_one_hundred',
    CLEAR_BET_CIRCLE: 'clear_bet_circle'
}


const initialGameState = {
    roundStatus: "not_started",
    roundresult: "in_progress",
    round_message: "Round has not yet started.",
    playerActionDisabled: false,
    playerBetActionDisabled: false,
    shoe: [],
    shoeQuantity: 0,
    dealerHand: [],
    playerHand: [],
    betCircle: 0,
    bankRoll: 0,
    betCount: 0
}

const initialBetState = {
    betCount: 0
}


// The betReducer function is eqiupped to manage multiple cases
// This function is called by the default useReducer 

function betReducer(state, action) {
    switch (action.type) {

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE:
            return {
                ...state,
                betCount: state.betCount + 1
            };

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_FIVE:
            return {
                ...state,
                betCount: state.betCount + 5
            };

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_TWENTY_FIVE:
            return {
                ...state,
                betCount: state.betCount + 25
            };

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE_HUNDRED:
            return {
                ...state,
                betCount: state.betCount + 100
            };

        case BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE:
            return {
                ...state,
                betCount: 0
            };
        default:
            return state

    }
}


function gameReducer(state, action) {
    switch (action.type) {
        case GAME_STATUS.START_SHOE:
            return {
                ...state,
                roundStatus: "shoe_initialized",
                round_result: "starting_round",
                round_message: "Shoe has been initialzied, dealing cards next...",
                shoe: action.payload.shoe,
                shoeQuantity: action.payload.shoe.length
            }
        case GAME_STATUS.START_ROUND:
            return {
                ...state,
                roundStatus: "init_hands_dealt",
                round_result: "in_progress",
                round_message: "Initial hands dealt",
                dealerHand: action.payload.dealerHand,
                playerHand: action.payload.playerHand
            }
        case GAME_STATUS.DEAL_INIT_HAND:
            return {
                ...state,

            }
        case GAME_STATUS.START_PLAYER_TURN:
            return {
                ...state,
                playerHand: [...state.playerHand, action.payload.drawn_Card]


            }
        case GAME_STATUS.START_DEALER_TURN:
            return {
                ...state,
            }
        case GAME_STATUS.COMPLETE_ROUND:
            return {
                ...state,

            }
    }
}


function App() {

    // Calling the useReducer function will return an array with two elements: [A, B]
    // A --> Current state of the reducer
    // B --> A function used to send actions ot the reducer, triggering state updates. 
    // constant must be used to ensure their references don't change during the component lifecycle. 

    // betState === current state of the reducer, first initialized by initialBetState
    // dispatchBet === is provided by the useReducer function as part of its internal mechanism for managing state updates. 


    const [betState, dispatchBet] = useReducer(betReducer, initialBetState)
    const [gameState, dispatchGame] = useReducer(gameReducer, initialGameState)


    function modifyBet(amount) {
        switch (amount) {
            case 1:
                dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE })
                break;
            case 5:
                dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_FIVE })
                break;
            case 25:
                dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_TWENTY_FIVE })
                break;
            case 100:
                dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE_HUNDRED })
                break;
            case 'c':
                dispatchBet({ type: BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE })
                break;
            default:
                break;

        }
    }

    function initializeShoe(deckQuantity = 6) {
        const singleDeck = [
            "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
            "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
            "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
            "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        ];

        let initShoe = [];
        for (let i = 0; i < deckQuantity; i++) initShoe = initShoe.concat(singleDeck);

        // Shuffle the shoe
        for (let i = initShoe.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [initShoe[i], initShoe[j]] = [initShoe[j], initShoe[i]];
        };
        dispatchGame({
            type: GAME_STATUS.START_SHOE,
            payload: {
                shoe: initShoe
            }
        })
        console.log("Shoe initialized:", initShoe);
    }

    function dealRound() {
        if (gameState.shoeQuantity < 30) {
            // start new shoe. 

            }
        // else if (gameState.betCircle === 0) {
        //     console.error("Must place bet to start round");
        //     alert("Must place bet to start round.");
        //     }

        else { 
            let dealerHand = [drawCard()]
            let playerHand = [drawCard()]
            dealerHand = [...dealerHand, drawCard()]
            playerHand = [...playerHand, drawCard()]

            dispatchGame( {
                type: GAME_STATUS.START_ROUND,
                payload: {
                    dealerHand: dealerHand,
                    playerHand: playerHand
                }
            })
      }
    }
    
    function drawCard() {
        const drawnCard = gameState.shoe.shift();
        return drawnCard;
    }

    function playerAction(action) {
        switch(action) {
            case PLAYER_ACTIONS.PLAYER_HIT:
                console.log("Successful player hit");
                let drawn_card = drawCard()
                console.log(drawn_card)
                dispatchGame( {
                    type: GAME_STATUS.START_PLAYER_TURN,
                    payload: {
                        drawn_card: drawn_card
                    }
                })
            case PLAYER_ACTIONS.PLAYER_STAND:
                    
        }
    }

    // OnClick function call must be passed as a reference; () => modifyBet(1)
    // This ensures 




    return (
        <>
            <div>
                <button onClick={() => initializeShoe()}>Start New Shoe</button>
                <button onClick={() => dealRound()}>Deal Next Round</button>
            </div>
            <div>
                Dealer Up Card: {gameState.dealerHand[0]}
                <br />
                {/* Dealer Hand: {gameState.dealerHand.join(", ")} */}
                <br />
            </div>
            <div>
                Player Hand: {gameState.playerHand.join(", ")}
            </div>
            <div>
                <button onClick={() => playerAction(PLAYER_ACTIONS.PLAYER_HIT)}>Hit</button>
                <button>Stand</button>
                <button>Double Down</button>
            </div>
            <br />
            <div>
                Shoe Size: {gameState.shoeQuantity}

            </div>

            <br />
            <div>


                {/* Curly braces because it's a javascript expression. 
                Secondly, betState is the current state object managed by the reducer hook. 
                betCount is the property of that state. 
                Thus, {state.property} is a dynamicaly rendered value.  */}

                {/* betState is the object holding the current state of the reducer. 

                betCount is a key within betState that holds teh numeric value of the player's current bet.

                {betState.betCount} retrieves the value of betCount from betState and injects it into the JSX. */}


                Bet Circle: {betState.betCount}

            </div>
            <br></br>
            <div>
                {/* Call a function reference, rather than invoking it immediately. 
                Referencing it only calls the function with the event, button click, occurs. 
                Otherwise the function wil be called every time a render is done.   */}
                <button onClick={() => modifyBet(1)}>Add 1</button>
                <button onClick={() => modifyBet(5)}>Add 5</button>
                <button onClick={() => modifyBet(25)}>Add 25</button>
                <button onClick={() => modifyBet(100)}>Add 100</button>
                <button onClick={() => modifyBet('c')}>Clear</button>
            </div>
            <br></br>
            <div>
                Player Bank Roll:
            </div>
        </>
    );
}

export default App;