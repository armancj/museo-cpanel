'use client';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Position,
    NodeTypes,
    MiniMap,
    Panel,
    useReactFlow,
    ReactFlowProvider,
    Handle
} from 'reactflow';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Card } from 'primereact/card';
import { UsersDatum } from '@/app/service/UserService';
import { UserRoles } from '@/app/(main)/pages/cultural-property-heritage/types';
import html2canvas from 'html2canvas';
import 'reactflow/dist/style.css';
import * as jsPDF from 'jspdf';
import { InstitutionResponse } from '@/app/service/InstitutionService';

const PROVINCE_COLORS = {
    'La Habana': '#e74c3c',
    'Artemisa': '#3498db',
    'Mayabeque': '#2ecc71',
    'Matanzas': '#f39c12',
    'Villa Clara': '#9b59b6',
    'Cienfuegos': '#1abc9c',
    'Sancti Spíritus': '#34495e',
    'Ciego de Ávila': '#e67e22',
    'Camagüey': '#95a5a6',
    'Las Tunas': '#8e44ad',
    'Holguín': '#27ae60',
    'Granma': '#f1c40f',
    'Santiago de Cuba': '#c0392b',
    'Guantánamo': '#2980b9',
    'Pinar del Río': '#16a085',
    'Isla de la Juventud': '#7f8c8d'
};

// Paleta de colores para municipios (diferentes tonos)
const MUNICIPALITY_COLORS = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#8e44ad',
    '#27ae60', '#f1c40f', '#c0392b', '#2980b9', '#16a085',
    '#7f8c8d', '#d35400', '#8e44ad', '#2c3e50', '#27ae60'
];

// Paleta de colores para instituciones (tonos más suaves)
const INSTITUTION_COLORS = [
    '#ec7063', '#5dade2', '#58d68d', '#f7dc6f', '#bb8fce',
    '#76d7c4', '#85929e', '#f0b27a', '#a9b2b6', '#d2b4de',
    '#82e0aa', '#f9e79f', '#cd6155', '#5499c7', '#52c4a5',
    '#909497', '#dc7633', '#a569bd', '#34495e', '#58d68d'
];

// Estructura del árbol jerárquico
interface TreeNode {
    id: string;
    name: string;
    type: 'root' | 'country' | 'province' | 'municipality' | 'institution' | 'user' | 'superAdmin';
    children: TreeNode[];
    data?: any;
    users?: UsersDatum[];
}

// Helper functions
const getUserInstitutionId = (user: UsersDatum): string | null => {
    if (user.institutionId) {
        return String(user.institutionId);
    }
    if (user.institution) {
        if (typeof user.institution === 'object') {
            return (user.institution as any).uuid || (user.institution as any).id || null;
        } else {
            return String(user.institution);
        }
    }
    return null;
};

const getProvinceColor = (provinceName: string): string => {
    return PROVINCE_COLORS[provinceName as keyof typeof PROVINCE_COLORS] || '#3498db';
};

const getMunicipalityColor = (index: number): string => {
    return MUNICIPALITY_COLORS[index % MUNICIPALITY_COLORS.length];
};

const getInstitutionColor = (index: number): string => {
    return INSTITUTION_COLORS[index % INSTITUTION_COLORS.length];
};


