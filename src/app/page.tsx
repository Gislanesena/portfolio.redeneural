"use client";

import React, { useState, useRef, useEffect } from "react";

interface MensagemTerminal {
  autor: "sistema" | "usuario" | "agente";
  texto: string;
}

interface BrainNode3D {
  id?: string;
  label?: string;
  q?: string;
  // Coordenadas 3D originais (-1 a 1)
  ox: number;
  oy: number;
  oz: number;
  // Coordenadas 2D projetadas na tela
  px: number;
  py: number;
  pz: number;
  scale: number;
  g: number;
  b: number;
  color: string;
}

interface BrainEdge {
  a: number;
  b: number;
}

// Nós interativos posicionados na superfície 3D do cérebro
const NOS_INTERATIVOS: Array<{
  id: string;
  label: string;
  q: string;
  ox: number;
  oy: number;
  oz: number;
}> = [
  { id: "Gislane_Sena", label: "Gislane Sena (Core)", q: "Quem é Gislane Sena e qual seu foco profissional?", ox: 0.0, oy: -0.05, oz: 0.68 },
  { id: "Scanner_purple", label: "Scanner_purple", q: "Explique o projeto Scanner_purple e suas funcionalidades de segurança.", ox: -0.58, oy: -0.25, oz: 0.42 },
  { id: "Seguranca_Info", label: "Segurança & AppSec", q: "Quais são os conhecimentos de Segurança da Informação da Gislane?", ox: -0.28, oy: -0.52, oz: 0.35 },
  { id: "Normas_LGPD", label: "ISO 27001 / IEC 62443 / LGPD", q: "Quais normas internacionais e LGPD a Gislane estuda?", ox: 0.25, oy: -0.55, oz: 0.32 },
  { id: "Python_Automacao", label: "Python & Automação", q: "Como a Gislane utiliza Python e automação nos projetos?", ox: -0.55, oy: 0.12, oz: -0.38 },
  { id: "Alerta_Vagas", label: "Alerta de Vagas (IA)", q: "Como funciona a automação de Alerta de Vagas com Groq e Discord?", ox: -0.72, oy: -0.05, oz: 0.15 },
  { id: "SatVantage", label: "SatVantage (Bitcoin IA)", q: "O que é o sistema SatVantage?", ox: 0.55, oy: -0.25, oz: 0.42 },
  { id: "OrbitMatter", label: "OrbitMatter (NASA)", q: "Conte sobre o projeto OrbitMatter do Hackathon da NASA.", ox: 0.72, oy: -0.02, oz: -0.15 },
  { id: "BuildXP", label: "BuildXP (Open Source)", q: "O que é a plataforma open source BuildXP?", ox: 0.52, oy: 0.18, oz: -0.45 },
  { id: "Frontend_React", label: "Frontend & React", q: "Quais tecnologias de Frontend a Gislane domina?", ox: -0.12, oy: 0.28, oz: -0.58 },
  { id: "Lideranca_Voluntaria", label: "Liderança (WoHackers / USP)", q: "Conte sobre a experiência de liderança na WoHackers, Connect Bytes e USP Leste.", ox: 0.22, oy: 0.48, oz: 0.35 },
  { id: "Cloud_DevOps", label: "Cloud (AWS / Azure)", q: "Qual a experiência da Gislane com AWS, Azure e GitHub Actions?", ox: -0.32, oy: 0.38, oz: 0.45 }
];

