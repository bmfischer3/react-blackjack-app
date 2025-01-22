import { ROUND_STATUS } from "../constants";
import { BET_STATUS } from "../constants";
import { GetHandTotal } from "./Calculations";
import { drawCard } from "./drawCard";

export function playerStand(dispatchGame, dispatchBet, gameState, betState) {
    dispatchGame({
        type: ROUND_STATUS.DEALER_TURN_ACTIVE,
        payload: {
            roundMessage: "Dealer Turn in progress..."
        }
    })

    let updatedDealerHand = [...gameState.dealerHand];
    let updatedDealerScore = GetHandTotal(updatedDealerHand)

    while (updatedDealerScore < 17) {
        updatedDealerHand.push(drawCard(gameState.shoe));
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
