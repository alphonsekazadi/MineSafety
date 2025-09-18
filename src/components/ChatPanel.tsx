import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { Chat, Message } from '@progress/kendo-react-conversational-ui';
import { Button } from '@progress/kendo-react-buttons';

interface ChatPanelProps {
  onFilterChange?: (filter: any) => void;
  onSearch?: (query: string) => void;
  getIncidentStats?: () => Promise<{ today: number; mostCommonType: string }>;
}


function getInitialMessages(t: (key: string) => string) {
  return [
    {
      author: { id: 1, name: 'MineSafe Assistant' },
      text: t('chatbotInitial'),
      timestamp: new Date(),
    },
  ];
}

// Expanded command mappings and Q&A
const commandMappings = {
  "critical|urgent|emergency": { 
    filter: { logic: "and", filters: [{ field: "severity", operator: "eq", value: "Critical" }] },
    response: "Showing critical incidents"
  },
  "high|severe": { 
    filter: { logic: "and", filters: [{ field: "severity", operator: "eq", value: "High" }] },
    response: "Showing high severity incidents"
  },
  "medium|moderate": { 
    filter: { logic: "and", filters: [{ field: "severity", operator: "eq", value: "Medium" }] },
    response: "Showing medium severity incidents"
  },
  "low|minor": { 
    filter: { logic: "and", filters: [{ field: "severity", operator: "eq", value: "Low" }] },
    response: "Showing low severity incidents"
  },
  "clear|reset|remove filters": { 
    filter: null,
    response: "Filters cleared"
  },
  "today": { 
    filter: { 
      logic: "and", 
      filters: [{ 
        field: "date", 
        operator: "gte", 
        value: new Date(new Date().setHours(0, 0, 0, 0)) 
      }] 
    },
    response: "Showing incidents from today"
  },
  "yesterday": { 
    filter: { 
      logic: "and", 
      filters: [{ 
        field: "date", 
        operator: "gte", 
        value: new Date(new Date().setDate(new Date().getDate() - 1))
      }, { 
        field: "date", 
        operator: "lt", 
        value: new Date(new Date().setHours(0, 0, 0, 0))
      }] 
    },
    response: "Showing incidents from yesterday"
  },
  "this week": { 
    filter: { 
      logic: "and", 
      filters: [{ 
        field: "date", 
        operator: "gte", 
        value: new Date(new Date().setDate(new Date().getDate() - 7))
      }] 
    },
    response: "Showing incidents from this week"
  },
  "this month": { 
    filter: { 
      logic: "and", 
      filters: [{ 
        field: "date", 
        operator: "gte", 
        value: new Date(new Date().setDate(1))
      }] 
    },
    response: "Showing incidents from this month"
  },
  "help|what can you do|options|commands": {
    filter: undefined,
    response: null, // Will be filled dynamically with t('chatbotHelp')
  },
  "hello|hi|hey|greetings": {
    filter: undefined,
    response: "Hello! I'm your MineSafe Assistant. How can I help you with incident management today?"
  },
  "thank you|thanks|appreciate it": {
    filter: undefined,
    response: "You're welcome! Let me know if you need anything else. Stay safe! 🛡️"
  }
};

