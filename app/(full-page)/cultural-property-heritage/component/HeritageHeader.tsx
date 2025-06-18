import { Component } from 'react';
import {
    AccessAndUseConditions,
    AssociatedDocumentation, CulturalRecord, DescriptionControl, EntryAndLocation, Notes,
    ProducerAuthor
} from '@/app/(main)/pages/cultural-property-heritage/types';

export class HeritageHeader extends Component<{
    lightBg: string;
    creamBg: string;
    primaryColor: string;
    property: {
        createdAt: Date | undefined;
        deleted: boolean | undefined;
        updatedAt: Date | undefined;
        uuid: string | undefined;
        producerAuthor?: ProducerAuthor | undefined;
        accessAndUseConditions?: AccessAndUseConditions | undefined;
        associatedDocumentation?: AssociatedDocumentation | undefined;
        culturalRecord: CulturalRecord | undefined;
        notes?: Notes | undefined;
        entryAndLocation?: EntryAndLocation | undefined;
        descriptionControl?: DescriptionControl | undefined;
    };
    extractValue: undefined | any;
    extractValue1: undefined | any;
    onClick: () => void;
    ref: React.MutableRefObject<HTMLButtonElement>;
    onClick1: () => Promise<void>;
    shareButtonState: { text: string; style: { background: string; color: string } };
}> {
    render() {
        return (
            <div
                style={{
            padding: '1rem',
                background: `linear-gradient(135deg, ${this.props.lightBg} 0%, ${this.props.creamBg} 100%)`,
                color: '#2d3748',
                borderBottom: `3px solid ${this.props.primaryColor}30`
        }}
    >
        {/* Línea superior con badges */}
        <div
            style={{
            display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
                fontSize: '0.75rem'
        }}
    >
        <span
            style={{
            background: this.props.primaryColor,
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '8px',
                fontWeight: 600
        }}
    >
        FICHA PATRIMONIAL
        </span>
        <span
        style={{
            color: '#666',
                fontSize: '0.7rem'
        }}
    >
        ID: {this.props.property?.uuid?.slice(0, 8)}
        </span>
        </div>

        {/* Título principal */}
        <h1
            style={{
            fontSize: '1.1rem',
                fontWeight: 700,
                lineHeight: 1.3,
                margin: '0 0 0.5rem 0',
                color: this.props.primaryColor
        }}
    >
        {this.props.extractValue || 'Título no especificado'}
        </h1>

        {/* Tipo de patrimonio */}
        {this.props.extractValue1 && (
            <div
                style={{
            fontSize: '0.8rem',
                color: '#666',
                marginBottom: '0.75rem'
        }}
        >
        📋 {this.props.extractValue1}
            </div>
        )}

        {/* Botones de acción */}
        <div
            style={{
            display: 'flex',
                gap: '0.5rem',
                fontSize: '0.8rem'
        }}
    >
        <button
            onClick={this.props.onClick}
        style={{
            background: 'white',
                border: `1px solid ${this.props.primaryColor}40`,
                color: this.props.primaryColor,
                padding: '0.4rem 0.8rem',
                borderRadius: '15px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 500,
                boxShadow: `0 2px 4px ${this.props.primaryColor}15`
        }}
    >
    🖨️ Imprimir
        </button>
        <button
        ref={this.props.ref}
        onClick={this.props.onClick1}
        style={{
            background: this.props.shareButtonState.style.background,
                border: `1px solid ${this.props.primaryColor}40`,
                color: this.props.shareButtonState.style.color,
                padding: '0.4rem 0.8rem',
                borderRadius: '15px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 500,
                boxShadow: `0 2px 4px ${this.props.primaryColor}15`,
                transition: 'all 0.2s ease'
        }}
    >
        {this.props.shareButtonState.text}
        </button>
        </div>
        </div>
    );
    }
}
