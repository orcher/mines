import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { Button, Input, Txt, Provider } from 'rendition';

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
            minSize: 8,
            maxSize: 30,
            minMines: 1,
            maxMinesRatio: 0.3
        }
    }

    uncover(w, h, tmpBoardUncovered) {
        if (tmpBoardUncovered[w][h] !== null) return;
        tmpBoardUncovered[w][h] = 1;
        const size = this.state.size;
        if (this.state.board[w][h] === 0) {
            if (w > 0)                       this.uncover(w - 1, h, tmpBoardUncovered);
            if (w > 0 & h > 0)               this.uncover(w - 1, h - 1, tmpBoardUncovered);
            if (h > 0)                       this.uncover(w, h - 1, tmpBoardUncovered);
            if (w + 1 < size & h > 0)        this.uncover(w + 1, h - 1, tmpBoardUncovered);
            if (w + 1 < size)                this.uncover(w + 1, h, tmpBoardUncovered);
            if (w + 1 < size & h + 1 < size) this.uncover(w + 1, h + 1, tmpBoardUncovered);
            if (h + 1 < size)                this.uncover(w, h + 1, tmpBoardUncovered);
            if (w > 0 & h + 1 < size)        this.uncover(w - 1, h + 1, tmpBoardUncovered);
        }
    }

    gameOver(w, h) {
        this.showAllMines();

        this.setState({
            win: false,
        });

        const id = "s" + w + h;
        this.explosion(id, 1, 80, 20);
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

        const tmpWin = uncovered === this.state.nMines ? true : null;
        if (tmpWin) this.showAllMines();

        this.setState ({
            win: tmpWin
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

    explosion(id, time, msize, esize) {
        let elem = document.getElementById(id);
        let size = 0;
        let big = false;
        let end = false;
        let int = setInterval(frame, time);
        function frame() {
            if (end) {
                clearInterval(int);
            } else {
                size += (big ? -1 : 1);
                elem.style.width = size + 'px';
                elem.style.height = size + 'px';
                if (size === msize) big = true;
                if (big & size === esize) end = true;
            }
        }
    }

    showAllMines() {
        const size = this.state.size;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.state.board[j][i] === 9) {
                    const id = "s" + j + i;
                    document.getElementById(id).setAttribute("class", "mine");
                }
            }
        }
    }

    hideAllMines() {
        const size = this.state.size;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.state.board[j][i] === 9) {
                    const id = "s" + j + i;
                    document.getElementById(id).setAttribute("class", "square");
                }
            }
        }
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
            <Provider>
                <div className="sub-container-form">
                    <table>
                        <tbody>
                            <tr>
                                <td><Txt bold align="right">Size:</Txt></td>
                                <td><Input number width="30px" id="input-size" type="text" defaultValue="10" /></td>
                                <td><Txt bold align="right">Mines:</Txt></td>
                                <td><Input number width="30px" id="input-mines" type="text" defaultValue="10" /></td>
                                <td><Button primary onClick={() => { this.createBoard() }}>Create</Button></td>
                                <td>{this.renderInfo()}</td>
                            </tr>
                        </tbody>
                     </table>
                </div>
            </Provider>
        );
    }

    createBoard() {
        let size = parseInt(document.getElementById("input-size").value, 10);
        let nMines = parseInt(document.getElementById("input-mines").value, 10);

        if (size > this.state.maxSize) {
            document.getElementById("input-size").value = this.state.maxSize;
            size = this.state.maxSize;
        }
        else if (size < this.state.minSize) {
            document.getElementById("input-size").value = this.state.minSize;
            size = this.state.minSize;
        }

        const area = Math.pow(size, 2);
        if (nMines / area > this.state.maxMinesRatio) {
            document.getElementById("input-mines").value = Math.floor(area * this.state.maxMinesRatio);
            nMines = Math.floor(area * this.state.maxMinesRatio);
        }
        else if (nMines < this.state.minMines) {
            document.getElementById("input-mines").value = this.state.minMines;
            nMines = this.state.minMines;
        }

        this.hideAllMines();

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
            win: null
        });
    }

    renderInfo() {
        const info = this.state.win === null ? "" : this.state.win === true ? "You are winner!" : "You lost!";
        return (
            <div className="sub-container-info">
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
