import React, { useEffect } from "react";

export function Calculations({

    // Insert needed props for the calculations here. 
    playerHand,
    playerScore,
    roundStatus,
    setRoundStatus,
    roundMessage,
    setRoundMessage,
    setRoundResult,
    setPlayerActionDisabled,
    DealerTurn,
    dealerScore,
    dealerHand,
    GetHandTotal,
    shoeRef,
    StartNewShoe,
    DealRound,
    setBetCircle
}) {

    // Insert the functions and UseEffect() pieces related to calculations here. 


    useEffect(() => {
        if (roundStatus === "init_hand_dealt") {
            let dealer_init_total = GetHandTotal(dealerHand);
            let player_init_total = GetHandTotal(playerHand);
            

            if (player_init_total === 21) {
                if (dealer_init_total === 21) {
                    setRoundStatus("round_complete");
                    setRoundResult("push");
                    setRoundMessage("Push");
                    
                }
                else {
                    setRoundStatus("round_complete");
                    setRoundResult("player_win");
                    setRoundMessage("Player Win");

                }
            }
            else if (dealer_init_total === 21) {
                setRoundStatus("round_complete");
                setRoundResult("dealer_win");
                setRoundMessage("Dealer Win");
                
            }
            else {
                setRoundStatus("player_turn");
                setRoundMessage("Player Turn");``
            }
        }

        else if (roundStatus === "dealer_action_complete") {

            const dealerTotal = dealerScore;
            const playerTotal = playerScore;

            if (dealerTotal > 21) {
                setRoundStatus("round_complete");
                setRoundResult("player_win");
                setRoundMessage("Player Win");
            } else if (dealerTotal === playerTotal) {
                setRoundStatus("round_complete");
                setRoundResult("push");
                setRoundMessage("Push");
            } else if (dealerTotal > playerTotal) {
                setRoundStatus("round_complete");
                setRoundResult("dealer_win");
                setRoundMessage("Dealer Win");
            } else {
                setRoundStatus("round_complete");
                setRoundResult("player_win");
                setRoundMessage("Player Win");
            }
        }

        else if (roundStatus === "player_turn") {
                // React to player bust

            if (playerScore > 21) {
                setRoundStatus("round_complete");
                setRoundResult("dealer_win")
                setRoundMessage("Dealer Wins");
            }
            else if (playerScore === 21) {
                setRoundStatus("dealer_turn");
                setRoundMessage("Dealer Turn");
                DealerTurn();
            }
            else {
                setRoundStatus("player_turn");
                setRoundMessage("Player Turn");
                setPlayerActionDisabled(false);
            }
    }


    }, [roundStatus, dealerScore, playerScore, playerHand, dealerHand]);

    return (

        <div>
            <p>Cards Remaining: {shoeRef.current.length}</p>
            <h2>Message: {roundMessage}</h2>
            <h4>Round Status: {roundStatus}</h4>
            <button onClick={StartNewShoe}>Start New Shoe</button>
            <button onClick={DealRound}>Deal Next Round</button>
            <div>
                <p>Dealer's up card: {dealerHand[0]}</p>
                <p>Dealer Hand: {dealerHand.join(", ")}</p>
                <p>Dealer Total: {dealerScore}</p>
            </div>
        </div>
    );

}