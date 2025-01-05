import React, { useEffect } from "react";

export function Calculations({

    // Insert needed props for the calculations here. 
    playerHand,
    setPlayerHand,
    playerScore,
    setPlayerScore,
    roundStatus,
    setRoundStatus,
    roundMessage,
    setRoundMessage,
    roundResult,
    setRoundResult,
    DrawCard,
    playerActionDisabled,
    setPlayerActionDisabled,
    DealerTurn,
    dealerScore,
    setDealerScore,
    dealerHand,
    setDealerHand,
    GetHandTotal,
    shoeRef,
    StartNewShoe,
    DealRound

}) {

    // Insert the functions and UseEffect() pieces related to calculations here. 


    // Evaluate the round
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
    }, [roundStatus, dealerScore, playerScore]);

    return (

        <div>
            <p>Cards Remaining: {shoeRef.current.length}</p>
            <h2>Message: {roundMessage}</h2>
            {/* <h4>Round Status: {roundStatus}</h4> */}
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