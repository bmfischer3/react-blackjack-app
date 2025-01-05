import React, { useEffect } from "react";

export function PlayerButtons({ 
    playerHand, setPlayerHand,
    playerScore, setPlayerScore,
    roundMessage, setRoundMessage,
    roundStatus, setRoundStatus, 
    setPlayerActionDisabled, playerActionDisabled,
    DrawCard, DealerTurn

}) {

    // States defined


    // Player action: Hit
    function PlayerHit() {
        setRoundStatus("player_turn")
        const drawnCard = DrawCard();
        const updatedHand = [...playerHand, drawnCard];
        setPlayerHand(updatedHand);
    }

    // Player action: Stand
    function PlayerStand() {
        setRoundStatus("player_action_complete");
        DealerTurn();
    }

    // React to player bust
    useEffect(() => {
        if (playerScore > 21) {
            setRoundStatus("round_complete")
            setRoundMessage("Dealer Wins");
        }
        else if (playerScore === 21) {
            setRoundStatus("player_action_complete");
            setRoundMessage("Dealer Turn");
            DealerTurn();
        }

    }, [playerScore]);


    return (
        <div>
            <p>Player Hand: {playerHand.join(", ")}</p>
            <p>Player Total: {playerScore}</p>
            <button onClick={PlayerHit} disabled={playerActionDisabled}>Hit</button>
            <button onClick={PlayerStand} disabled={playerActionDisabled}>Stand</button>
        </div>
    )
}