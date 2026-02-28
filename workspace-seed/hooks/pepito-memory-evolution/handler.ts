import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

type HookEvent = {
  type: string;
  action: string;
  sessionKey: string;
  context: Record<string, unknown>;
  timestamp: Date;
};

const PERSONA = "pepito";
const STATE_DIR = path.join(os.homedir(), ".openclaw");
const CONFIG_PATH = path.join(STATE_DIR, "openclaw.json");
const DEFAULT_WORKSPACE = path.join(STATE_DIR, "workspace");

function resolveUserPath(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("~/")) {
    return path.join(os.homedir(), trimmed.slice(2));
  }
  return trimmed;
}

async function readJson(filePath: string): Promise<Record<string, unknown> | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function extractAgentId(sessionKey: string): string | null {
  const match = /^agent:([^:]+):/.exec(sessionKey.trim());
  return match?.[1] ?? null;
}

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

async function resolveWorkspaceDir(sessionKey: string): Promise<string> {
  const cfg = await readJson(CONFIG_PATH);
  if (!cfg) {
    return DEFAULT_WORKSPACE;
  }

  const agents = asObject(cfg.agents);
  const defaults = asObject(agents?.defaults);
  const defaultWorkspace = typeof defaults?.workspace === "string" ? defaults.workspace : "";
  const agentId = extractAgentId(sessionKey);

  if (agentId) {
    const list = Array.isArray(agents?.list) ? agents?.list : [];
    for (const entry of list) {
      const obj = asObject(entry);
      if (!obj) continue;
      if (String(obj.id ?? "").trim() !== agentId) continue;
      const workspace = typeof obj.workspace === "string" ? obj.workspace.trim() : "";
      if (workspace) {
        return resolveUserPath(workspace);
      }
    }
  }

  if (defaultWorkspace.trim()) {
    return resolveUserPath(defaultWorkspace);
  }

  return DEFAULT_WORKSPACE;
}

function toDateParts(input: Date): { day: string; time: string; iso: string } {
  const iso = input.toISOString();
  return {
    day: iso.slice(0, 10),
    time: iso.slice(11, 19),
    iso,
  };
}

function cleanText(raw: unknown, maxLen: number): string {
  const text = typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "";
  if (!text) return "";
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
}

async function appendBlock(filePath: string, block: string): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, block, "utf-8");
}

async function appendUniqueLine(params: {
  filePath: string;
  section: string;
  line: string;
}): Promise<void> {
  const { filePath, section, line } = params;
  const normalizedLine = line.trim();
  if (!normalizedLine) return;

  let content = "";
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    content = "";
  }

  if (content.includes(normalizedLine)) {
    return;
  }

  if (!content.trim()) {
    content = `# ${path.basename(filePath)}\n`;
  }

  if (!content.includes(section)) {
    content = `${content.trimEnd()}\n\n${section}\n`;
  }

  content = `${content.trimEnd()}\n- ${normalizedLine}\n`;
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf-8");
}

