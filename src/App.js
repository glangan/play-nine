import React, {Component} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';


const Stars = (props) => {
  let stars = [];
  for (let i = 0; i < props.numberOfStars; i++) {
    stars.push(<i className="fa fa-star"></i>);
  }
  return (
    <div className="col-sm-5">
      {stars}
    </div>
  )
};

const Button = (props) => {
  let button;
  switch(props.answerIsCorrect) {
    case true:
      button = <button className="btn btn-success" onClick={props.acceptAnswer}>
        <i className="fa fa-check"></i>
      </button>;
      break;
    case false:
      button = <button className="btn btn-danger">
        <i className="fa fa-times"></i>
      </button>;
      break;
    default:
      button = <button className="btn"
                       onClick={props.checkAnswer}
                       disabled={props.selectedNumbers.length === 0}>
        =
      </button>;
      break;
  }
  return (
    <div className="col-sm-2 text-center">
      {button}
      <br/>
      <button className="btn btn-warning" onClick={props.redraw}
        disabled={props.redraws === 0}>
        <i className="fa fa-refresh"></i> {props.redraws}
      </button>
    </div>
  )
};

const Answer = (props) => {
  return (
    <div className="col-sm-5">
      {props.selectedNumbers.map((number, i) =>
        <span key={i} onClick={() => props.unselectNumber(number)}>{number}</span>
      )}
    </div>
  )
};

const Numbers = (props) => {
  const numberClassName = (number) => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return 'used';
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    }
  };
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i} className={numberClassName(number)}
          onClick={() => props.selectNumber(number)}>{number}</span>
        )}
      </div>
    </div>
  )
};

Numbers.list = [...Array(9).keys()].map(number => number + 1);

const possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  let listSize = arr.length, combinationsCount = (1 << listSize)
  for (let i = 1; i < combinationsCount ; i++ ) {
    let combinationSum = 0;
    for (let j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const DoneFrame = (props) => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <button className="btn btn-primary" onClick={props.resetGame}>Play Again</button>
    </div>
  )
};


class Game extends Component {
  static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: 1 + Game.randomNumber(),
    usedNumbers: [],
    answerIsCorrect: null,
    redraws: 5,
    doneStatus: null,
  });

  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };

  unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
    }))
  };

  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }))
  };

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
    }), this.updateDoneStatus);
  };

  redraw = () => {
    this.setState(prevState => ({
      randomNumberOfStars: Game.randomNumber(),
      answerIsCorrect: null,
      selectedNumbers: [],
      redraws: prevState.redraws - 1
    }));
  };



  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
    const possibleNumbers = [...Array(9).keys()].map(number => number + 1).filter(number =>
      usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return {doneStatus: 'Done, nice!'}
      }
      if (prevState.redraws === 0 && !this.possibleSolutions()) {
        return {doneStatus: 'Game Over!'}
      }
    })
  };

  resetGame = () => {
    this.setState(Game.initialState());
  };

  render() {
    const { selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      usedNumbers,
      redraws,
      doneStatus
    } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr/>
        <div className="row">
          <Stars numberOfStars={randomNumberOfStars} />
          <Button selectedNumbers={selectedNumbers}
          checkAnswer={this.checkAnswer}
          answerIsCorrect={answerIsCorrect}
          acceptAnswer={this.acceptAnswer}
          redraws={redraws}
          redraw={this.redraw}
          />
          <Answer selectedNumbers={selectedNumbers}
          unselectNumber={this.unselectNumber} />
        </div>
        {doneStatus ? <DoneFrame doneStatus={doneStatus} /> :
          <Numbers selectedNumbers={selectedNumbers}
                   selectNumber={this.selectNumber}
                   usedNumbers={usedNumbers}
          />
        }
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Game/>
      </div>
    );
  }
}

export default App;
