const CELL_STATE_LIVE = 1;
const CELL_STATE_DIED = 0;

export type CellState = typeof CELL_STATE_LIVE | typeof CELL_STATE_DIED;

export class Cell {
	readonly state: CellState;
	private futureState: CellState | undefined;

	constructor(state: CellState) {
		this.state = state;
	}

	setLiveNeighbours(count: number) {
		if (count < 0 || count > 8) {
			throw new Error('Live neighbour count should be within 0 to 8');
		}

		if (this.state === CELL_STATE_LIVE) {
			switch (count) {
				case 0:
				case 1:
					this.futureState = CELL_STATE_DIED;
					break;
				case 2:
				case 3:
					this.futureState = CELL_STATE_LIVE;
					break;
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
					this.futureState = CELL_STATE_DIED;
			}
		} else {
			if (count === 3) {
				this.futureState = CELL_STATE_LIVE;
			} else {
				this.futureState = CELL_STATE_DIED;
			}
		}
	}

	spawn() {
		if (this.futureState === undefined) {
			throw new Error('Live neighbours is undefined, set it first!');
		}

		return new Cell(this.futureState);
	}
}
