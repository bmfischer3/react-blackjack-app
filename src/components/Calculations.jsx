
// Helper: Calculate hand total dynamically
export function GetHandTotal(handArray) {
    if (!handArray.length) return 0;

    let aceCount = handArray.filter((card) => card === "A").length;
    let handTotal = handArray.reduce((total, card) => total + GetCardValue(card), 0);

    // Adjust for aces
    while (handTotal > 21 && aceCount > 0) {
        handTotal -= 10;
        aceCount -= 1;
    }
    return handTotal;
}


// Helper: Get card value
export function GetCardValue(card) {
    if (card === "A") return 11;
    if (["K", "Q", "J", "10"].includes(card)) return 10;
    return parseInt(card, 10);
}
