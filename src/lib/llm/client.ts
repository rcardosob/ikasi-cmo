/**
 * Cliente LLM para la generación de copies de la Creative Area.
 *
 * Nivel 1 (principal): DeepSeek (API compatible con OpenAI, chat/completions).
 * Nivel 2 (fallback):   OpenAI GPT-5.6 Luna (Responses API), modelo económico.
 *
 * Ambos lanzan una excepción ante cualquier fallo; el caller decide cómo degradar.
 */

export interface LLMResult {
  provider: 'deepseek' | 'openai';
  text: string;
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

interface ResponsesOutputItem {
  type?: string;
  content?: { type?: string; text?: string }[];
}

interface ResponsesResponse {
  output?: ResponsesOutputItem[];
  error?: { message?: string };
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object') {
    const err = (payload as { error?: { message?: string } }).error;
    if (err?.message) return err.message;
  }
  return fallback;
}

/**
 * Nivel 1: DeepSeek vía chat/completions (formato OpenAI).
 */
export async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<LLMResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY no está configurada en el entorno.');
  }

  const baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1800,
      thinking: { type: 'disabled' },
    }),
  });

  const raw = await response.text();
  let json: ChatCompletionResponse | null = null;
  try {
    json = JSON.parse(raw) as ChatCompletionResponse;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(
      `DeepSeek HTTP ${response.status}: ${extractErrorMessage(json, raw.slice(0, 300))}`
    );
  }

  const text = json?.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('DeepSeek respondió sin contenido de texto.');
  }

  return { provider: 'deepseek', text };
}

/**
 * Nivel 2 (fallback): OpenAI GPT-5.6 Luna vía Responses API.
 */
export async function callOpenAILuna(systemPrompt: string, userPrompt: string): Promise<LLMResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no está configurada en el entorno.');
  }

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_FALLBACK_MODEL || 'gpt-5.6-luna';

  const response = await fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: systemPrompt,
      input: userPrompt,
      reasoning: { effort: 'low' },
      max_output_tokens: 1800,
      store: false,
    }),
  });

  const raw = await response.text();
  let json: ResponsesResponse | null = null;
  try {
    json = JSON.parse(raw) as ResponsesResponse;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(
      `OpenAI HTTP ${response.status}: ${extractErrorMessage(json, raw.slice(0, 300))}`
    );
  }

  const text = json?.output
    ?.filter((item) => item.type === 'message')
    .flatMap((item) => item.content ?? [])
    .filter((c) => c.type === 'output_text' && c.text)
    .map((c) => c.text as string)
    .join('')
    .trim();

  if (!text) {
    throw new Error('OpenAI respondió sin contenido de texto.');
  }

  return { provider: 'openai', text };
}
