import { ROUND_STATUS } from "../constants"
import { BET_STATUS } from "../constants"
import { drawCard } from "./drawCard"
import { GetHandTotal } from "./Calculations"

export function playerHit(dispatchGame, dispatchBet, gameState, betState) {
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

}