const buildOrgChartTree = (usersData: UsersDatum[]): TreeNode => {
    const activeUsers = usersData.filter(user => user.active);

    // Usuarios con ubicación geográfica
    const locationUsers = activeUsers.filter(user =>
        user.nationality && user.province &&
        user.roles !== 'Super Administrador' && user.roles !== UserRoles.superAdmin
    );

    const countriesMap = new Map<string, TreeNode>();
    const provincesMap = new Map<string, TreeNode>();
    const municipalitiesMap = new Map<string, TreeNode>();
    const institutionsMap = new Map<string, TreeNode>();

    locationUsers.forEach(user => {
        const countryName = user.nationality!;
        const provinceName = user.province!;
        const municipalName = user.municipal;
        const institutionId = getUserInstitutionId(user);
        const institutionName = (user.institution as InstitutionResponse)?.name ||
            (typeof user.institution === 'object' ? user.institution.name : null);

        if (!countriesMap.has(countryName)) {
            countriesMap.set(countryName, {
                id: `country-${countryName}`,
                name: countryName,
                type: 'country',
                children: [],
                users: []
            });
        }
        const countryNode = countriesMap.get(countryName)!;

        const provinceKey = `${countryName}-${provinceName}`;
        if (!provincesMap.has(provinceKey)) {
            const provinceNode: TreeNode = {
                id: `province-${provinceKey}`,
                name: provinceName,
                type: 'province',
                children: [],
                users: [],
                data: { countryName }
            };
            provincesMap.set(provinceKey, provinceNode);
            countryNode.children.push(provinceNode);
        }
        const provinceNode = provincesMap.get(provinceKey)!;

        if (user.roles === 'Administrador' || user.roles === UserRoles.administrator) {
            provinceNode.users = provinceNode.users || [];
            provinceNode.users.push(user);
            return;
        }

        if (!municipalName) {
            provinceNode.users = provinceNode.users || [];
            provinceNode.users.push(user);
            return;
        }

        const municipalKey = `${provinceKey}-${municipalName}`;
        if (!municipalitiesMap.has(municipalKey)) {
            const municipalNode: TreeNode = {
                id: `municipality-${municipalKey}`,
                name: municipalName,
                type: 'municipality',
                children: [],
                users: [],
                data: { countryName, provinceName }
            };
            municipalitiesMap.set(municipalKey, municipalNode);
            provinceNode.children.push(municipalNode);
        }
        const municipalNode = municipalitiesMap.get(municipalKey)!;

        if (user.roles === 'Especialista' || user.roles === UserRoles.manager) {
            municipalNode.users = municipalNode.users || [];
            municipalNode.users.push(user);
            return;
        }

        if (!institutionId || !institutionName) {
            municipalNode.users = municipalNode.users || [];
            municipalNode.users.push(user);
            return;
        }

        const institutionKey = `${municipalKey}-${institutionId}`;
        if (!institutionsMap.has(institutionKey)) {
            const institutionNode: TreeNode = {
                id: `institution-${institutionKey}`,
                name: institutionName,
                type: 'institution',
                children: [],
                users: [],
                data: {
                    countryName,
                    provinceName,
                    municipalName,
                    institutionId,
                    uuid: institutionId
                }
            };
            institutionsMap.set(institutionKey, institutionNode);
            municipalNode.children.push(institutionNode);
        }
        const institutionNode = institutionsMap.get(institutionKey)!;

        institutionNode.users = institutionNode.users || [];
        institutionNode.users.push(user);
    });

    const rootNode: TreeNode = {
        id: 'root',
        name: 'Organigrama',
        type: 'root',
        children: []
    };

    countriesMap.forEach(country => {
        rootNode.children.push(country);
    });

    return rootNode;
};

// Node Types
interface NodeData {
    label: string;
    type: 'root' | 'country' | 'province' | 'municipality' | 'institution' | 'user' | 'superAdmin';
    role?: string;
    provinceName?: string;
    provinceColor?: string;
    municipalityColor?: string;
    institutionColor?: string;
    avatarUrl?: string;
    description?: string;
    uuid?: string;
    email?: string;
    phone?: string;
    institutionName?: string;
    fullName?: string;
    childrenCount?: number;
    expanded?: boolean;
    onToggle?: () => void;
}

// Country Node Component
const CountryNode = ({ data }: { data: NodeData }) => (
    <>
        <Handle type="source" position={Position.Bottom} />
        <div style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            padding: '25px 35px',
            borderRadius: '20px',
            boxShadow: '0 12px 35px rgba(44, 62, 80, 0.25)',
            border: '4px solid #34495e',
            minWidth: '280px',
            textAlign: 'center',
            cursor: data.onToggle ? 'pointer' : 'default',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}
             onClick={data.onToggle}
             onMouseEnter={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1.05)';
                     e.currentTarget.style.boxShadow = '0 20px 50px rgba(44, 62, 80, 0.35)';
                 }
             }}
             onMouseLeave={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1)';
                     e.currentTarget.style.boxShadow = '0 12px 35px rgba(44, 62, 80, 0.25)';
                 }
             }}
        >
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #3498db, #2ecc71, #f39c12, #e74c3c)',
            }} />
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>🇨🇺</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{data.label}</div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '15px' }}>República de Cuba</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
                {data.childrenCount && (
                    <Badge
                        value={`${data.childrenCount} provincias`}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 12px'
                        }}
                    />
                )}
                {data.onToggle && (
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'all 0.2s ease'
                    }}>
                        {data.expanded ? '−' : '+'}
                    </div>
                )}
            </div>
        </div>
    </>
);

// Province Node Component
const ProvinceNode = ({ data }: { data: NodeData }) => (
    <>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        <div style={{
            background: `linear-gradient(135deg, ${data.provinceColor} 0%, ${data.provinceColor}dd 100%)`,
            color: 'white',
            padding: '20px 30px',
            borderRadius: '16px',
            boxShadow: `0 10px 30px ${data.provinceColor}40`,
            border: `3px solid ${data.provinceColor}`,
            minWidth: '240px',
            textAlign: 'center',
            cursor: data.onToggle ? 'pointer' : 'default',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'all 0.3s ease',
            position: 'relative'
        }}
             onClick={data.onToggle}
             onMouseEnter={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1.05)';
                     e.currentTarget.style.boxShadow = `0 15px 40px ${data.provinceColor}60`;
                 }
             }}
             onMouseLeave={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1)';
                     e.currentTarget.style.boxShadow = `0 10px 30px ${data.provinceColor}40`;
                 }
             }}
        >
            <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: data.provinceColor,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '2px solid white'
            }}>PROVINCIA</div>
            <div style={{ fontSize: '24px', marginBottom: '10px', marginTop: '8px' }}>🗺️</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{data.label}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                {data.childrenCount && (
                    <Badge
                        value={data.childrenCount}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px 8px'
                        }}
                    />
                )}
                {data.onToggle && (
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        {data.expanded ? '−' : '+'}
                    </div>
                )}
            </div>
        </div>
    </>
);

