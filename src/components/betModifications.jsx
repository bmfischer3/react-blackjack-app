import { BET_CIRCLE_ACTIONS, initialBetState } from "../constants"


export function modifyBet(amount, betState, dispatchBet) {

    // betState --> Must pass this in so the function knows the latest state. 
    // dispatchBet --> Must pass in to dispatch actions back to the reducer. 

    // To handle adjustments to the bank roll this must be updated here prior to being passed to the state. 
    // Logic occurs here, state update occurs in the dispatch.


    // Add Button gets pressed, then what?
    // Check if the current bet_circle + amount being added is less than the bank roll
    // if true, then update the reducer with that amount subtracted from the bank roll.. 
    // if false, then alert that the bet amount would be higher than the bank roll. Don't call the reducer. 
    // Clear button gets pressed, then what?
    // If current bet_circle is 0, do nothing. 
    // if it has a value > 0, take that amount and call the betreducer to update the bank roll, then clear the betCircle.     

    console.log("Modify bet has been hit")
    console.log(initialBetState)

    if (amount != 'c') {
        if (amount < betState.bankRoll) {
            console.log("bet is valid and can pass through.")
            console.log("proposed bet is: " + (amount + betState.betCircle))
            console.log("bankRoll is: " + betState.bankRoll)
            const updatedBetCircle = betState.betCircle + amount
            const updatedBankRoll = betState.bankRoll - amount
            dispatchBet(
                {
                    betCircleAction: BET_CIRCLE_ACTIONS.ADD_BET,
                    payload: {
                        bankRoll: updatedBankRoll,
                        betCircle: updatedBetCircle
                    }
                }
            )
        }
        else if (amount === betState.bankRoll) {
            const updatedBetCircle = betState.betCircle + amount
            dispatchBet(
                {
                    betCircleAction: BET_CIRCLE_ACTIONS.ADD_BET,
                    payload: {
                        bankRoll: 0,
                        betCircle: updatedBetCircle
                    }
                }
            )
        }
        else {
            console.error("Proposed bet amount is higher than bank roll")
        }
    }
    else {
        if (betState.betCircle != 0) {
            const updatedBankRoll = betState.bankRoll + betState.betCircle
            dispatchBet(
                {
                    betCircleAction: BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE,
                    payload: {
                        bankRoll: updatedBankRoll
                    }
                }
            )
        }
    }
}
