import { useState, useRef, useEffect, useReducer } from "react";
import "./App.css";
import { PlayerActions } from "./components/Player";
import { Calculations } from "./components/Calculations";


const ROUND_ACTIONS = {
  START_ROUND: 'start_round', 
  DEAL_INIT_HAND: 'deal_init_hand',
  START_PLAYER_TURN: 'start_player_turn',
  START_DEALER_TURN: 'start_dealer_turn',
  COMPLETE_ROUND: 'complete_round',

}

const PLAYER_PAYOUT_ACTIONS = {
  PLAYER_BLACKJACK_PAYOUT: 'player_blackjack_payout',
  PLAYER_WIN_PAYOUT: 'player_win_payout',
  PLAYER_DOUBLE_DOWN_WIN_PAYOUT: 'player_double_down_win_payout',
}

const BET_CIRCLE_ACTIONS = {
  BET_CIRCLE_PLUS_ONE: 'bet_circle_plus_one',
  BET_CIRCLE_PLUS_FIVE: 'bet_circle_plus_five',
  BET_CIRCLE_PLUS_TWENTY_FIVE: 'bet_circle_plus_twenty_five',
  BET_CIRCLE_PLUS_ONE_HUNDRED: 'bet_circle_plus_one_hundred',
  CLEAR_BET_CIRCLE: 'clear_bet_circle'
}


const initialGameState = {
  roundStatus: "not_started",
  roundresult: "in_progress",
  round_message: "Round has not yet started.",
  playerActionDisabled: false,
  playerBetActionDisabled: false,
  dealerHand: [],
  playerHand: [],
  betCircle: 0,
  bankRoll: 0 
}


// Plan:  Run all fo the game logic through a reducer function
//        Call other functions within the reducer case to help simplify logic. 


function gameReducer(state, action) {
  switch (action.type) {
    case ROUND_ACTIONS.START_ROUND:
      // Do what when the round starts?


      // Functions to call:


      // States to update:
      return {
        ...state,
        dealerHand: [],
        playerHand: [],
        playerActionDisabled: false,
        playerBetActionDisabled: false,
      };

    case ROUND_ACTIONS.DEAL_INIT_HAND:
      // Do what when the 

    


  }
}

function betReducer(betState, action) {
  switch (action.type) {

    case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE:
      return betCircle + 1

    case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_FIVE:
      return betCircle + 5

    case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_TWENTY_FIVE:
      return betCircle + 25

    case BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE_HUNDRED:
      return betCircle + 100

    case BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE:
        return bet_circle === 0
    default:
      return betState

    }
}

