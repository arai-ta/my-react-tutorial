import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.handler} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      key={i}
      value={this.props.squares[i]}
      handler={() => this.props.handler(i)}
    />;
  }

  renderRow(start, num) {
    const squares = Array.from({length:num}, (v,k) => k+start).map(
      (i) => this.renderSquare(i)
    );
    return (
      <div className="board-row" key={start}>
        {squares}
      </div>
    );
  }

  render() {
    const rowNum = 3,
          colNum = 3;

    const rows = Array.from({length:rowNum}, (v,k) => k).map(
      (row) => this.renderRow(row * colNum, colNum)
    );

    return (
      <div>
        {rows}
      </div>
    );
  }
}

function HistoryList(props) {
  const moves   = props.history.map((step, move) => {
    const select = step.select;
    const desc = move ?
      'Go to move #' + move + ' (' + select[0] + ',' + select[1] + ')' :
      'Go to game start';
    const style = {
      fontWeight: (move === props.current ? 'bold' : '')
    }
    return (
      <li key={move}>
        <button onClick={() => props.handler(move)} style={style}>{desc}</button>
      </li>
    );
  });

  return <ol>{moves}</ol>;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        select: [],
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // ここでhistoryを更新しているので、click時点から過去の履歴が残るようになっている
    this.setState({
      history: history.concat([{
        squares: squares,
        select : colAndRowFromIndex(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    // ここではhistoryを更新しないため、過去の履歴がjumpによって失われることはない
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            handler={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <HistoryList
             history={history}
             handler={(i) => this.jumpTo(i)}
             current={this.state.stepNumber}
          />
        </div>
      </div>
    );
  }
}

function colAndRowFromIndex(index) {
  const map = [
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];
  return map[index];
}

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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