// Municipality Node Component
const MunicipalityNode = ({ data }: { data: NodeData }) => (
    <>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        <div style={{
            background: `linear-gradient(135deg, ${data.municipalityColor} 0%, ${data.municipalityColor}dd 100%)`,
            color: 'white',
            padding: '16px 24px',
            borderRadius: '14px',
            boxShadow: `0 8px 25px ${data.municipalityColor}30`,
            border: `2px solid ${data.municipalityColor}`,
            minWidth: '200px',
            textAlign: 'center',
            cursor: data.onToggle ? 'pointer' : 'default',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transition: 'all 0.3s ease',
            position: 'relative'
        }}
             onClick={data.onToggle}
             onMouseEnter={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1.05)';
                     e.currentTarget.style.boxShadow = `0 12px 35px ${data.municipalityColor}50`;
                 }
             }}
             onMouseLeave={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1)';
                     e.currentTarget.style.boxShadow = `0 8px 25px ${data.municipalityColor}30`;
                 }
             }}
        >
            <div style={{
                position: 'absolute',
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: data.municipalityColor,
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '9px',
                fontWeight: 'bold',
                border: '1px solid white'
            }}>MUNICIPIO</div>
            <div style={{ fontSize: '20px', marginBottom: '8px', marginTop: '6px' }}>🏛️</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '6px' }}>{data.label}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                {data.childrenCount && (
                    <Badge
                        value={data.childrenCount}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.4)',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px 6px'
                        }}
                    />
                )}
                {data.onToggle && (
                    <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}>
                        {data.expanded ? '−' : '+'}
                    </div>
                )}
            </div>
        </div>
    </>
);

// Institution Node Component
const InstitutionNode = ({ data }: { data: NodeData }) => (
    <>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
        <div style={{
            background: `linear-gradient(135deg, ${data.institutionColor} 0%, ${data.institutionColor}dd 100%)`,
            color: 'white',
            padding: '18px 28px',
            borderRadius: '16px',
            boxShadow: `0 10px 30px ${data.institutionColor}40`,
            border: `3px solid ${data.institutionColor}`,
            minWidth: '260px',
            textAlign: 'center',
            cursor: data.onToggle ? 'pointer' : 'default',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            position: 'relative',
            transition: 'all 0.3s ease'
        }}
             onClick={data.onToggle}
             onMouseEnter={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1.05)';
                     e.currentTarget.style.boxShadow = `0 15px 40px ${data.institutionColor}60`;
                 }
             }}
             onMouseLeave={(e) => {
                 if (data.onToggle) {
                     e.currentTarget.style.transform = 'scale(1)';
                     e.currentTarget.style.boxShadow = `0 10px 30px ${data.institutionColor}40`;
                 }
             }}
        >
            <div style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: data.institutionColor,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                border: '2px solid white'
            }}>INSTITUCIÓN</div>
            <div style={{ fontSize: '24px', marginBottom: '10px', marginTop: '8px' }}>🏢</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                {data.label.length > 30 ? `${data.label.substring(0, 30)}...` : data.label}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center' }}>
                {data.childrenCount && (
                    <Badge
                        value={`${data.childrenCount} empleados`}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px 8px'
                        }}
                    />
                )}
                {data.onToggle && (
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        {data.expanded ? '−' : '+'}
                    </div>
                )}
            </div>
            {/* Province indicator stripe */}
            {data.provinceName && (
                <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    height: '6px',
                    background: `linear-gradient(90deg, ${data.provinceColor}, ${data.provinceColor}dd)`,
                    borderBottomLeftRadius: '13px',
                    borderBottomRightRadius: '13px'
                }} />
            )}
        </div>
    </>
);

