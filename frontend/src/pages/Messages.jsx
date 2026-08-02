import { useState, useEffect, useRef, useContext } from "react";
import { FiSend, FiSearch, FiPhone, FiVideo, FiInfo, FiCheck, FiArrowLeft, FiLayers } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";

function Messages() {
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  // Mock Conversations List
  const [conversations, setConversations] = useState([
    {
      id: "1",
      name: "Olivia Vance",
      avatar: "",
      role: "Client",
      lastMessage: "I reviewed your project proposal. Can you hop on a call tomorrow?",
      timestamp: "10:42 AM",
      unreadCount: 2,
      online: true,
      messages: [
        { id: 1, sender: "Olivia Vance", text: "Hey! Thanks for submitting the bid on the SaaS Dashboard project.", time: "10:35 AM", fromMe: false },
        { id: 2, sender: "Me", text: "Hi Olivia! Absolutely. I have built similar systems using React and TailwindCSS.", time: "10:38 AM", fromMe: true },
        { id: 3, sender: "Olivia Vance", text: "Great. Can you share links to your Github repository or live demo?", time: "10:40 AM", fromMe: false },
        { id: 4, sender: "Olivia Vance", text: "I reviewed your project proposal. Can you hop on a call tomorrow?", time: "10:42 AM", fromMe: false },
      ],
    },
    {
      id: "2",
      name: "Marcus Brody",
      avatar: "",
      role: "Freelancer",
      lastMessage: "I have finished optimizing the API routes. Let me know what you think.",
      timestamp: "Yesterday",
      unreadCount: 0,
      online: false,
      messages: [
        { id: 1, sender: "Marcus Brody", text: "Hello, I am starting work on the authentication middleware today.", time: "Tuesday 3:00 PM", fromMe: false },
        { id: 2, sender: "Me", text: "Awesome. Make sure to use JWT and keep token lifetime to 24 hours.", time: "Tuesday 3:15 PM", fromMe: true },
        { id: 3, sender: "Marcus Brody", text: "I have finished optimizing the API routes. Let me know what you think.", time: "Yesterday 5:00 PM", fromMe: false },
      ],
    },
    {
      id: "3",
      name: "Sophia Martinez",
      avatar: "",
      role: "Client",
      lastMessage: "Budget looks perfect. I will deposit funds into GigFlow Escrow.",
      timestamp: "3 days ago",
      unreadCount: 0,
      online: true,
      messages: [
        { id: 1, sender: "Sophia Martinez", text: "Hi there! I love your design portfolios. What is your rate for a mobile landing page?", time: "Monday 11:00 AM", fromMe: false },
        { id: 2, sender: "Me", text: "Thanks Sophia! My standard rate for landing page designs is ₹25,000.", time: "Monday 11:15 AM", fromMe: true },
        { id: 3, sender: "Sophia Martinez", text: "Budget looks perfect. I will deposit funds into GigFlow Escrow.", time: "Monday 11:30 AM", fromMe: false },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState("1");
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // Scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv?.messages, isTyping]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (!activeConv) return;
    if (activeConv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [activeConvId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const timeString = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMsg = {
      id: Date.now(),
      sender: "Me",
      text: inputText,
      time: timeString,
      fromMe: true,
    };

    // Update conversation message list
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: inputText,
            timestamp: "Just now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText("");
    triggerBotReply();
  };

  // Automated bot replies to make chat feel alive
  const triggerBotReply = () => {
    setIsTyping(true);
    
    const botResponses = [
      "Awesome! I'm on it. Let's sync on this shortly.",
      "That sounds reasonable. Can you provide the API documentation?",
      "I appreciate the quick update! I will review this tonight and get back to you.",
      "Perfect. I am going to make those updates in our GitHub branch right away.",
      "Sounds like a plan! Let's schedule a Zoom call for tomorrow.",
    ];

    const randomReply = botResponses[Math.floor(Math.random() * botResponses.length)];

    setTimeout(() => {
      setIsTyping(false);
      const timeString = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const botMsg = {
        id: Date.now() + 1,
        sender: activeConv.name,
        text: randomReply,
        time: timeString,
        fromMe: false,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: randomReply,
              timestamp: "Just now",
              messages: [...c.messages, botMsg],
            };
          }
          return c;
        })
      );
    }, 1800);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
      
      {/* LEFT COLUMN: CONVERSATION LIST */}
      <div
        className={`w-full md:w-80 h-full border-r border-slate-200 dark:border-slate-700 flex flex-col ${
          mobileShowChat ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 space-y-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Conversations
          </h2>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <FiSearch size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chat..."
              className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/10 text-xs h-9 transition"
            />
          </div>
        </div>

        {/* Chats scroll list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No conversations found.
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setMobileShowChat(true);
                }}
                className={`w-full flex items-center gap-3 p-4 text-left transition hover:bg-slate-50 dark:hover:bg-slate-900/40 ${
                  activeConvId === conv.id ? "bg-slate-50 dark:bg-slate-900/60" : ""
                }`}
              >
                {/* Avatar with status bullet */}
                <div className="relative">
                  <Avatar name={conv.name} src={conv.avatar} size="md" />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 dark:bg-white rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>

                {/* Details excerpt */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {conv.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.timestamp}
                    </span>
                  </div>
                  
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    {conv.role}
                  </span>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Unread dot */}
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-accent-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE CONVERSATION WINDOW */}
      <div
        className={`flex-1 h-full flex flex-col ${
          mobileShowChat ? "flex" : "hidden md:flex"
        }`}
      >
        {activeConv ? (
          <>
            {/* Header toolbar */}
            <div className="h-16 border-b border-slate-200 dark:border-slate-700 px-4 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                  title="Back to conversation list"
                >
                  <FiArrowLeft size={18} />
                </button>
                <div className="relative">
                  <Avatar name={activeConv.name} src={activeConv.avatar} size="sm" />
                  {activeConv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-400 dark:bg-white rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-none">
                    {activeConv.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {activeConv.online ? "Active Now" : "Offline"} • {activeConv.role}
                  </span>
                </div>
              </div>

              {/* Call headers */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition cursor-pointer" title="Voice Call">
                  <FiPhone size={16} />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition cursor-pointer" title="Video Call">
                  <FiVideo size={16} />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition cursor-pointer" title="Chat Info">
                  <FiInfo size={16} />
                </button>
              </div>
            </div>

            {/* Message history pane */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-slate-900/20 space-y-4">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.fromMe
                        ? "bg-slate-900 text-white rounded-br-none dark:bg-white dark:text-slate-950"
                        : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/60 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed break-words">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 justify-end ${
                      msg.fromMe ? "text-slate-400 dark:text-slate-500" : "text-slate-400"
                    }`}>
                      <span className="text-[9px]">{msg.time}</span>
                      {msg.fromMe && (
                        <div className="flex">
                          <FiCheck size={11} className="text-slate-400 dark:text-slate-500" />
                          <FiCheck size={11} className="text-slate-400 dark:text-slate-500 -ml-1.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl px-4 py-3 rounded-bl-none">
                    <div className="flex gap-1.5 items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input keyboard form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-3 bg-white dark:bg-slate-900"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Send message to ${activeConv.name}...`}
                className="flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/10 h-11"
              />
              <Button
                type="submit"
                disabled={!inputText.trim()}
                className="h-11 px-4 flex items-center justify-center shrink-0"
              >
                <FiSend size={15} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center p-8 bg-slate-50/20 dark:bg-slate-900/5">
            <FiLayers size={36} className="text-slate-300 dark:text-slate-700 mb-3" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-200">
              No conversation selected
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select a conversation from the sidebar to view chat details.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Messages;
