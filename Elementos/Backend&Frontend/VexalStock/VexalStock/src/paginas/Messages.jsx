import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { getMessages, createMessage, updateMessage } from '@/api/backendClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/componentes/ui/button';
import { Input } from '@/componentes/ui/input';
import { Card } from '@/componentes/ui/card';
import { ScrollArea } from '@/componentes/ui/scroll-area';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function Messages() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  // Check URL params for direct message
  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to && to !== user.email) setSelectedChat(to);
  }, [user]);

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', user?.email],
    queryFn: async () => {
      const sent = await getMessages({ senderEmail: user.email });
      const received = await getMessages({ receiverEmail: user.email });
      return [...sent, ...received].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    },
    enabled: !!user,
    refetchInterval: 5000,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Get unique conversations
  const conversations = React.useMemo(() => {
    const chats = {};
    messages.forEach(m => {
      const otherEmail = m.sender_email === user?.email ? m.receiver_email : m.sender_email;
      const otherName = m.sender_email === user?.email ? m.receiver_email : (m.sender_name || m.sender_email);
      if (!chats[otherEmail]) {
        chats[otherEmail] = { email: otherEmail, name: otherName, lastMessage: m, unread: 0 };
      }
      if (new Date(m.created_date) > new Date(chats[otherEmail].lastMessage.created_date)) {
        chats[otherEmail].lastMessage = m;
      }
      if (m.receiver_email === user?.email && !m.is_read) {
        chats[otherEmail].unread++;
      }
    });
    return Object.values(chats).sort((a, b) => new Date(b.lastMessage.created_date) - new Date(a.lastMessage.created_date));
  }, [messages, user]);

  const chatMessages = messages.filter(m =>
    (m.sender_email === selectedChat && m.receiver_email === user?.email) ||
    (m.sender_email === user?.email && m.receiver_email === selectedChat)
  );

  // Mark as read
  useEffect(() => {
    if (!selectedChat || !user) return;
    chatMessages
      .filter(m => m.receiver_email === user.email && !m.is_read)
      .forEach(m => updateMessage(m.id, { is_read: true }));
  }, [chatMessages, selectedChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = useMutation({
    mutationFn: () => createMessage({
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      receiver_email: selectedChat,
      content: newMessage,
      product_title: new URLSearchParams(window.location.search).get('product') || '',
      is_read: false,
    }),
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold mb-6">Mensajes</h1>

      <Card className="overflow-hidden h-[calc(100vh-220px)] flex">
        {/* Sidebar */}
        <div className={`w-full sm:w-80 border-r border-border flex-shrink-0 flex flex-col ${selectedChat ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground">Conversaciones</p>
          </div>
          <ScrollArea className="flex-1">
            {conversations.length ? conversations.map(chat => (
              <button
                key={chat.email}
                className={`w-full text-left p-3 hover:bg-muted/50 transition-colors border-b border-border/50 ${selectedChat === chat.email ? 'bg-muted/50' : ''}`}
                onClick={() => setSelectedChat(chat.email)}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium truncate">{chat.name}</p>
                  {chat.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage.content}</p>
              </button>
            )) : (
              <div className="text-center py-12">
                <MessageCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Sin conversaciones</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden sm:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              <div className="p-3 border-b border-border flex items-center gap-2">
                <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setSelectedChat(null)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <p className="text-sm font-medium">{conversations.find(c => c.email === selectedChat)?.name || selectedChat}</p>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {chatMessages.map(m => (
                    <div key={m.id} className={`flex ${m.sender_email === user.email ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${m.sender_email === user.email ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-sm">{m.content}</p>
                        <p className={`text-[10px] mt-1 ${m.sender_email === user.email ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          {m.created_date ? format(new Date(m.created_date), 'HH:mm') : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && newMessage.trim() && sendMessage.mutate()}
                  className="rounded-xl"
                />
                <Button size="icon" className="rounded-xl flex-shrink-0" disabled={!newMessage.trim()} onClick={() => sendMessage.mutate()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}