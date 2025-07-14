"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { answerQuestionsAboutNexusFlow } from "@/ai/flows/answer-questions-about-nexusflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data to be passed to the AI.
const eventDetails = `
- Event: AI & The Future of Work, Date: 2 days from now, Description: A seminar on the impact of AI on various industries.
- Event: Quantum Computing Symposium, Date: 7 days from now, Description: Deep dive into quantum algorithms and hardware.
- Event: Web3 Developer Meetup, Date: 15 days from now, Description: Networking and talks on decentralized applications.
`;

const resourceStatus = `
- Resource: Quantum Rig A-1, Status: Available, Location: Lab 3
- Resource: Supercomputer Cygnus, Status: Unavailable, Location: Data Center
- Resource: VR/AR Development Kit, Status: Available, Location: Innovation Hub
- Resource: High-Res 3D Printer, Status: Available, Location: Maker Space
- Resource: Bio-Sequencer Z-9, Status: Unavailable, Location: BioLab 1
`;

type Message = {
  role: "user" | "bot";
  content: string;
};

const initialState: { messages: Message[] } = {
  messages: [
    {
      role: "bot",
      content: "Hello! I'm the NexusFlow assistant. Ask me about events or resources.",
    },
  ],
};

async function chatAction(
  state: { messages: Message[] },
  formData: FormData
): Promise<{ messages: Message[] }> {
  const question = formData.get("question") as string;
  if (!question) {
    return state;
  }

  const userMessage: Message = { role: "user", content: question };
  const newMessages = [...state.messages, userMessage];

  try {
    const aiResponse = await answerQuestionsAboutNexusFlow({
      question,
      eventDetails,
      resourceStatus,
    });
    
    const botMessage: Message = { role: "bot", content: aiResponse.answer };
    return { messages: [...newMessages, botMessage] };
  } catch (error) {
    console.error(error);
    const errorMessage: Message = {
      role: "bot",
      content: "Sorry, I encountered an error. Please try again.",
    };
    return { messages: [...newMessages, errorMessage] };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" aria-label="Send message" disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
    </Button>
  );
}

export default function ChatBot() {
  const [state, formAction] = React.useActionState(chatAction, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [state.messages]);

  return (
    <Card className="flex flex-col h-[75vh]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span>AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {state.messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "bot" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-xs md:max-w-md p-3 rounded-xl",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="text-sm font-code whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form
          ref={formRef}
          action={async (formData) => {
            formAction(formData);
            formRef.current?.reset();
          }}
          className="flex items-center gap-2"
        >
          <Input
            name="question"
            placeholder="Ask about an event..."
            className="flex-1"
            autoComplete="off"
            required
          />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
