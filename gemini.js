let cachedClient = null;

const getClient = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.startsWith('replace_with_')) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!cachedClient) {
    const { GoogleGenAI } = await import('@google/genai');
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
};

const extractText = (response) => {
  if (typeof response?.text === 'string') return response.text.trim();
  if (typeof response?.text === 'function') return String(response.text()).trim();
  return '';
};

const generate = async (prompt) => {
  const ai = await getClient();
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    contents: prompt,
  });

  const text = extractText(response);
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
};

const answerQuestion = async (question) =>
  generate(`Answer the following user question clearly and concisely. Do not invent facts.\n\nQuestion: ${question}`);

const generateFaq = async (topic) => {
  const text = await generate(
    `Create one useful FAQ about the topic below. Return ONLY valid JSON with exactly two string fields: "question" and "answer".\n\nTopic: ${topic}`
  );

  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (!parsed.question || !parsed.answer) throw new Error('Gemini response did not contain question and answer');
    return { question: String(parsed.question).trim(), answer: String(parsed.answer).trim() };
  } catch {
    const questionMatch = cleaned.match(/"question"\s*:\s*"([\s\S]*?)"\s*,\s*"answer"\s*:/i);
    if (!questionMatch) throw new Error('Gemini returned invalid FAQ JSON');
    const answerStart = cleaned.indexOf('"answer"', questionMatch.index + questionMatch[0].length);
    const answerValue = answerStart >= 0 ? cleaned.slice(answerStart).replace(/^"answer"\s*:\s*"?/i, '').replace(/"\s*}\s*$/, '') : '';
    if (!answerValue) throw new Error('Gemini returned invalid FAQ JSON');
    return { question: questionMatch[1], answer: answerValue.replace(/\\"/g, '"') };
  }
};

module.exports = { answerQuestion, generateFaq };
