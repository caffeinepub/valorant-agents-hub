import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Role = "Duelist" | "Sentinel" | "Initiator" | "Controller";

interface Ability {
  icon: string;
  name: string;
}

interface Agent {
  id: string;
  name: string;
  role: Role;
  description: string;
  abilities: Ability[];
  tagline: string;
}

interface ChatMessage {
  role: "ai" | "user";
  text: string;
  ts: string;
}

interface PricingTier {
  id: string;
  name: string;
  price: string;
  color: "silver" | "diamond" | "radiant";
  features: string[];
  popular?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const agents: Agent[] = [
  {
    id: "jett",
    name: "JETT",
    role: "Duelist",
    description:
      "Agile Korean duelist who uses wind abilities to dash, ascend, and eliminate with deadly precision.",
    abilities: [
      { icon: "💨", name: "Cloudburst" },
      { icon: "🌪️", name: "Updraft" },
      { icon: "⚡", name: "Tailwind" },
      { icon: "🔪", name: "Blade Storm" },
    ],
    tagline: "Speed. Precision. Dominance.",
  },
  {
    id: "sage",
    name: "SAGE",
    role: "Sentinel",
    description:
      "Chinese medic who heals allies, erects barriers, and can resurrect fallen teammates in battle.",
    abilities: [
      { icon: "🧊", name: "Slow Orb" },
      { icon: "🧱", name: "Barrier Orb" },
      { icon: "💚", name: "Heal" },
      { icon: "✨", name: "Resurrection" },
    ],
    tagline: "Life and death, balanced.",
  },
  {
    id: "sova",
    name: "SOVA",
    role: "Initiator",
    description:
      "Russian hunter who gathers critical intel with his owl drone and pinpoint recon bolts.",
    abilities: [
      { icon: "🦅", name: "Owl Drone" },
      { icon: "⚡", name: "Shock Bolt" },
      { icon: "🎯", name: "Recon Bolt" },
      { icon: "🏹", name: "Hunter's Fury" },
    ],
    tagline: "Knowledge is the deadliest weapon.",
  },
  {
    id: "omen",
    name: "OMEN",
    role: "Controller",
    description:
      "Mysterious shadow who lurks in darkness, disorients enemies, and teleports across the battlefield.",
    abilities: [
      { icon: "👤", name: "Shrouded Step" },
      { icon: "👁️", name: "Paranoia" },
      { icon: "🌑", name: "Dark Cover" },
      { icon: "🌀", name: "From the Shadows" },
    ],
    tagline: "Fear what you cannot see.",
  },
  {
    id: "reyna",
    name: "REYNA",
    role: "Duelist",
    description:
      "Mexican vampire who feeds on enemy souls, healing herself and dismissing damage when on a killing spree.",
    abilities: [
      { icon: "👁️", name: "Leer" },
      { icon: "🩸", name: "Devour" },
      { icon: "💀", name: "Dismiss" },
      { icon: "👑", name: "Empress" },
    ],
    tagline: "I feed on your fear.",
  },
  {
    id: "killjoy",
    name: "KILLJOY",
    role: "Sentinel",
    description:
      "German tech genius who deploys turrets, nanobots, and grenades to lock down entire sites.",
    abilities: [
      { icon: "💥", name: "Nanoswarm" },
      { icon: "🤖", name: "Alarmbot" },
      { icon: "🔫", name: "Turret" },
      { icon: "🔒", name: "Lockdown" },
    ],
    tagline: "The genius is always right.",
  },
];

const initialChatMessages: ChatMessage[] = [
  {
    role: "ai",
    text: "Welcome to ORION AI — your tactical Valorant coach. Ask me anything about agent strategies, positioning, or how to climb ranks!",
    ts: "10:00",
  },
  {
    role: "user",
    text: "How should I play Jett on Bind?",
    ts: "10:01",
  },
  {
    role: "ai",
    text: "On Bind, Jett excels at aggressive entry with Tailwind dashes through teleporters. Use Updraft to reach unexpected angles on B-Short roof. Keep Blade Storm for eco rounds — it's essentially a free rifle. Pre-aim hookah exits and use Cloudburst to smoke off defenders.",
    ts: "10:01",
  },
  {
    role: "user",
    text: "What rank do I need to unlock advanced coaching?",
    ts: "10:02",
  },
  {
    role: "ai",
    text: "Advanced coaching is available on Diamond & Radiant tiers! Upgrade to unlock personalized VOD reviews, custom crosshair configs, and real-time positioning feedback tailored to your rank.",
    ts: "10:02",
  },
];

const pricingTiers: PricingTier[] = [
  {
    id: "silver",
    name: "SILVER",
    price: "$2.99",
    color: "silver",
    features: [
      "Basic AI Tips",
      "Agent Guides",
      "Community Access",
      "Weekly Patch Insights",
      "Role-based Strategies",
    ],
  },
  {
    id: "diamond",
    name: "DIAMOND",
    price: "$5.99",
    color: "diamond",
    popular: true,
    features: [
      "Advanced AI Analysis",
      "Priority Support",
      "All Silver Features",
      "Map-by-Map Tactics",
      "Live Agent Meta Updates",
    ],
  },
  {
    id: "radiant",
    name: "RADIANT",
    price: "$10.99",
    color: "radiant",
    features: [
      "Full AI Coaching",
      "Personalized Strategies",
      "Pro Insights & VODs",
      "All Diamond Features",
      "1-on-1 AI Sessions",
    ],
  },
];

const aiResponses = [
  "Great question! On that map, try holding off-angles with your agent's unique movement abilities to surprise opponents.",
  "For climbing ranked, focus on mastering 2–3 agents rather than instalocking meta picks you haven't practiced.",
  "Your crosshair placement is key — keep it at head level and pre-aim common hiding spots before peeking.",
  "Economy management wins rounds. Know when to force-buy, eco, or full-buy based on your team's credits.",
  "Communication is crucial! Even simple callouts like 'One B-Main' can completely shift round outcomes.",
];

// ─── Role Styles ─────────────────────────────────────────────────────────────
const roleGradient: Record<Role, string> = {
  Duelist: "from-red-600 via-orange-500 to-red-800",
  Sentinel: "from-emerald-500 via-teal-400 to-green-700",
  Initiator: "from-blue-500 via-indigo-400 to-purple-700",
  Controller: "from-purple-600 via-indigo-500 to-violet-800",
};

const roleBadgeStyle: Record<Role, string> = {
  Duelist: "bg-red-600/20 text-red-400 border-red-500/40",
  Sentinel: "bg-emerald-600/20 text-emerald-400 border-emerald-500/40",
  Initiator: "bg-blue-600/20 text-blue-400 border-blue-500/40",
  Controller: "bg-purple-600/20 text-purple-400 border-purple-500/40",
};

const roleEmoji: Record<Role, string> = {
  Duelist: "⚔️",
  Sentinel: "🛡️",
  Initiator: "🔍",
  Controller: "🌫️",
};

// ─── Agent Portrait Images ────────────────────────────────────────────────────
const agentImages: Record<string, string> = {
  jett: "/assets/generated/agent-jett.dim_400x300.jpg",
  sage: "/assets/generated/agent-sage.dim_400x300.jpg",
  sova: "/assets/generated/agent-sova.dim_400x300.jpg",
  omen: "/assets/generated/agent-omen.dim_400x300.jpg",
  reyna: "/assets/generated/agent-reyna.dim_400x300.jpg",
  killjoy: "/assets/generated/agent-killjoy.dim_400x300.jpg",
};

// ─── Components ──────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" role="img">
        <title>Radiant HQ Logo</title>
        <path d="M14 2L26 24H2L14 2Z" fill="oklch(0.55 0.22 25)" />
        <path d="M14 8L22 22H6L14 8Z" fill="oklch(0.09 0.006 255)" />
        <path d="M14 2L20 14H14V2Z" fill="oklch(0.7 0.22 25)" />
      </svg>
      <span className="font-heading text-xl tracking-widest text-foreground">
        RADIANT <span style={{ color: "oklch(0.55 0.22 25)" }}>HQ</span>
      </span>
    </div>
  );
}

