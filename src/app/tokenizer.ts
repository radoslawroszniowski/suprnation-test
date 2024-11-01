type Token = {
  type: "NUMBER" |
    "OPERATOR" | "OPEN_PARENTHESIS" | "CLOSE_PARENTHESIS";
  value: string;
};
type Success = {
  success: true; value: Token[]; rest: string;
}
type Failure = {
  success: false;
  reason: string;
}
type Result = Success | Failure;

const success = (value: Token[], rest: string): Result => ({success: true, value: value, rest});

const failure = (reason: string): Result => ({success: false, reason});

type Parser = (input: string) => Result

export const parseNumber: Parser = (input: string) => {
  const match = /^\d+/.exec(input);
  if (match) {
    return success([
      {type: "NUMBER", value: match[0]}], input.slice(match[0].length));
  }
  return failure("Not a number");
}

export const parseOperator: Parser = (input: string) => {
  const match = /^[+-]/.exec(input);
  if (match) {
    return success([
      {type: "OPERATOR", value: match[0]}], input.slice(match[0].length));
  }
  return failure("Expected '+ or -'");
}

export const parseOpenParenthesis: Parser = (input: string) => {
  const match = /^[(]/.exec(input);
  if (match) {
    return success([
      {type: "OPEN_PARENTHESIS", value: match[0]}], input.slice(match[0].length));
  }
  return failure("Expected '('");
}

export const parseCloseParenthesis: Parser = (input: string) => {
  const match = /^[)]/.exec(input);
  if (match) {
    return success([
      {type: "CLOSE_PARENTHESIS", value: match[0]}], input.slice(match[0].length));
  }
  return failure("Expected ')'");
}

export const parseCharacter:
  (char: string, tokenType: Token['type']) => Parser = (char: string, tokenType: Token['type']) => {
  return (input: string) => {
    const match = new RegExp(`^[${char}]`, "g").exec(input);
    if (match) {
      return success([
        {type: tokenType, value: match[0]}], input.slice(match[0].length));
    }
    return failure(`Expected '${char}'`);
  }
}

const parseOpenParenthesis2 = parseCharacter(')', 'CLOSE_PARENTHESIS');
const parseCloseParenthesis2 = parseCharacter('(', 'OPEN_PARENTHESIS');

export const choice: (p1: Parser, p2: Parser) => Parser = (p1, p2) => {
  return (input: string) => {
    const result1 = p1(input);
    if (result1.success) {
      return result1;
    } else {
      return p2(input);
    }
  }
}

export const parseOperator2 = choice(parseCharacter('-', 'OPERATOR'), parseCharacter('+', 'OPERATOR'));

export const choiceN: (parsers: Parser[]) => Parser = (parsers: Parser[]) => {
  return (input: string) => {
    for (const parser of parsers) {
      const result = parser(input);
      if (result.success) {
        return result;
      }
    }
    return failure(`Choice parser: All choices failed on input'`);
  }
}

export const zip: (parser1: Parser, parser2: Parser) => Parser = (parser1, parser2) => (input: string) => {
  const result1 = parser1(input);
  if (result1.success) {
    const result2 = parser2(result1.rest);
    if (result2.success) {
      return success([
        {type: result1.value[0].type, value: result1.value[0].value}, {
          type: result2.value[0].type,
          value: result2.value[0].value
        }], result2.rest);
    } else {
      return result1;
    }
  } else {
    const result2 = parser2(input[1]);
    if (result2.success) {
      return result2;
    }
    return failure(`${result1.reason}. ${result2.reason}`);
  }
}

export function doUntil(parser: Parser): Parser {
  return (input) => {
    const result = parser(input);
    if (result.success && result.rest) {
      const results = result.value;
      for( const rest of result.rest.split('')) {
        const restResult = parser(rest);
        if(restResult.success) {
          results.push(...restResult.value)
        } else {
          return failure(`Choice parser: All choices failed on input'`);
        }
      }
      return success(results, "");
    } else {
      return failure(`Choice parser: All choices failed on input'`);
    }
    return parser(input);
  }
}
