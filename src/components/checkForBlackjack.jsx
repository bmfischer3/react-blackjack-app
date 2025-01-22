import { BET_STATUS } from "../constants"
import { ROUND_STATUS } from "../constants"
import { GetHandTotal } from "./Calculations"


export function checkForBlackjacks (dispatchGame, dispatchBet, playerHand, dealerHand) {
    if (checkInitBlackjack(playerHand) === true) {
        if (checkInitBlackjack(dealerHand) === true) {
            dispatchGame(
                {
                    type: ROUND_STATUS.ROUND_COMPLETE,
                    payload: {
                        roundStatus: "round_complete",
                        roundResult: "push",
                        roundMessage: "Push: Player and dealer both have blackjack.",
                        playerHand: playerHand,
                        dealerHand: dealerHand
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
                        playerHand: playerHand,
                        dealerHand: dealerHand
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
    }
    else if (checkInitBlackjack(dealerHand) === true) {
        dispatchGame(
            {
                type: ROUND_STATUS.ROUND_COMPLETE,
                payload: {
                    roundStatus: "round_complete",
                    roundResult: "dealer_win",
                    roundMessage: "Dealer Win: Dealer has blackjack, player does not.",
                    playerHand: playerHand,
                    dealerHand: dealerHand
                }
            }
        )
    }
    else {
        dispatchGame(
            {
                type: ROUND_STATUS.PLAYER_TURN_ACTIVE,
                payload: {
                    playerHand: playerHand,
                    dealerHand: dealerHand,
                    playerScore: GetHandTotal(playerHand),
                    dealerScore: GetHandTotal(dealerHand),
                    roundStatus: "in_progress",
                    roundResult: "not_determined",
                    roundMessage: "No Init BJs, player turn."
                }
            }
        )
        dispatchBet({
            betStatus: BET_STATUS.LOCKED
        })
    }
}

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
