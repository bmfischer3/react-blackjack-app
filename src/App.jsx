import { useState, useRef, useEffect, useReducer } from "react";
import "./App.css";
import { PlayerActions } from "./components/Player";
import { Calculations } from "./components/Calculations";


// TODO: Make some differentiation between ROUND_STATUS and round_status. 

/**
 * Each 
 * @date January 19th 2025, 8:25:58 pm
 * @author Brian Fischer
 *
 */
const ROUND_STATUS = {
    INIT_SHOE: 'shoe_initialized',
    ROUND_INIT: 'round_initialized',
    INIT_HANDS: 'init_hands_dealt',
    PLAYER_TURN_ACTIVE: 'player_turn_active',
    DEALER_TURN_ACTIVE: 'dealer_turn_active',
    ROUND_COMPLETE: 'round_complete'

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
    roundResult: "in_progress",
    roundMessage: "Round has not yet started.",
    playerActionDisabled: false,
    playerBetActionDisabled: false,
    shoe: [],
    shoeQuantity: 0,
    dealerHand: [],
    dealerScore: 0,
    playerHand: [],
    playerScore: 0,

}

const initialBetState = {
    betCount: 0,
    betCircle: 0,
    bankRoll: 0,
}


// The betReducer function is eqiupped to manage multiple cases
// This function is called by the default useReducer 

