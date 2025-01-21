import { GetHandTotal } from "./Calculations";


// Return a new shoe
export function initializeShoe(deckQuantity = 6) {
    const singleDeck = [
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
        "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
    ];

    let initShoe = [];
    for (let i = 0; i < deckQuantity; i++) initShoe = initShoe.concat(singleDeck);

    // Shuffle the shoe
    for (let i = initShoe.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initShoe[i], initShoe[j]] = [initShoe[j], initShoe[i]];
    };
    console.log("Shoe initialized:", initShoe);

    return initShoe;
}

/**
 * Deals initial round of cards for dealer and player. 
 * @date January 19th 2025, 9:27:28 pm
 * @author Brian Fischer
 *
 * @returns {[]} - Retuns an array of arrays of player/dealer cards [[d1, d2,], [p1, p2]] 
 */
export function dealRound(shoe) {
    let dealerInitHand = [drawCard(shoe), drawCard(shoe)]
    let playerInitHand = [drawCard(shoe), drawCard(shoe)]
    return [dealerInitHand, playerInitHand];
}

/**
 * Draws a card from the shoe and returns the drawnCard
 * @date January 19th 2025, 7:38:00 pm
 * @author Brian Fischer
 *
 * @returns {*} 
 */
export function drawCard(shoe) {
    const drawnCard = shoe.shift();
    return drawnCard;
}

/**
 * Helper: Determine if dealer or player was a dealt a blackjack on the round's initial two cards
 * @param {array} hand_array - 2 item array representing player or dealer hand. 
 * @returns {boolean} - returns true if hand_array === 21, else false 
 */
export function checkInitBlackjack(hand_array) {
    if (GetHandTotal(hand_array) === 21) {
        return true
    }
    else {
        return false
    }
}


