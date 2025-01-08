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
    DealRound

}) {

    // Insert the functions and UseEffect() pieces related to calculations here. 


    useEffect(() => {
        if (roundStatus === "init_hand_dealt") {
            let dealer_init_total = GetHandTotal(dealerHand);
            let player_init_total = GetHandTotal(playerHand);
            

            if (player_init_total === 21) {
                if (dealer_init_total === 21) {
                    setRoundResult("push");
                    setRoundStatus("round_complete");
                    setRoundMessage("Push");
                }
                else {
                    setRoundResult("player_win");
                    setRoundStatus("round_complete");
                    setRoundMessage("Player Win");

                }
            }
            else if (dealer_init_total === 21) {
                setRoundResult("dealer_win");
                setRoundStatus("round_complete");
                setRoundMessage("Dealer Win");
            }
            else {
                setRoundResult("in_progress");
                setRoundStatus("player_turn");
                setRoundMessage("Player Turn");
            }
        }

        else if (roundStatus === "dealer_action_complete") {

            const dealerTotal = dealerScore;
            const playerTotal = playerScore;

            if (dealerTotal > 21) {
                setRoundResult("player_win");
                setRoundMessage("Player Win");
                setRoundStatus("round_complete");
            } else if (dealerTotal === playerTotal) {
                setRoundResult("push");
                setRoundMessage("Push");
                setRoundStatus("round_complete");
            } else if (dealerTotal > playerTotal) {
                setRoundResult("dealer_win");
                setRoundMessage("Dealer Win");
                setRoundStatus("round_complete");
            } else {
                setRoundResult("dealer_win");
                setRoundMessage("Player Win");
                setRoundStatus("round_complete");
            }
        }

        else if (roundStatus === "player_turn") {
                // React to player bust

            if (playerScore > 21) {
                setRoundStatus("round_complete")
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