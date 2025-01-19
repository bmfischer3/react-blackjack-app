import { useState, useRef, useEffect, useReducer } from "react";
import "./App.css";
import { PlayerActions } from "./components/Player";
import { Calculations } from "./components/Calculations";


const GAME_STATUS = {
    START_SHOE: 'start_shoe',
    START_ROUND: 'start_round',
    DEAL_INIT_HAND: 'deal_init_hand',
    PLAYER_TURN_ACTIVE: 'player_turn_active',
    DEALER_TURN_ACTIVE: 'dealer_turn_active',
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
    roundMessage: "Round has not yet started.",
    playerActionDisabled: false,
    playerBetActionDisabled: false,
    shoe: [],
    shoeQuantity: 0,
    dealerHand: [],
    dealerScore: 0,
    playerHand: [],
    playerScore: 0,
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

    // Within each case of this reducer, each game status has varying displays to put on screen. 
    // Each game status is simply the state update to be displayed. 
    // This manages the state, subsequent functions dictate what is fed through to each of those states. 
    // This makes each case of the reducer more re-usable throughout the code. 

    switch (action.type) {
        case GAME_STATUS.START_SHOE:
            return {
                ...state,
                roundStatus: "shoe_initialized",
                roundResult: "starting_round",
                roundMessage: "Shoe has been initialzied, dealing cards next...",
                shoe: action.payload.shoe,
                shoeQuantity: action.payload.shoe.length
            }
        case GAME_STATUS.START_ROUND:
            return {
                ...state,
                roundStatus: "init_hands_dealt",
                roundResult: "in_progress",
                roundMessage: "Initial hands dealt",
                dealerHand: action.payload.dealerHand,
                dealerScore: action.payload.dealerScore,
                playerHand: action.payload.playerHand,
                playerScore: action.payload.playerScore
            }
        case GAME_STATUS.DEAL_INIT_HAND:
            return {
                ...state,

            }
        case GAME_STATUS.PLAYER_TURN_ACTIVE:
            return {
                ...state,
                roundStatus: "player_turn",
                roundMessage: "No blackjacks, player turn",
                playerHand: action.payload.playerHand,
                playerScore: action.payload.playerScore
            }
        case GAME_STATUS.DEALER_TURN_ACTIVE:
            return {
                ...state,
                roundStatus: "dealer_turn",
                // roundResult: action.payload.roundResult,
                // roundMessage: action.payload.roundMessage
            }
        case GAME_STATUS.COMPLETE_ROUND:
            return {
                ...state,
                // roundStatus: action.payload.roundStatus,
                // roundResult: action.payload.roundResult,
                // roundMessage: action.payload.roundMessage
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


// Main game flow control
    function main() {
        // The main controller for the application that calls and directs the appropriate state updates. 
        // Helper functions below breakdown complex tasks and return simplified responses. 
        // main() then updates the varying states displayed on screen. 

        

    }

// Betting

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

// Payouts


// Starting a new shoe
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


// Dealing a round
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


            // TODO: Add in if statements to check for blackjack. 


            dispatchGame({
                type: GAME_STATUS.START_ROUND,
                payload: {
                    dealerHand: dealerHand,
                    dealerScore: GetHandTotal(dealerHand),
                    playerHand: playerHand,
                    playerScore: GetHandTotal(playerHand)
                }
            })
        }
    }

    function drawCard() {
        const drawnCard = gameState.shoe.shift();
        console.log(gameState.shoe);
        // dispatchGame( {
        //     payload: {
        //         shoeQuantity: gameState.shoe.length
        //     }
        // })
        return drawnCard;
    }




// Hand-specific functions
    // Helper: Determine if the hand has busted or not. 
    function handBust(hand_array) {
        // evalutes to t/f
        // t === hand total > 21
        // f === hand total <= 21

        if (GetHandTotal(hand_array) > 21) {
            return true
        } 
        else {
            return false
        }

    }

    // Helper: Determine if the dealer is supposed to stand. 
    function dealerStand(hand_array) {
        // evals to t/f --> "Should the dealer stand?"
        // t === dealer is equal to or greater than  17. 
        // f === dealer is less than 17. 

        // Note: Being over 21 is irrelevant here, only looking to determine if the dealer is supposed to stand. 

        // TODO: Account for hard/soft 17, make it a switch that can be turned on and off. 

        if (GetHandTotal(hand_array) < 17) {
            return false
        } else {
            return true
        }
    }

    // Helper: Determine if dealer or player was a dealt a blackjack on the round's initial two cards
    function checkInitBlackjack(hand_array) {
        // Checks for blackjack on the dealing of the initial hand. 
        // Return t/f based on initial hand. 

        if (gameState === GAME_STATUS.DEAL_INIT_HAND) {
            if (GetHandTotal(hand_array) === 21) {
                return true
            }
            else return false
        }
        else {
            console.log("checkInitBlackjack called when gameState != DEAL_INIT_HAND")
        }
    }

        // function evalRound();
        //     if (gameState === GAME_STATUS.DEAL_INIT_HAND) {
        //         // Check dealer hand first
        //         if (GetHandTotal(dealerHand) === 21) {
        //             if (GetHandTotal(playerHand) === 21) {
        //                 // Both dealer and player have 21. 
        //                 dispatchGame({
        //                     // 'type' dictates which state case the reducer will update.
        //                     type: GAME_STATUS.COMPLETE_ROUND,
        //                     payload: {
        //                         // keys here must match the keys outlined in the payload reference. 
        //                         roundStatus: "round_complete",
        //                         roundResult: "push",
        //                         roundMessage: "Push: Player and Dealer both have Blackjack."
        //                     }
        //                 })
        //                 return roundResult;
        //             } else {
        //                 // Dealer has 21, player does not. 
        //                 dispatchGame({
        //                     type: GAME_STATUS.COMPLETE_ROUND,
        //                     payload: {
        //                         roundStatus: "round_complete",
        //                         roundResult: "dealer_win",
        //                         roundMessage: "Dealer Win: Dealer has blackjack."
        //                     }
        //                 })
        //                 return roundResult;
        //             }
        //         }
        //         else if (GetHandTotal(playerHand) === 21) {
        //             // Player has 21, dealer does not. 
        //             dispatchGame({
        //                 type: GAME_STATUS.COMPLETE_ROUND,
        //                 payload: {
        //                     roundStatus: "round_complete",
        //                     roundResult: "player_win",
        //                     roundMessage: "Player Win: Player has blackjack."
        //                 }
        //             })

        //         }
        //         else {
        //             // Neither player nor dealer has 21. 
        //             dispatchGame({
        //                 type: GAME_STATUS.PLAYER_TURN_ACTIVE
        //             })
        //         }
        //     }
        //     else {
        //         console.error("Blackjack not evaluated, gameState is not equal to a valid status.")
        //     }
        //     else if (gameState === GAME_STATUS.PLAYER_TURN_ACTIVE) {
        //             if (GetHandTotal(playerHand) === 21) {
        //                 // Player reaches 21. End turn.
        //                 dispatchGame({
        //                     type: GAME_STATUS.DEALER_TURN_ACTIVE,
        //                     payload: {
        //                         roundMessage: "Player has 21, dealer turn in progress."
        //                     }
        //                 })
        //             } else if (GetHandTotal(playerHand < 21)) {
        //                 dispatchGame({
        //                     type: GAME_STATUS.PLAYER_TURN_ACTIVE,
        //                     payload: {
        //                         roundMessage: "Player has not busted, can continue to hit or stand."
        //                     }
        //                 })
        //             }
        //         }

        //         else if (gameState === GAME_STATUS.DEALER_TURN_ACTIVE) {
        //             if (GetHandTotal(dealerHand) === 21) {
        //                 dispatchGame({
        //                     type: GAME_STATUS.DEALER_TURN_ACTIVE,
        //                     payload: {
        //                         roundMessage: "Dealer has 21."
        //                     }
        //                 })

        //                 if (GetHandTotal(playerHand) === 21) {
        //                     // Player and dealer both reach 21. 
        //                     dispatchGame({
        //                         type: GAME_STATUS.DEALER_TURN_ACTIVE,
        //                         payload: {
        //                             roundMessage: "Push: Dealer and player both have 21"
        //                         }
        //                     })
        //                 }
        //             } else {
        //                 // Only the dealer has 21. 
        //                 dispatchGame({
        //                     type: GAME_STATUS.COMPLETE_ROUND,
        //                     payload: {
        //                         roundMessage: "Dealer Win: Dealer has 21, player does not."
        //                     }
        //                 })
        //             }
        //         }
        //     }


    // Helper: Draw a single card from the shoe.
 
    // Helper: Calculate hand total dynamically
    function GetHandTotal(handArray) {
        if (!handArray.length) return 0;

        let aceCount = handArray.filter((card) => card === "A").length;
        let handTotal = handArray.reduce((total, card) => total + GetCardValue(card), 0);

        // Adjust for aces
        while (handTotal > 21 && aceCount > 0) {
            handTotal -= 10;
            aceCount -= 1;
        }
        return handTotal;
    }


    // Helper: Get card value
    function GetCardValue(card) {
        if (card === "A") return 11;
        if (["K", "Q", "J", "10"].includes(card)) return 10;
        return parseInt(card, 10);
    }




    function playerAction(action) {
        switch (action) {
            case PLAYER_ACTIONS.PLAYER_HIT:
                let updatedHand = [...gameState.playerHand, drawCard()]
                dispatchGame({
                    type: GAME_STATUS.PLAYER_TURN_ACTIVE,
                    payload: {
                        playerHand: updatedHand,
                        playerScore: updatedPlayerScore
                    }
                })
            case PLAYER_ACTIONS.PLAYER_STAND:
                dispatchGame({
                    type: GAME_STATUS.DEALER_TURN_ACTIVE,
                })
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
            <br />
            Player Total: {gameState.playerScore}
        </div>
        <div>
            <button onClick={() => playerAction(PLAYER_ACTIONS.PLAYER_HIT)}>Hit</button>
            <button onClick={() => playerAction(PLAYER_ACTIONS.PLAYER_STAND)}>Stand</button>
            <button>Double Down</button>
        </div>
        <br />
        <div>
            {/* Shoe Size: {gameState.shoeQuantity} */}

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
        <div>
            <br />
            Dev Area
            <br />
            <br />
            roundStatus: {gameState.roundStatus}
            <br />
            roundResult: {gameState.roundResult}
            <br />
            roundMessage: {gameState.roundMessage}
        </div>
    </>
);
}

export default App;