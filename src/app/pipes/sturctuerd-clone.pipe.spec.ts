import { StructuredClonePipe } from './structured-clone.pipe';

describe('StructuredClonePipe', () => {
  it('create an instance', () => {
    const pipe = new StructuredClonePipe();
    expect(pipe).toBeTruthy();
  });
});
