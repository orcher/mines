import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

class Square extends React.Component {
    render() {
        return (
            <td className="square" onClick={this.props.onClick} id={this.props.id}>{this.props.value}</td>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 0,
            nMines: 0,
            board: [],
            board_uncovered: [],
            win: null,
            blownMineId: ""
        }
    }

    uncover(w, h, tmpBoardUncovered, count) {
        const size = this.state.size;
        if (count > 3) return;

        if (this.state.board[w][h] === 0) {
            if (w > 0)                       this.uncover(w - 1, h, tmpBoardUncovered, count+1);
            if (w > 0 & h > 0)               this.uncover(w - 1, h - 1, tmpBoardUncovered, count + 1);
            if (h > 0)                       this.uncover(w, h - 1, tmpBoardUncovered, count + 1);
            if (w + 1 < size & h > 0)        this.uncover(w + 1, h - 1, tmpBoardUncovered, count + 1);
            if (w + 1 < size)                this.uncover(w + 1, h, tmpBoardUncovered, count + 1);
            if (w + 1 < size & h + 1 < size) this.uncover(w + 1, h + 1, tmpBoardUncovered, count + 1);
            if (h + 1 < size)                this.uncover(w, h + 1, tmpBoardUncovered, count + 1);
            if (w > 0 & h + 1 < size)        this.uncover(w - 1, h + 1, tmpBoardUncovered, count + 1);
        }

        tmpBoardUncovered[w][h] = 1;
    }

    gameOver(w, h) {
        const id = "s" + w + h;
        document.getElementById(id).setAttribute("id", "mine");
        this.setState({
            win: false,
            blownMineId: id
        });
    }

    checkWin() {
        const size = this.state.size;
        let uncovered = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.state.board_uncovered[j][i] === null) {
                    uncovered++;
                }
            }
        }

        this.setState ({
            win: uncovered === this.state.nMines ? true : null
        });
    }

    handleSquareClick(w, h) {
        if (this.state.win != null) return;

        if (this.state.board[w][h] === 9) {
            this.gameOver(w, h);
            return;
        }

        const tmpBoardUncovered = this.state.board_uncovered;

        this.uncover(w, h, tmpBoardUncovered, 0);

        this.setState({
            board_uncovered: tmpBoardUncovered
        });

        this.checkWin();
    }

    renderBoard() {
        const size = this.state.size;
        const board = [];
        for (let j = 0; j < size; j++) {
            const row = [];
            for (let i = 0; i < size; i++) {
                const id = "s" + i + j;
                row.push(
                    <Square
                        key={i}
                        onClick={() => this.handleSquareClick(i, j)}
                        value={this.state.board_uncovered[i][j] === null ? "" : this.state.board[i][j].toString()}
                        id={id}
                    />
                );
            }
            board.push(<tr key={j}>{row}</tr>);
        }

        return (
            <div className="sub-container">
                <table>
                    <tbody>
                        {board}
                    </tbody>
                </table>
            </div>
            );
    }

    renderInputForm() {
        return (
            <div className="sub-container">
                <table>
                    <tbody>
                        <tr>
                            <td>Size:</td>
                            <td><input id="input-size" type="text" defaultValue="10" /></td>
                        </tr>
                        <tr>
                            <td>Num. Mines: </td>
                            <td><input id="input-mines" type="text" defaultValue="10" /></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><button className="create-btn" onClick={() => { this.createBoard() }}>Create</button></td>
                        </tr>
                    </tbody>
                 </table>
            </div>
        );
    }

    createBoard() {
        let m = document.getElementById("mine");
        if (m !== null) {
            m.setAttribute("id", this.state.blownMineId);
        }

        const size = parseInt(document.getElementById("input-size").value, 10);
        const nMines = parseInt(document.getElementById("input-mines").value, 10);

        const tmpBoard = [];
        let tmpBoardUncovered = [];
        for (let i = 0; i < size; i++) {
            tmpBoard.push(Array(size).fill(null));
            tmpBoardUncovered.push(Array(size).fill(null));
        }

        // Place mines on board
        for (let i = 0; i < nMines; i++) {
            let c = Math.floor(Math.random() * size);
            let r = Math.floor(Math.random() * size);
            while (tmpBoard[c][r] != null) {
                c = Math.floor(Math.random() * size);
                r = Math.floor(Math.random() * size);
            }
            tmpBoard[c][r] = 9;
        }

        // Set rest of fields values
        let mCount = 0;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (tmpBoard[j][i] === 9) continue;
                if (j > 0                        && tmpBoard[j - 1][i] === 9) mCount++;
                if (j > 0 && i > 0               && tmpBoard[j - 1][i - 1] === 9) mCount++;
                if (i > 0                        && tmpBoard[j][i - 1] === 9) mCount++;
                if (j + 1 < size && i > 0        && tmpBoard[j + 1][i - 1] === 9) mCount++;
                if (j + 1 < size                 && tmpBoard[j + 1][i] === 9) mCount++;
                if (j + 1 < size && i + 1 < size && tmpBoard[j + 1][i + 1] === 9) mCount++;
                if (i + 1 < size                 && tmpBoard[j][i + 1] === 9) mCount++;
                if (j > 0 && i + 1 < size        && tmpBoard[j - 1][i + 1] === 9) mCount++;
                tmpBoard[j][i] = mCount;
                mCount = 0;
            }
        }

        this.setState({
            size: size,
            nMines: nMines,
            board: tmpBoard,
            board_uncovered: tmpBoardUncovered,
            win: null,
            blownMineId: null
        });
    }

    renderInfo() {
        const info = this.state.win === null ? "" : this.state.win === true ? "You are winner!" : "You lost!";
        return (
            <div className="sub-container">
                {info}
            </div>
        );
    }

    render() {
        return (
            <div>
                <table className="main-container">
                    <tbody>
                        <tr>
                            <td>
                                {this.renderInputForm()}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.renderBoard()}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {this.renderInfo()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

App.propTypes = {
    size: PropTypes.number,
    nMines: PropTypes.number,
    board: PropTypes.array,
    board_uncovered: PropTypes.array,
    win: PropTypes.bool,
    blownMineId: PropTypes.string
};

Square.propTypes = {
    id: PropTypes.string,
    onClick: PropTypes.func,
    value: PropTypes.string
};

export default App;
