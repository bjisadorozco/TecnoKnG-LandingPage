"use client"

import * as React from "react"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
}

const quickReplies = [
  "¿Cuáles son tus horarios?",
  "¿Haces servicio a domicilio?",
  "¿Cuánto cuesta reparar una pantalla?",
  "¿Ofreces garantía?",
]

const botResponses: Record<string, string> = {
  horarios: "Mi horario de atención es de Lunes a Sábado de 9:00 AM a 7:00 PM. ¡Estoy aquí para ayudarte!",
  domicilio:
    "¡Sí! Ofrezco servicio a domicilio para diagnósticos y reparaciones menores. El costo adicional es de $10 dentro de la zona metropolitana.",
  pantalla:
    "El costo de reparación de pantalla varía según el modelo. Para celulares va desde $15 hasta $150. Para laptops desde $80 hasta $300. ¿Qué dispositivo tienes?",
  garantía:
    "Todos mis servicios incluyen garantía de 30 a 90 días dependiendo del tipo de reparación. Los repuestos tienen su propia garantía del fabricante.",
  default:
    "¡Gracias por tu mensaje! Te responderé lo antes posible. También puedes llamarme al +1 (555) 123-4567 para atención inmediata.",
}

function getBotResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("horario")) return botResponses.horarios
  if (lowerMessage.includes("domicilio") || lowerMessage.includes("casa")) return botResponses.domicilio
  if (lowerMessage.includes("pantalla") || lowerMessage.includes("screen")) return botResponses.pantalla
  if (lowerMessage.includes("garantía") || lowerMessage.includes("warranty")) return botResponses.garantía

  return botResponses.default
}

export function Chatbox() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy el asistente virtual de DasTech. ¿En qué puedo ayudarte hoy?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = React.useState("")
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: getBotResponse(content),
      isBot: true,
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, botMessage])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 md:bottom-8 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
      </button>

      {/* Chat Window - Corregida estructura del chatbox */}
      <div
        className={`fixed bottom-24 md:bottom-8 right-6 z-50 w-[calc(100vw-3rem)] max-w-md transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col h-[500px] max-h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Asistente DasTech</h3>
                <p className="text-xs text-primary-foreground/70">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              aria-label="Cerrar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.isBot
                      ? "bg-background-secondary text-foreground rounded-bl-md"
                      : "bg-primary text-primary-foreground rounded-br-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {!message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-background-secondary">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-border shrink-0">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(reply)}
                  className="px-3 py-1.5 rounded-full bg-background-secondary text-foreground-secondary text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input - Arreglado el input que se veía entrecortado */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border shrink-0">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-background-secondary border border-border text-foreground placeholder-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 transition-all hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Enviar mensaje"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
