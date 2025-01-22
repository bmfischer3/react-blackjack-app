import { useReducer } from "react";
import "./App.css";
import { betReducer } from "../reducers/betReducer";
import { gameReducer } from "../reducers/gameReducer";
import {
    initialBetState, initialGameState, ROUND_STATUS, BET_STATUS, PLAYER_ACTIONS, BET_CIRCLE_ACTIONS
} from "./constants";
import { modifyBet } from "./components/betModifications";
import { initNewShoe } from "./components/initNewShoe";
import { initNewRound } from "./components/initNewRound";
import { playerHit } from "./components/playerHit";
import { playerStand } from "./components/playerStand";


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


return (
    <>
        <div>
            <button onClick={() => initNewShoe(dispatchGame, dispatchBet)}>Start New Shoe</button>
            <button onClick={() => initNewRound(dispatchGame, dispatchBet, gameState, betState)}>Deal Next Round</button>
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
            <button onClick={() => playerHit(dispatchGame, dispatchBet, gameState, betState)} disabled={gameState.playerActionDisabled}>Hit</button>
            <button onClick={() => playerStand(dispatchGame, dispatchBet, gameState, betState)} disabled={gameState.playerActionDisabled}>Stand</button>
        </div>
        <br />
        <div>
            Shoe Size: {gameState.shoeQuantity}

        </div>

        <br />
        <div>

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
