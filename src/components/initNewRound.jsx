import { BET_STATUS } from "../constants";
import { ROUND_STATUS } from "../constants";
import { checkForBlackjacks } from "./checkForBlackjack";
import { drawCard } from "./drawCard";
import { initializeShoe } from "./initShoe";

// export function initNewRound(dispatchGame, dispatchBet, gameState, betState) 


// Helper function to deal the round.
export function initNewRound(dispatchGame, dispatchBet, gameState) {
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
        let dealerInitHand = [drawCard(gameState.shoe), drawCard(gameState.shoe)];
        let playerInitHand = [drawCard(gameState.shoe), drawCard(gameState.shoe)];
        console.info("dealerInitHand: " + dealerInitHand)
        console.info("playerInitHand: " + playerInitHand)
        console.info("Round Message: " + gameState.roundMessage)

        dispatchGame({
            type: ROUND_STATUS.INIT_HANDS,
            payload: {
                dealerHand: dealerInitHand,
                playerHand: playerInitHand
            }
        })
        checkForBlackjacks(dispatchGame, dispatchBet, dealerInitHand, playerInitHand)

}
}


