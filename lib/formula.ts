export function evaluateAst(ast: ExprNode, row: StockRow): boolean {
  if (ast.type === 'COMPARISON') {
    const fieldKey = SUPPORTED_FIELDS[ast.field];
    const leftValue = row[fieldKey];

    const leftNum =
      typeof leftValue === 'number' ? leftValue : Number(leftValue);
    const rightNum =
      typeof ast.value === 'number' ? ast.value : Number(ast.value);

    switch (ast.operator) {
      case '<':
        return (
          Number.isFinite(leftNum) &&
          Number.isFinite(rightNum) &&
          leftNum < rightNum
        );
      case '>':
        return (
          Number.isFinite(leftNum) &&
          Number.isFinite(rightNum) &&
          leftNum > rightNum
        );
      case '<=':
        return (
          Number.isFinite(leftNum) &&
          Number.isFinite(rightNum) &&
          leftNum <= rightNum
        );
      case '>=':
        return (
          Number.isFinite(leftNum) &&
          Number.isFinite(rightNum) &&
          leftNum >= rightNum
        );
      case '=':
        return String(leftValue) === String(ast.value);
      case '!=':
        return String(leftValue) !== String(ast.value);
      default:
        return false;
    }
  }

  if (ast.type === 'LOGICAL') {
    return ast.operator === 'AND'
      ? evaluateAst(ast.left, row) && evaluateAst(ast.right, row)
      : evaluateAst(ast.left, row) || evaluateAst(ast.right, row);
  }

  return !evaluateAst(ast.operand, row);
}