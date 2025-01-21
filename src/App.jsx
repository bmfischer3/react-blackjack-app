import { useReducer } from "react";
import "./App.css";
import { betReducer } from "../reducers/betReducer";
import { gameReducer } from "../reducers/gameReducer";
import { initialBetState, initialGameState, ROUND_STATUS, BET_STATUS, PLAYER_ACTIONS, BET_CIRCLE_ACTIONS
 } from "./constants";
import { modifyBet } from "./components/betModifications";
import { GetHandTotal } from "./components/Calculations";
import { initializeShoe, dealRound, drawCard, checkInitBlackjack } from "./components/roundOperations";

// Pure Functions - Rely solely on teh input arguemtns and do not depend on varaiblaes defined outside its scope. 
    // If arguments are needed, these can be passed as parameters . 


function App() {

        // Calling the useReducer function will return an array with two elements: [A, B]
        // A --> Current state of the reducer
        // B --> A function used to send actions to the reducer, triggering state updates. 
        // constant must be used to ensure their references don't change during the component lifecycle. 

        // betState === current state of the reducer, first initialized by initialBetState
        // dispatchBet === is provided by the useReducer function as part of its internal mechanism for managing state updates. 


        const [betState, dispatchBet] = useReducer(betReducer, initialBetState)
        const [gameState, dispatchGame] = useReducer(gameReducer, initialGameState)


        // Main game flow control
        function main(action) {
            console.log("Initial betState:", initialBetState)
            // The main controller for the application that calls and directs the appropriate state updates. 
            // Helper functions below breakdown complex tasks and return simplified responses. 
            // main() then updates the varying states displayed on screen. 

            // main() is initiated after starting a new shoe/round. 
            // main() is initiated whenever a gameState or roundStatus chanages. 
            if (action.playerAction) {
                switch (action.playerAction) {
                    case PLAYER_ACTIONS.PLAYER_HIT:
                        console.info("Player Hit action hit")
                        const updatedPlayerHand = [...gameState.playerHand, drawCard(gameState.shoe)]
                        console.info("Updated Player Hand: " + updatedPlayerHand)
                        const updatedPlayerScore = GetHandTotal(updatedPlayerHand)
                        if (updatedPlayerScore > 21) {
                            dispatchGame({
                                type: ROUND_STATUS.ROUND_COMPLETE,
                                payload: {
                                    playerHand: updatedPlayerHand,
                                    playerScore: updatedPlayerScore,
                                    roundStatus: "round_complete",
                                    roundResult: "dealer_win",
                                    roundMessage: "Dealer Win - Player Bust",
                                }
                            })
                            dispatchBet({
                                betStatus: BET_STATUS.LOST,
                            })
                        }

                        else {
                            dispatchGame({
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
                        dispatchGame({
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
                            dispatchGame({
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

                            // Update the gameReducer
                            dispatchGame({
                                type: ROUND_STATUS.ROUND_COMPLETE,
                                payload: {
                                    roundMessage: "Player Win - Dealer bust",
                                    roundStatus: ROUND_STATUS.ROUND_COMPLETE,
                                    roundResult: "player_win"
                                }
                            })
                            // Payout the winner
                            const payoutAmount = betState.betCircle * 2;
                            console.info("payoutAmount is: " + payoutAmount);
                            dispatchBet({
                                betStatus: BET_STATUS.WON,
                                payload: {
                                    payoutAmount: payoutAmount
                                }
                            })
                        }
                        else if (updatedDealerScore > gameState.playerScore) {
                            dispatchGame({
                                type: ROUND_STATUS.ROUND_COMPLETE,
                                payload: {
                                    roundMessage: "Dealer Win - Dealer has more than player.",
                                    roundStatus: ROUND_STATUS.ROUND_COMPLETE,
                                    roundResult: "dealer_win"
                                }
                            })

                            dispatchBet({
                                betStatus: BET_STATUS.LOST
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
                            const bankRollReturnAmount = betState.betCircle
                            dispatchBet({
                                betStatus: BET_STATUS.PUSH,
                                payload: {
                                    bankRoll: betState.bankRoll + bankRollReturnAmount
                                }
                            })
                        }
                        else if (updatedDealerScore < gameState.playerScore) {
                            const payoutAmount = betState.betCircle * 2;
                            console.info("payoutAmount is: " + payoutAmount);

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
                            dispatchBet({
                                betStatus: BET_STATUS.WON,
                                payload: {
                                    payoutAmount: payoutAmount
                                }
                            })
                        }

                }
            }

            // Shoe is initiated
            else if (action.roundStatus) {
                switch (action.roundStatus) {
                    case ROUND_STATUS.INIT_SHOE:
                        // User presses --> "Start New Shoe"
                        const initShoe = initializeShoe();
                        console.info("initShoe is: " + initShoe)
                        dispatchGame(
                            {
                                type: ROUND_STATUS.INIT_SHOE,
                                payload: {
                                    shoe: initShoe,
                                    shoeQuantity: initShoe.length,
                                    playerHand: [],
                                    dealerHand: []
                                }
                            }
                        )

                        dispatchBet({
                            betStatus: BET_STATUS.NOT_LOCKED
                        })
                        break;

                    // Round is initiated
                    case ROUND_STATUS.INIT_HANDS:

                        // Check that there are enough cards in the shoe, else start a new shoe. 
                        if (gameState.shoeQuantity < 60) {
                            let initShoe = initializeShoe();
                            dispatchGame({
                                type: ROUND_STATUS.INIT_SHOE,
                                payload: {
                                    shoe: initShoe
                                }
                            })

                            dispatchBet({
                                betStatus: BET_STATUS.NOT_LOCKED
                            })
                        }

                        // If enough cards exist, deal the round.

                        else {
                            let [dealerInitHand, playerInitHand] = dealRound(gameState.shoe);
                            console.info("dealerInitHand: " + dealerInitHand)
                            console.info("playerInitHand: " + playerInitHand)
                            console.info("Round Message: " + gameState.roundMessage)
                            
                            dispatchGame(
                                {
                                    type: ROUND_STATUS.INIT_HANDS,
                                    payload: {
                                        playerHand: playerInitHand,
                                        dealerHand: dealerInitHand
                                    }
                                }
                            )

                            // Lock-in the bet and disable bet adjustments. 
                            dispatchBet(
                                {
                                    betStatus: BET_STATUS.LOCKED
                                }
                            )



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
                                    const bankRollReturnAmount = betState.betCircle
                                    dispatchBet({
                                        betStatus: BET_STATUS.PUSH,
                                        payload: {
                                            bankRoll: betState.bankRoll + bankRollReturnAmount
                                        }
                                    })
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
                                    const payoutAmount = betState.betCircle + (betState.betCircle * 1.5);
                                    console.info("payoutAmount is: " + payoutAmount);

                                    dispatchBet({
                                        betStatus: BET_STATUS.WON,
                                        payload: {
                                            payoutAmount: payoutAmount
                                        }
                                    })
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


                                dispatchBet({
                                    betStatus: BET_STATUS.LOST
                                })
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
                                dispatchBet({
                                    betStatus: BET_STATUS.LOCKED
                                })
                                break;
                            }
                        }
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

    return (
        <>
            <div>
                <button onClick={() => main({ roundStatus: ROUND_STATUS.INIT_SHOE })}>Start New Shoe</button>
                <button onClick={() => main({ roundStatus: ROUND_STATUS.INIT_HANDS })}>Deal Next Round</button>
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
                <button onClick={() => main({ playerAction: PLAYER_ACTIONS.PLAYER_HIT })} disabled={gameState.playerActionDisabled}>Hit</button>
                <button onClick={() => main({ playerAction: PLAYER_ACTIONS.PLAYER_STAND })} disabled={gameState.playerActionDisabled}>Stand</button>
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


                Bet Circle: {betState.betCircle}

            </div>
            <br />
            <div>
                <button>Repeat Bet & Deal Next Round</button>
            </div>
            <br></br>
            <div>
                {/* Call a function reference, rather than invoking it immediately. 
                Referencing it only calls the function with the event, button click, occurs. 
                Otherwise the function wil be called every time a render is done.   */}
                <button onClick={() => modifyBet(1, betState, dispatchBet)} disabled={betState.betButtonsDisabled}>Add 1</button>
                <button onClick={() => modifyBet(5, betState, dispatchBet)} disabled={betState.betButtonsDisabled}>Add 5</button>
                <button onClick={() => modifyBet(25, betState, dispatchBet)} disabled={betState.betButtonsDisabled}>Add 25</button>
                <button onClick={() => modifyBet(100, betState, dispatchBet)} disabled={betState.betButtonsDisabled}>Add 100</button>
                <button onClick={() => modifyBet('c', betState, dispatchBet)} disabled={betState.betButtonsDisabled}>Clear</button>
            </div>
            <br></br>
            <div>
                Player Bank Roll: {betState.bankRoll}
            </div>
            <div>
                <br />
                Dev Area
                <br />
                <br />
                <div>
                    <table>
                        <tr>
                            <th>Category</th>
                            <th>Message</th>
                        </tr>
                        <tr>
                            <td>roundStatus:</td>
                            <td>{gameState.roundStatus}</td>
                        </tr>
                        <tr>
                            <td>roundResult:</td>
                            <td>{gameState.roundResult}</td>
                        </tr>
                        <tr>
                            <td>dealerScore:</td>
                            <td>{gameState.dealerScore}</td>
                        </tr>
                        <tr>
                            <td>playerScore:</td>
                            <td>{gameState.playerScore}</td>
                        </tr>

                        <tr>
                            <td>roundMessage:</td>
                            <td>{gameState.roundMessage}</td>
                        </tr>
                        <tr>
                            <td>payoutAmount:</td>
                            <td>{betState.payoutAmount}</td>
                        </tr>
                        <tr>
                            <td>betButtonsDisabled:</td>
                            <td>{betState.betButtonsDisabled}</td>
                        </tr>
                        <tr>
                            <td>bankRoll:</td>
                            <td>{betState.bankRoll}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </>
    );
}

export default App;
