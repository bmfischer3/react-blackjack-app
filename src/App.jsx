import { useState, useRef, useEffect } from "react";
import "./App.css";
import { PlayerActions } from "./components/Player";
import { Calculations } from "./components/Calculations";

function App() {

  const [dealerHand, setDealerHand] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [shoe, setShoe] = useState([]);
  const [roundResult, setRoundResult] = useState("in_progress") // not_determined, player_bust, dealer_bust, in_progress, player_win, dealer_win, push
  const [roundStatus, setRoundStatus] = useState("not_started"); // not_started, init_hand_dealt, player_turn, dealer_turn, dealer_action_complete, round_complete
  const [roundMessage, setRoundMessage] = useState(""); // 'Player Turn', 'Dealer Turn', 'Push', 'Player Win', 'Dealer Win'
  const shoeRef = useRef([]);
  const [playerScore, setPlayerScore] = useState(0); // Derived state with useEffect
  const [dealerScore, setDealerScore] = useState(0); // Derived state with useEffect
  const [playerActionDisabled, setPlayerActionDisabled] = useState(false);


  const PlayerProps = {
    playerHand,
    setPlayerHand,
    playerScore,
    setPlayerScore,
    roundStatus,
    setRoundStatus,
    roundMessage,
    setRoundMessage,
    DrawCard,
    playerActionDisabled,
    setPlayerActionDisabled, 
    DealerTurn
  };


  const CalculationProps = {
    // insert calculation props here
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
    dealerScore,
    setDealerScore,
    dealerHand,
    setDealerHand,
    shoeRef,
    StartNewShoe,
    DealRound,
    GetHandTotal,
    DealerTurn
  };


  // Automatically update scores when hands change
  useEffect(() => {
    setPlayerScore(GetHandTotal(playerHand));
  }, [playerHand]);

  useEffect(() => {
    setDealerScore(GetHandTotal(dealerHand));
  }, [dealerHand]);

  useEffect(() => {
    if (roundStatus === "round_complete" || roundStatus === "dealer_turn") {
      setPlayerActionDisabled(true);
    }
    else {
      setPlayerActionDisabled(false);
    }
  }, [roundStatus]);





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

    // Dealer's turn logic
  function DealerTurn() {
    if (roundStatus != "round_complete") {
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
}

  return (
    <div>
      <div>
        <div>
          <Calculations {...CalculationProps}/>
        </div>
        <div>
          <PlayerActions {...PlayerProps}/>
        </div>
      </div>
    </div>
  );
}

export default App;