import { expect, describe, it } from 'vitest';
import { World } from './world';
import { Cell } from './cell';

describe('World', () => {
	describe('random', () => {
		it('should generate a world', () => {
			const world = World.random(100, 100);

			expect(world).toBeTruthy();
		});
	});

	describe('advance', () => {
		it('should increase generation by 1', () => {
			const world = new World([[new Cell(1)]]);
			const lastRecordedGeneration = world.generation;

			world.advance();

			const expectedGeneration = lastRecordedGeneration + 1;
			expect(world.generation).toBe(expectedGeneration);
		});

		it('should modifies cells', () => {
			const world = new World([
				[new Cell(1), new Cell(0), new Cell(0), new Cell(0)],
				[new Cell(1), new Cell(0), new Cell(0), new Cell(0)],
				[new Cell(1), new Cell(0), new Cell(0), new Cell(0)],
				[new Cell(1), new Cell(1), new Cell(0), new Cell(0)],
				[new Cell(1), new Cell(1), new Cell(1), new Cell(0)]
			]);

			const expectedDataAfterAdvance = [
				[new Cell(0), new Cell(0), new Cell(0), new Cell(0)],
				[new Cell(1), new Cell(1), new Cell(0), new Cell(0)],
				[new Cell(1), new Cell(0), new Cell(0), new Cell(0)],
				[new Cell(0), new Cell(0), new Cell(1), new Cell(0)],
				[new Cell(1), new Cell(0), new Cell(1), new Cell(0)]
			];

			world.advance();

			expect(JSON.stringify(world.data)).toBe(JSON.stringify(expectedDataAfterAdvance));
		});
	});

	describe('clear', () => {
		it('should clear world and restart generation', () => {
			const world = World.random(10, 10);

			world.advance();
			world.advance();
			world.advance();

			world.clear();

			const totalLivingCell = world.data.reduce<number>((total, cellList) => {
				return total + cellList.reduce<number>((subtotal, cell) => subtotal + cell.state, 0);
			}, 0);

			console.log(world.generation);

			expect(totalLivingCell).toBe(0);
			expect(world.generation).toBe(1);
		});
	});

	describe('toggleCellState', () => {
		it(`should toggle cell' state`, () => {
			const world = new World([
				[new Cell(1), new Cell(0), new Cell(0)],
				[new Cell(0), new Cell(1), new Cell(0)],
				[new Cell(0), new Cell(0), new Cell(1)]
			]);

			world.toggleCellState(1, 1);

			expect(world.data[1][1].state).toBe(0);
		});
	});
});
