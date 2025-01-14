import React, { useEffect } from "react";

export function PlayerActions({
    playerHand, setPlayerHand,
    playerScore,
    roundStatus,
    setPlayerActionDisabled, playerActionDisabled,
    DrawCard, DealerTurn, setRoundStatus

}) {

    // Player action: Hit
    function PlayerHit() {
        const drawnCard = DrawCard();
        const updatedHand = [...playerHand, drawnCard];
        setPlayerHand(updatedHand);
        setPlayerActionDisabled(true);

    }

    // Player action: Stand
    function PlayerStand() {
        if (roundStatus != "round_complete") {
            setRoundStatus("dealer_turn");
            DealerTurn();
        }
    }

    return (
        <div>
            <p>Player Hand: {playerHand.join(", ")}</p>
            <p>Player Total: {playerScore}</p>
            <button onClick={PlayerHit} disabled={playerActionDisabled}>Hit</button>
            <button onClick={PlayerStand} disabled={playerActionDisabled}>Stand</button>
        </div>
    )
}