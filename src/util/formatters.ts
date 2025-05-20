export function changeToProperCase(str: string) {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

export function camelCaseToProperCase(str: string, delimiter = "") {
  const words = [];
  let wordStart = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i]! >= "A" && str[i]! <= "Z") {
      words.push(str.slice(wordStart, i));
      wordStart = i;
    }
  }

  words.push(str.slice(wordStart));

  return words.reduce(
    (acc, word) => `${acc} ${changeToProperCase(word)}`,
    delimiter
  );
}

export const escapeRegExp = (str: string) =>
  str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
