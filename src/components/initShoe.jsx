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

