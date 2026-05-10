const MINIMAX_API_URL = "https://api.minimaxi.com/v1/text/chatcompletion_v2";
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY ?? "";
const MINIMAX_MODEL = process.env.MINIMAX_MODEL ?? "MiniMax-Text-01";

const TIMEOUT_MS = 20_000;

export type SummaryOptions = {
  title: string;
  url?: string;
  originalSummary?: string;
  category?: string;
  region?: string;
};

export type SummaryResult =
  | { ok: true; summary: string; model: string }
  | { ok: false; error: string };

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

export async function generateAiSummary(opts: SummaryOptions): Promise<SummaryResult> {
  if (!MINIMAX_API_KEY) {
    return { ok: false, error: "MINIMAX_API_KEY not configured" };
  }

  const prompt = buildPrompt(opts);

  try {
    const response = await withTimeout(
      fetch(MINIMAX_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MINIMAX_API_KEY}`,
        },
        body: JSON.stringify({
          model: MINIMAX_MODEL,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      }),
      TIMEOUT_MS
    );

    if (!response.ok) {
      const body = await response.text();
      return { ok: false, error: `API ${response.status}: ${body.slice(0, 100)}` };
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      model?: string;
    };

    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { ok: false, error: "Empty response from model" };
    }

    return {
      ok: true,
      summary: text,
      model: data.model ?? MINIMAX_MODEL,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}

function buildPrompt(opts: SummaryOptions): string {
  const parts: string[] = [
    "你是一个水产行业情报分析师。请根据以下信息，生成一段简洁、结构化的中文情报摘要。",
    "",
    "规则：",
    "1. 摘要长度 100-200 字，突出关键事实、数据和行业意义",
    "2. 使用专业的渔业行业用语",
    "3. 如有具体数据（价格、比例、增长率），务必保留",
    "4. 以客观陈述为主，避免主观臆测",
    "5. 结尾添加一句简要建议或行业影响评估",
    "",
    "---",
    `标题：${opts.title}`,
  ];

  if (opts.url) parts.push(`来源链接：${opts.url}`);
  if (opts.category) parts.push(`分类：${opts.category}`);
  if (opts.region) parts.push(`地区：${opts.region}`);
  if (opts.originalSummary) parts.push(`已有摘要：${opts.originalSummary}`);

  parts.push("---", "", "请生成情报摘要：");

  return parts.join("\n");
}