// Gera malha neural 3D em formato de cérebro (hemisférios + córtex + cerebelo)
function criarRedeCerebral3D() {
  const nodes: BrainNode3D[] = [];
  const edges: BrainEdge[] = [];

  // 1. Adiciona os nós interativos
  NOS_INTERATIVOS.forEach((item, idx) => {
    nodes.push({
      id: item.id,
      label: item.label,
      q: item.q,
      ox: item.ox,
      oy: item.oy,
      oz: item.oz,
      px: 0,
      py: 0,
      pz: 0,
      scale: 1,
      g: 0.4,
      b: item.id === "Gislane_Sena" ? 1 : 0,
      color: idx % 2 === 0 ? "#ffd166" : "#ff7a1a"
    });
  });

  // 2. Gera nós estruturais 3D formando o volume do cérebro
  const totalEstruturais = 140;
  for (let i = 0; i < totalEstruturais; i++) {
    const s1 = Math.sin(i * 12.9898) * 43758.5453;
    const r1 = s1 - Math.floor(s1);
    const s2 = Math.sin(i * 78.233) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 45.164) * 43758.5453;
    const r3 = s3 - Math.floor(s3);

    let ox = 0;
    let oy = 0;
    let oz = 0;

    if (i < 118) {
      // Córtex cerebral 3D (elipsoide com fissura longitudinal entre hemisférios)
      const theta = r1 * Math.PI * 2;
      const phi = Math.acos(2 * r2 - 1);
      const rad = 0.58 + 0.32 * Math.cbrt(r3);

      ox = Math.sin(phi) * Math.cos(theta) * 0.88 * rad;
      oy = Math.cos(phi) * 0.66 * rad - 0.05;
      oz = Math.sin(phi) * Math.sin(theta) * 0.72 * rad;

      // Sulco central (divisão sutil entre hemisfério esquerdo e direito no topo)
      if (oy < 0 && Math.abs(oz) < 0.08) {
        oy += 0.09;
      }
      // Curva frontal/temporal na base
      if (oy > 0.25 && ox < -0.1) {
        oy -= (-ox) * 0.28;
      }
    } else {
      // Cerebelo na base posterior
      const angle = r1 * Math.PI * 2;
      const rad = 0.22 + 0.14 * r2;
      ox = 0.28 + Math.cos(angle) * rad;
      oy = 0.42 + (r3 - 0.3) * 0.22;
      oz = Math.sin(angle) * rad * 1.3;
    }

    const palette = ["#ffd166", "#ff9f1c", "#ff7a1a", "#c77dff"];
    nodes.push({
      ox,
      oy,
      oz,
      px: 0,
      py: 0,
      pz: 0,
      scale: 1,
      g: 0,
      b: 0,
      color: palette[i % palette.length]
    });
  }

  // 3. Conecta neurônios próximos no espaço 3D
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.hypot(
        nodes[i].ox - nodes[j].ox,
        nodes[i].oy - nodes[j].oy,
        nodes[i].oz - nodes[j].oz
      );
      if (dist < 0.33) {
        edges.push({ a: i, b: j });
      }
    }
  }

  return { nodes, edges };
}

