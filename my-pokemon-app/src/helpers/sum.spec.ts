import { sum } from './sum.helper';

describe('sum.helper.ts', () => {
  it('Should sum two numbers', () => {
    //Arrange

    const num1 = 10;
    const num2 = 20;

    //Act
    const result = sum(num1, num2);

    //Assert
    expect(result).toBe(30);
  });
});
