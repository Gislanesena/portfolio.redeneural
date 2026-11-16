import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { NextResponse } from "next/server";
import { DADOS_PERFIL } from "@/data/perfil";

function detectarNosRelacionados(texto: string): string[] {
  const t = texto.toLowerCase();
  const mapaPalavras: Record<string, string[]> = {
    Scanner_purple: ["scanner", "purple", "varredura", "recon"],
    Seguranca_Info: ["segurança", "security", "appsec", "vulnerabilidade", "criptografia", "ofensiva", "defensiva"],
    Normas_LGPD: ["iso", "27001", "27002", "62443", "iec", "lgpd", "conformidade", "norma"],
    Python_Automacao: ["python", "automação", "automações", "script", "bot"],
    Alerta_Vagas: ["vaga", "vagas", "discord", "groq", "alerta"],
    SatVantage: ["satvantage", "bitcoin", "btc"],
    OrbitMatter: ["orbitmatter", "nasa", "hackathon"],
    BuildXP: ["buildxp", "open source", "xp"],
    Frontend_React: ["html", "css", "javascript", "front-end", "frontend", "react", "next"],
    Lideranca_Voluntaria: ["wohackers", "connect bytes", "usp", "liderança", "voluntário", "voluntariado"],
    Cloud_DevOps: ["cloud", "aws", "azure", "github actions", "devops"]
  };

  const encontrados: string[] = [];
  for (const [nodeId, palavras] of Object.entries(mapaPalavras)) {
    if (palavras.some((p) => t.includes(p))) {
      encontrados.push(nodeId);
    }
  }

  return encontrados.length > 0 ? encontrados.slice(0, 4) : ["Gislane_Sena"];
}

async function obterModeloChatGroq(apiKey: string): Promise<string> {
  try {
    const res = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!res.ok) return "llama-3.1-8b-instant";

    const data = await res.json();
    const ids: string[] = (data?.data || [])
      .map((m: { id: string }) => m.id)
      .filter(
        (id: string) =>
          !id.includes("whisper") &&
          !id.includes("guard") &&
          !id.includes("tts") &&
          !id.includes("embed") &&
          !id.includes("orpheus") &&
          !id.includes("canopylabs") &&
          !id.includes("playai")
      );

    const preferidos = [
      "llama-3.1-8b-instant",
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "meta-llama/llama-4-maverick-17b-128e-instruct",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3-32b"
    ];

    for (const p of preferidos) {
      if (ids.includes(p)) return p;
    }

    return ids[0] || "llama-3.1-8b-instant";
  } catch {
    return "llama-3.1-8b-instant";
  }
}

export async function POST(req: Request) {
  try {
    const { mensagem } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          resposta_terminal: "[ERRO]: GROQ_API_KEY não encontrada no arquivo .env.local.",
          nos_relacionados: ["Gislane_Sena"]
        },
        { status: 500 }
      );
    }

    const modeloEscolhido = await obterModeloChatGroq(apiKey);

    const systemPrompt = `
Você é a própria Gislane Sena conversando diretamente no chat do seu portfólio profissional interativo.

BLOQUEIO ESTRITO DE ESCOPO (REGRA MAIS IMPORTANTE):
- Você SÓ pode responder perguntas relacionadas a VOCÊ (Gislane Sena), sua trajetória acadêmica em ADS, sua carreira, suas habilidades técnicas, suas motivações na área de tecnologia/segurança, seus projetos (Scanner_purple, Alerta de Vagas, SatVantage, OrbitMatter, BuildXP, Sala de Crise) e suas atuações em comunidades/liderança (WoHackers, Banca da Ciência USP Leste, Connect Bytes).
- Se o visitante perguntar sobre QUALQUER assunto fora do seu escopo profissional e técnico (ex: receitas de culinária como brownie, futebol, piadas, conselhos pessoais, clima, ou pedir para você resolver tarefas/códigos genéricos que não sejam sobre os seus projetos), NÃO responda o assunto externo.
- Em vez disso, recuse de forma leve, educada e em primeira pessoa em no máximo 2 linhas, redirecionando a conversa para o seu portfólio (ex: "Essa parte eu deixo fora do terminal! Aqui eu consigo te contar sobre meus projetos em Python, Segurança da Informação ou minha base em desenvolvimento web. Sobre qual desses pontos você quer saber mais?").

REGRAS DE CONVERSA E HONESTIDADE TÉCNICA:
1. PRIMEIRA PESSOA SEMPRE: Fale como "eu" ("Eu trabalho...", "Nos meus projetos eu uso..."). Nunca fale de você mesma na terceira pessoa.
2. SEGUNDA PESSOA COM O VISITANTE: Trate quem pergunta como "você".
3. HONESTIDADE SOBRE SUA STACK: No front-end, sua base principal e mais frequente é HTML, CSS e JavaScript. Você usa React e Next.js apenas de forma pontual, nunca os venda como sua especialidade principal.
4. RESPOSTA DIRETA E COERENTE: Responda exatamente ao que foi perguntado dentro do seu escopo, explicando o porquê e o contexto real em vez de recitar uma lista genérica do currículo.
5. FIDELIDADE AOS DADOS: Baseie-se exclusivamente em DADOS_PERFIL. Nunca invente experiências, cargos, gostos pessoais ou ferramentas que não estão lá.
6. IDIOMA DINÂMICO: Responda no mesmo idioma da mensagem do visitante (Português ou Inglês).
7. RESPOSTA CONCISA DE CHAT: Responda em 1 ou 2 parágrafos curtos e diretos (no máximo 4 a 6 linhas no total).

SEUS DADOS REAIS (DADOS_PERFIL):
${JSON.stringify(DADOS_PERFIL)}
    `;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: modeloEscolhido,
          temperature: 0.15,
          max_tokens: 450,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: mensagem }
          ]
        })
      });

      clearTimeout(timeoutId);
      const rawData = await res.json();

      if (!res.ok) {
        console.error(`Erro HTTP Groq (${modeloEscolhido}):`, res.status, JSON.stringify(rawData));
        return NextResponse.json(
          {
            resposta_terminal: `[ERRO GROQ ${res.status}]: ${rawData?.error?.message || "Falha na API"}`,
            nos_relacionados: ["Gislane_Sena"]
          },
          { status: 500 }
        );
      }

      const respostaTexto = (
        rawData?.choices?.[0]?.message?.content || ""
      ).trim();

      return NextResponse.json({
        resposta_terminal: respostaTexto || "Não consegui gerar uma resposta agora.",
        nos_relacionados: detectarNosRelacionados(respostaTexto)
      });
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error("Erro na requisição Groq:", error);
    return NextResponse.json(
      {
        resposta_terminal:
          "[ERRO DE SISTEMA]: Falha ao consultar o motor de IA. Tente novamente.",
        nos_relacionados: ["Gislane_Sena"]
      },
      { status: 500 }
    );
  }
}