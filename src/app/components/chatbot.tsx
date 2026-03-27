"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Sparkles,
  Phone,
  FileText,
  Layers,
  Copy,
  Pencil,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Mic,
  MicOff,
} from "lucide-react";
import clsx from "clsx";
import gsap from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MAX_INPUT_LENGTH = 500;
const LONG_PRESS_MS = 500;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

// ─── Speech recognition helpers ──────────────────────────────────────────────

function getSpeechRecognitionClass():
  | (new () => {
      start(): void;
      stop(): void;
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: ((e: unknown) => void) | null;
      onend: (() => void) | null;
      onerror: ((e: { error: string }) => void) | null;
    })
  | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => unknown;
    webkitSpeechRecognition?: new () => unknown;
  };
  return (w.SpeechRecognition ??
    w.webkitSpeechRecognition ??
    null) as ReturnType<typeof getSpeechRecognitionClass>;
}

function getTranscriptFromResult(result: unknown): string {
  const r = result as {
    item?(i: number): { transcript?: string };
    0?: { transcript?: string };
  };
  if (!r) return "";
  const alt = typeof r.item === "function" ? r.item(0) : r[0];
  return (alt?.transcript ?? "").trim();
}

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

// ─── GSAP animated message row ────────────────────────────────────────────────

function AnimatedMessageRow({
  messageId,
  isUser,
  children,
}: {
  messageId: string;
  isUser: boolean;
  children: React.ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { opacity: 0, x: isUser ? 48 : -48, scale: 0.92, filter: "blur(4px)" },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "back.out(1.2)",
        overwrite: "auto",
      }
    );
    if (!isUser) {
      const actions = el.querySelector("[data-bot-actions]");
      if (actions) {
        tl.fromTo(
          actions.querySelectorAll("button"),
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: 0.05,
            ease: "back.out(1.4)",
            overwrite: "auto",
          },
          "-0.15"
        );
      }
    }
  }, [messageId, isUser]);

  return (
    <div
      ref={rowRef}
      className={isUser ? "flex justify-end" : "flex justify-start"}
    >
      {children}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [greeting] = useState(() => getTimeBasedGreeting());
  const [userMessageActionsVisibleId, setUserMessageActionsVisibleId] =
    useState<string | null>(null);
  const [botFeedback, setBotFeedback] = useState<
    Record<string, "up" | "down" | null>
  >({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  const sessionIdRef = useRef(
    `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const lastUserQueryRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<{
    start(): void;
    stop(): void;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((e: unknown) => void) | null;
    onend: (() => void) | null;
    onerror: ((e: { error: string }) => void) | null;
  } | null>(null);
  const speechResultsCountRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
const analyserRef = useRef<AnalyserNode | null>(null);
const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
const audioStreamRef = useRef<MediaStream | null>(null);
const voiceLevelRef = useRef(0);
const [voiceScale, setVoiceScale] = useState(1);
const animFrameRef = useRef<number>(0);

const startAudioAnalysis = useCallback(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioStreamRef.current = stream;
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 32;           // tiny FFT = much faster response
    analyser.smoothingTimeConstant = 0; // no smoothing = instant react
    analyserRef.current = analyser;
    const source = ctx.createMediaStreamSource(stream);
    audioSourceRef.current = source;
    source.connect(analyser);
    
    const data = new Uint8Array(analyser.frequencyBinCount);
    
    const tick = () => {
      analyser.getByteTimeDomainData(data); // time domain = reacts to voice instantly
      // RMS amplitude
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const norm = (data[i] - 128) / 128; // centre around 0
        sum += norm * norm;
      }
      const rms = Math.sqrt(sum / data.length);
      const scale = 1 + Math.min(rms * 8, 1) * 0.2; // 1.0 silence → 2.2 loud
      setVoiceScale(scale);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
  } catch {
    // mic already granted via speech recognition — silently ignore
  }
}, []);

const stopAudioAnalysis = useCallback(() => {
  cancelAnimationFrame(animFrameRef.current);
  audioSourceRef.current?.disconnect();
  audioContextRef.current?.close();
  audioStreamRef.current?.getTracks().forEach((t) => t.stop());
  audioContextRef.current = null;
  analyserRef.current = null;
  audioSourceRef.current = null;
  audioStreamRef.current = null;
  setVoiceScale(1);
}, []);

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  // Auto-resize textarea
  useEffect(() => {
    const t = textareaRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${Math.min(t.scrollHeight, 150)}px`;
  }, [inputValue]);

  // Scroll to bottom + focus on open
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);

  // Mobile: lock body scroll
  useEffect(() => {
    if (typeof window === "undefined" || !isOpen || !isMobile()) return;
    scrollPositionRef.current = window.scrollY;
    const s = document.body.style;
    const [prevO, prevP, prevT, prevW] = [
      s.overflow,
      s.position,
      s.top,
      s.width,
    ];
    s.overflow = "hidden";
    s.position = "fixed";
    s.top = `-${scrollPositionRef.current}px`;
    s.width = "100%";
    return () => {
      s.overflow = prevO;
      s.position = prevP;
      s.top = prevT;
      s.width = prevW;
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpen]);

  // Mobile: visual viewport keyboard resize
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport || !isOpen)
      return;
    const el = chatWindowRef.current;
    const vv = window.visualViewport;
    const update = () => {
      if (!el || !isMobile()) return;
      el.style.height = `${vv.height}px`;
      el.style.top = `${vv.offsetTop}px`;
      el.style.left = `${vv.offsetLeft}px`;
      el.style.width = `${vv.width}px`;
      requestAnimationFrame(() =>
        textareaRef.current?.scrollIntoView({ behavior: "auto", block: "end" })
      );
      setTimeout(
        () =>
          textareaRef.current?.scrollIntoView({
            behavior: "auto",
            block: "end",
          }),
        150
      );
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      if (el && isMobile()) {
        el.style.height = "";
        el.style.top = "";
        el.style.left = "";
        el.style.width = "";
      }
    };
  }, [isOpen]);

  const handleNewChat = () => {
    setMessages([]);
    setUserMessageActionsVisibleId(null);
    setBotFeedback({});
    sessionIdRef.current = `session-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  };

  const fetchBotResponse = useCallback(
    async (query: string): Promise<string> => {
      const res = await fetch(`${API_URL}/api/chatbot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, sessionId: sessionIdRef.current }),
      });
      if (!res.ok) throw new Error("Failed to get response");
      const json = await res.json();
      return (
        json.data?.response ??
        "Sorry, I could not get a response. Please try again."
      );
    },
    []
  );

  const handleSendMessage = useCallback(
    async (textOverride?: string) => {
      const query = (textOverride ?? inputValue).trim();
      if (!query || isTyping) return;
      lastUserQueryRef.current = query;
      const userMsg: Message = {
        id: Date.now().toString(),
        text: query,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((p) => [...p, userMsg]);
      setInputValue("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      setIsTyping(true);
      try {
        const text = await fetchBotResponse(query);
        setMessages((p) => [
          ...p,
          {
            id: (Date.now() + 1).toString(),
            text,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((p) => [
          ...p,
          {
            id: (Date.now() + 1).toString(),
            text: "Something went wrong. Please try again.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, fetchBotResponse]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  const handleEditUserMessage = useCallback((text: string) => {
    setInputValue(text);
    setUserMessageActionsVisibleId(null);
    textareaRef.current?.focus();
  }, []);

  const handleRegenerateBotMessage = useCallback(
    async (botMessageId: string) => {
      if (isTyping || !lastUserQueryRef.current) return;
      // Remove the old bot message and show typing indicator instead
      setMessages((p) => p.filter((m) => m.id !== botMessageId));
      setIsTyping(true);
      try {
        const text = await fetchBotResponse(lastUserQueryRef.current);
        setMessages((p) => [
          ...p,
          {
            id: Date.now().toString(),
            text,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((p) => [
          ...p,
          {
            id: Date.now().toString(),
            text: "Could not regenerate. Please try again.",
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, fetchBotResponse]
  );

  const handleBotFeedback = useCallback(
    (messageId: string, value: "up" | "down") => {
      setBotFeedback((f) => ({
        ...f,
        [messageId]: f[messageId] === value ? null : value,
      }));
    },
    []
  );

  const handleUserMessageTouchStart = useCallback((messageId: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setUserMessageActionsVisibleId(messageId);
      longPressTimerRef.current = null;
    }, LONG_PRESS_MS);
  }, []);

  const handleUserMessageTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    },
    []
  );
  useEffect(() => () => { stopAudioAnalysis(); }, [stopAudioAnalysis]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognitionClass = getSpeechRecognitionClass();
    setSpeechSupported(!!SpeechRecognitionClass);
    if (!SpeechRecognitionClass) return;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "en-US";

    recognition.onresult = (e: unknown) => {
      const ev = e as {
        results: {
          length: number;
          item?(i: number): unknown;
          [i: number]: unknown;
        };
      };
      const results = ev.results;
      if (!results || results.length === 0) return;
      for (let i = speechResultsCountRef.current; i < results.length; i++) {
        const result = (results as { item?(i: number): unknown }).item
          ? (results as { item(i: number): unknown }).item(i)
          : (results as unknown[])[i];
        const r = result as { isFinal?: boolean };
        if (!r) continue;
        const transcript = getTranscriptFromResult(result);
        if (r.isFinal && transcript) {
          speechResultsCountRef.current = i + 1;
          setInputValue((prev) =>
            ((prev ? prev + " " : "") + transcript).slice(0, MAX_INPUT_LENGTH)
          );
        }
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      setSpeechError(null);
      speechResultsCountRef.current = 0;
    };
    recognition.onerror = (e: { error: string }) => {
      if (e.error === "aborted") return;
      setIsListening(false);
      setSpeechError(
        e.error === "not-allowed" ? "Microphone access denied" : e.error
      );
      speechResultsCountRef.current = 0;
    };
    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, []);

  const toggleVoiceInput = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setSpeechError(null);
    if (isListening) {
      try { recognition.stop(); } catch { setIsListening(false); }
      stopAudioAnalysis();
    } else {
      speechResultsCountRef.current = 0;
      try {
        recognition.start();
        setIsListening(true);
        startAudioAnalysis();
      } catch {
        setIsListening(false);
        setSpeechError('Could not start microphone');
      }
    }
  }, [isListening, startAudioAnalysis, stopAudioAnalysis]);

  const canSend = inputValue.trim().length > 0 && !isTyping;

  return (
    <>
      {/* ── Trigger button — Inovalink pulse rings, MASZ blue ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed bottom-6 right-6 z-[110] max-lg:bottom-[90px]",
          "w-[64px] h-[64px] rounded-full",
          "flex items-center justify-center",
          "transition-all duration-300 ease-in-out",
          "hover:scale-105 active:scale-95 cursor-pointer",
          isOpen ? "hidden md:flex" : "flex"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <div className="w-[42px] h-[42px] bg-[#016BF2] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 rotate-90 hover:bg-[#0150B6]">
            <X className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Outer pulse ring */}
            <div className="w-full h-full absolute rounded-full animate-pulse opacity-20">
              <div className="w-full h-full rounded-full border border-[#016BF2]" />
            </div>
            {/* Middle pulse ring */}
            <div
              className="w-[52px] h-[52px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse opacity-40"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-full h-full rounded-full border border-[#016BF2]" />
            </div>
            {/* Center blue button */}
            <div className="w-[42px] h-[42px] bg-[#016BF2] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg hover:bg-[#0150B6] transition-colors">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={clsx(
            "fixed z-[110] flex flex-col overflow-hidden bg-white shadow-2xl",
            // Mobile: full screen
            "inset-0 w-full h-full min-h-dvh max-w-none rounded-none",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
            "pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]",
            // Tablet/Desktop: Inovalink floating panel shape
            "md:pt-0 md:pb-0 md:pl-0 md:pr-0",
            "md:inset-auto md:bottom-28 md:right-4 md:left-auto md:top-auto md:min-h-0",
            "md:w-[550px] md:h-[668px] md:rounded-[31px]",
            "chatbot-window"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Maszbot"
        >
          {/* ── Header — Inovalink layout, MASZ blue ── */}
          <header className="shrink-0 flex items-center justify-between px-4 md:px-7 py-3 md:py-5 bg-white md:rounded-t-[31px]">
            {messages.length > 0 ? (
              <>
                {/* Logo + name */}
                <div className="flex items-center gap-2">
                  <div className="w-[22px] h-[22px] rounded-full bg-[#016BF2]/10 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#016BF2]" />
                  </div>
                  <span className="text-sm font-semibold text-[#016BF2]">
                    Maszbot
                  </span>
                </div>
                {/* New Chat + chevron-down close */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-sm text-[#777] hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M10 6.66667V13.3333M6.66667 10H13.3333M4.16667 2.5H15.8333C16.7538 2.5 17.5 3.24619 17.5 4.16667V15.8333C17.5 16.7538 16.7538 17.5 15.8333 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5Z"
                        stroke="#777777"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>New Chat</span>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full text-[#777] hover:bg-[#F2F2F2] flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close chat"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 9L12 16L19 9"
                        stroke="#777777"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex w-full justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full text-[#777] hover:bg-[#F2F2F2] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 9L12 16L19 9"
                      stroke="#777777"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </header>

          {/* ── Scrollable content ── */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col no-scrollbar">
            {messages.length === 0 ? (
              /* Welcome screen */
              <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-7 overflow-y-auto">
                <div className="text-center">
                  {/* Blue orb — static Sparkles */}
                  <div className="flex justify-center mb-[35px]">
                    <div className="relative inline-flex justify-center">
                      <div className="absolute inset-0 rounded-full bg-[#016BF2]/20 blur-xl scale-150" />
                      <div className="absolute rounded-full bg-[#016BF2]/10 blur-lg w-16 h-16 scale-125" />
                      <div className="relative w-[94px] h-[94px] rounded-full bg-[#016BF2] flex items-center justify-center shadow-lg">
                        <Sparkles
                          className="w-[46px] h-[46px] text-white"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-lg font-semibold text-[#0D0D0D] mb-2.5">
                    {greeting}! I&apos;m{" "}
                    <span className="text-[#016BF2]">Maszbot</span>
                  </h1>
                  <p className="text-sm text-[#777] px-[44px] mb-8">
                    Ask anything about MASZ Africa — services, locations, or how
                    we can help you.
                  </p>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="flex-1 px-4 py-4 space-y-5 overflow-hidden">
                {messages.map((message) =>
                  message.sender === "user" ? (
                    <AnimatedMessageRow
                      key={message.id}
                      messageId={message.id}
                      isUser
                    >
                      <div
                        className="max-w-[80%] group relative"
                        onMouseEnter={() =>
                          setUserMessageActionsVisibleId(message.id)
                        }
                        onMouseLeave={() =>
                          setUserMessageActionsVisibleId(null)
                        }
                        onTouchStart={() =>
                          handleUserMessageTouchStart(message.id)
                        }
                        onTouchEnd={handleUserMessageTouchEnd}
                        onTouchCancel={handleUserMessageTouchEnd}
                      >
                        <div className="rounded-[20px] px-4 py-2.5 bg-[#016BF2] text-white text-sm transition-transform duration-200 hover:scale-[1.02] will-change-transform">
                          <p>{message.text}</p>
                        </div>
                        <div
                          className={clsx(
                            "flex items-center justify-end gap-1 mt-1 transition-opacity duration-150",
                            userMessageActionsVisibleId === message.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          )}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(message.text, message.id)
                            }
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center transition-transform hover:scale-110"
                            aria-label="Copy"
                          >
                            {copiedId === message.id ? (
                              <span className="text-[10px] font-semibold text-[#016BF2]">
                                ✓
                              </span>
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditUserMessage(message.text)}
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center transition-transform hover:scale-110"
                            aria-label="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </AnimatedMessageRow>
                  ) : (
                    <AnimatedMessageRow
                      key={message.id}
                      messageId={message.id}
                      isUser={false}
                    >
                      <div className="max-w-[80%]">
                        <div className="rounded-[20px] px-4 py-2.5 bg-[#F2F2F2] text-[#0D0D0D] text-sm transition-transform duration-200 hover:scale-[1.02] will-change-transform">
                          <p>{message.text}</p>
                        </div>
                        <div
                          data-bot-actions
                          className="flex items-center gap-1 mt-1"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(message.text, message.id)
                            }
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110"
                            aria-label="Copy"
                          >
                            {copiedId === message.id ? (
                              <span className="text-[10px] font-semibold text-[#016BF2]">
                                ✓
                              </span>
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleRegenerateBotMessage(message.id)
                            }
                            className="w-8 h-8 rounded-full bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8] flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110"
                            aria-label="Regenerate"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBotFeedback(message.id, "up")}
                            className={clsx(
                              "w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110",
                              botFeedback[message.id] === "up"
                                ? "bg-[#016BF2]/10 text-[#016BF2]"
                                : "bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8]"
                            )}
                            aria-label="Thumbs up"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleBotFeedback(message.id, "down")
                            }
                            className={clsx(
                              "w-8 h-8 rounded-full flex items-center justify-center border border-[#E8E8E8] transition-transform hover:scale-110",
                              botFeedback[message.id] === "down"
                                ? "bg-[#016BF2]/10 text-[#016BF2]"
                                : "bg-[#F2F2F2] text-[#777] hover:bg-[#E8E8E8]"
                            )}
                            aria-label="Thumbs down"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </AnimatedMessageRow>
                  )
                )}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-[20px] px-4 py-3 bg-[#F2F2F2] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#016BF2] animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#016BF2] animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#016BF2] animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ── Input area — Inovalink pill layout, MASZ blue ── */}
          <div className="shrink-0 pb-4 md:pb-6 bg-white px-4 md:px-6">
            {/* Quick action buttons — welcome screen only */}
            {messages.length === 0 && (
              <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar pb-1">
                <Link
                  href="/contactUs#talk-to-us"
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-[30px] hover:bg-[#016BF2] hover:text-white bg-[#F2F2F2] text-[#0D0D0D]  border border-[#D1D8E0] text-sm font-medium  transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  Talk to our team
                </Link>
                <Link
                  href="/contactUs#contact-form"
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-[30px] bg-[#F2F2F2] text-[#0D0D0D] text-sm font-medium border border-[#D1D8E0] hover:bg-[#016BF2] hover:text-white transition-colors"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  Start a project
                </Link>
                <Link
                  href="/services"
                  onClick={() => setIsOpen(false)}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-[30px] bg-[#F2F2F2] text-[#0D0D0D] text-sm font-medium border border-[#D1D8E0] hover:bg-[#016BF2] hover:text-white transition-colors"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  Explore services
                </Link>
              </div>
            )}

            {/* Pill input box */}
            <div className="px-4 py-4 flex flex-col gap-5 border border-[#D1D8E0] bg-[#FAFAFA] rounded-[30px] transition-all duration-200 focus-within:border-[#016BF2]/50">
              {/* Top row: spark icon + textarea */}
              <div className="flex items-start gap-2">
              <div className="shrink-0 mt-0.5" aria-hidden>
  {isListening ? (
   <Mic
   className="w-[18px] h-[18px] text-red-500"
   style={{ transform: `scale(${voiceScale})`, willChange: 'transform' }}
 />
  ) : (
    <Sparkles className="w-[18px] h-[18px] text-[#016BF2]" />
  )}
</div>
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(e.target.value.slice(0, MAX_INPUT_LENGTH))
                  }
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    if (isMobile()) {
                      setTimeout(
                        () =>
                          textareaRef.current?.scrollIntoView({
                            behavior: "auto",
                            block: "end",
                          }),
                        100
                      );
                      setTimeout(
                        () =>
                          textareaRef.current?.scrollIntoView({
                            behavior: "auto",
                            block: "end",
                          }),
                        400
                      );
                    }
                  }}
                  placeholder={
                    isListening ? "Listening…" : "Ask Maszbot assistant…"
                  }
                  maxLength={MAX_INPUT_LENGTH}
                  rows={1}
                  disabled={isTyping}
                  className="flex-1 min-w-0 resize-none bg-transparent text-[#0D0D0D] text-sm focus:outline-none placeholder:text-[#A1A1A1] max-h-[150px] disabled:opacity-50"
                />
              </div>

              {/* Bottom row: sample prompt + char count + mic + send */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("Tell me more about your services");
                    textareaRef.current?.focus();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] border border-[#D1D8E0] bg-white text-xs text-[#777] hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Sample Prompt
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#A1A1A1]">
                    {inputValue.length}/{MAX_INPUT_LENGTH}
                  </span>

                  {/* Mic */}
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleVoiceInput}
                      className={clsx(
                        "w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer",
                        isListening
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-[#F2F2F2] text-[#016BF2] hover:bg-[#016BF2]/10"
                      )}
                      aria-label={
                        isListening ? "Stop listening" : "Speak to type"
                      }
                      title={isListening ? "Stop listening" : "Click to speak"}
                    >
                      {isListening ? (
                        <MicOff className="w-4 h-4" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Send — Inovalink arrow SVG, MASZ blue */}
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!canSend}
                    className={clsx(
                      "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95",
                      canSend
                        ? "bg-[#016BF2] hover:bg-[#0150B6]"
                        : "bg-[#E0E0E0] cursor-not-allowed opacity-50"
                    )}
                    aria-label="Send message"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 19 19"
                      fill="none"
                    >
                      <path
                        d="M16.797 1.52686L8.39867 9.92514M16.797 1.52686L11.4526 16.7965L8.39867 9.92514M16.797 1.52686L1.52734 6.87122L8.39867 9.92514"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Speech feedback */}
              {speechError && (
                <span className="text-xs text-red-600" role="alert">
                  {speechError}
                </span>
              )}
              {speechSupported && !speechError && isListening && (
                <span className="text-xs text-[#016BF2]">
                  Listening… speak now
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
