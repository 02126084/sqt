import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const sidegrid = document.getElementById("sidegrid");
const sidegrid_2 = document.getElementById("sidegrid_2")

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const update_grid = function () {
    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
};

const sidecells = range(2).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(4).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";
        row.append(cell);
        return cell;
    });

    sidegrid.append(row);
    return rows;
});

const update_sidegrid = function () {
    sidecells.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = sidecells[line_index][column_index];
            cell.className = `cell sidebar`;
        });
    });

    Tetris.tetromino_coordiates(game.held_tetromino, [1, 0]).forEach(
        function (coord) {
            try {
                const cell = sidecells[coord[1]][coord[0]];
                cell.className = (
                    `cell ${game.held_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
};

const sidecells_2 = range(2).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(4).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";
        row.append(cell);
        return cell;
    });

    sidegrid_2.append(row);
    return rows;
});

const update_sidegrid_2 = function () {
    sidecells_2.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = sidecells_2[line_index][column_index];
            cell.className = `cell sidebar`;
        });
    });

    Tetris.tetromino_coordiates(game.next_tetromino, [1, 0]).forEach(
        function (coord) {
            try {
                const cell = sidecells_2[coord[1]][coord[0]];
                cell.className = (
                    `cell ${game.next_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );
};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_sidegrid_2();
    update_sidegrid();
    update_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);
update_sidegrid_2();
update_sidegrid();
update_grid();

