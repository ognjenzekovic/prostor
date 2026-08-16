/**
 * Serbian Latin -> Cyrillic transliteration.
 *
 * Serbian UI copy is authored in Latin only; Cyrillic is produced at render
 * time (spec 4.7), so there is never a second set of translations per script.
 *
 * The function is idempotent: Cyrillic input passes through untouched, because
 * only Latin letters exist in the maps. Text that is already Cyrillic (lesson
 * titles typed by an admin, for example) therefore stays as it is.
 */

/** Two-letter Latin sequences that map to a single Cyrillic letter. */
const DIGRAPHS: Record<string, string> = {
  nj: 'њ',
  Nj: 'Њ',
  NJ: 'Њ',
  lj: 'љ',
  Lj: 'Љ',
  LJ: 'Љ',
  dž: 'џ',
  Dž: 'Џ',
  DŽ: 'Џ',
};

/** Single Latin letters. Letters absent here (q, w, x, y, digits) pass through. */
const LETTERS: Record<string, string> = {
  a: 'а', b: 'б', c: 'ц', č: 'ч', ć: 'ћ', d: 'д', đ: 'ђ', e: 'е', f: 'ф',
  g: 'г', h: 'х', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о',
  p: 'п', r: 'р', s: 'с', š: 'ш', t: 'т', u: 'у', v: 'в', z: 'з', ž: 'ж',
  A: 'А', B: 'Б', C: 'Ц', Č: 'Ч', Ć: 'Ћ', D: 'Д', Đ: 'Ђ', E: 'Е', F: 'Ф',
  G: 'Г', H: 'Х', I: 'И', J: 'Ј', K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О',
  P: 'П', R: 'Р', S: 'С', Š: 'Ш', T: 'Т', U: 'У', V: 'В', Z: 'З', Ž: 'Ж',
};

/**
 * Converts Serbian Latin text to Cyrillic.
 *
 * TODO: words where n+j / l+j / d+ž are separate sounds ("injekcija",
 * "nadživeti", "konjunkcija") transliterate wrongly and need an exception
 * list. Not a problem for UI strings we author ourselves.
 *
 * @param text - Serbian Latin text (may already contain Cyrillic)
 * @returns Same text in Cyrillic script
 */
export function toCyrillic(text: string): string {
  let out = '';

  for (let i = 0; i < text.length; i += 1) {
    const digraph = DIGRAPHS[text.slice(i, i + 2)];

    if (digraph) {
      out += digraph;
      i += 1;
      continue;
    }

    out += LETTERS[text[i]] ?? text[i];
  }

  return out;
}
