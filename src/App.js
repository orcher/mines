import React, { Component } from 'react';
import './App.css';

class Square extends React.Component {
    render() {
        return (
            <td className="square" onClick={this.props.onClick}></ td>
            );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            nMines: 0,
            board: [],
        }
    }

    handleSquareClick(w, h) {
        console.log(w, h);
    }

    renderBoard(w, h) {
        let board = [];
        let row = [];

        for (let j = 0; j < h; j++) {
            for (let i = 0; i < w; i++) {
                row.push(<Square key={i} onClick={() => { this.handleSquareClick(i, j) }} />)
            }
            board.push(<tr key={j}>{row}</tr>);
            row = [];
        }

        return (
            <table>
                <tbody>
                    {board}
                </tbody>
            </table>
            );
    }

    renderSizeInput() {
        return (
            <div>
                Size: <input id="input-size" type="text" defaultValue="10"/>
                Num. Mines: <input id="input-mines" type="text" defaultValue="10"/>
                <button className="create-btn" onClick={() => { this.createBoard() }}>Create</button>
            </div>
        );
    }

    createBoard() {
        let size = document.getElementById("input-size").value;
        let m = document.getElementById("input-mines").value;

        let tmp_board = this.state.board;
        for (let i = 0; i < size; i++) {
            tmp_board.push(Array(size).fill(null));
        }

        this.setState({
            width: size,
            height: size,
            nMines: m,
            board: tmp_board,
        });
    }

    render() {
        return (
            <div>
                {this.renderSizeInput()}
                {this.renderBoard(this.state.width, this.state.height)}
            </div>
        );
    }
}

export default App;
