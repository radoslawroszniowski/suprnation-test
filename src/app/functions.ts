export function sumInts(a: number, b: number): number {
  return ((a > b) ? 0 : a + sumInts(a + 1, b));
}

export function sumSquares(a: number, b: number): number {
  return (a > b) ? 0 : a * a + sumSquares(a + 1, b);
}

export function sumCubes(a: number, b: number): number {
  return (a > b) ? 0 : a * a * a + sumCubes(a + 1, b);
}

export function sumFactorial(a: number, b: number): number {
  return (a > b) ? 0 : factorial(a) + sumFactorial(a + 1, b);
}

export function factorial(a: number): number {
  return a <= 1 ? 1 : a * factorial(a - 1);
}

export const sumMap: (mapFn: (value: number) => number) => (a: number, b: number) => number = (mapFn) => {
  return (a, b) => {
    if (a > b) {
      return 0;
    }
    return mapFn(a) + sumMap(mapFn)(a + 1, b);
  };
};

export const sumInts2 = sumMap(x => x);
export const sumSquares2 = sumMap(x => x * x);
export const sumCubes2 = sumMap(x => x * x * x);
export const sumFactorial2 = sumMap(x => factorial(x));

export function prodInts(a: number, b: number): number {
  return (a > b) ? 1 : a * prodInts(a + 1, b);
}

export function prodSquares(a: number, b: number): number {
  return (a > b) ? 1 : a * a * prodSquares(a + 1, b);
}

export function prodCubes(a: number, b: number): number {
  return (a > b) ? 1 : a * a * a * prodCubes(a + 1, b);
}

export function prodFactorial(a: number, b: number): number {
  return (a > b) ? 1 : factorial(a) * prodFactorial(a + 1, b);
}

export const prodMap: (mapFn: (value: number) => number) => (a: number, b: number) => number = (mapFn) => {
  return (a, b) => {
    if (a > b) {
      return 1;
    }
    return mapFn(a) * prodMap(mapFn)(a + 1, b);
  };
};

export const prodInts2 = prodMap(x => x);
export const prodSquares2 = prodMap(x => x * x);
export const prodCubes2 = prodMap(x => x * x * x);
export const prodFactorial2 = prodMap(x => factorial(x));

export const mapReduce: (
  mapFn: (value: number) => number,
  reduceFn: (first: number, second: number) => number,
  zero: number
) => (a: number, b: number) => number = (mapFn, reduceFn, zero) => {
  return (a, b) => {
    return mapFn(reduceFn(a, b));
  }
}

export const mapReduce2:
  (reduceFn: (first: number, second: number) => number,
   zero: number) =>
    (mapFn: (value: number) => number) => (a: number, b: number) =>
      number = (reduceFn, zero: number) => {
  return (mapFn) => {
    return (a: number, b: number) => {
      return mapFn(reduceFn(a, b));
    }
  }
}

export const sumMap2 = mapReduce2(sumInts2,0);
export const prodMap2 = mapReduce2(prodInts2, 0)
