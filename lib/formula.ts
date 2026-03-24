import { SUPPORTED_FIELDS } from './constants';
import type { ComparisonOperator, ExprNode, StockRow, Token, ValidationResult } from './types';

const OPERATOR_SET = new Set(['<', '>', '<=', '>=', '=', '!=']);

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    if (/\s/.test(char)) {
      i += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: char, position: i });
      i += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: char, position: i });
      i += 1;
      continue;
    }

    if (['<', '>', '!', '='].includes(char)) {
      const twoChar = input.slice(i, i + 2);
      const value = OPERATOR_SET.has(twoChar) ? twoChar : char;
      if (!OPERATOR_SET.has(value)) {
        throw new Error(`Invalid operator at position ${i}`);
      }
      tokens.push({ type: 'OPERATOR', value, position: i });
      i += value.length;
      continue;
    }

    if (/[-0-9.]/.test(char)) {
      let value = char;
      let j = i + 1;
      while (j < input.length && /[0-9.]/.test(input[j])) {
        value += input[j];
        j += 1;
      }
      if (Number.isNaN(Number(value))) {
        throw new Error(`Invalid number '${value}' at position ${i}`);
      }
      tokens.push({ type: 'NUMBER', value, position: i });
      i = j;
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let value = char;
      let j = i + 1;
      while (j < input.length && /[A-Za-z0-9_]/.test(input[j])) {
        value += input[j];
        j += 1;
      }
      const upper = value.toUpperCase();
      const type = upper === 'AND' ? 'AND' : upper === 'OR' ? 'OR' : upper === 'NOT' ? 'NOT' : 'IDENTIFIER';
      tokens.push({ type, value: upper, position: i });
      i = j;
      continue;
    }

    throw new Error(`Unexpected character '${char}' at position ${i}`);
  }

  return tokens;
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: Token[]) {}

  parse(): ExprNode {
    const expr = this.parseOr();
    if (this.peek()) {
      throw new Error(`Unexpected token '${this.peek()?.value}' at position ${this.peek()?.position}`);
    }
    return expr;
  }

  private parseOr(): ExprNode {
    let left = this.parseAnd();
    while (this.peek()?.type === 'OR') {
      this.consume('OR');
      const right = this.parseAnd();
      left = { type: 'LOGICAL', operator: 'OR', left, right };
    }
    return left;
  }

  private parseAnd(): ExprNode {
    let left = this.parseUnary();
    while (this.peek()?.type === 'AND') {
      this.consume('AND');
      const right = this.parseUnary();
      left = { type: 'LOGICAL', operator: 'AND', left, right };
    }
    return left;
  }

  private parseUnary(): ExprNode {
    if (this.peek()?.type === 'NOT') {
      this.consume('NOT');
      return { type: 'NOT', operand: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ExprNode {
    if (this.peek()?.type === 'LPAREN') {
      this.consume('LPAREN');
      const expr = this.parseOr();
      this.consume('RPAREN');
      return expr;
    }
    return this.parseComparison();
  }

  private parseComparison(): ExprNode {
    const fieldToken = this.consume('IDENTIFIER');
    if (!(fieldToken.value in SUPPORTED_FIELDS)) {
      throw new Error(`Unsupported field '${fieldToken.value}' at position ${fieldToken.position}`);
    }

    const operatorToken = this.consume('OPERATOR');
    const valueToken = this.consume('NUMBER');

    return {
      type: 'COMPARISON',
      field: fieldToken.value,
      operator: operatorToken.value as ComparisonOperator,
      value: Number(valueToken.value),
    };
  }

  private peek(): Token | undefined {
    return this.tokens[this.index];
  }

  private consume(type: Token['type']): Token {
    const token = this.tokens[this.index];
    if (!token || token.type !== type) {
      throw new Error(`Expected ${type} at position ${token?.position ?? 'end of input'}`);
    }
    this.index += 1;
    return token;
  }
}

export function validateFormula(input: string): ValidationResult {
  try {
    const tokens = tokenize(input);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return {
      ok: true,
      ast,
      normalizedFormula: tokens.map((token) => token.value).join(' '),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown formula error',
    };
  }
}

export function evaluateAst(ast: ExprNode, row: StockRow): boolean {
  if (ast.type === 'COMPARISON') {
    const fieldKey = SUPPORTED_FIELDS[ast.field];
    const leftValue = row[fieldKey];
    switch (ast.operator) {
      case '<':
        return leftValue < ast.value;
      case '>':
        return leftValue > ast.value;
      case '<=':
        return leftValue <= ast.value;
      case '>=':
        return leftValue >= ast.value;
      case '=':
        return leftValue === ast.value;
      case '!=':
        return leftValue !== ast.value;
    }
  }

  if (ast.type === 'LOGICAL') {
    return ast.operator === 'AND'
      ? evaluateAst(ast.left, row) && evaluateAst(ast.right, row)
      : evaluateAst(ast.left, row) || evaluateAst(ast.right, row);
  }

  return !evaluateAst(ast.operand, row);
}
