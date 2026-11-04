import { calculateProgress } from '../../src/services/progress.js';
describe('progress calculation', () => {
  it('calculates zero, fifty, full, capped, and half-up percentages', () => {
    expect(calculateProgress(100, [])).toEqual({ totalRecorded: 0, percent: 0 });
    expect(calculateProgress(100, [50])).toEqual({ totalRecorded: 50, percent: 50 });
    expect(calculateProgress(100, [100])).toEqual({ totalRecorded: 100, percent: 100 });
    expect(calculateProgress(100, [150])).toEqual({ totalRecorded: 150, percent: 100 });
    expect(calculateProgress(30, [10])).toEqual({ totalRecorded: 10, percent: 33.3 });
    expect(calculateProgress(100, [50.05])).toEqual({ totalRecorded: 50.05, percent: 50.1 });
  });
});