function betReducer(state, action) {
    switch (action.type) {

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE:
            return {
                ...state,
                betCircle: state.betCircle + 1
            };

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_FIVE:
            return {
                ...state,
                betCircle: state.betCircle + 5
            };

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_TWENTY_FIVE:
            return {
                ...state,
                betCircle: state.betCircle + 25
            };

        case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE_HUNDRED:
            return {
                ...state,
                betCircle: state.betCircle+ 100
            };

        case BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE:
            return {
                ...state,
                betCircle: 0
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
        case ROUND_STATUS.INIT_SHOE:
            return {
                ...state,
                roundStatus: "shoe_initialized",
                roundResult: "starting_round",
                roundMessage: "Shoe has been initialzied, dealing cards next...",
                shoe: action.payload.shoe,
                shoeQuantity: action.payload.shoe.length,
                playerActionDisabled: false,
            }
        case ROUND_STATUS.INIT_HANDS:
            return {
                ...state,
                roundStatus: "next_hands_dealt",
                playerActionDisabled: false
            }

        case ROUND_STATUS.PLAYER_TURN_ACTIVE:
            return {
                ...state,
                // optional chaining used to prevent having to provide payloads for every update.
                roundStatus: action.payload?.roundStatus || state.roundStatus,
                roundMessage: action.payload?.roundMessage || state.roundMessage,
                playerHand: action.payload?.playerHand || state.playerHand,
                playerScore: action.payload?.playerScore || state.playerScore,
                dealerHand: action.payload?.dealerHand || state.dealerHand,
                dealerScore: action.payload?.dealerScore || state.dealerScore,
                playerActionDisabled: false
            }
        case ROUND_STATUS.DEALER_TURN_ACTIVE:
            return {
                ...state,
                roundStatus: "dealer_turn",
                roundResult: "in_progress",
                roundMessage: action.payload.roundMessage,
                playerActionDisabled: true,
                dealerHand: action.payload?.dealerHand || state.dealerHand,
                dealerScore: action.payload?.dealerScore || state.dealerScore
            }
        case ROUND_STATUS.ROUND_COMPLETE:
            return {
                ...state,
                roundStatus: action.payload.roundStatus,
                roundResult: action.payload.roundResult,
                roundMessage: action.payload.roundMessage,
                playerHand: action.payload?.playerHand || state.playerHand,
                playerScore: action.payload?.playerScore || state.playerScore,
                dealerHand: action.payload?.dealerHand || state.dealerHand,
                dealerScore: action.payload?.dealerScore || state.dealerScore,
                playerActionDisabled: true
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
    function main(action) {
        // The main controller for the application that calls and directs the appropriate state updates. 
        // Helper functions below breakdown complex tasks and return simplified responses. 
        // main() then updates the varying states displayed on screen. 

        // main() is initiated after starting a new shoe/round. 
        // main() is initiated whenever a gameState or roundStatus chanages. 
        if (action.playerAction) {
            switch (action.playerAction) {
                case PLAYER_ACTIONS.PLAYER_HIT: 
                    console.info("Player Hit action hit")
                    const updatedPlayerHand = [...gameState.playerHand, drawCard()]
                    console.info("Updated Player Hand: " + updatedPlayerHand)
                    const updatedPlayerScore = GetHandTotal(updatedPlayerHand) 
                    if (updatedPlayerScore > 21) {
                        dispatchGame( {
                            type: ROUND_STATUS.ROUND_COMPLETE,
                            payload: {
                                playerHand: updatedPlayerHand,
                                playerScore: updatedPlayerScore,
                                roundStatus: "round_complete",
                                roundResult: "dealer_win",
                                roundMessage: "Dealer Win - Player Bust",
                            }
                        })
                    }

                    else {
                        dispatchGame( {
                            type: ROUND_STATUS.PLAYER_TURN_ACTIVE,
                            payload: {
                                roundStatus: "player_turn",
                                roundMessage: "Player Turn",
                                playerHand: updatedPlayerHand,
                                playerScore: updatedPlayerScore,
                            }
                        })
                    }
                    break;
                case PLAYER_ACTIONS.PLAYER_STAND:
                    dispatchGame( {
                        type: ROUND_STATUS.DEALER_TURN_ACTIVE,
                        payload: {
                            roundMessage: "Dealer Turn in progress..."
                        }
                    })

                    let updatedDealerHand = [...gameState.dealerHand];
                    let updatedDealerScore = GetHandTotal(updatedDealerHand)

                    while (updatedDealerScore < 17) {
                        updatedDealerHand.push(drawCard());
                        updatedDealerScore = GetHandTotal(updatedDealerHand);
                        console.info("Updated Dealer Score: " + updatedDealerScore)
                        setTimeout(() => playDealerTurn(updatedHand), 1000); // Add delay for UI feedback
                        dispatchGame( {
                            type: ROUND_STATUS.DEALER_TURN_ACTIVE,
                            payload: {
                                roundMessage: "Dealer turn in progress",
                                roundResult: "in_progress",
                                roundStatus: ROUND_STATUS.DEALER_TURN_ACTIVE,
                                dealerHand: updatedDealerHand,
                                dealerScore: updatedDealerScore
                            }
                        })
                    }

                    if (updatedDealerScore > 21) {
                        dispatchGame( {
                            type: ROUND_STATUS.ROUND_COMPLETE,
                            payload: {
                                roundMessage: "Player Win - Dealer bust",
                                roundStatus: ROUND_STATUS.ROUND_COMPLETE,
                                roundResult: "player_win"
                            }
                        })
                    }
                    else if (updatedDealerScore > gameState.playerScore) {
                        dispatchGame( {
                            type: ROUND_STATUS.ROUND_COMPLETE,
                            payload: {
                                roundMessage: "Dealer Win - Dealer has more than player.",
                                roundStatus: ROUND_STATUS.ROUND_COMPLETE,
                                roundResult: "dealer_win"
                            }
                        })
                    }
                    else if (updatedDealerScore === gameState.playerScore) {
                        dispatchGame(
                            {
                                type: ROUND_STATUS.ROUND_COMPLETE,
                                payload: {
                                    roundStatus: "round_complete",
                                    roundResult: "push",
                                    roundMessage: "Push: Dealer and Player are tied."
                                }
                            }
                        )
                    }
                    else if (updatedDealerScore < gameState.playerScore) {
                        dispatchGame(
                            {
                                type: ROUND_STATUS.ROUND_COMPLETE,
                                payload: {
                                    roundStatus: "round_complete",
                                    roundResult: "player_win",
                                    roundMessage: "Player Win: Player has more than dealer."
                                }
                            }
                        )
                    }

                }
        }
        else if (action.roundStatus) {
            switch (action.roundStatus) {
                case ROUND_STATUS.INIT_SHOE:
                    // User presses --> "Start New Shoe"
                    const initShoe = initializeShoe();
                    console.info("initShoe is: " + initShoe)
                    dispatchGame({
                        type: ROUND_STATUS.INIT_SHOE,
                        payload: {
                            shoe: initShoe,
                            shoeQuantity: initShoe.length,
                            playerHand: [],
                            dealerHand: []
                        }
                    })
                    break;
                case ROUND_STATUS.INIT_HANDS:
                    // Users clicks --> "Deal round" 
                    if (gameState.shoeQuantity < 60) {
                        let initShoe = initializeShoe();
                        dispatchGame({
                            type: ROUND_STATUS.INIT_SHOE,
                            payload: {
                                shoe: initShoe
                            }
                        })
                        break;
                    }

                    else {
                        let [dealerInitHand, playerInitHand] = dealRound();
                        console.info("dealerInitHand: " + dealerInitHand)
                        console.info("playerInitHand: " + playerInitHand)
                        console.info("Round Message: " + gameState.roundMessage)

                        // Check for blackjack in dealer and player hand. 
                        // LATER TODO: Check if the up card is an ace to offer insurance. 

                        if (checkInitBlackjack(playerInitHand) === true) {
                            if (checkInitBlackjack(dealerInitHand) === true) {
                                dispatchGame(
                                    {
                                        type: ROUND_STATUS.ROUND_COMPLETE,
                                        payload: {
                                            roundStatus: "round_complete",
                                            roundResult: "push",
                                            roundMessage: "Push: Player and dealer both have blackjack.",
                                            playerHand: playerInitHand,
                                            dealerHand: dealerInitHand
                                        }
                                    }
                                )
                            }
                            else {
                                dispatchGame(
                                    {
                                        type: ROUND_STATUS.ROUND_COMPLETE,
                                        payload: {
                                            roundStatus: "round_complete",
                                            roundResult: "player_win",
                                            roundMessage: "Player Win: Player has blackjack, dealer does not.",
                                            playerHand: playerInitHand,
                                            dealerHand: dealerInitHand
                                        }
                                    }
                                )
                            }
                            break;
                        }
                        else if (checkInitBlackjack(dealerInitHand) === true) {
                            dispatchGame(
                                {
                                    type: ROUND_STATUS.ROUND_COMPLETE,
                                    payload: {
                                        roundStatus: "round_complete",
                                        roundResult: "dealer_win",
                                        roundMessage: "Dealer Win: Dealer has blackjack, player does not.",
                                        playerHand: playerInitHand,
                                        dealerHand: dealerInitHand
                                    }
                                }
                            )
                            break;
                        }
                        else {
                            dispatchGame(
                                {
                                    type: ROUND_STATUS.PLAYER_TURN_ACTIVE,
                                    payload: {
                                        playerHand: playerInitHand,
                                        dealerHand: dealerInitHand,
                                        playerScore: GetHandTotal(playerInitHand),
                                        dealerScore: GetHandTotal(dealerInitHand),
                                        roundStatus: "in_progress",
                                        roundResult: "not_determined",
                                        roundMessage: "No Init BJs, player turn."
                                    }
                                }
                            )
                        break;
                        }
                    }
                    break;


                    break;
                case ROUND_STATUS.DEALER_TURN_ACTIVE:
                    //
                    break;
                case ROUND_STATUS.ROUND_COMPLETE:
                    // 
                    break;

            }
        }

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


    function payoutBlackjackWin() {
        return false
    }

    function payoutStandardWin() {
        return false
    }

    // Payouts


    // Return a new shoe
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
        console.log("Shoe initialized:", initShoe);

        return initShoe;
    }



    /**
     * Deals initial round of cards for dealer and player. 
     * @date January 19th 2025, 9:27:28 pm
     * @author Brian Fischer
     *
     * @returns {[]} - Retuns an array of arrays of player/dealer cards [[d1, d2,], [p1, p2]] 
     */
    function dealRound() {
        console.info("DealRound hit")
        let dealerInitHand = [drawCard(),drawCard()]
        let playerInitHand = [drawCard(),drawCard()]
        return [dealerInitHand, playerInitHand]
    }

    /**
     * Draws a card from the shoe and returns the drawnCard
     * @date January 19th 2025, 7:38:00 pm
     * @author Brian Fischer
     *
     * @returns {*} 
     */
    function drawCard() {
        const drawnCard = gameState.shoe.shift();
        return drawnCard;
    }




    // Hand-specific functions
    // Helper: Determine if the hand has busted or not. 
    // function handBust(hand_array) {
    //     // evalutes to t/f
    //     // t === hand total > 21
    //     // f === hand total <= 21

    //     if (GetHandTotal(hand_array) > 21) {
    //         return true
    //     }
    //     else {
    //         return false
    //     }

    // }

    // Helper: Determine if the dealer is supposed to stand. 
    // function dealerStand(hand_array) {
    //     // evals to t/f --> "Should the dealer stand?"
    //     // t === dealer is equal to or greater than  17. 
    //     // f === dealer is less than 17. 

    //     // Note: Being over 21 is irrelevant here, only looking to determine if the dealer is supposed to stand. 

    //     // TODO: Account for hard/soft 17, make it a switch that can be turned on and off. 

    //     if (GetHandTotal(hand_array) < 17) {
    //         return false
    //     } else {
    //         return true
    //     }
    // }

    /**
     * Helper: Determine if dealer or player was a dealt a blackjack on the round's initial two cards
     * @param {array} hand_array - 2 item array representing player or dealer hand. 
     * @returns {boolean} - returns true if hand_array === 21, else false 
     */
    function checkInitBlackjack(hand_array) {
        if (GetHandTotal(hand_array) === 21) {
            return true
        }
        else {
            return false
        }
    }

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





    // OnClick function call must be passed as a reference; () => modifyBet(1)
    // This ensures 




    return (
        <>
            <div>
                <button onClick={() => main( {roundStatus: ROUND_STATUS.INIT_SHOE})}>Start New Shoe</button>
                <button onClick={() => main( {roundStatus: ROUND_STATUS.INIT_HANDS})}>Deal Next Round</button>
            </div>
            <div>
                Dealer Up Card: {gameState.dealerHand[0]}
                <br />
                Dealer Hand: {gameState.dealerHand.join(", ")}
                <br />
            </div>
            <div>
                Player Hand: {gameState.playerHand.join(", ")}
                <br />
                Player Total: {gameState.playerScore}
            </div>
            <div>
                <button onClick={() => main( {playerAction: PLAYER_ACTIONS.PLAYER_HIT} )} disabled={gameState.playerActionDisabled}>Hit</button>
                <button onClick={() => main( {playerAction: PLAYER_ACTIONS.PLAYER_STAND} )} disabled={gameState.playerActionDisabled}>Stand</button>
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


                Bet Circle: {betState.betCircle}

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