// User Node Component
const UserNode = ({ data }: { data: NodeData }) => {
    const getRoleColor = () => {
        switch (data.role) {
            case UserRoles.superAdmin:
            case 'Super Administrador':
                return '#8e44ad';
            case UserRoles.administrator:
            case 'Administrador':
                return data.provinceColor || '#e74c3c';
            case UserRoles.manager:
            case 'Especialista':
                return data.municipalityColor || '#f39c12';
            case UserRoles.employee:
            case 'Técnico':
                return data.institutionColor || '#27ae60';
            default:
                return '#3498db';
        }
    };

    const getRoleIcon = () => {
        switch (data.role) {
            case UserRoles.superAdmin:
            case 'Super Administrador':
                return '⭐';
            case UserRoles.administrator:
            case 'Administrador':
                return '🛡️';
            case UserRoles.manager:
            case 'Especialista':
                return '👤';
            case UserRoles.employee:
            case 'Técnico':
                return '⚙️';
            default:
                return '👤';
        }
    };

    const getRoleTitle = () => {
        switch (data.role) {
            case UserRoles.superAdmin:
            case 'Super Administrador':
                return 'Super Administrador';
            case UserRoles.administrator:
            case 'Administrador':
                return 'Administrador Provincial';
            case UserRoles.manager:
            case 'Especialista':
                return 'Especialista Municipal';
            case UserRoles.employee:
            case 'Técnico':
                return 'Técnico';
            default:
                return 'Usuario';
        }
    };

    const roleColor = getRoleColor();

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div style={{
                background: 'white',
                border: `4px solid ${roleColor}`,
                borderRadius: '20px',
                padding: '0',
                minWidth: '300px',
                maxWidth: '300px',
                boxShadow: `0 12px 40px ${roleColor}30`,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
            }}
                 onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'scale(1.03)';
                     e.currentTarget.style.boxShadow = `0 20px 60px ${roleColor}40`;
                 }}
                 onMouseLeave={(e) => {
                     e.currentTarget.style.transform = 'scale(1)';
                     e.currentTarget.style.boxShadow = `0 12px 40px ${roleColor}30`;
                 }}
            >
                {/* Header con degradado */}
                <div style={{
                    background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 100%)`,
                    padding: '20px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    position: 'relative'
                }}>
                    {/* Avatar */}
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid rgba(255,255,255,0.3)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        {data.avatarUrl && !data.avatarUrl.includes('bamboo-watch.jpg') ? (
                            <img
                                src={data.avatarUrl}
                                alt={data.label}
                                style={{
                                    width: '54px',
                                    height: '54px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                        ) : (
                            <span style={{ fontSize: '28px', color: roleColor }}>
                                {getRoleIcon()}
                            </span>
                        )}
                    </div>

                    {/* Nombre y rol */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {data.label}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            opacity: 0.95,
                            fontWeight: '600',
                            background: 'rgba(255,255,255,0.2)',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            display: 'inline-block'
                        }}>
                            {getRoleTitle()}
                        </div>
                    </div>
                </div>

                {/* Cuerpo de la tarjeta */}
                <div style={{ padding: '16px' }}>
                    {/* Institución */}
                    {data.institutionName && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            marginBottom: '12px',
                            padding: '12px',
                            background: `linear-gradient(135deg, ${roleColor}10, ${roleColor}05)`,
                            borderRadius: '8px',
                            border: `2px solid ${roleColor}20`
                        }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>🏢</span>
                            <div>
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#2c3e50',
                                    lineHeight: '1.3',
                                    marginBottom: '2px'
                                }}>
                                    {data.institutionName.length > 25 ? `${data.institutionName.substring(0, 25)}...` : data.institutionName}
                                </div>
                                <div style={{
                                    fontSize: '10px',
                                    color: '#7f8c8d',
                                    fontWeight: '500'
                                }}>
                                    Institución de trabajo
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Información de contacto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.email && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '11px',
                                color: '#555',
                                padding: '6px 10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px'
                            }}>
                                <span style={{ fontSize: '14px' }}>✉️</span>
                                <span style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    flex: 1,
                                    fontWeight: '500'
                                }}>
                                    {data.email}
                                </span>
                            </div>
                        )}
                        {data.phone && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '11px',
                                color: '#555',
                                padding: '6px 10px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px'
                            }}>
                                <span style={{ fontSize: '14px' }}>📞</span>
                                <span style={{ fontWeight: '500' }}>{data.phone}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Indicador de provincia en la base */}
                {data.provinceName && (
                    <>
                        <div style={{
                            height: '4px',
                            background: `linear-gradient(90deg, ${data.provinceColor || data.municipalityColor || data.institutionColor}, ${data.provinceColor || data.municipalityColor || data.institutionColor}dd)`,
                            width: '100%'
                        }} />
                        <div style={{
                            padding: '6px 16px',
                            background: `linear-gradient(135deg, ${data.provinceColor || data.municipalityColor || data.institutionColor}15, ${data.provinceColor || data.municipalityColor || data.institutionColor}08)`,
                            textAlign: 'center',
                            fontSize: '10px',
                            fontWeight: '700',
                            color: data.provinceColor || data.municipalityColor || data.institutionColor,
                            borderTop: `1px solid ${data.provinceColor || data.municipalityColor || data.institutionColor}30`
                        }}>
                            📍 {data.provinceName}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

// Node types
const nodeTypes: NodeTypes = {
    country: CountryNode,
    province: ProvinceNode,
    municipality: MunicipalityNode,
    institution: InstitutionNode,
    user: UserNode
};

// Layout helper mejorado para evitar solapamientos y posicionar al mismo nivel
const calculateLayout = (nodes: Node[], edges: Edge[]) => {
    // Separar nodos por niveles
    const countryNodes = nodes.filter(n => n.type === 'country');
    const provinceNodes = nodes.filter(n => n.type === 'province');
    const municipalityNodes = nodes.filter(n => n.type === 'municipality');
    const institutionNodes = nodes.filter(n => n.type === 'institution');
    const userNodes = nodes.filter(n => n.type === 'user');

    let yPosition = 100;
    const levelSpacing = 350;
    const nodeSpacingX = 400;

    // 1. País (nivel superior)
    countryNodes.forEach((node) => {
        node.position = {
            x: 0, // Centro
            y: yPosition
        };
    });
    yPosition += levelSpacing;

    // 2. Provincias (distribuidas horizontalmente)
    const provinceCount = provinceNodes.length;
    const provinceStartX = -(provinceCount - 1) * nodeSpacingX / 2;
    provinceNodes.forEach((node, index) => {
        node.position = {
            x: provinceStartX + index * nodeSpacingX,
            y: yPosition
        };
    });
    yPosition += levelSpacing;

    // 3. Municipios y Administradores Provinciales (mismo nivel)
    let municipalityY = yPosition;
    const provinceMunicipalityMap = new Map<string, { municipalities: Node[], administrators: Node[] }>();

    // Agrupar municipios y administradores por provincia
    municipalityNodes.forEach((node) => {
        const parentProvinceEdge = edges.find(e => e.target === node.id && e.source.startsWith('province-'));
        if (parentProvinceEdge) {
            const provinceId = parentProvinceEdge.source;
            if (!provinceMunicipalityMap.has(provinceId)) {
                provinceMunicipalityMap.set(provinceId, { municipalities: [], administrators: [] });
            }
            provinceMunicipalityMap.get(provinceId)!.municipalities.push(node);
        }
    });

    // Agrupar administradores provinciales
    const provinceAdministrators = userNodes.filter(node =>
        node.data.role === 'Administrador' || node.data.role === UserRoles.administrator
    );

    provinceAdministrators.forEach((node) => {
        const parentProvinceEdge = edges.find(e => e.target === node.id && e.source.startsWith('province-'));
        if (parentProvinceEdge) {
            const provinceId = parentProvinceEdge.source;
            if (!provinceMunicipalityMap.has(provinceId)) {
                provinceMunicipalityMap.set(provinceId, { municipalities: [], administrators: [] });
            }
            provinceMunicipalityMap.get(provinceId)!.administrators.push(node);
        }
    });

    // Posicionar municipios y administradores en el mismo nivel
    provinceMunicipalityMap.forEach((group, provinceId) => {
        const parentProvince = nodes.find(n => n.id === provinceId);
        if (parentProvince) {
            const allNodesInLevel = [...group.municipalities, ...group.administrators];
            const totalNodes = allNodesInLevel.length;
            const startX = parentProvince.position.x - (totalNodes - 1) * 160;

            allNodesInLevel.forEach((node, index) => {
                node.position = {
                    x: startX + index * 320,
                    y: municipalityY
                };
            });
        }
    });
    yPosition = municipalityY + levelSpacing;

    // 4. Instituciones y Especialistas Municipales (mismo nivel)
    let institutionY = yPosition;
    const municipalityInstitutionMap = new Map<string, { institutions: Node[], specialists: Node[] }>();

    // Agrupar instituciones por municipio
    institutionNodes.forEach((node) => {
        const parentMunicipalityEdge = edges.find(e => e.target === node.id && e.source.startsWith('municipality-'));
        if (parentMunicipalityEdge) {
            const municipalityId = parentMunicipalityEdge.source;
            if (!municipalityInstitutionMap.has(municipalityId)) {
                municipalityInstitutionMap.set(municipalityId, { institutions: [], specialists: [] });
            }
            municipalityInstitutionMap.get(municipalityId)!.institutions.push(node);
        }
    });

    // Agrupar especialistas municipales
    const municipalitySpecialists = userNodes.filter(node =>
        node.data.role === 'Especialista' || node.data.role === UserRoles.manager
    );

    municipalitySpecialists.forEach((node) => {
        const parentMunicipalityEdge = edges.find(e => e.target === node.id && e.source.startsWith('municipality-'));
        if (parentMunicipalityEdge) {
            const municipalityId = parentMunicipalityEdge.source;
            if (!municipalityInstitutionMap.has(municipalityId)) {
                municipalityInstitutionMap.set(municipalityId, { institutions: [], specialists: [] });
            }
            municipalityInstitutionMap.get(municipalityId)!.specialists.push(node);
        }
    });

    // Posicionar instituciones y especialistas en el mismo nivel
    municipalityInstitutionMap.forEach((group, municipalityId) => {
        const parentMunicipality = nodes.find(n => n.id === municipalityId);
        if (parentMunicipality) {
            const allNodesInLevel = [...group.institutions, ...group.specialists];
            const totalNodes = allNodesInLevel.length;
            const startX = parentMunicipality.position.x - (totalNodes - 1) * 140;

            allNodesInLevel.forEach((node, index) => {
                node.position = {
                    x: startX + index * 280,
                    y: institutionY
                };
            });
        }
    });
    yPosition = institutionY + levelSpacing;

    // 5. Técnicos y empleados (nivel final)
    let userY = yPosition;
    const institutionUserMap = new Map<string, number>();

    const institutionEmployees = userNodes.filter(node =>
        node.data.role === 'Técnico' || node.data.role === UserRoles.employee
    );

    institutionEmployees.forEach((node) => {
        const parentEdge = edges.find(e => e.target === node.id && e.source.startsWith('institution-'));
        if (parentEdge) {
            const parent = nodes.find(n => n.id === parentEdge.source);
            if (parent) {
                if (!institutionUserMap.has(parent.id)) {
                    institutionUserMap.set(parent.id, 0);
                }
                const userIndex = institutionUserMap.get(parent.id)!;
                institutionUserMap.set(parent.id, userIndex + 1);

                const offsetX = (userIndex % 3 - 1) * 320;
                const offsetY = Math.floor(userIndex / 3) * 300;

                node.position = {
                    x: parent.position.x + offsetX,
                    y: userY + offsetY
                };
            }
        }
    });

    return { nodes, edges };
};

// Componente principal del organigrama
const OrganizationalChartFlow = ({ users }: { users: UsersDatum[] }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['country-Cuba'])); // Cuba expandido por defecto

    // Estados de filtrado
    const [searchText, setSearchText] = useState('');
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [showOnlyActive, setShowOnlyActive] = useState(true);

    const { fitView, zoomIn, zoomOut } = useReactFlow();

    // Filtrar usuarios según los criterios
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // Filtro de búsqueda
            if (searchText) {
                const search = searchText.toLowerCase();
                const fullName = `${user.name} ${user.lastName}`.toLowerCase();
                const email = user.email?.toLowerCase() || '';
                const institution = (user.institution as InstitutionResponse)?.name?.toLowerCase() || '';

                if (!fullName.includes(search) && !email.includes(search) && !institution.includes(search)) {
                    return false;
                }
            }

            // Filtro de provincia
            if (selectedProvince && user.province !== selectedProvince) {
                return false;
            }

            // Filtro de rol
            if (selectedRole && user.roles !== selectedRole) {
                return false;
            }

            return !(showOnlyActive && !user.active);
        });
    }, [users, searchText, selectedProvince, selectedRole, showOnlyActive]);

    // Opciones para dropdowns
    const provinceOptions = useMemo(() => {
        const provinces = Array.from(new Set(users.map(u => u.province).filter(Boolean)));
        return provinces.map(p => ({ label: p, value: p }));
    }, [users]);

    const roleOptions = useMemo(() => {
        const roles = Array.from(new Set(users.map(u => u.roles).filter(Boolean)));
        return roles.map(r => ({ label: r, value: r }));
    }, [users]);

    const toggleExpansion = useCallback((nodeId: string) => {
        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            } else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    }, []);

    // Construir nodos y edges del organigrama
    const buildChart = useCallback(() => {
        const tree = buildOrgChartTree(filteredUsers);
        const chartNodes: Node[] = [];
        const chartEdges: Edge[] = [];
        const edgeIdSet = new Set<string>(); // Para evitar edges duplicados

        // Contadores para colores únicos
        let municipalityColorIndex = 0;
        let institutionColorIndex = 0;

        const processNode = (node: TreeNode, parentId?: string) => {
            const nodeId = node.id;
            const isExpanded = expandedNodes.has(nodeId);

            // Crear nodo según su tipo
            if (node.type === 'country') {
                chartNodes.push({
                    id: nodeId,
                    type: 'country',
                    position: { x: 0, y: 0 },
                    data: {
                        label: node.name,
                        type: 'country',
                        childrenCount: node.children.length,
                        expanded: isExpanded,
                        onToggle: () => toggleExpansion(nodeId)
                    }
                });
            } else if (node.type === 'province') {
                const provinceColor = getProvinceColor(node.name);
                chartNodes.push({
                    id: nodeId,
                    type: 'province',
                    position: { x: 0, y: 0 },
                    data: {
                        label: node.name,
                        type: 'province',
                        provinceColor,
                        childrenCount: node.children.length + (node.users?.length || 0),
                        expanded: isExpanded,
                        onToggle: () => toggleExpansion(nodeId)
                    }
                });

                // Agregar usuarios de provincia (administradores) - MISMO NIVEL QUE MUNICIPIOS
                if (node.users && isExpanded) {
                    node.users.forEach((user, index) => {
                        const userNodeId = `${nodeId}-user-${user.uuid || index}`;
                        const avatarUrl = user.avatar?.id
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}file-storage/${user.avatar.id}`
                            : null;

                        chartNodes.push({
                            id: userNodeId,
                            type: 'user',
                            position: { x: 0, y: 0 },
                            data: {
                                label: `${user.name} ${user.lastName}`,
                                type: 'user',
                                role: user.roles,
                                provinceName: node.name,
                                provinceColor,
                                avatarUrl,
                                email: user.email,
                                phone: user.mobile,
                                institutionName: (user.institution as InstitutionResponse)?.name
                            }
                        });

                        const edgeId = `${nodeId}-to-${userNodeId}`;
                        if (!edgeIdSet.has(edgeId)) {
                            chartEdges.push({
                                id: edgeId,
                                source: nodeId,
                                target: userNodeId,
                                type: 'straight',
                                style: { stroke: provinceColor, strokeWidth: 3 }
                            });
                            edgeIdSet.add(edgeId);
                        }
                    });
                }
            } else if (node.type === 'municipality') {
                const provinceColor = getProvinceColor(node.data?.provinceName || '');
                const municipalityColor = getMunicipalityColor(municipalityColorIndex++);

                chartNodes.push({
                    id: nodeId,
                    type: 'municipality',
                    position: { x: 0, y: 0 },
                    data: {
                        label: node.name,
                        type: 'municipality',
                        provinceName: node.data?.provinceName,
                        provinceColor,
                        municipalityColor,
                        childrenCount: node.children.length + (node.users?.length || 0),
                        expanded: isExpanded,
                        onToggle: () => toggleExpansion(nodeId)
                    }
                });

                // Agregar usuarios de municipio (especialistas) - MISMO NIVEL QUE INSTITUCIONES
                if (node.users && isExpanded) {
                    node.users.forEach((user, index) => {
                        const userNodeId = `${nodeId}-user-${user.uuid || index}`;
                        const avatarUrl = user.avatar?.id
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}file-storage/${user.avatar.id}`
                            : null;

                        chartNodes.push({
                            id: userNodeId,
                            type: 'user',
                            position: { x: 0, y: 0 },
                            data: {
                                label: `${user.name} ${user.lastName}`,
                                type: 'user',
                                role: user.roles,
                                provinceName: node.data?.provinceName,
                                provinceColor,
                                municipalityColor,
                                avatarUrl,
                                email: user.email,
                                phone: user.mobile,
                                institutionName: (user.institution as InstitutionResponse)?.name
                            }
                        });

                        const edgeId = `${nodeId}-to-${userNodeId}`;
                        if (!edgeIdSet.has(edgeId)) {
                            chartEdges.push({
                                id: edgeId,
                                source: nodeId,
                                target: userNodeId,
                                type: 'straight',
                                style: { stroke: municipalityColor, strokeWidth: 3 }
                            });
                            edgeIdSet.add(edgeId);
                        }
                    });
                }
            } else if (node.type === 'institution') {
                const provinceColor = getProvinceColor(node.data?.provinceName || '');
                const institutionColor = getInstitutionColor(institutionColorIndex++);

                chartNodes.push({
                    id: nodeId,
                    type: 'institution',
                    position: { x: 0, y: 0 },
                    data: {
                        label: node.name,
                        type: 'institution',
                        provinceName: node.data?.provinceName,
                        provinceColor,
                        institutionColor,
                        childrenCount: node.users?.length || 0,
                        expanded: isExpanded,
                        onToggle: () => toggleExpansion(nodeId)
                    }
                });

                // Agregar usuarios de institución (técnicos y empleados)
                if (node.users && isExpanded) {
                    node.users.forEach((user, index) => {
                        const userNodeId = `${nodeId}-user-${user.uuid || index}`;
                        const avatarUrl = user.avatar?.id
                            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}file-storage/${user.avatar.id}`
                            : null;

                        chartNodes.push({
                            id: userNodeId,
                            type: 'user',
                            position: { x: 0, y: 0 },
                            data: {
                                label: `${user.name} ${user.lastName}`,
                                type: 'user',
                                role: user.roles,
                                provinceName: node.data?.provinceName,
                                provinceColor,
                                institutionColor,
                                avatarUrl,
                                email: user.email,
                                phone: user.mobile,
                                institutionName: node.name
                            }
                        });

                        const edgeId = `${nodeId}-to-${userNodeId}`;
                        if (!edgeIdSet.has(edgeId)) {
                            chartEdges.push({
                                id: edgeId,
                                source: nodeId,
                                target: userNodeId,
                                type: 'straight',
                                style: { stroke: institutionColor, strokeWidth: 3 }
                            });
                            edgeIdSet.add(edgeId);
                        }
                    });
                }
            }

            // Crear edge con el padre
            if (parentId) {
                const edgeId = `${parentId}-to-${nodeId}`;
                if (!edgeIdSet.has(edgeId)) {
                    const currentNode = chartNodes.find(n => n.id === nodeId);
                    let edgeColor = '#3498db';

                    if (currentNode?.data?.provinceColor) {
                        edgeColor = currentNode.data.provinceColor;
                    } else if (currentNode?.data?.municipalityColor) {
                        edgeColor = currentNode.data.municipalityColor;
                    } else if (currentNode?.data?.institutionColor) {
                        edgeColor = currentNode.data.institutionColor;
                    }

                    chartEdges.push({
                        id: edgeId,
                        source: parentId,
                        target: nodeId,
                        type: 'straight',
                        style: { stroke: edgeColor, strokeWidth: 4 }
                    });
                    edgeIdSet.add(edgeId);
                }
            }

            // Procesar hijos si el nodo está expandido
            if (isExpanded && node.children) {
                node.children.forEach(child => processNode(child, nodeId));
            }
        };

        // Procesar el árbol completo empezando desde el país
        tree.children.forEach(child => processNode(child));

        // Aplicar layout
        const { nodes: layoutNodes, edges: layoutEdges } = calculateLayout(chartNodes, chartEdges);

        setNodes(layoutNodes);
        setEdges(layoutEdges);
    }, [filteredUsers, expandedNodes, toggleExpansion, setNodes, setEdges]);

    // Funciones de control
    const handleReset = useCallback(() => {
        setSearchText('');
        setSelectedProvince(null);
        setSelectedRole(null);
        setShowOnlyActive(true);
        setExpandedNodes(new Set(['country-Cuba']));
    }, []);

    const handleFitView = useCallback(() => {
        fitView({ padding: 0.1, duration: 800 });
    }, [fitView]);

    const exportToPDF = useCallback(async () => {
        const element = document.querySelector('.react-flow') as HTMLElement;
        if (element) {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF.jsPDF('landscape', 'mm', 'a3');
            const imgWidth = 420;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('organigrama.pdf');
        }
    }, []);

    // Efecto para reconstruir el gráfico cuando cambien los filtros
    useEffect(() => {
        buildChart();
    }, [buildChart]);

    return (
        <div style={{ width: '100%', height: '70vh', position: 'relative' }}>
            {/* Panel de filtros compacto */}
            <Panel position="top-left" style={{ margin: '10px' }}>
                <Card className="p-2" style={{ minWidth: '300px', backgroundColor: 'rgba(255,255,255,0.95)', fontSize: '12px' }}>
                    <h6 className="m-0 mb-2">🔍 Filtros</h6>

                    <div className="p-fluid grid">
                        <div className="field col-12 mb-2">
                            <InputText
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full p-inputtext-sm"
                            />
                        </div>

                        <div className="field col-6 mb-2">
                            <Dropdown
                                value={selectedProvince}
                                options={[{ label: 'Todas', value: null }, ...provinceOptions]}
                                onChange={(e) => setSelectedProvince(e.value)}
                                placeholder="Provincia"
                                className="w-full p-dropdown-sm"
                            />
                        </div>
                        <div className="field col-6 mb-2">
                            <Dropdown
                                value={selectedRole}
                                options={[{ label: 'Todos', value: null }, ...roleOptions]}
                                onChange={(e) => setSelectedRole(e.value)}
                                placeholder="Rol"
                                className="w-full p-dropdown-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-content-between align-items-center gap-1">
                        <Button
                            label={showOnlyActive ? "Activos" : "Todos"}
                            onClick={() => setShowOnlyActive(!showOnlyActive)}
                            className={showOnlyActive ? "p-button-success" : "p-button-secondary"}
                            size="small"
                            style={{ fontSize: '11px', padding: '4px 8px' }}
                        />

                        <div className="flex gap-1">
                            <Button
                                icon="pi pi-refresh"
                                onClick={handleReset}
                                className="p-button-warning"
                                size="small"
                                style={{ padding: '4px 8px' }}
                            />
                            <Button
                                icon="pi pi-search-plus"
                                onClick={handleFitView}
                                className="p-button-info"
                                size="small"
                                style={{ padding: '4px 8px' }}
                            />
                        </div>
                    </div>
                </Card>
            </Panel>

            {/* Panel de estadísticas compacto */}
            <Panel position="top-right" style={{ margin: '10px' }}>
                <Card className="p-2" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                    <div className="text-sm">
                        <Badge value={filteredUsers.length} className="mr-2" />
                        <span style={{ fontSize: '11px' }}>de {users.length}</span>
                    </div>
                </Card>
            </Panel>

            {/* Panel de controles */}
            <Panel position="bottom-right" style={{ margin: '10px' }}>
                <div className="flex gap-2">
                    <Button
                        icon="pi pi-download"
                        onClick={exportToPDF}
                        className="p-button-help"
                        size="small"
                        tooltip="Exportar PDF"
                    />
                    <Button
                        icon="pi pi-plus"
                        onClick={() => zoomIn({ duration: 300 })}
                        className="p-button-secondary"
                        size="small"
                        tooltip="Zoom +"
                    />
                    <Button
                        icon="pi pi-minus"
                        onClick={() => zoomOut({ duration: 300 })}
                        className="p-button-secondary"
                        size="small"
                        tooltip="Zoom -"
                    />
                </div>
            </Panel>

            {/* ReactFlow */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-left"
                proOptions={{ hideAttribution: true }}
                style={{ backgroundColor: '#f8fafc' }}
            >
                <Controls showInteractive={false} />
                <Background color="#e5e7eb" gap={20} size={1} />
                <MiniMap
                    nodeColor={(node: Node) => {
                        if (node.type === 'country') return '#34495e';
                        return node.data?.provinceColor || node.data?.municipalityColor || node.data?.institutionColor || '#3498db';
                    }}
                    maskColor="rgba(240, 240, 240, 0.8)"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px'
                    }}
                />
            </ReactFlow>
        </div>
    );
};

// Componente wrapper con ReactFlowProvider
const OrganizationalChart = ({ users }: { users: UsersDatum[] }) => {
    return (
        <ReactFlowProvider>
            <OrganizationalChartFlow users={users} />
        </ReactFlowProvider>
    );
};

export default OrganizationalChart;
