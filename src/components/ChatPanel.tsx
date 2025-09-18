import React from "react";
import { Chat } from "@progress/kendo-react-conversational-ui";
import { Button } from "@progress/kendo-react-buttons";

interface Message {
  id?: number;
  author: { id: number; name: string };
  text: string;
  timestamp?: Date;
}

interface ChatPanelProps {
  onFilterChange?: (filter: any) => void;
  onSearch?: (query: string) => void;
}

const initialMessages: Message[] = [
  {
    id: 1,
    author: { id: 1, name: "MineSafe Assistant" },
    text: "Hi! I can help you filter incidents. Try: 'Show critical incidents', 'Filter by location: Main Shaft', 'High severity from yesterday', or 'Clear filters'.",
    timestamp: new Date(),
  },
];

// Natural language to filter mapping
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
  }
};

const ChatPanel: React.FC<ChatPanelProps> = ({ onFilterChange, onSearch }) => {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>(initialMessages);

  const user = { id: 0, name: "You" };

  const processNaturalLanguage = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Check for location-specific filters
    const locationMatch = lowerText.match(/(?:location|at|in)\s+(.+?)(?:\s|$)/);
    if (locationMatch) {
      const location = locationMatch[1].replace(/[.?]/, '').trim();
      return {
        filter: { 
          logic: "and", 
          filters: [{ field: "location", operator: "contains", value: location }] 
        },
        response: `Showing incidents at ${location}`
      };
    }

    // Check for type-specific filters
    const typeMatch = lowerText.match(/(?:type|kind of)\s+(.+?)(?:\s|$)/);
    if (typeMatch) {
      const type = typeMatch[1].replace(/[.?]/, '').trim();
      return {
        filter: { 
          logic: "and", 
          filters: [{ field: "type", operator: "contains", value: type }] 
        },
        response: `Showing ${type} incidents`
      };
    }

    // Check predefined command mappings
    for (const [pattern, mapping] of Object.entries(commandMappings)) {
      if (new RegExp(pattern).test(lowerText)) {
        return mapping;
      }
    }

    // Default response for unknown commands
    return {
      filter: null,
      response: "I didn't understand that command. Try: 'Show critical incidents', 'Filter by location: Main Shaft', or 'Clear filters'."
    };
  };

  const onMessageSend = (e: any) => {
    const msg = e.message;
    
    // Append user message
    const userMessage: Message = {
      id: Date.now(),
      author: user,
      text: msg.text,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Process the message and generate response
    setTimeout(() => {
      const result = processNaturalLanguage(msg.text);
      
      // Apply filter if callback provided
      if (result.filter !== undefined && onFilterChange) {
        onFilterChange(result.filter);
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now() + 1,
        author: { id: 1, name: "MineSafe Assistant" },
        text: result.response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <>
      {/* floating button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          rounded={"full"}
          fillMode="solid"
          themeColor={"primary"}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Open chat"}
          className="shadow-lg"
        >
          {open ? "✕" : "💬 Chat"}
        </Button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-40 w-80 h-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col border border-gray-200"
          role="dialog"
          aria-label="Chat window"
        >
          <div className="p-3 border-b bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <div className="font-semibold flex items-center gap-2">
              <span>🤖</span>
              MineSafe Assistant
            </div>
          </div>

          <div className="flex-1">
            <Chat 
              user={user} 
              messages={messages} 
              onMessageSend={onMessageSend}
              placeholder="Type a command like 'Show critical incidents'..."
              width={320}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPanel;