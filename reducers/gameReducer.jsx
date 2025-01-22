import { initialGameState, ROUND_STATUS } from "../src/constants"


export function gameReducer(state, action) {

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
                    dealerHand: [],
                    playerHand: [],
                    playerScore: 0,
                    dealerScore: 0
                }
            case ROUND_STATUS.INIT_HANDS:
                return {
                    ...state,
                    roundStatus: "next_hands_dealt",
                    dealerHand: action.payload?.dealerHand || state.dealerHand,
                    playerHand: action.payload?.playerHand || state.playerHand,
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
                    roundMessage: action.payload?.roundMessage || state.roundMessage,
                    playerActionDisabled: true,
                    dealerHand: action.payload?.dealerHand || state.dealerHand,
                    dealerScore: action.payload?.dealerScore || state.dealerScore
                }
            case ROUND_STATUS.ROUND_COMPLETE:
                return {
                    ...state,
                    roundStatus: action.payload?.roundStatus || state.roundStatus,
                    roundResult: action.payload?.roundResult || state.roundResult,
                    roundMessage: action.payload?.roundMessage || state.roundMessage,
                    playerHand: action.payload?.playerHand || state.playerHand,
                    playerScore: action.payload?.playerScore || state.playerScore,
                    dealerHand: action.payload?.dealerHand || state.dealerHand,
                    dealerScore: action.payload?.dealerScore || state.dealerScore,
                    playerActionDisabled: true,
                }
            default:
                return state
        }
    }