const ChatPanel: React.FC<ChatPanelProps> = ({ onFilterChange, onSearch, getIncidentStats }) => {
  const { t, language } = useI18n();
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(t));
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Reset initial message when language changes
  useEffect(() => {
    setMessages(getInitialMessages(t));
  }, [language]);
  // Custom send handler for fixed input
  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    handleSendMessage({ message: { text } });
    setInputValue("");
  };

  const user = { id: 0, name: "You" };

  const processNaturalLanguage = async (text: string) => {
    const lowerText = text.toLowerCase();

    // Location filter
    const locationMatch = lowerText.match(/(?:location|at|in|from)\s+(.+?)(?:\s|$|\.|\?)/);
    if (locationMatch) {
      const location = locationMatch[1].replace(/[.?]/, '').trim();
      return {
        filter: { 
          logic: "and", 
          filters: [{ field: "location", operator: "contains", value: location }] 
        },
        response: `🔍 Showing incidents at **${location}**`
      };
    }

    // Type filter
    const typeMatch = lowerText.match(/(?:type|kind of|category)\s+(.+?)(?:\s|$|\.|\?)/);
    if (typeMatch) {
      const type = typeMatch[1].replace(/[.?]/, '').trim();
      return {
        filter: { 
          logic: "and", 
          filters: [{ field: "type", operator: "contains", value: type }] 
        },
        response: `🔍 Showing **${type}** incidents`
      };
    }

    // Q&A: How many incidents today?
    if (/how many incidents (are )?(there )?(today|this day)/.test(lowerText)) {
      if (getIncidentStats) {
        try {
          const stats = await getIncidentStats();
          return {
            filter: undefined,
            response: `📊 There have been **${stats.today} incidents** reported today.`
          };
        } catch (error) {
          return {
            filter: undefined,
            response: "❌ Sorry, I can't retrieve today's incident count right now."
          };
        }
      }
      return {
        filter: undefined,
        response: "❌ Statistics feature is not available at the moment."
      };
    }

    // Q&A: Most common incident type
    if (/most common (incident )?type|what('s| is) the most common/.test(lowerText)) {
      if (getIncidentStats) {
        try {
          const stats = await getIncidentStats();
          return {
            filter: undefined,
            response: `📊 The most common incident type is **"${stats.mostCommonType}"**.`
          };
        } catch (error) {
          return {
            filter: undefined,
            response: "❌ Sorry, I can't retrieve the most common incident type right now."
          };
        }
      }
      return {
        filter: undefined,
        response: "❌ Statistics feature is not available at the moment."
      };
    }

    // Total incidents count
    if (/total incidents|how many incidents|incident count/.test(lowerText)) {
      return {
        filter: undefined,
        response: "📊 To get the total incident count, please check the statistics dashboard or ask about specific time periods like 'today'."
      };
    }

    // Predefined command mappings
    for (const [pattern, mapping] of Object.entries(commandMappings)) {
      if (new RegExp(pattern).test(lowerText)) {
        if (pattern.includes('help')) {
          return { ...mapping, response: t('chatbotHelp') };
        }
        return mapping;
      }
    }

    // Default response with suggestions
    return {
      filter: null,
      response: `🤔 I didn't understand that command. Try one of these:\n
• "Show critical incidents" 🚨
• "How many incidents today?" 📅
• "Filter by location: Main Shaft" 📍
• "Most common incident type?" 📊
• Type "help" for more options ℹ️`
    };
  };

  const handleSendMessage = async (event: any) => {
    const msg = event.message;
    
    if (!msg.text.trim()) return;

    // Append user message
    const userMessage: Message = {
      author: user,
      text: msg.text ?? "",
      timestamp: new Date(),
    };

  setMessages((prev) => [...prev, userMessage]);

    // Optionally call onSearch with the user's message text
    if (onSearch) {
      onSearch(msg.text ?? "");
    }

    try {
      // Process the message and get the result
  const result = await processNaturalLanguage(msg.text ?? "");

      // Optionally call onFilterChange if a filter is present
      if (typeof result.filter !== "undefined" && onFilterChange) {
        onFilterChange(result.filter);
      }

      // Add assistant response
      const assistantMessage: Message = {
        author: { id: 1, name: "MineSafe Assistant" },
        text: result.response ?? "",
        timestamp: new Date(),
      };

  setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Error response
      const errorMessage: Message = {
        author: { id: 1, name: "MineSafe Assistant" },
        text: "❌ Sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          rounded={"full"}
          fillMode="solid"
          themeColor={"primary"}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Open chat"}
          className="shadow-lg h-12 w-12 text-lg"
        >
          {open ? "✕" : "💬"}
        </Button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 chatpanel-window">
          <div className="p-3 border-b bg-gray-700 text-white">
            <div className="font-semibold flex items-center gap-2">
              <span>🤖</span>
              MineSafe Assistant
              <Button
                fillMode="flat"
                themeColor={"light"}
                className="ml-auto !p-1 !min-w-0 h-6 w-6"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                ✕
              </Button>
            </div>
          </div>
          <div className="flex-1 min-h-0 relative flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <Chat
                user={user}
                messages={messages}
                onMessageSend={handleSendMessage}
                width={"100%"}
                showToolbar={false}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-white p-2 border-t border-gray-200 flex items-center chatpanel-inputbar">
              {/* Custom input and send button */}
              <input
                type="text"
                className="flex-1 border rounded px-2 py-1 mr-2 focus:outline-none focus:ring"
                placeholder="Type a command or question..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                autoFocus
              />
              <Button themeColor="primary" onClick={handleSend} disabled={!inputValue.trim()}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPanel;