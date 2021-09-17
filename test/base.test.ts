import { helloFunc } from '../src/main';

describe('helloFuncのテスト', () => {
  test('HelloWorldを返すか', () => {
    expect(helloFunc()).toBe('Hello World');
  });
});
