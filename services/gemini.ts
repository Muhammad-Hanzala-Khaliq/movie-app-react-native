export const getMovieSuggestion = async (prompt: string): Promise<string> => {
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAXbBI9Qc7-XgVAKYazr2ARbi1PBI67OGQ',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();
  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestion found.';

  const cleanedLines = rawText
    .split('\n')
    .map(line =>
      line
        .replace(/^[\*\-\•]+\s*/, '')         // remove bullet symbols
        .replace(/\*\*(.*?)\*\*/g, '$1')      // remove bold
        .trim()
    )
    .filter(Boolean); // remove empty lines

  // Add numbering only to movie lines (having ":")
  let counter = 1;
  const numberedText = cleanedLines
    .map(line => {
      if (line.includes(':')) {
        return `${counter++}. ${line}`;
      }
      return line; // return headings or others as-is
    })
    .join('\n');

  return numberedText;
};