function extractFacts(text: string): string[] {
  const facts = new Set<string>();

  const patterns: Array<{ re: RegExp; label: string }> = [
    { re: /\b(me llamo|mi nombre es)\s+([a-zA-ZÀ-ÿ'\- ]{2,40})/i, label: "Nombre" },
    { re: /\b(my name is|i am)\s+([a-zA-Z'\- ]{2,40})/i, label: "Name" },
    { re: /\bquiero\s+([^.!?]{4,120})/i, label: "Meta" },
    { re: /\b(i want to|i want)\s+([^.!?]{4,120})/i, label: "Goal" },
    { re: /\bproyecto[s]?\s*[:\-]?\s*([^.!?\n]{4,120})/i, label: "Proyecto" },
    { re: /\b(project|projects)\s*[:\-]?\s*([^.!?\n]{4,120})/i, label: "Project" },
  ];

  for (const { re, label } of patterns) {
    const match = re.exec(text);
    if (!match) continue;
    const value = cleanText(match[2] ?? match[1], 120);
    if (!value) continue;
    facts.add(`${label}: ${value}`);
  }

  return Array.from(facts);
}

function extractProjects(text: string): string[] {
  const projects = new Set<string>();
  const patterns = [
    /\bproyecto[:\s-]+([^.!?\n]{3,100})/gi,
    /\bproject[:\s-]+([^.!?\n]{3,100})/gi,
  ];

  for (const re of patterns) {
    for (const match of text.matchAll(re)) {
      const candidate = cleanText(match[1], 100);
      if (!candidate) continue;
      projects.add(candidate);
    }
  }
  return Array.from(projects);
}

function extractActions(text: string): string[] {
  const actions = new Set<string>();
  const patterns = [
    /\b(tengo que|debo|necesito)\s+([^.!?\n]{4,120})/gi,
    /\b(i have to|i need to|remind me to)\s+([^.!?\n]{4,120})/gi,
  ];
  for (const re of patterns) {
    for (const match of text.matchAll(re)) {
      const candidate = cleanText(match[2], 120);
      if (!candidate) continue;
      actions.add(candidate);
    }
  }
  return Array.from(actions);
}

function scoreAssistantReply(text: string): { score: number; generic: boolean; reasons: string[] } {
  const normalized = text.toLowerCase();
  let score = 0;
  const reasons: string[] = [];

  if (text.length >= 180) {
    score += 1;
  } else {
    reasons.push("too-short");
  }

  if (
    /prioridades|priorities|bloque|focus block|riesgo|risk|check-in|follow-up|next step|siguiente paso/i.test(
      text,
    )
  ) {
    score += 1;
  } else {
    reasons.push("missing-operational-structure");
  }

  if (/\b\d{1,2}(:\d{2})?\s?(am|pm)?\b|hoy|today|mañana|tomorrow|semana|week/i.test(text)) {
    score += 1;
  } else {
    reasons.push("missing-time-anchor");
  }

  const genericPatterns = [
    /av[ií]same si necesitas/i,
    /let me know if you need anything/i,
    /c[oó]mo est[aá]s\??/i,
    /how are you\??/i,
    /todo bien\??/i,
  ];
  if (genericPatterns.some((re) => re.test(normalized))) {
    score -= 1;
    reasons.push("generic-phrase");
  }

  return { score, generic: score <= 0, reasons };
}

async function handleMessageReceived(event: HookEvent): Promise<void> {
  const workspaceDir = await resolveWorkspaceDir(event.sessionKey);
  const baseMemoryDir = path.join(workspaceDir, "memory", PERSONA);
  const dailyDir = path.join(baseMemoryDir, "daily");
  const inboxPath = path.join(baseMemoryDir, "inbox.md");
  const userPath = path.join(workspaceDir, "USER.md");
  const memoryPath = path.join(workspaceDir, "MEMORY.md");
  const goalsPath = path.join(workspaceDir, "memory", PERSONA, "goals.md");
  const nextActionsPath = path.join(workspaceDir, "memory", PERSONA, "next-actions.md");

  const timestamp = toDateParts(new Date(event.timestamp));
  const from = cleanText(event.context.from, 80) || "unknown";
  const channel = cleanText(event.context.channelId, 40) || "unknown";
  const content = cleanText(event.context.content, 1200);
  if (!content) return;

  const dailyPath = path.join(dailyDir, `${timestamp.day}.md`);
  await appendBlock(
    dailyPath,
    `\n## ${timestamp.time} received\n- from: ${from}\n- channel: ${channel}\n- text: ${content}\n`,
  );
  await appendBlock(
    inboxPath,
    `\n- [${timestamp.iso}] (${channel}) ${from}: ${content}\n`,
  );

  const facts = extractFacts(content);
  for (const fact of facts) {
    await appendUniqueLine({
      filePath: userPath,
      section: "## Extracted Facts (auto)",
      line: `[${timestamp.day}] ${fact}`,
    });
    await appendUniqueLine({
      filePath: memoryPath,
      section: "## Auto Captured Signals",
      line: `[${timestamp.day}] ${fact}`,
    });
  }

  const projects = extractProjects(content);
  for (const project of projects) {
    await appendUniqueLine({
      filePath: goalsPath,
      section: "## Project Registry (auto)",
      line: `[ ] ${project} | estado:active | próxima acción: definir siguiente paso`,
    });
  }

  const actions = extractActions(content);
  for (const action of actions) {
    await appendUniqueLine({
      filePath: nextActionsPath,
      section: "## Today",
      line: `[ ] ${action} | src:auto | fecha:${timestamp.day}`,
    });
  }
}

async function handleMessageSent(event: HookEvent): Promise<void> {
  const success = Boolean(event.context.success);
  if (!success) return;

  const workspaceDir = await resolveWorkspaceDir(event.sessionKey);
  const dailyDir = path.join(workspaceDir, "memory", PERSONA, "daily");
  const timestamp = toDateParts(new Date(event.timestamp));
  const to = cleanText(event.context.to, 80) || "unknown";
  const channel = cleanText(event.context.channelId, 40) || "unknown";
  const content = cleanText(event.context.content, 1200);
  if (!content) return;

  const dailyPath = path.join(dailyDir, `${timestamp.day}.md`);
  await appendBlock(
    dailyPath,
    `\n## ${timestamp.time} sent\n- to: ${to}\n- channel: ${channel}\n- text: ${content}\n`,
  );

  const qualityLogPath = path.join(workspaceDir, "memory", PERSONA, "quality-log.md");
  const regressionsPath = path.join(workspaceDir, "REGRESSIONS.md");
  const quality = scoreAssistantReply(content);
  await appendBlock(
    qualityLogPath,
    `\n- [${timestamp.iso}] score=${quality.score} generic=${quality.generic} reasons=${quality.reasons.join(
      ",",
    ) || "ok"}\n`,
  );

  if (quality.generic) {
    await appendUniqueLine({
      filePath: regressionsPath,
      section: "## Auto Quality Alerts",
      line: `[${timestamp.day}] Evitar respuesta genérica. Reescribir con formato operativo (prioridades, bloque, riesgo, seguimiento).`,
    });
  }
}

async function handleSessionMarker(event: HookEvent): Promise<void> {
  const workspaceDir = await resolveWorkspaceDir(event.sessionKey);
  const dailyDir = path.join(workspaceDir, "memory", PERSONA, "daily");
  const timestamp = toDateParts(new Date(event.timestamp));
  const dailyPath = path.join(dailyDir, `${timestamp.day}.md`);
  await appendBlock(
    dailyPath,
    `\n## ${timestamp.time} ${event.action}\n- session: ${event.sessionKey}\n`,
  );
}

export default async function pepitoMemoryEvolutionHook(event: HookEvent): Promise<void> {
  if (event.type === "message" && event.action === "received") {
    await handleMessageReceived(event);
    return;
  }
  if (event.type === "message" && event.action === "sent") {
    await handleMessageSent(event);
    return;
  }
  if (event.type === "command" && (event.action === "new" || event.action === "reset")) {
    await handleSessionMarker(event);
  }
}
