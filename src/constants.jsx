export const ROUND_STATUS = {
    INIT_SHOE: 'shoe_initialized',
    ROUND_INIT: 'round_initialized',
    INIT_HANDS: 'init_hands_dealt',
    PLAYER_TURN_ACTIVE: 'player_turn_active',
    DEALER_TURN_ACTIVE: 'dealer_turn_active',
    ROUND_COMPLETE: 'round_complete'

}

export const PLAYER_ACTIONS = {
    PLAYER_HIT: 'player_hit',
    PLAYER_STAND: 'player_stand',
    PLAYER_DOUBLE_DOWN: 'player_double_down',
    PLAYER_SPLIT: 'player_split',
    INIT_NEW_SHOE: 'init_new_shoe',
    INIT_NEW_ROUND: 'init_new_round'
}

export const BET_CIRCLE_ACTIONS = {
    ADD_BET: 'add_bet',
    CLEAR_BET_CIRCLE: 'clear_bet_circle'
}


export const initialGameState = {
    roundStatus: "not_started",
    roundResult: "in_progress",
    roundMessage: "Round has not yet started.",
    playerActionDisabled: true,
    playerBetActionDisabled: false,
    shoe: [],
    shoeQuantity: 0,
    dealerHand: [],
    dealerScore: 0,
    playerHand: [],
    playerScore: 0
}

export const BET_STATUS = {
    NOT_LOCKED: "not_locked",
    LOCKED: "locked",
    LOST: "lost",
    WON: "won",
    PUSH: "push"
}

export const initialBetState = {
    betButtonsDisabled: false,
    betCount: 0,
    betCircle: 0,
    bankRoll: 100,
    payoutAmount: 0,
    previousBet: 0
}