import { BET_STATUS } from "../constants";
import { ROUND_STATUS } from "../constants";
import { initializeShoe } from "./initShoe";

export function initNewShoe(dispatchGame, dispatchBet) {
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

}
