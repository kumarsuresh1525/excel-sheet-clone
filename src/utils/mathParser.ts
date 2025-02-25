import { evaluate } from 'mathjs';

export const parseMathExpression = (expression: string): number => {
  try {
    return evaluate(expression);
  } catch (error) {
    console.error('Invalid expression:', error);
    return 0;
  }
}; 