function Navbar() {
  const [active, setActive] = useState("AGENTS POOL");
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ["HOME", "AGENTS POOL", "GUIDANCE AI", "PRICING", "COMMUNITY"];
  const anchors: Record<string, string> = {
    HOME: "#hero",
    "AGENTS POOL": "#agents",
    "GUIDANCE AI": "#guidance",
    PRICING: "#pricing",
    COMMUNITY: "#footer",
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40"
      style={{
        background: "oklch(0.09 0.006 255 / 0.95)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Logo />

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          data-ocid="nav.panel"
        >
          {links.map((link) => (
            <a
              key={link}
              href={anchors[link]}
              data-ocid={`nav.${link.toLowerCase().replace(" ", "_")}.link`}
              className={`font-rajdhani text-sm font-semibold tracking-widest transition-all duration-200 hover:text-val-red ${
                active === link
                  ? "nav-active border-b-2"
                  : "text-muted-foreground"
              }`}
              style={
                active === link ? { borderColor: "oklch(0.55 0.22 25)" } : {}
              }
              onClick={() => setActive(link)}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            data-ocid="nav.search_input"
            className="hidden md:flex items-center justify-center w-8 h-8 rounded border border-border/50 text-muted-foreground hover:text-val-red hover:border-val-red transition-colors"
          >
            🔍
          </button>
          <Button
            data-ocid="nav.login.button"
            size="sm"
            className="font-heading text-xs tracking-widest border"
            style={{
              background: "oklch(0.55 0.22 25 / 0.15)",
              borderColor: "oklch(0.55 0.22 25 / 0.5)",
              color: "oklch(0.75 0.22 25)",
            }}
          >
            LOG IN
          </Button>
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/30 overflow-hidden"
          >
            <div className="flex flex-col px-4 py-3 gap-3">
              {links.map((link) => (
                <a
                  key={link}
                  href={anchors[link]}
                  data-ocid={`nav.mobile.${link.toLowerCase().replace(" ", "_")}.link`}
                  className="font-rajdhani text-sm font-semibold tracking-widest text-muted-foreground hover:text-val-red transition-colors"
                  onClick={() => {
                    setActive(link);
                    setMenuOpen(false);
                  }}
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-28 md:py-40 text-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.22 0.12 20 / 0.75) 0%, transparent 70%), oklch(0.09 0.006 255)",
      }}
    >
      {/* Decorative lines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, oklch(0.55 0.22 25) 0px, oklch(0.55 0.22 25) 1px, transparent 1px, transparent 80px)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span
            className="font-rajdhani text-xs tracking-[0.3em] font-semibold mb-4 inline-block"
            style={{ color: "oklch(0.55 0.22 25)" }}
          >
            ◆ VALORANT TACTICAL HUB ◆
          </span>
          <h1 className="font-heading text-5xl md:text-7xl text-foreground leading-none mb-4">
            MASTER THE ROSTER:
            <br />
            <span style={{ color: "oklch(0.65 0.22 25)" }}>AGENTS POOL</span>
          </h1>
          <p className="font-body text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-8">
            Explore every agent's unique toolkit, counter-strategies, and
            AI-powered tactical breakdowns — curated for climbers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="hero.primary_button"
              asChild
              className="font-heading text-sm tracking-widest px-8 py-6 rounded-sm border"
              style={{
                background: "oklch(0.55 0.22 25)",
                borderColor: "oklch(0.65 0.22 25)",
                color: "white",
                boxShadow: "0 0 24px oklch(0.55 0.22 25 / 0.4)",
              }}
            >
              <a href="#agents">DISCOVER TACTICS</a>
            </Button>
            <Button
              data-ocid="hero.secondary_button"
              variant="outline"
              asChild
              className="font-heading text-sm tracking-widest px-8 py-6 rounded-sm"
              style={{
                borderColor: "oklch(0.55 0.22 25 / 0.4)",
                color: "oklch(0.75 0.22 25)",
                background: "transparent",
              }}
            >
              <a href="#guidance">CONSULT AI COACH</a>
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { value: "26+", label: "AGENTS" },
            { value: "12+", label: "MAPS" },
            { value: "3 TIERS", label: "AI COACHING" },
            { value: "10K+", label: "PLAYERS GUIDED" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-heading text-2xl md:text-3xl"
                style={{ color: "oklch(0.65 0.22 25)" }}
              >
                {stat.value}
              </div>
              <div className="font-rajdhani text-xs tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      data-ocid={`agents.item.${index + 1}`}
      className="relative rounded-xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col"
      style={{
        borderColor: hovered
          ? "oklch(0.55 0.22 25 / 0.8)"
          : "oklch(0.22 0.01 255)",
        background: "oklch(0.12 0.007 255)",
        boxShadow: hovered
          ? "0 0 24px oklch(0.55 0.22 25 / 0.4), 0 0 60px oklch(0.55 0.22 25 / 0.1)"
          : "0 4px 20px oklch(0 0 0 / 0.4)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Art area */}
      <div
        className={`relative h-48 bg-gradient-to-br ${roleGradient[agent.role]} flex items-center justify-center overflow-hidden`}
      >
        {/* Agent portrait image */}
        <img
          src={agentImages[agent.id]}
          alt={agent.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{ zIndex: 1 }}
        />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/20" style={{ zIndex: 2 }} />
        {/* Role badge on art */}
        <div className="absolute top-3 right-3" style={{ zIndex: 10 }}>
          <span
            className={`font-rajdhani text-xs font-bold tracking-widest px-2 py-1 rounded-sm border ${roleBadgeStyle[agent.role]}`}
          >
            {roleEmoji[agent.role]} {agent.role.toUpperCase()}
          </span>
        </div>
        {/* Agent name overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-3"
          style={{
            background:
              "linear-gradient(to top, oklch(0.09 0.006 255) 40%, oklch(0.09 0.006 255 / 0.7) 70%, transparent)",
            zIndex: 10,
          }}
        >
          <h3
            className={`font-heading text-2xl text-foreground tracking-wider ${agent.id === "sova" ? "font-normal" : ""}`}
          >
            {agent.name}
          </h3>
          <p className="font-rajdhani text-xs text-muted-foreground italic">
            {agent.tagline}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <p className="text-muted-foreground text-sm leading-relaxed font-body">
          {agent.description}
        </p>

        {/* Abilities */}
        <div>
          <p
            className="font-rajdhani text-xs tracking-widest mb-2"
            style={{ color: "oklch(0.55 0.22 25)" }}
          >
            ABILITIES
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {agent.abilities.map((ab) => (
              <div
                key={ab.name}
                className="flex items-center gap-1.5 rounded-sm px-2 py-1"
                style={{ background: "oklch(0.16 0.008 255)" }}
              >
                <span className="text-base">{ab.icon}</span>
                <span className="font-rajdhani text-xs text-muted-foreground truncate">
                  {ab.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <Button
          data-ocid={`agents.view_profile.button.${index + 1}`}
          className="mt-auto w-full font-heading text-xs tracking-widest rounded-sm border"
          style={{
            background: hovered
              ? "oklch(0.55 0.22 25 / 0.2)"
              : "oklch(0.55 0.22 25 / 0.08)",
            borderColor: "oklch(0.55 0.22 25 / 0.5)",
            color: "oklch(0.75 0.22 25)",
          }}
        >
          VIEW PROFILE
        </Button>
      </div>
    </motion.div>
  );
}

function AgentsSection() {
  return (
    <section
      id="agents"
      className="py-20"
      style={{ background: "oklch(0.1 0.007 255)" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="font-rajdhani text-xs tracking-[0.3em] font-semibold mb-3 inline-block"
            style={{ color: "oklch(0.55 0.22 25)" }}
          >
            ◆ AGENT ROSTER ◆
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground">
            THE AGENTS POOL
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto font-body">
            Every agent. Every ability. Tactical breakdowns to help you master
            your role.
          </p>
        </motion.div>

        {/* Role filter tabs */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-10"
          data-ocid="agents.filter.tab"
        >
          {(
            ["All", "Duelist", "Sentinel", "Initiator", "Controller"] as const
          ).map((r) => (
            <button
              type="button"
              key={r}
              className="font-rajdhani text-xs tracking-widest px-4 py-2 rounded-sm border transition-all"
              style={{
                borderColor: "oklch(0.55 0.22 25 / 0.3)",
                background:
                  r === "All" ? "oklch(0.55 0.22 25 / 0.15)" : "transparent",
                color:
                  r === "All" ? "oklch(0.75 0.22 25)" : "oklch(0.62 0.015 250)",
              }}
            >
              {r === "All" ? "ALL" : `${roleEmoji[r]} ${r.toUpperCase()}`}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="agents.list"
        >
          {agents.map((agent, i) => (
            <AgentCard key={agent.id} agent={agent} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChatWidget({ isSubscribed }: { isSubscribed: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiIdx = useRef(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on messages/typing change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || !isSubscribed) return;
    const userMsg: ChatMessage = {
      role: "user",
      text: input.trim(),
      ts: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response = aiResponses[aiIdx.current % aiResponses.length];
      aiIdx.current++;
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: response,
          ts: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div
      className="rounded-xl border flex flex-col h-[480px] overflow-hidden relative"
      style={{
        borderColor: "oklch(0.55 0.22 25 / 0.5)",
        background: "oklch(0.11 0.007 255)",
        boxShadow: "0 0 30px oklch(0.55 0.22 25 / 0.15)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{
          borderColor: "oklch(0.55 0.22 25 / 0.3)",
          background: "oklch(0.13 0.008 255)",
        }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg border animate-pulse-glow"
          style={{
            borderColor: "oklch(0.55 0.22 25)",
            background: "oklch(0.55 0.22 25 / 0.2)",
          }}
        >
          🤖
        </div>
        <div>
          <p className="font-heading text-sm text-foreground tracking-wider">
            ORION AI
          </p>
          <p
            className="font-rajdhani text-xs"
            style={{ color: "oklch(0.55 0.22 25)" }}
          >
            ● ONLINE — TACTICAL COACH
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scroll-smooth"
        data-ocid="guidance.chat.panel"
      >
        {messages.map((msg, i) => (
          <motion.div
            key={`${msg.role}-${i}-${msg.ts}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[80%] rounded-lg px-3 py-2"
              style={{
                background:
                  msg.role === "ai"
                    ? "oklch(0.16 0.008 255)"
                    : "oklch(0.55 0.22 25 / 0.25)",
                borderLeft:
                  msg.role === "ai"
                    ? "2px solid oklch(0.55 0.22 25 / 0.6)"
                    : undefined,
              }}
            >
              {msg.role === "ai" && (
                <p
                  className="font-rajdhani text-xs mb-1"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                >
                  ORION AI · {msg.ts}
                </p>
              )}
              <p className="text-sm text-foreground font-body leading-relaxed">
                {msg.text}
              </p>
              {msg.role === "user" && (
                <p className="font-rajdhani text-xs mt-1 text-right text-muted-foreground">
                  {msg.ts}
                </p>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-lg px-4 py-2"
              style={{
                background: "oklch(0.16 0.008 255)",
                borderLeft: "2px solid oklch(0.55 0.22 25 / 0.6)",
              }}
            >
              <p
                className="font-rajdhani text-xs mb-1"
                style={{ color: "oklch(0.55 0.22 25)" }}
              >
                ORION AI is typing...
              </p>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 0.8,
                      delay: i * 0.2,
                    }}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "oklch(0.55 0.22 25)" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "oklch(0.22 0.01 255)" }}
      >
        {isSubscribed ? (
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about agents, maps, strategies..."
              data-ocid="guidance.chat.input"
              className="flex-1 font-body text-sm rounded-sm"
              style={{
                background: "oklch(0.16 0.008 255)",
                borderColor: "oklch(0.22 0.01 255)",
                color: "oklch(0.97 0.003 250)",
              }}
            />
            <Button
              onClick={sendMessage}
              data-ocid="guidance.chat.submit_button"
              className="font-heading text-xs tracking-widest px-4 rounded-sm"
              style={{ background: "oklch(0.55 0.22 25)", color: "white" }}
            >
              SEND
            </Button>
          </div>
        ) : (
          <div
            className="rounded-lg px-4 py-3 text-center border"
            style={{
              background: "oklch(0.14 0.008 255)",
              borderColor: "oklch(0.55 0.22 25 / 0.3)",
            }}
          >
            <p
              className="font-rajdhani text-xs tracking-wider mb-2"
              style={{ color: "oklch(0.55 0.22 25)" }}
            >
              🔒 SUBSCRIBE TO UNLOCK LIVE AI COACHING
            </p>
            <Button
              data-ocid="guidance.subscribe.button"
              asChild
              size="sm"
              className="font-heading text-xs tracking-widest rounded-sm"
              style={{ background: "oklch(0.55 0.22 25)", color: "white" }}
            >
              <a href="#pricing">VIEW PLANS</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const pricingCardStyles: Record<
  string,
  { border: string; glow: string; badge: string; btn: string }
> = {
  silver: {
    border: "oklch(0.7 0.01 250 / 0.5)",
    glow: "0 0 20px oklch(0.7 0.01 250 / 0.15)",
    badge: "oklch(0.7 0.01 250 / 0.2)",
    btn: "oklch(0.7 0.01 250)",
  },
  diamond: {
    border: "oklch(0.6 0.2 260 / 0.7)",
    glow: "0 0 24px oklch(0.6 0.2 260 / 0.35)",
    badge: "oklch(0.6 0.2 260 / 0.2)",
    btn: "oklch(0.6 0.2 260)",
  },
  radiant: {
    border: "oklch(0.55 0.22 25 / 0.8)",
    glow: "0 0 32px oklch(0.55 0.22 25 / 0.5), 0 0 64px oklch(0.55 0.22 25 / 0.2)",
    badge: "oklch(0.55 0.22 25 / 0.2)",
    btn: "oklch(0.55 0.22 25)",
  },
};

const tierIcons: Record<string, string> = {
  silver: "🥈",
  diamond: "💎",
  radiant: "👑",
};

function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  const styles = pricingCardStyles[tier.color];
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      data-ocid={`pricing.item.${index + 1}`}
      className="relative rounded-xl border flex flex-col p-6 transition-all duration-300"
      style={{
        borderColor: hovered
          ? styles.border
          : `${styles.border.replace("0.5", "0.3").replace("0.7", "0.4").replace("0.8", "0.5")}`,
        background: "oklch(0.12 0.007 255)",
        boxShadow: hovered ? styles.glow : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {tier.popular && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 font-rajdhani text-xs tracking-widest px-3 py-1 rounded-full"
          style={{ background: styles.btn, color: "white" }}
        >
          MOST POPULAR
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
          style={{ background: styles.badge }}
        >
          {tierIcons[tier.color]}
        </div>
        <div>
          <h3 className="font-heading text-xl text-foreground tracking-wider">
            {tier.name}
          </h3>
          <p className="font-rajdhani text-xs text-muted-foreground">TIER</p>
        </div>
      </div>

      <div className="mb-5">
        <span className="font-heading text-4xl" style={{ color: styles.btn }}>
          {tier.price}
        </span>
        <span className="text-muted-foreground text-sm font-body">/month</span>
      </div>

      <ul className="flex flex-col gap-2 flex-1 mb-6">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <span style={{ color: styles.btn }}>✓</span>
            <span className="font-body text-sm text-foreground">{f}</span>
          </li>
        ))}
      </ul>

      <Button
        data-ocid={`pricing.${tier.id}.primary_button`}
        className="w-full font-heading text-sm tracking-widest rounded-sm border"
        style={{
          background: tier.popular ? styles.btn : "transparent",
          borderColor: styles.border,
          color: tier.popular ? "white" : styles.btn,
        }}
      >
        GET STARTED
      </Button>
    </motion.div>
  );
}

function GuidanceSection() {
  const [isSubscribed] = useState(false);

  return (
    <section
      id="guidance"
      className="py-20"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 20% 50%, oklch(0.18 0.08 20 / 0.25) 0%, transparent 60%), oklch(0.09 0.006 255)",
      }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="font-rajdhani text-xs tracking-[0.3em] font-semibold mb-3 inline-block"
            style={{ color: "oklch(0.55 0.22 25)" }}
          >
            ◆ AI-POWERED ◆
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground">
            TACTICAL GUIDANCE
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto font-body">
            Real-time coaching powered by ORION AI. Ask anything, get
            elite-level strategic breakdowns.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Chat widget */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: "oklch(0.55 0.22 25)" }}>◆</span>
              <h3 className="font-heading text-lg text-foreground tracking-wider">
                AI TACTICAL GUIDANCE
              </h3>
            </div>
            <ChatWidget isSubscribed={isSubscribed} />
          </div>

          {/* Pricing mini */}
          <div id="pricing">
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: "oklch(0.55 0.22 25)" }}>◆</span>
              <h3 className="font-heading text-lg text-foreground tracking-wider">
                PRICING PLANS
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {pricingTiers.map((tier, i) => (
                <PricingCard key={tier.id} tier={tier} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FullPricingSection() {
  return (
    <section
      className="py-20"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 100%, oklch(0.2 0.1 20 / 0.3) 0%, transparent 60%), oklch(0.1 0.007 255)",
      }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="font-rajdhani text-xs tracking-[0.3em] font-semibold mb-3 inline-block"
            style={{ color: "oklch(0.55 0.22 25)" }}
          >
            ◆ SUBSCRIPTION TIERS ◆
          </span>
          <h2 className="font-heading text-4xl md:text-5xl text-foreground">
            CHOOSE YOUR TIER
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-lg mx-auto font-body">
            All plans include access to the Agents Pool and community resources.
            Upgrade anytime.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <PricingCard key={tier.id} tier={tier} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-muted-foreground text-xs font-body mt-8"
        >
          No contracts. Cancel anytime. All prices in USD.
        </motion.p>
      </div>
    </section>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer
      id="footer"
      className="border-t py-10"
      style={{
        borderColor: "oklch(0.22 0.01 255)",
        background: "oklch(0.09 0.006 255)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />

          <nav className="flex flex-wrap justify-center gap-6">
            {["About", "Terms", "Support", "API"].map((link) => (
              <a
                key={link}
                href="/"
                className="font-rajdhani text-xs tracking-widest text-muted-foreground hover:text-val-red transition-colors"
              >
                {link.toUpperCase()}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            {["𝕏", "📺", "💬", "📱"].map((icon) => (
              <button
                type="button"
                key={icon}
                className="w-8 h-8 flex items-center justify-center rounded border text-sm border-border/50 text-muted-foreground hover:border-val-red hover:text-val-red transition-colors"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div
          className="mt-8 pt-6 border-t text-center"
          style={{ borderColor: "oklch(0.22 0.01 255)" }}
        >
          <p className="font-body text-xs text-muted-foreground">
            © {year} RADIANT HQ. All rights reserved. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-val-red transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.09 0.006 255)" }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <AgentsSection />
        <GuidanceSection />
        <FullPricingSection />
      </main>
      <Footer />
    </div>
  );
}
