// The betCircleReducer function is eqiupped to manage multiple cases
// This function is called by the default useReducer 

import { BET_STATUS, BET_CIRCLE_ACTIONS} from "../src/constants";

export function betReducer(state, action) {

    console.log("Current state:", state);
    console.log("Action received:", action);

    if (action.betStatus || action.payoutAction) {
        switch (action.betStatus) {
            case BET_STATUS.LOCKED:
                return {
                    ...state,
                    betButtonsDisabled: true,
                }
            case BET_STATUS.LOST:
                return {
                    ...state,
                    betButtonsDisabled: false,
                    betCircle: 0,
                    payoutAmount: 0
                }
            case BET_STATUS.WON:
                return {
                    ...state,
                    betButtonsDisabled: false,
                    betCircle: 0,
                    payoutAmount: action.payload?.payoutAmount || state.payoutAmount,
                    bankRoll: state.bankRoll + action.payload?.payoutAmount
                }
            case BET_STATUS.PUSH:
                return {
                    ...state,
                    betButtonsDisabled: false,
                    betCircle: 0,
                    bankRoll: action.payload?.bankRoll || state.bankRoll
                }
            default:
                return state
        }
    }

    else if (action.betCircleAction) {
        console.log("BetCircleAction if statement hit")
        switch (action.betCircleAction) {
            case BET_CIRCLE_ACTIONS.ADD_BET:
                console.log("Add bet hit.")
                return {
                    ...state,
                    betCircle: action.payload?.betCircle || state.betCircle,
                    betCount: action.payload?.betCount || state.betCount,
                    bankRoll: action.payload.bankRoll,
                    payoutAmount: action.payload?.payoutAmount || state.payoutAmount
                };
            case BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE:
                return {
                    ...state,
                    betCircle: 0,
                    bankRoll: action.payload?.bankRoll || state.bankRoll
                };
            default:
                return state

        }
    }
}