function App() {



  const [gameState, dispatch] = useReducer(gameReducer, [])
  const [betState, dispatchBet] = useReducer(betReducer, {betCount: 0})



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
  const [playerBetActionDisabled, setPlayerBetActionDisabled] = useState(false);

  const [betSelection, setBetSelection] = useState(0);
  const [betCircle, setBetCircle] = useState(0);
  const [bankRoll, setBankRoll] = useState(0);



  function modifyBet(amount) {
    switch (BET_CIRCLE_ACTIONS.type) {
      case amount === 1:
        return dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE})
      case amount === 5:
        return dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_FIVE})
      case amount === 25:
        return dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_TWENTY_FIVE})
      case amount === 100:
        return dispatchBet({ type: BET_CIRCLE_ACTIONS.BET_CIRCLE_PLUS_ONE_HUNDRED})
      case amount === 'C':
        return dispatchBet({ type: BET_CIRCLE_ACTIONS.CLEAR_BET_CIRCLE})
}
  }




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
    DealerTurn,
    setPlayerBetActionDisabled,
    playerBetActionDisabled
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
    DealerTurn,
    playerBetActionDisabled,
    setPlayerBetActionDisabled,
    ReturnWinnings, 
    setBetCircle
  };


  // Automatically update scores when hands change
  useEffect(() => {
    setPlayerScore(GetHandTotal(playerHand));
  }, [playerHand]);

  useEffect(() => {
    setDealerScore(GetHandTotal(dealerHand));
  }, [dealerHand]);

  // Disable the hit and stand button after standing or the round ends. 
  useEffect(() => {
    if (roundStatus === "round_complete" || roundStatus === "dealer_turn") {
      setPlayerActionDisabled(true);
    }
    else {
      setPlayerActionDisabled(false);
    }
  }, [roundStatus]);

  // Return winnings by updating the bankRoll

  useEffect(() => {
    if (roundStatus === "round_complete") {
      ReturnWinnings();
    }
  }, [roundStatus])

  // Disable the bet adjustment buttons after hitting

  useEffect(() => {

    if (roundStatus === "player_turn") {
      return setPlayerBetActionDisabled(true);
    }

    else if (roundStatus === "round_complete") {
      return setPlayerBetActionDisabled(false);
    }

    else if (roundStatus === "init_hand_dealt") {
      return setPlayerBetActionDisabled(false);
    }

  }, [roundStatus]);


  // Update the bankroll after play deals the next hand. Bet circle is locked in when the round is dealt. 

  useEffect(() => {
    if (roundStatus==="init_hand_dealt") {
      let current_bank_roll = bankRoll
      setBankRoll(current_bank_roll - betCircle);
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
    
    if (betCircle === 0) {
      console.error("Must place bet to start round");
      alert("Must place bet to start round.");
    }
    else {
    setDealerHand([]);
    setPlayerHand([]);
    InitializeShoe();
    setRoundStatus("player_turn");
    setRoundResult("not_determined")
    setPlayerBetActionDisabled(false)

    DealRound();
  }
  }
  // Draw a card
  function DrawCard() {
    const drawnCard = shoeRef.current.shift();
    setShoe([...shoeRef.current]);
    return drawnCard;
  }

  // Deal the initial round
  function DealRound() {

    if (betCircle === 0) {
      console.error("Must place bet to start round");
      alert("Must place bet to start round.");
    }
    else {
    setPlayerActionDisabled(false);
    setPlayerBetActionDisabled(false);

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

  // Handling bet amounts and the bank roll. 

  // Betting Calculations

  function AddToBetValue(incremental_amount) {
    setBetSelection(betSelection + incremental_amount)
  }

  function SubtractFromBetValue(incremental_amount) {
    // check result will be positive integer
    // Actively adds to the bank roll. 
    setBetSelection(betSelection - incremental_amount)
  }

  function AdjustBetCircle() {
    let RequestedBetTotal = SumTotalBet()
    console.info("bankroll is currently: " + bankRoll);
    if (RequestedBetTotal <= bankRoll) {
      console.info("Total Bet is less than, equal to bankRoll")
      setBetCircle(RequestedBetTotal);
      setBetSelection(0);
      return true;
    } else {
      alert("You need more money, click the button to get more credits.");
      console.error("RequestedBetTotal is greater than bankRoll");
      setBetSelection(0);
      return false;
    }
  }

  // Verify bank roll has sufficient funds to bet. 

  function SumTotalBet() {
    // Assumes betCircle + betSelection are updated with each change. 
    console.info("Calculating total bet: " + betCircle + " and " + betSelection)
    let max_bet = betCircle + betSelection;
    console.info("max bet is = " + max_bet);
    return max_bet;
  }


  function ReturnWinnings() {
    if (roundResult === "player_win") {
      setBankRoll(bankRoll+(betCircle*2));
      console.log("bank roll is: " + bankRoll)
    }
    else if (roundResult === "push") {
      setBankRoll(bankRoll+betCircle);
      console.log("banl roll is: " + bankRoll)
    }
    else if (roundResult === "dealer_win") {
      console.info("Dealer win, no payout.")
    }
    else if (roundResult === "in_progress") {
      console.info("Round in progress, retrying...")
    }
    else {
      console.error("round result is: " + roundResult)
      console.log("No winnings returned.");
    }
  }


  return (
    <div>
      <div>
        {/* <div>
          <Calculations {...CalculationProps} />
        </div>
        <div>
          <PlayerActions {...PlayerProps} />
        </div> */}
        <div>
          <h3>Bet Circle: {betState.betCount}</h3>
        </div>
        <div>
          <p>Bet Amount: {betSelection}</p>

          <button onClick={() => SubtractFromBetValue(1)} disabled={playerBetActionDisabled}>-</button>
          <button onClick={() => AddToBetValue(1)} disabled={playerBetActionDisabled}>+</button>
          <br></br>
          <button onClick={() => AdjustBetCircle(betSelection)} disabled={playerBetActionDisabled}>Adjust betting Circle</button>
        </div>
        <div>
          <ul>
            <li><button onClick={modifyBet(1)}>Add 1</button></li>
            <li><button>Add 5</button></li>
            <li><button>Add 25</button></li>
            <li><button>Add 100</button></li>
            <li><button>Clear Bet Circle</button></li>

          </ul>
        </div>
        <div>
          <h2>Player Bank Roll: {bankRoll}</h2>
          <button onClick={() => setBankRoll(bankRoll+100)}>Get 100 Credits</button>
        </div>
      </div>
    </div>
  );
}

export default App;