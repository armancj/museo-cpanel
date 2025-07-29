/* eslint-disable @next/next/no-img-element */
'use client';
import { ChatInterface } from './component/ChatInterface';
import withAuth from '@/lib/withAuth';

const AIChat = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Chat de IA</h5>
                    <p className="mb-4">Consulta información sobre el museo y sus colecciones utilizando inteligencia artificial.</p>
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
};

export default withAuth(AIChat);
