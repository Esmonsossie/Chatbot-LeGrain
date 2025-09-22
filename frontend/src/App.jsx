import { useEffect, useRef, useState } from "react";
import MessageBubble from "./components/MessageBubble";

export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Bonjour — pose une question sur l'histoire de la Côte d'Ivoire (2000→aujourd'hui).",
    },
  ]); // initialisé avec le message bot
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const containerRef = useRef(null);

  // Charger historique ou message initial
  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: 1,
          role: "bot",
          text: "Bonjour — pose une question sur l'histoire de la Côte d'Ivoire (2000→aujourd'hui).",
        },
      ]);
    }
  }, []);

  // Sauvegarder à chaque mise à jour
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    const el = containerRef.current;
    // @ts-ignore
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    const text = question.trim();
    if (!text) return;

    if (!showChat) setShowChat(true); // afficher le chat

    // ajouter message utilisateur
    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setQuestion("");

    // ajouter message bot temporaire "pending"
    const botId = Date.now();
    const pendingBot = {
      id: botId,
      role: "bot",
      text: "En cours de réponse...",
      pending: true,
    };
    setMessages((m) => [...m, pendingBot]);
    setLoading(true);

    try {
      const res = await fetch("https://chatbot-le-grain-bi7r.vercel.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) throw new Error("Réponse non OK du serveur : " + res.status);

      const data = await res.json();

      // remplacer le message "pending" par la vraie réponse
      setMessages((prev) =>
        prev.map((mm) =>
          mm.id === botId
            ? { ...mm, text: data.answer || "Pas de réponse", pending: false }
            : mm
        )
      );
    } catch (err) {
      console.error("Erreur API :", err);
      setMessages((prev) =>
        prev.map((mm) =>
          mm.id === botId
            ? { ...mm, text: "Erreur lors de l'appel à l'API", pending: false }
            : mm
        )
      );
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "bot",
        text: " Pose une nouvelle question.",
      },
    ]);
    setShowChat(false);
  };

  return (
    <>
      <header className="flex items-center justify-between  mb-4 mx-4 md:mx-8 p-4 md:p-6 ">
        <h1 className="text-lg md:text-2xl text-[#BE7232] font-bold font-grotesk transition-transform duration-200 hover:-translate-y-1">
          Le Grin
        </h1>
        <button
          onClick={clearChat}
          className="px-3 py-1 text-sm md:text-xl border border-[#447B56] rounded hover:bg-gray-100 transition-transform duration-200 hover:-translate-y-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 text-[#447B56]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      </header>
      <div className="relative min-h-screen flex flex-col items-center p-6">
        {/* Image floutée en background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-lg"
          style={{ backgroundImage: "url('/assets/flag.jpg')" }}
        />

        {/* Contenu au-dessus */}
        <div className="relative z-10 w-full max-w-2xl">
          {/* Header reste en haut */}

          {/* Wrapper centré uniquement si chat non visible */}
          <div
            className={`flex flex-col w-full ${
              !showChat ? "justify-center h-[60vh]" : ""
            }`}
          >
            {showChat && (
              <main
                ref={containerRef}
                className="bg-transparent text-white rounded-lg border-1 border-white shadow-xl p-4 h-[60vh] overflow-y-auto flex flex-col gap-3 mb-4"
              >
                {messages.map((m) => (
                  <MessageBubble key={m.id} msg={m} />
                ))}
                {loading && (
                  <div className="text-center text-sm font-grotesk text-gray-500">
                    Le bot réfléchit…
                  </div>
                )}
              </main>
            )}

            {/* Barre de question */}
            <footer className="flex gap-3 items-end">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 py-2 px-3 text-white font-grotesk bg-transparent  rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#447B56]"
                placeholder="Tape ta question ici ..."
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="px-5 py-2 border border-[#447B56] hover:bg-[#447B56] text-white font-grotesk rounded disabled:opacity-60 transition-transform duration-200 hover:-translate-y-1"
              >
                {loading ? "En cours..." : "Envoyer"}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
