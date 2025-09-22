// src/components/MessageBubble.jsx
export default function MessageBubble({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={
          (isUser
            ? "bg-[#447B56]  text-white font-grotesk rounded-tr-2xl rounded-bl-2xl rounded-tl-xl"
            : "bg-[#BE7232] text-white font-grotesk rounded-tl-2xl rounded-br-2xl rounded-tr-xl") +
          " max-w-[80%] px-4 py-2 shadow-sm"
        }
      >
        <div className="whitespace-pre-wrap">{msg.text}</div>
        {msg.pending && <div className="text-xs opacity-60 mt-1">…</div>}
      </div>
    </div>
  );
}