export default function PortfolioNeuralOS() {
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [nosAtivos, setNosAtivos] = useState<string[]>(["Gislane_Sena"]);
  const [historico, setHistorico] = useState<MensagemTerminal[]>([
    {
      autor: "sistema",
      texto: "Tudo pronto. Pergunte o que quiser sobre mim.\nAll ready. Ask anything about me."
    }
  ]);

  const logRef = useRef<HTMLDivElement>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement>(null);
  const netCanvasRef = useRef<HTMLCanvasElement>(null);
  const nosAtivosRef = useRef<string[]>(["Gislane_Sena"]);

  useEffect(() => {
    nosAtivosRef.current = nosAtivos;
  }, [nosAtivos]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [historico, carregando]);


  // Função para simular digitação letra por letra no chat
  const digitarResposta = (textoCompleto: string) => {
    let indice = 0;
    // Cria a mensagem vazia da IA primeiro
    setHistorico((prev) => [...prev, { autor: "ia", texto: "" }]);

    const intervalo = setInterval(() => {
      indice += 2; // 2 caracteres por tick (~15ms) deixa a digitação rápida e natural
      const trechoAtual = textoCompleto.slice(0, indice);

      setHistorico((prev) => {
        const copia = [...prev];
        copia[copia.length - 1] = { autor: "ia", texto: trechoAtual };
        return copia;
      });

      if (indice >= textoCompleto.length) {
        clearInterval(intervalo);
      }
    }, 15);
  };

  const enviarPergunta = async (textoPergunta?: string) => {
    const query = (textoPergunta ?? input).trim();
    if (!query || carregando) return;

    setHistorico((prev) => [...prev, { autor: "usuario", texto: query }]);
    setInput("");
    setCarregando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: query })
      });
      const data = await res.json();

      if (Array.isArray(data.nos_relacionados) && data.nos_relacionados.length > 0) {
        setNosAtivos(data.nos_relacionados);
      }

      const textoCompleto = data.resposta_terminal || "Sem resposta do núcleo.";

      // Cria a mensagem vazia do agente para ir preenchendo letra por letra
      setHistorico((prev) => [...prev, { autor: "agente", texto: "" }]);

      await new Promise<void>((resolve) => {
        let indice = 0;
        const intervalo = setInterval(() => {
          indice += 2; // velocidade da digitação (2 caracteres a cada 15ms)
          const trechoAtual = textoCompleto.slice(0, indice);

          setHistorico((prev) => {
            const copia = [...prev];
            copia[copia.length - 1] = {
              autor: "agente",
              texto: trechoAtual
            };
            return copia;
          });

          if (indice >= textoCompleto.length) {
            clearInterval(intervalo);
            resolve();
          }
        }, 15);
      });
    } catch {
      setHistorico((prev) => [
        ...prev,
        {
          autor: "sistema",
          texto: "[ERRO / ERROR]: Falha na conexão com o servidor."
        }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const perguntasSugeridas = [
    {
      label: "Experiência & Liderança",
      query: "Qual é a sua experiência com projetos, liderança e voluntariado?"
    },
    {
      label: "Segurança & Projetos",
      query: "Quais são os seus principais projetos de segurança e automação?"
    },
    {
      label: "Experience & Tech Stack",
      query: "Tell me about your technical stack, leadership roles, and main projects."
    },
    {
      label: "Security & AI Projects",
      query: "What security, automation, and AI projects have you built so far?"
    }
  ];

  // Chuva de Binários (0 e 1) + Cérebro 3D Giratório com Drag & Zoom
  useEffect(() => {
    const rain = rainCanvasRef.current;
    const net = netCanvasRef.current;
    if (!rain || !net) return;

    const rc = rain.getContext("2d");
    const ctx = net.getContext("2d");
    if (!rc || !ctx) return;

    const { nodes, edges } = criarRedeCerebral3D();
    const interactiveNodes = nodes.filter((n) => n.label);
    let pulses: Array<{ e: number; p: number; speed: number }> = [];
    let W = 0;
    let H = 0;
    let cols = 0;
    let drops: number[] = [];
    let hoveredNode: BrainNode3D | null = null;
    let animId = 0;
    let lastRain = 0;
    let lastPulse = 0;
    let prevTime = performance.now();

    // Estado de rotação 3D e zoom
    let rotY = 0.4;
    let rotX = 0.15;
    let zoom = 1.0;
    let isDragging = false;
    let dragMoved = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const resize = () => {
      const rect = net.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      W = rect.width;
      H = rect.height;

      [rain, net].forEach((canvas) => {
        canvas.width = W * dpr;
        canvas.height = H * dpr;
      });

      rc.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.floor(W / 16);
      drops = Array.from({ length: cols }, () => Math.random() * (H / 16));

      rc.fillStyle = "#050202";
      rc.fillRect(0, 0, W, H);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(net);
    resize();

    // Chuva Matrix exclusiva de BINÁRIOS (0 e 1)
    const stepRain = () => {
      rc.fillStyle = "rgba(5, 2, 2, 0.16)";
      rc.fillRect(0, 0, W, H);
      rc.font = "13px monospace";
      for (let i = 0; i < cols; i++) {
        const bit = Math.random() < 0.5 ? "0" : "1";
        const y = drops[i] * 16;
        rc.fillStyle =
          Math.random() < 0.08
            ? "rgba(255, 45, 45, 0.45)"
            : "rgba(255, 122, 26, 0.24)";
        rc.fillText(bit, i * 16, y);
        if (y > H && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += 1;
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(50, now - prevTime);
      prevTime = now;

      if (now - lastRain > 75) {
        stepRain();
        lastRain = now;
      }

      // Rotação automática suave quando o usuário não está arrastando
      if (!isDragging) {
        rotY += dt * 0.00012;
      }

      if (now - lastPulse > 130 && edges.length > 0) {
        const edgeIdx = Math.floor(Math.random() * edges.length);
        pulses.push({ e: edgeIdx, p: 0, speed: 0.8 + Math.random() * 0.8 });
        lastPulse = now;
      }

      // Projeta todas as coordenadas 3D para 2D com perspectiva
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const baseSize = Math.min(W, H) * 0.48 * zoom;
      const fov = 2.6;

      nodes.forEach((n) => {
        // Rotação eixo Y
        const x1 = n.ox * cosY - n.oz * sinY;
        const z1 = n.oz * cosY + n.ox * sinY;
        // Rotação eixo X
        const y2 = n.oy * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.oy * sinX;

        const perspective = fov / (fov + z2);
        n.px = W * 0.5 + x1 * baseSize * perspective;
        n.py = H * 0.5 + y2 * baseSize * perspective;
        n.pz = z2;
        n.scale = perspective;
      });

      ctx.clearRect(0, 0, W, H);

      // 1. Conexões 3D do cérebro
      edges.forEach((edge, idx) => {
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        const aAtivo = a.id && nosAtivosRef.current.includes(a.id);
        const bAtivo = b.id && nosAtivosRef.current.includes(b.id);
        const depthAlpha = Math.max(0.08, Math.min(0.45, ((a.scale + b.scale) * 0.5 - 0.65) * 0.7));

        ctx.beginPath();
        ctx.moveTo(a.px, a.py);
        ctx.lineTo(b.px, b.py);

        if (aAtivo || bAtivo) {
          ctx.strokeStyle = "rgba(255, 209, 102, 0.65)";
          ctx.lineWidth = 1.4;
        } else {
          ctx.strokeStyle =
            idx % 4 === 0
              ? `rgba(180, 130, 255, ${depthAlpha})`
              : `rgba(255, 165, 60, ${depthAlpha})`;
          ctx.lineWidth = 0.85;
        }
        ctx.stroke();
      });

      // 2. Pulsos elétricos viajando nas sinapses 3D
      pulses = pulses.filter((pulse) => {
        pulse.p += (dt / 700) * pulse.speed;
        if (pulse.p >= 1) {
          nodes[edges[pulse.e].b].g = 1;
          return false;
        }
        const a = nodes[edges[pulse.e].a];
        const b = nodes[edges[pulse.e].b];
        const px = a.px + (b.px - a.px) * pulse.p;
        const py = a.py + (b.py - a.py) * pulse.p;
        const pScale = a.scale + (b.scale - a.scale) * pulse.p;

        ctx.shadowColor = "#ffd166";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#fff3b0";
        ctx.beginPath();
        ctx.arc(px, py, 2.0 * pScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        return true;
      });

      // 3. Ordena nós por profundidade (Z) para desenhar os do fundo antes dos da frente
      const sortedNodes = [...nodes].sort((a, b) => b.pz - a.pz);

      sortedNodes.forEach((n) => {
        const isAtivo = Boolean(n.id && nosAtivosRef.current.includes(n.id));
        const isHovered = hoveredNode === n;
        const glow = isAtivo || isHovered ? 1 : Math.max(n.g, n.b);
        const baseRadius = (n.label ? 5.2 : 2.2) * n.scale;
        const radius = Math.max(1.2, baseRadius + glow * (n.label ? 2.6 : 1.2) * n.scale);
        const depthFade = Math.max(0.3, Math.min(1, n.scale * 0.9));

        ctx.shadowColor = isAtivo ? "#ffd166" : n.color;
        ctx.shadowBlur = isAtivo ? 22 : (5 + 14 * glow) * n.scale;
        ctx.fillStyle = isAtivo || glow > 0.5 ? "#fff8d6" : n.color;
        ctx.globalAlpha = (n.label ? 0.95 : 0.65 + 0.35 * glow) * depthFade;

        ctx.beginPath();
        ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
        ctx.fill();

        if (isAtivo) {
          ctx.strokeStyle = "rgba(255, 209, 102, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(n.px, n.py, radius + 5 * n.scale, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        n.g = Math.max(0, n.g - dt / 500);
        n.b = Math.max(0, n.b - dt / 1200);
      });

      // 4. Tooltip ao passar o cursor sobre um nó
      if (hoveredNode && hoveredNode.label) {
        ctx.font = "13px monospace";
        const text = hoveredNode.label;
        const pad = 10;
        const w = ctx.measureText(text).width + pad * 2;
        const h = 26;
        const tx = Math.max(8, Math.min(W - w - 8, hoveredNode.px - w / 2));
        const ty = Math.max(8, hoveredNode.py - 36);

        ctx.fillStyle = "rgba(16, 8, 6, 0.94)";
        ctx.strokeStyle = "#ff7a1a";
        ctx.lineWidth = 1;
        ctx.fillRect(tx, ty, w, h);
        ctx.strokeRect(tx, ty, w, h);

        ctx.fillStyle = "#ffd9b8";
        ctx.textBaseline = "middle";
        ctx.fillText(text, tx + pad, ty + h / 2);
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const findNode = (clientX: number, clientY: number) => {
      const rect = net.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      // Prioriza nós mais próximos da câmera (menor pz)
      const candidates = interactiveNodes
        .filter((n) => Math.hypot(n.px - mx, n.py - my) < 22)
        .sort((a, b) => a.pz - b.pz);
      return candidates[0] || null;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragMoved = false;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      net.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        if (Math.hypot(dx, dy) > 3) dragMoved = true;
        rotY += dx * 0.007;
        rotX = Math.max(-1.2, Math.min(1.2, rotX + dy * 0.007));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        hoveredNode = null;
        return;
      }

      const found = findNode(e.clientX, e.clientY);
      hoveredNode = found;
      net.style.cursor = found ? "pointer" : "grab";
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasClick = !dragMoved;
      isDragging = false;
      const found = findNode(e.clientX, e.clientY);
      net.style.cursor = found ? "pointer" : "grab";

      if (wasClick && found && found.q && found.id) {
        found.b = 1;
        setNosAtivos([found.id]);
        enviarPergunta(found.q);
      }
    };

    const onPointerLeave = () => {
      isDragging = false;
      hoveredNode = null;
    };

    // Scroll do mouse para aumentar e diminuir o zoom do cérebro
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      zoom = Math.max(0.55, Math.min(2.1, zoom + delta));
    };

    net.addEventListener("pointerdown", onPointerDown);
    net.addEventListener("pointermove", onPointerMove);
    net.addEventListener("pointerup", onPointerUp);
    net.addEventListener("pointerleave", onPointerLeave);
    net.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      net.removeEventListener("pointerdown", onPointerDown);
      net.removeEventListener("pointermove", onPointerMove);
      net.removeEventListener("pointerup", onPointerUp);
      net.removeEventListener("pointerleave", onPointerLeave);
      net.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <main className="max-w-[1240px] mx-auto px-4 pt-5 pb-10 grid grid-cols-1 lg:grid-cols-[410px_1fr] gap-4 min-h-screen items-stretch">
      {/* PAINEL ESQUERDO: TERMINAL DE COMANDO */}
      <section
        aria-label="Terminal"
        className="bg-[#100806] border border-[#5a1d0e] rounded-md flex flex-col h-[590px] shadow-[0_0_28px_rgba(255,70,20,0.12)]"
      >
        <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[#5a1d0e] text-[#ff7a1a] text-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff2d2d] shadow-[0_0_8px_#ff2d2d] animate-pulse" />
          <span>GIS-OS v3 · Gemini 2.5 Flash online</span>
        </div>

        {/* Perguntas sugeridas em Português e Inglês */}
        <div className="flex flex-wrap gap-1.5 px-3.5 pt-2.5">
          {perguntasSugeridas.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => enviarPergunta(item.query)}
              disabled={carregando}
              className="text-xs bg-transparent text-[#ff7a1a] border border-[#5a1d0e] rounded px-2.5 py-1 hover:border-[#ff7a1a] hover:shadow-[0_0_10px_rgba(255,122,26,0.35)] transition cursor-pointer disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Histórico de mensagens */}
        <div
          ref={logRef}
          aria-live="polite"
          className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-3 text-[14.5px] leading-relaxed"
        >
          {historico.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.autor === "usuario"
                  ? "whitespace-pre-wrap pl-3 border-l-2 border-[#ff2d2d] text-[#a8643c] before:content-['$_']"
                  : "whitespace-pre-wrap pl-3 border-l-2 border-[#ff7a1a] text-[#ffd9b8]"
              }
            >
              {msg.texto}
            </div>
          ))}
          {carregando && (
            <div className="pl-3 border-l-2 border-[#ff7a1a] text-[#ff7a1a] animate-pulse text-xs">
              processando / processing…
            </div>
          )}
        </div>

        {/* Input de pergunta */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarPergunta();
          }}
          className="flex gap-2 px-3.5 py-3 border-t border-[#5a1d0e] focus-within:shadow-[inset_0_-2px_0_#ff7a1a]"
        >
          <span className="text-[#ff7a1a]">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo ou cole uma vaga / Ask anything..."
            aria-label="Sua pergunta"
            className="flex-1 min-w-0 bg-transparent border-0 text-[#ffd9b8] placeholder-[#a8643c]/60 focus:outline-none caret-[#ff7a1a] text-sm"
          />
          <button
            type="submit"
            disabled={carregando}
            className="bg-[#ff7a1a] text-[#1a0800] font-bold rounded px-3.5 py-1 text-sm hover:brightness-110 transition cursor-pointer disabled:opacity-50"
          >
            Executar
          </button>
        </form>
      </section>

      {/* PAINEL DIREITO: REDE NEURAL CEREBRAL 3D + CHUVA DE BINÁRIOS */}
      <section className="relative min-h-[480px] lg:h-[590px] border border-[#5a1d0e] rounded-md overflow-hidden bg-[#050202] shadow-[0_0_28px_rgba(255,45,45,0.12)]">
        <canvas
          ref={rainCanvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full block"
        />
        <canvas
          ref={netCanvasRef}
          tabIndex={0}
          aria-label="Rede neural 3D dos projetos: arraste para girar, use o scroll para zoom ou toque num nó"
          className="absolute inset-0 w-full h-full block cursor-grab"
        />
        <div className="absolute left-3.5 bottom-2.5 text-[#a8643c] text-xs pointer-events-none bg-[#050202]/75 px-2.5 py-1 rounded">
          arraste para girar · scroll para zoom · clique num nó / drag to rotate · scroll to zoom
        </div>
      </section>
    </main>
  );
}