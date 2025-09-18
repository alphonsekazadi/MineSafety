const reComment = /\/\*[\s\S]*?\*\//g;
/*
([^\s:;]+?)\s*:\s*         # Property name and colon
(
  (?:
    (?:                    # Begin alternation
      url\(                # Match 'url('
        \s*
        (?:
          (?:[^"')\\]|\\.)*  # Content inside url(), excluding quotes and closing parenthesis
          |
          "(?:[^"\\]|\\.)*"  # Double-quoted strings, handling escaped characters
          |
          '(?:[^'\\]|\\.)*'  # Single-quoted strings, handling escaped characters
        )
        \s*
      \)
      |
      "(?:[^"\\]|\\.)*"     # Double-quoted strings, handling escaped characters
      |
      '(?:[^'\\]|\\.)*'     # Single-quoted strings, handling escaped characters
      |
      [^;"']                # Any character except ';', double or single quotes
    )*?                     # Repeat zero or more times, non-greedy
    \s*
  )
)
(?=;|$)                     # Lookahead for ';' or end of string
*/
const reDeclaration = /([^\s:;]+?)\s*:\s*((?:(?:url\(\s*(?:(?:[^"')\\]|\\.)*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^;"'])*?)\s*)(?=;|$)/gi;
const reDoubleQuoted = /&quot;|&#34;|&#x22;/gi;
const reSingleQuoted = /&apos;|&#39;|&#x27;/gi;
const doubleQuote = '"';
const singleQuote = "'";
const empty = '';
function replaceQuoteEntities(str) {
    return str.replace(reDoubleQuoted, doubleQuote)
        .replace(reSingleQuoted, singleQuote);
}
/**
 * Parse inline styles string into object.
 *
 * @param styleString - inline styles string
 * @returns object with styles
 */
export function parseInlineStyles(styleString) {
    const styleObject = {};
    const input = replaceQuoteEntities((styleString || empty).replace(reComment, empty));
    let match = reDeclaration.exec(input), property, value;
    while (match !== null) {
        property = match[1].trim();
        value = match[2].trim();
        styleObject[property] = value;
        match = reDeclaration.exec(input);
    }
    return styleObject;
}
