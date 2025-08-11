export interface WisdomFlowerResult {
  I: number;
  II: number;
  III: number;
  IV: number;
  V: number;
  A: number;
  B: number;
  C: number;
  D: number;
  spirit_line: {
    "20_40": number;
    "40_60": number;
    "60_plus": number;
  };
  matter_line: {
    "20_40": number;
    "40_60": number;
    "60_plus": number;
  };
  connection: {
    "20_40": number;
    "40_60": number;
    "60_plus": number;
  };
}

function reduceToTwelve(n: number): number {
  while (n > 12) {
    n = n.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return n;
}

export function calculateWisdomFlower(birthdate: Date): WisdomFlowerResult {
  const d = birthdate.getDate();
  const m = birthdate.getMonth() + 1; // JavaScript months are 0-indexed
  const y = birthdate.getFullYear();

  const I = reduceToTwelve(d);
  const II = m;
  const III = reduceToTwelve(y.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0));

  const IV = reduceToTwelve(I + II + III);
  const V = reduceToTwelve(I + II + III + IV);

  const A = reduceToTwelve(I + V);
  const B = reduceToTwelve(II + V);
  const C = reduceToTwelve(III + V);
  const D = reduceToTwelve(IV + V);

  const spirit_line = {
    "20_40": reduceToTwelve(II + IV),
    "40_60": reduceToTwelve(II + B + D + IV),
    "60_plus": reduceToTwelve(II + B + V + D + IV)
  };

  const matter_line = {
    "20_40": reduceToTwelve(I + III),
    "40_60": reduceToTwelve(I + A + C + III),
    "60_plus": reduceToTwelve(I + A + V + C + III)
  };

  const connection = {
    "20_40": reduceToTwelve(spirit_line["20_40"] + matter_line["20_40"]),
    "40_60": reduceToTwelve(spirit_line["40_60"] + matter_line["40_60"]),
    "60_plus": reduceToTwelve(spirit_line["60_plus"] + matter_line["60_plus"])
  };

  return {
    I, II, III, IV, V, A, B, C, D,
    spirit_line,
    matter_line,
    connection
  };
}