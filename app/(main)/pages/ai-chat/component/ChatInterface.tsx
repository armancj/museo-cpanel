'use client';
import { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { post } from '@/adapter/httpAdapter';

interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useRef<Toast>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of chat when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage: Message = {
            content: inputMessage,
            isUser: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Send message to AI API
            const response = await post<{ response: string }>('/ai/chat', {
                prompt: inputMessage
            });

            // Add AI response to chat
            const aiMessage: Message = {
                content: response.response,
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo obtener respuesta del asistente de IA',
                life: 3000
            });

            // Add error message to chat
            const errorMessage: Message = {
                content: 'Lo siento, no pude procesar tu solicitud en este momento. Por favor, intenta de nuevo más tarde.',
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTimestamp = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex flex-column h-full">
            <Toast ref={toast} />

            {/* Chat messages container */}
            <div
                ref={chatContainerRef}
                className="flex-grow-1 overflow-auto p-3"
                style={{ height: '500px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}
            >
                {messages.length === 0 ? (
                    <div className="flex flex-column align-items-center justify-content-center h-full text-center">
                        <i className="pi pi-comments text-primary" style={{ fontSize: '3rem' }}></i>
                        <h3 className="mt-3">Bienvenido al Asistente de IA del Museo</h3>
                        <p className="text-700">
                            Puedes preguntarme sobre las colecciones, exposiciones, historia y más.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex mb-3 ${msg.isUser ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            <div
                                className={`p-3 ${msg.isUser
                                    ? 'bg-primary text-white'
                                    : 'bg-white border-1 border-300'}`}
                                style={{
                                    borderRadius: '12px',
                                    maxWidth: '80%',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div className="white-space-pre-line" style={{ whiteSpace: 'pre-line' }}>
                                    {msg.content}
                                </div>
                                <div
                                    className={`text-right text-xs mt-1 ${msg.isUser ? 'text-100' : 'text-500'}`}
                                >
                                    {formatTimestamp(msg.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className="flex align-items-center mt-3">
                        <ProgressSpinner
                            style={{ width: '30px', height: '30px' }}
                            strokeWidth="4"
                            fill="transparent"
                            animationDuration=".5s"
                        />
                        <span className="ml-2 text-500">El asistente está escribiendo...</span>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="p-inputgroup mt-3">
                <InputText
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje aquí..."
                    disabled={isLoading}
                    className="p-3"
                />
                <Button
                    icon="pi pi-send"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-button-primary"
                />
            </div>
        </div>
    );
};
