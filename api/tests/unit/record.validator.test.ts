import { validateQuantityRange, validateRecord } from '../../src/validators/record.js';

describe('record validator', () => {
  it('accepts valid calendar dates and numeric quantities', () => {
    expect(validateRecord({ activity_date: '2026-11-04', quantity: 25 })).toEqual({ valid: true, value: { activity_date: '2026-11-04', quantity: 25 } });
  });

  it('rejects non-numeric quantities and malformed dates', () => {
    expect(validateRecord({ activity_date: '2026-11-04', quantity: '25' }).valid).toBe(false);
    expect(validateRecord({ activity_date: '2026-02-30', quantity: 25 }).valid).toBe(false);
  });

  it('uses inclusive template quantity bounds', () => {
    expect(validateQuantityRange(0, 0, 500)).toBeNull();
    expect(validateQuantityRange(500, 0, 500)).toBeNull();
    expect(validateQuantityRange(-0.01, 0, 500)?.valid).toBe(false);
    expect(validateQuantityRange(500.01, 0, 500)?.valid).toBe(false);
  });
});
