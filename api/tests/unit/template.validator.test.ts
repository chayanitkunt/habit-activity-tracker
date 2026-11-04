import { validateTemplate } from '../../src/validators/template.js';

describe('template validation / TEST-03.6', () => {
  const valid = { name: 'Reading', unit: 'pages', min_value: 1, max_value: 10 };
  it('accepts an inclusive range where minimum equals maximum', () => expect(validateTemplate({ ...valid, max_value: 1 }).valid).toBe(true));
  it('rejects an inverted range', () => expect(validateTemplate({ ...valid, min_value: 11 }).valid).toBe(false));
  it('rejects a negative minimum', () => expect(validateTemplate({ ...valid, min_value: -1 }).valid).toBe(false));
});
