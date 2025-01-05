

const scores = [98,45,33,47,100,80];
const totalScores = scores.reduce(
(previousScore, currentScore, index)=>previousScore+currentScore, 
0);
console.log(totalScores); //returns 403


