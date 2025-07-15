"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { answerQuestionsAboutQPlan } from "@/ai/flows/answer-questions-about-qplan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Event, Resource } from "@/lib/firebase-service";

type Message = {
  role: "user" | "bot";
  content: string;
};

type ChatBotProps = {
    events: Event[];
    resources: Resource[];
}

const initialState: { messages: Message[] } = {
  messages: [
    {
      role: "bot",
      content: "Hello! I'm the QPlan assistant. Ask me about events or resources.",
    },
  ],
};

export default function ChatBot({ events, resources }: ChatBotProps) {
    const chatAction = async (
      state: { messages: Message[] },
      formData: FormData
    ): Promise<{ messages: Message[] }> => {
        const question = formData.get("question") as string;
        if (!question) {
            return state;
        }

        const userMessage: Message = { role: "user", content: question };
        const newMessages = [...state.messages, userMessage];

        const eventDetails = events.map(e => `- Event: ${e.title}, Date: ${e.date.toDateString()}, Description: ${e.description}`).join('\n');
        const resourceStatus = resources.map(r => `- Resource: ${r.name}, Status: ${r.status}, Location: ${r.location}`).join('\n');

        try {
            const aiResponse = await answerQuestionsAboutQPlan({
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

  const [state, formAction] = useActionState(chatAction, initialState);
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

  function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size="icon" aria-label="Send message" disabled={pending}>
        {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
    );
  }

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
