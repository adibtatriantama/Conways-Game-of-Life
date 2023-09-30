import { Cell, type CellState } from './cell';

export class World {
	readonly x;
	readonly y;
	private _generation: number;
	private _data: Cell[][];

	constructor(data: Cell[][], generation: number = 1) {
		this._data = data;
		this.x = data.length;
		this.y = data[0].length;
		this._generation = generation;
	}

	static random(x: number, y: number) {
		const data: Cell[][] = [];

		for (let i = 0; i < x; i++) {
			const yList: Cell[] = [];
			for (let j = 0; j < y; j++) {
				yList.push(new Cell(getRandomCellState()));
			}
			data.push(yList);
		}

		return new World(data);
	}

	get data(): Cell[][] {
		return this._data;
	}

	get generation(): number {
		return this._generation;
	}

	advance() {
		const data: Cell[][] = [];

		for (let i = 0; i < this.x; i++) {
			const yList: Cell[] = [];
			for (let j = 0; j < this.y; j++) {
				this._data[i][j].setLiveNeighbours(getLiveNeighboursCount(this._data, i, j));

				yList.push(this.data[i][j].spawn());
			}
			data.push(yList);
		}

		this._data = data;
		this._generation += 1;
	}

	clear() {
		const newData = [];

		for (let i = 0; i < this.x; i++) {
			const yList: Cell[] = [];
			for (let j = 0; j < this.y; j++) {
				yList.push(new Cell(0));
			}
			newData.push(yList);
		}

		this._data = newData;
	}

	toggleCellState(x: number, y: number) {
		const prevState = this._data[x][y].state;

		this._data[x][y] = new Cell(prevState === 1 ? 0 : 1);
	}
}

function getRandomCellState(): CellState {
	if (Math.random() > 0.5) {
		return 1;
	} else {
		return 0;
	}
}

function getLiveNeighboursCount(grid: Cell[][], row: number, col: number): number {
	const neighbours = getNeighbours(grid, row, col);

	return neighbours.reduce((count, cell) => (count += cell.state), 0);
}

function getNeighbours(grid: Cell[][], row: number, col: number): Cell[] {
	const numRows = grid.length;
	const numCols = grid[0].length;
	const neighbors: Cell[] = [];

	const offsets = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1]
	];

	for (const [dx, dy] of offsets) {
		const newRow = row + dx;
		const newCol = col + dy;

		// Check if the new coordinates are within the bounds of the grid
		if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
			neighbors.push(grid[newRow][newCol]);
		}
	}

	return neighbors;
}
