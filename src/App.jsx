import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PlayerButtons } from "./components/PlayerButtons";

function App() {
  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [shoe, setShoe] = useState([]);
  const [roundResult, setRoundResult] = useState("in_progress") // not_determined, player_bust, dealer_bust, in_progress, player_win, dealer_win, push
  const [roundStatus, setRoundStatus] = useState("not_started"); // not_started, init_hand_dealt, player_turn, player_action_complete, dealer_turn, dealer_action_complete, round_complete
  const [roundMessage, setRoundMessage] = useState(""); // 'Player Turn', 'Dealer Turn', 'Push', 'Player Win', 'Dealer Win'
  const shoeRef = useRef([]);
  const [playerScore, setPlayerScore] = useState(0); // Derived state with useEffect
  const [dealerScore, setDealerScore] = useState(0); // Derived state with useEffect
  const [playerActionDisabled, setPlayerActionDisabled] = useState(false);

  // Automatically update scores when hands change
  useEffect(() => {
    setPlayerScore(GetHandTotal(playerHand));
  }, [playerHand]);

  useEffect(() => {
    setDealerScore(GetHandTotal(dealerHand));
  }, [dealerHand]);

  useEffect(() => {
    if (roundStatus === "round_complete" || roundStatus === "player_action_complete") {
      setPlayerActionDisabled(true);
    }
  }, [roundStatus]);

  // Helper: Calculate hand total dynamically
  function GetHandTotal(handArray) {
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
  function GetCardValue(card) {
    if (card === "A") return 11;
    if (["K", "Q", "J", "10"].includes(card)) return 10;
    return parseInt(card, 10);
  }

  // Initialize shoe
  function InitializeShoe(deckQuantity = 4) {

    setRoundStatus("not_started");
    setRoundMessage("Shoe Starting");

    const singleDeck = [
      "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
      "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
      "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
      "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K",
    ];

    let shoe = [];
    for (let i = 0; i < deckQuantity; i++) shoe = shoe.concat(singleDeck);

    // Shuffle the shoe
    for (let i = shoe.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
    }

    shoeRef.current = shoe; // Update the shoe reference
    setShoe(shoe);
    console.log("Shoe initialized:", shoe);
  }

  // Start a new shoe
  function StartNewShoe() {
    setDealerHand([]);
    setPlayerHand([]);
    InitializeShoe();
    setRoundStatus("player_turn");
    setRoundResult("not_determined")

    DealRound();
  }

  // Draw a card
  function DrawCard() {
    const drawnCard = shoeRef.current.shift();
    setShoe([...shoeRef.current]);
    return drawnCard;
  }

  // Deal the initial round
  function DealRound() {

    setPlayerActionDisabled(false);

    if (shoeRef.current.length < 30) {
      StartNewShoe();
      return;
    }

    const playerCards = [DrawCard(), DrawCard()];
    const dealerCards = [DrawCard(), DrawCard()];

    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setRoundStatus("init_hand_dealt");
    setRoundResult("in_progress");
    setRoundMessage("Player Turn");
  }


  // Dealer's turn logic
  function DealerTurn() {

    setRoundStatus("dealer_turn");

    const playDealerTurn = (currentHand) => {
      const dealerTotal = GetHandTotal(currentHand);
      if (dealerTotal >= 17) {
        if (dealerTotal > 21) {
          setRoundStatus("round_complete");
          setRoundMessage("Player Win");
        }
        else {
          // Evaluate the round
          setRoundStatus("dealer_action_complete")
        }
      } else if (dealerTotal < 17) {
        setRoundStatus("dealer_turn")
        const drawnCard = DrawCard();
        const updatedHand = [...currentHand, drawnCard];
        setDealerHand(updatedHand);
        setTimeout(() => playDealerTurn(updatedHand), 1000); // Add delay for UI feedback
      };
    }
    playDealerTurn(dealerHand);
  }



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
      <div>
        <p>Cards Remaining: {shoeRef.current.length}</p>
        <h2>Message: {roundMessage}</h2>
        {/* <h4>Round Status: {roundStatus}</h4> */}
        <button onClick={StartNewShoe}>Start New Shoe</button>
        <button onClick={DealRound}>Deal Next Round</button>
      </div>

      <div>
        <div>
          <p>Dealer's up card: {dealerHand[0]}</p>
          <p>Dealer Hand: {dealerHand.join(", ")}</p>
          <p>Dealer Total: {dealerScore}</p>
        </div>
        <div>
          <PlayerButtons
            
            
            // Left:  What the child reads              --> this is the prop name for the child (it can be anything)
            // Righ:  What is being passed to the child --> this is the actual state value of the parent.

            playerHand={playerHand}          // Passing state value


            // Left:  What the child uses to call the updater function. 
            // Right: What is being passed from the parent. 


            // Why having the set on both sides is okay:
            // ---> setPlayerHand is just a prop name (it can be anything) you’re defining for the child component. The child doesn’t know or care what the function is called in the parent.
            // ---> setPlayerHand is the actual updater function provided by useState in the parent.
            setPlayerHand={setPlayerHand}    // Passing state updater function 
          
            
            playerScore={playerScore}              // playerScore set as the prop, and the value within playerScore is being passed to that prop. 

            // playerScoreA={playerScoreAAA}      
            // --> playerScoreA is the name that the child component would use.
            // --> playerScoreAAA, whatever the value of this state is would be passed to the child. 


            setPlayerScore={setPlayerScore}        // Passing derived state

            roundStatus={roundStatus}             // Passing round status updater
            setRoundStatus={setRoundStatus}


            roundMessage={roundMessage}           // Pass the round message updater
            setRoundMessage={setRoundMessage}

            DrawCard={DrawCard}                 // Passing helper function
            
            playerActionDisabled={playerActionDisabled}
            setPlayerActionDisabled={setPlayerActionDisabled}

            DealerTurn={DealerTurn}


          />
        </div>
      </div>
    </div>
  );
}

export default App;