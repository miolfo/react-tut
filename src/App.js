import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

function Square(props) {
  if(!props.winningSquare){
    return (
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
  } else{
    return(
      <button className="square greenFont" onClick={() => props.onClick()}>
        <i>{props.value}</i>
      </button>
    )
  }
}

class Board extends React.Component {
  
  renderSquare(i) {
    let winningSquare = false;
    if(this.props.winningLine != null){
      for(let j = 0; j < this.props.winningLine.length; j++){
        if(this.props.winningLine[j] == i) winningSquare = true;
      }
    }
    return <Square value = {this.props.squares[i]} onClick={()=> this.props.onClick(i)} winningSquare = {winningSquare}/>;
  }
  render() {
    const rows = Array(3).fill(null);
    for(let i = 0; i < 3; i++){
      rows[i] = (
        <div className="board-row">
          {this.renderSquare(0 + i*3)}
          {this.renderSquare(1 + i*3)}
          {this.renderSquare(2 + i*3)}
        </div>
      )
    }
    return (
      <div>
        <div className="status">{status}</div>
        {rows[0]}
        {rows[1]}
        {rows[2]}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }
  render() { 
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    let winningLine = null;
    if(winner){
      status = "Winner: " + winner.winner;
      winningLine = winner.line;
    }
    else{
      status = "Player in turn: " + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, i) => {
      let desc = i ? 
      "Move #: " + i :
      "Game start";
      if(this.state.stepNumber != i){
        return(
        <li key = {i}>
            <a href = "#" onClick = {() => this.jumpTo(i)}>{desc}</a>
          </li>
        )
      } else{
        return(
        <li key = {i}>
            <a href = "#" onClick = {() => this.jumpTo(i)}><b>{desc}</b></a>
          </li>
        )
      }
    });

    return (
      <div>
        <button onClick = {() => this.resetGame()}>Reset</button>
        <div className="game">
          <div className="game-board">
            <Board squares = {current.squares} onClick = {(i) => this.handleClick(i)} winningLine = {winningLine}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true
    });
  }

  handleClick(i){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  resetGame(){
    this.setState({
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0
    });
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //return squares[a];
      return {
        winner: squares[a],
        line: lines[i]
      }
    }
  }
  return null;
}


export default App;
