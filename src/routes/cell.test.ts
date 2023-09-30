import { expect, describe, it } from 'vitest';
import { Cell } from './cell';

describe('Cell', () => {
	it('when a cell assigned with less than 0 or more than live 8 neigbours, should throw error ', () => {
		const cell1 = new Cell(1);
		const cell2 = new Cell(0);

		expect(() => {
			cell1.setLiveNeighbours(-1);
		}).toThrow();

		expect(() => {
			cell2.setLiveNeighbours(9);
		}).toThrow();
	});

	it('when cell have undefined live neighbours, should throw error when spawn called', () => {
		const cell1 = new Cell(1);

		expect(() => {
			cell1.spawn();
		}).toThrow();
	});

	describe('when a live cell', () => {
		it('have fewer than 2 live neighbours, should spawn dead cell', () => {
			const cell1 = new Cell(1);
			const cell2 = new Cell(1);

			cell1.setLiveNeighbours(1);
			cell2.setLiveNeighbours(0);

			expect(cell1.spawn()?.state).equal(0);
			expect(cell2.spawn()?.state).equal(0);
		});

		it('have 2 or 3 live neighbours, should spawn live cell', () => {
			const cell1 = new Cell(1);
			const cell2 = new Cell(1);

			cell1.setLiveNeighbours(2);
			cell2.setLiveNeighbours(3);

			expect(cell1.spawn()?.state).equal(1);
			expect(cell2.spawn()?.state).equal(1);
		});

		it('have more than 3 live neighbours, should spawn dead cell', () => {
			const cell1 = new Cell(1);
			const cell2 = new Cell(1);
			const cell3 = new Cell(1);
			const cell4 = new Cell(1);
			const cell5 = new Cell(1);

			cell1.setLiveNeighbours(4);
			cell2.setLiveNeighbours(5);
			cell3.setLiveNeighbours(6);
			cell4.setLiveNeighbours(7);
			cell5.setLiveNeighbours(8);

			expect(cell1.spawn()?.state).equal(0);
			expect(cell2.spawn()?.state).equal(0);
			expect(cell3.spawn()?.state).equal(0);
			expect(cell4.spawn()?.state).equal(0);
			expect(cell5.spawn()?.state).equal(0);
		});
	});
	describe('when a dead cell', () => {
		it('when a dead cell have exactly 3 live neighbours, should spawn live cell', () => {
			const cell1 = new Cell(0);

			cell1.setLiveNeighbours(3);

			expect(cell1.spawn()?.state).equal(1);
		});

		it('when a dead cell have other than 3 live neighbours, should spawn dead cell', () => {
			const cell1 = new Cell(0);
			const cell2 = new Cell(0);
			const cell3 = new Cell(0);
			const cell4 = new Cell(0);
			const cell5 = new Cell(0);
			const cell6 = new Cell(0);
			const cell7 = new Cell(0);
			const cell8 = new Cell(0);

			cell1.setLiveNeighbours(0);
			cell2.setLiveNeighbours(1);
			cell3.setLiveNeighbours(2);
			cell4.setLiveNeighbours(4);
			cell5.setLiveNeighbours(5);
			cell6.setLiveNeighbours(6);
			cell7.setLiveNeighbours(7);
			cell8.setLiveNeighbours(8);

			expect(cell1.spawn()?.state).equal(0);
			expect(cell2.spawn()?.state).equal(0);
			expect(cell3.spawn()?.state).equal(0);
			expect(cell4.spawn()?.state).equal(0);
			expect(cell5.spawn()?.state).equal(0);
			expect(cell6.spawn()?.state).equal(0);
			expect(cell7.spawn()?.state).equal(0);
			expect(cell8.spawn()?.state).equal(0);
		});
	});
});
