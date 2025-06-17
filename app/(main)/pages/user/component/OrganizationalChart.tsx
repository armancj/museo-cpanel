'use client';
import React, { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Panel,
    MiniMap,
    useReactFlow,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from 'primereact/button';
import { UsersDatum } from '@/app/service/UserService';
import { InstitutionResponse, InstitutionService } from '@/app/service/InstitutionService';
import { FileStorageService } from '@/app/service/FileStorageService';
import { CountryService, CountryResponse } from '@/app/service/CountryService';
import { ProvinceService, ProvinceResponse } from '@/app/service/ProvinceService';
import { MunicipalityService, MunicipalityResponse } from '@/app/service/MunicipalityService';
import { UserRoles } from '@/app/(main)/pages/cultural-property-heritage/types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


export enum BackgroundVariant {
    Lines = "lines",
    Dots = "dots",
    Cross = "cross"
}

// Helper function to get user's institution ID (MOVIDA FUERA DEL COMPONENTE)
const getUserInstitutionId = (user: UsersDatum): string | null => {
    if (user.institutionId) {
        return String(user.institutionId);
    }

    if (user.institution) {
        if (typeof user.institution === 'object') {
            // Si institution es un objeto, extraer el UUID
            return (user.institution as any).uuid || (user.institution as any).id || null;
        } else {
            // Si institution es un string, usarlo directamente
            return String(user.institution);
        }
    }

    return null;
};

// Custom node component for geographic entities
const GeographicNode = ({ data, id }: { data: any; id: string }) => {
    let iconClass = 'pi pi-globe';
    let nodeColor = '#2196F3';

    switch (data.entityType) {
        case 'country':
            iconClass = 'pi pi-globe';
            nodeColor = '#2196F3';
            break;
        case 'province':
            iconClass = 'pi pi-map';
            nodeColor = '#4CAF50';
            break;
        case 'municipality':
            iconClass = 'pi pi-building';
            nodeColor = '#F44336';
            break;
        case 'institution':
            iconClass = 'pi pi-home';
            nodeColor = data.institutionColor || '#9C27B0';
            break;
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('🖱️ Node clicked:', id, 'hasChildren:', data.hasChildren, 'childrenCount:', data.childrenCount);

        if (data.hasChildren && data.onToggleExpand) {
            console.log('🔄 Calling onToggleExpand...');
            data.onToggleExpand(id);
        }
    };

    return (
        <div
            className="geographic-node"
            style={{
                background: 'white',
                border: `3px solid ${nodeColor}`,
                borderRadius: '12px',
                width: '180px',
                padding: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: data.hasChildren ? 'pointer' : 'default',
                userSelect: 'none'
            }}
            onClick={handleClick}
        >
            <div style={{ marginBottom: '8px' }}>
                <div
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: nodeColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        color: 'white',
                        fontSize: '1.5rem'
                    }}
                >
                    <i className={iconClass}></i>
                </div>
            </div>

            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#2c3e50' }}>
                {data.name}
            </div>

            <div style={{
                backgroundColor: nodeColor,
                color: 'white',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                display: 'inline-block',
                marginBottom: '8px'
            }}>
                {data.institutionName}
            </div>

            {data.hasChildren && (
                <div style={{
                    backgroundColor: data.isExpanded ? '#e8f5e8' : '#fff3e0',
                    border: `1px solid ${nodeColor}30`,
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: nodeColor
                }}>
                    {data.isExpanded ? '▼ CONTRAER' : '▶ EXPANDIR'} ({data.childrenCount})
                </div>
            )}
        </div>
    );
};

// Custom node component for users
const UserNode = ({ data }: { data: any }) => {
    let nodeColor = data.institutionColor || '#2196F3';
    let iconClass = 'pi pi-user';

    switch (data.roles) {
        case UserRoles.superAdmin:
            iconClass = 'pi pi-star';
            nodeColor = '#9C27B0';
            break;
        case UserRoles.administrator:
            iconClass = 'pi pi-shield';
            nodeColor = '#F44336';
            break;
        case UserRoles.manager:
            iconClass = 'pi pi-user';
            nodeColor = '#f97316';
            break;
        case UserRoles.employee:
            iconClass = 'pi pi-cog';
            nodeColor = '#b8152d';
            break;
    }

    let avatarContent;
    if (data.avatarUrl &&
        !data.avatarUrl.includes('user.png') &&
        !data.avatarUrl.includes('cog.png') &&
        !data.avatarUrl.includes('shield.png') &&
        !data.avatarUrl.includes('star.png') &&
        !data.avatarUrl.includes('/layout/images/')) {
        avatarContent = (
            <img
                src={data.avatarUrl}
                alt={data.name}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${nodeColor}`
                }}
            />
        );
    } else {
        avatarContent = (
            <div
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: nodeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.8rem'
                }}
            >
                <i className={iconClass}></i>
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            border: `3px solid ${nodeColor}`,
            borderRadius: '12px',
            width: '200px',
            padding: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
            <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                {avatarContent}
            </div>

            <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#2c3e50' }}>
                {data.name} {data.lastName}
            </div>

            <div style={{
                backgroundColor: nodeColor,
                color: 'white',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '11px',
                display: 'inline-block',
                marginBottom: '4px'
            }}>
                {data.roles}
            </div>

            {data.institutionName && data.institutionName !== data.roles && (
                <div style={{
                    backgroundColor: `${nodeColor}20`,
                    color: nodeColor,
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    border: `1px solid ${nodeColor}40`
                }}>
                    {data.institutionName}
                </div>
            )}
        </div>
    );
};

const nodeTypes = {
    userNode: UserNode,
    geographicNode: GeographicNode,
};

// Tree layout calculation
const calculateTreePositions = (
    nodes: any[],
    levelHeight = 300,
    nodeWidth = 200,
    nodeSpacing = 50
) => {
    const positions = new Map();
    const levelNodes = new Map();

    // Group nodes by level
    nodes.forEach((node: any) => {
        const level = node.level;
        if (!levelNodes.has(level)) {
            levelNodes.set(level, []);
        }
        levelNodes.get(level).push(node);
    });

    // Calculate positions for each level
    levelNodes.forEach((nodesInLevel, level) => {
        const totalWidth = nodesInLevel.length * (nodeWidth + nodeSpacing) - nodeSpacing;
        let startX = -totalWidth / 2;

        nodesInLevel.forEach((node: any, index: number) => {
            const x = startX + index * (nodeWidth + nodeSpacing);
            const y = level * levelHeight;
            positions.set(node.id, { x, y });
        });
    });

    return positions;
};

// Componente interno
const OrganizationalChartFlow = ({
                                     users,
                                     institutions,
                                     countries,
                                     provinces,
                                     municipalities,
                                     filteredUsers,
                                     loading
                                 }: {
    users: UsersDatum[];
    institutions: InstitutionResponse[];
    countries: CountryResponse[];
    provinces: ProvinceResponse[];
    municipalities: MunicipalityResponse[];
    filteredUsers: UsersDatum[];
    loading: boolean;
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
    const { fitView } = useReactFlow();

    // Generate colors
    const getInstitutionColor = useCallback((institutionId: any) => {
        const colors = [
            '#2196F3', '#4CAF50', '#f97316', '#9C27B0', '#F44336',
            '#009688', '#673AB7', '#FF5722', '#795548', '#607D8B'
        ];
        if (!institutionId) return colors[0];
        const hash = String(institutionId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    }, []);

    // Toggle expansion
    const toggleNodeExpansion = useCallback((nodeId: string) => {
        console.log('🔄 toggleNodeExpansion called with:', nodeId);

        setExpandedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                console.log('📤 Removing from expanded:', nodeId);
                newSet.delete(nodeId);

                // Remove children too based on hierarchy
                const [type] = nodeId.split('-');
                if (type === 'country') {
                    Array.from(newSet).forEach(expandedId => {
                        if (expandedId.startsWith('province-') ||
                            expandedId.startsWith('municipality-') ||
                            expandedId.startsWith('institution-')) {
                            newSet.delete(expandedId);
                        }
                    });
                } else if (type === 'province') {
                    Array.from(newSet).forEach(expandedId => {
                        if (expandedId.startsWith('municipality-') ||
                            expandedId.startsWith('institution-')) {
                            newSet.delete(expandedId);
                        }
                    });
                } else if (type === 'municipality') {
                    Array.from(newSet).forEach(expandedId => {
                        if (expandedId.startsWith('institution-')) {
                            newSet.delete(expandedId);
                        }
                    });
                }
            } else {
                console.log('📥 Adding to expanded:', nodeId);
                newSet.add(nodeId);
            }

            console.log('🔄 New expanded set:', Array.from(newSet));
            return newSet;
        });
    }, []);

    // Helper function to check if province has users in hierarchy
    const provinceHasUsers = useCallback((provinceName: string) => {
        const hasUsers = filteredUsers.some(user => user.province === provinceName);
        console.log(`🔍 Province ${provinceName} has users: ${hasUsers}`);
        return hasUsers;
    }, [filteredUsers]);

    // Helper function to check if municipality has users in hierarchy
    const municipalityHasUsers = useCallback((municipalityName: string) => {
        const hasUsers = filteredUsers.some(user => user.municipal === municipalityName);
        console.log(`🔍 Municipality ${municipalityName} has users: ${hasUsers}`);
        return hasUsers;
    }, [filteredUsers]);

    // Helper function to check if institution has users (CORREGIDO PARA OBJETOS)
    const institutionHasUsers = useCallback((institutionId: string) => {
        const usersInInstitution = filteredUsers.filter(user => {
            const userInstId = getUserInstitutionId(user);
            const matches = userInstId === institutionId;
            console.log(`👤 User ${user.name}: userInstId='${userInstId}', targetId='${institutionId}', matches=${matches}`);
            return matches;
        });

        const hasUsers = usersInInstitution.length > 0;
        console.log(`🏢 Institution ${institutionId} has ${usersInInstitution.length} users:`, usersInInstitution.map(u => u.name));
        return hasUsers;
    }, [filteredUsers]);

    // Check if entity has direct children (CORREGIDO)
    const hasDirectChildren = useCallback((entityType: string, entityId: string, entityName?: string) => {
        console.log(`🔍 Checking direct children for ${entityType}: ${entityName || entityId}`);

        switch (entityType) {
            case 'country':
                // Solo cuenta provincias que tienen usuarios
                const hasProvincesWithUsers = provinces.some(p =>
                    p.country === entityName && provinceHasUsers(p.name)
                );
                console.log(`Country ${entityName}: hasProvincesWithUsers=${hasProvincesWithUsers}`);
                return hasProvincesWithUsers;

            case 'province':
                // Solo cuenta municipios que tienen usuarios + administradores de esta provincia
                const hasMunicipalitiesWithUsers = municipalities.some(m =>
                    m.province === entityName && municipalityHasUsers(m.name)
                );
                const hasAdminsInProvince = filteredUsers.some(u =>
                    u.roles === UserRoles.administrator && u.province === entityName
                );
                console.log(`Province ${entityName}: hasMunicipalitiesWithUsers=${hasMunicipalitiesWithUsers}, hasAdminsInProvince=${hasAdminsInProvince}`);
                return hasMunicipalitiesWithUsers || hasAdminsInProvince;

            case 'municipality':
                // Solo cuenta instituciones con usuarios + managers de este municipio
                console.log(`🔍 Checking municipality ${entityName}:`);

                const institutionsInMunicipality = institutions.filter(i => i.municipality === entityName);
                console.log(`🏢 Institutions in municipality ${entityName}:`, institutionsInMunicipality);

                const hasInstitutionsWithUsers = institutionsInMunicipality.some(i => {
                    const hasUsers = institutionHasUsers(i.uuid);
                    console.log(`🏢 Institution ${i.name} (${i.uuid}) has users: ${hasUsers}`);
                    return hasUsers;
                });

                const hasManagersInMunicipality = filteredUsers.some(u =>
                    u.roles === UserRoles.manager && u.municipal === entityName
                );
                console.log(`Municipality ${entityName}: hasInstitutionsWithUsers=${hasInstitutionsWithUsers}, hasManagersInMunicipality=${hasManagersInMunicipality}`);
                return hasInstitutionsWithUsers || hasManagersInMunicipality;

            case 'institution':
                // Solo cuenta empleados en esta institución (CORREGIDO)
                const hasEmployees = filteredUsers.some(u => {
                    const userInstId = getUserInstitutionId(u);
                    const belongsToInstitution = userInstId === entityId;
                    const isEmployee = u.roles === UserRoles.employee;
                    return belongsToInstitution && isEmployee;
                });
                console.log(`Institution ${entityId}: hasEmployees=${hasEmployees}`);
                return hasEmployees;

            default:
                return false;
        }
    }, [provinces, municipalities, institutions, filteredUsers, provinceHasUsers, municipalityHasUsers, institutionHasUsers]);

    // Count direct children (CORREGIDO)
    const getDirectChildrenCount = useCallback((entityType: string, entityId: string, entityName?: string) => {
        let count = 0;

        switch (entityType) {
            case 'country':
                // Solo cuenta provincias que tienen usuarios
                count = provinces.filter(p =>
                    p.country === entityName && provinceHasUsers(p.name)
                ).length;
                break;

            case 'province':
                // Cuenta municipios con usuarios + administradores de esta provincia
                const municipalitiesWithUsersCount = municipalities.filter(m =>
                    m.province === entityName && municipalityHasUsers(m.name)
                ).length;
                const adminCount = filteredUsers.filter(u =>
                    u.roles === UserRoles.administrator && u.province === entityName
                ).length;
                count = municipalitiesWithUsersCount + adminCount;
                break;

            case 'municipality':
                console.log(`📊 Counting children for municipality ${entityName}:`);

                // Cuenta instituciones con usuarios + managers de este municipio
                const institutionsInMunicipality = institutions.filter(i => i.municipality === entityName);
                console.log(`🏢 All institutions in municipality:`, institutionsInMunicipality);

                const institutionsWithUsersCount = institutionsInMunicipality.filter(i => {
                    const hasUsers = institutionHasUsers(i.uuid);
                    console.log(`🏢 Institution ${i.name} has users: ${hasUsers}`);
                    return hasUsers;
                }).length;

                const managerCount = filteredUsers.filter(u =>
                    u.roles === UserRoles.manager && u.municipal === entityName
                ).length;

                count = institutionsWithUsersCount + managerCount;
                console.log(`📊 Municipality ${entityName} total count: institutions=${institutionsWithUsersCount}, managers=${managerCount}, total=${count}`);
                break;

            case 'institution':
                // Solo cuenta empleados en esta institución (CORREGIDO)
                const employeesInInstitution = filteredUsers.filter(u => {
                    const userInstId = getUserInstitutionId(u);
                    const belongsToInstitution = userInstId === entityId;
                    const isEmployee = u.roles === UserRoles.employee;
                    return belongsToInstitution && isEmployee;
                });
                count = employeesInInstitution.length;
                console.log(`📊 Institution ${entityId} has ${count} employees:`, employeesInInstitution.map(u => u.name));
                break;

            default:
                count = 0;
        }

        console.log(`📊 Direct children count for ${entityType} ${entityName || entityId}: ${count}`);
        return count;
    }, [provinces, municipalities, institutions, filteredUsers, provinceHasUsers, municipalityHasUsers, institutionHasUsers]);

    // Create edge
    const createEdge = useCallback((sourceId: string, targetId: string, color: string): Edge => ({
        id: `edge-${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        type: 'smoothstep',
        animated: true,
        style: {
            stroke: color,
            strokeWidth: 3,
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: color,
        },
    }), []);

    // Build nodes and edges with correct logic
    useEffect(() => {
        if (loading) return;

        console.log('🔄 Building organizational chart...');

        const allNodes: Node[] = [];
        const allEdges: Edge[] = [];
        const treeNodes: any[] = [];

        // Level 0: Countries
        const countriesWithUsers = countries.filter(country =>
            provinces.some(p => p.country === country.name && provinceHasUsers(p.name))
        );

        countriesWithUsers.forEach((country) => {
            const countryNodeId = `country-${country.uuid}`;
            const hasChildren = hasDirectChildren('country', country.uuid, country.name);
            const isExpanded = expandedNodes.has(countryNodeId);
            const childrenCount = getDirectChildrenCount('country', country.uuid, country.name);

            treeNodes.push({
                id: countryNodeId,
                level: 0,
                parentId: null,
                type: 'geographicNode',
                data: {
                    name: country.name,
                    institutionName: 'País',
                    entityType: 'country',
                    hasChildren,
                    isExpanded,
                    childrenCount,
                    onToggleExpand: toggleNodeExpansion
                }
            });

            // Level 1: Provinces
            if (isExpanded) {
                const countryProvinces = provinces.filter(province =>
                    province.country === country.name && provinceHasUsers(province.name)
                );

                countryProvinces.forEach((province) => {
                    const provinceNodeId = `province-${province.uuid}`;
                    const hasChildren = hasDirectChildren('province', province.uuid, province.name);
                    const isProvinceExpanded = expandedNodes.has(provinceNodeId);
                    const childrenCount = getDirectChildrenCount('province', province.uuid, province.name);

                    treeNodes.push({
                        id: provinceNodeId,
                        level: 1,
                        parentId: countryNodeId,
                        type: 'geographicNode',
                        data: {
                            name: province.name,
                            institutionName: 'Provincia',
                            entityType: 'province',
                            hasChildren,
                            isExpanded: isProvinceExpanded,
                            childrenCount,
                            onToggleExpand: toggleNodeExpansion
                        }
                    });

                    allEdges.push(createEdge(countryNodeId, provinceNodeId, '#4CAF50'));

                    // Level 2: Administrators + Municipalities
                    if (isProvinceExpanded) {
                        // Administrators
                        const provinceAdmins = filteredUsers.filter(user =>
                            user.roles === UserRoles.administrator &&
                            user.province === province.name
                        );

                        provinceAdmins.forEach((admin) => {
                            let avatarUrl = '';
                            if (admin.avatar && admin.avatar.id) {
                                avatarUrl = FileStorageService.getFileUrl(admin.avatar.id);
                            }

                            const adminNodeId = `admin-${admin.uuid}`;
                            treeNodes.push({
                                id: adminNodeId,
                                level: 2,
                                parentId: provinceNodeId,
                                type: 'userNode',
                                data: {
                                    name: admin.name,
                                    lastName: admin.lastName,
                                    roles: admin.roles,
                                    institutionName: `Admin. ${admin.province}`,
                                    institutionColor: '#F44336',
                                    avatarUrl,
                                }
                            });

                            allEdges.push(createEdge(provinceNodeId, adminNodeId, '#F44336'));
                        });

                        // Municipalities
                        const provinceMunicipalities = municipalities.filter(municipality =>
                            municipality.province === province.name && municipalityHasUsers(municipality.name)
                        );

                        provinceMunicipalities.forEach((municipality) => {
                            const municipalityNodeId = `municipality-${municipality.uuid}`;
                            const hasChildren = hasDirectChildren('municipality', municipality.uuid, municipality.name);
                            const isMunicipalityExpanded = expandedNodes.has(municipalityNodeId);
                            const childrenCount = getDirectChildrenCount('municipality', municipality.uuid, municipality.name);

                            treeNodes.push({
                                id: municipalityNodeId,
                                level: 2,
                                parentId: provinceNodeId,
                                type: 'geographicNode',
                                data: {
                                    name: municipality.name,
                                    institutionName: 'Municipio',
                                    entityType: 'municipality',
                                    hasChildren,
                                    isExpanded: isMunicipalityExpanded,
                                    childrenCount,
                                    onToggleExpand: toggleNodeExpansion
                                }
                            });

                            allEdges.push(createEdge(provinceNodeId, municipalityNodeId, '#ff0741'));

                            // Level 3: Managers + Institutions
                            if (isMunicipalityExpanded) {
                                // Managers
                                const municipalityManagers = filteredUsers.filter(user =>
                                    user.roles === UserRoles.manager &&
                                    user.municipal === municipality.name
                                );

                                municipalityManagers.forEach((manager) => {
                                    let avatarUrl = '';
                                    if (manager.avatar && manager.avatar.id) {
                                        avatarUrl = FileStorageService.getFileUrl(manager.avatar.id);
                                    }

                                    const managerNodeId = `manager-${manager.uuid}`;
                                    treeNodes.push({
                                        id: managerNodeId,
                                        level: 3,
                                        parentId: municipalityNodeId,
                                        type: 'userNode',
                                        data: {
                                            name: manager.name,
                                            lastName: manager.lastName,
                                            roles: manager.roles,
                                            institutionName: `Especialista ${municipality.name}`,
                                            institutionColor: '#4CAF50',
                                            avatarUrl,
                                        }
                                    });

                                    allEdges.push(createEdge(municipalityNodeId, managerNodeId, '#4CAF50'));
                                });

                                // Institutions
                                const municipalityInstitutions = institutions.filter(institution => {
                                    const belongsToMunicipality = institution.municipality === municipality.name;
                                    const hasUsers = institutionHasUsers(institution.uuid);
                                    return belongsToMunicipality && hasUsers;
                                });

                                municipalityInstitutions.forEach((institution) => {
                                    const institutionNodeId = `institution-${institution.uuid}`;
                                    const hasChildren = hasDirectChildren('institution', institution.uuid);
                                    const isInstitutionExpanded = expandedNodes.has(institutionNodeId);
                                    const childrenCount = getDirectChildrenCount('institution', institution.uuid);
                                    const institutionColor = getInstitutionColor(institution.uuid);

                                    treeNodes.push({
                                        id: institutionNodeId,
                                        level: 3,
                                        parentId: municipalityNodeId,
                                        type: 'geographicNode',
                                        data: {
                                            name: institution.name,
                                            institutionName: 'Institución',
                                            entityType: 'institution',
                                            institutionColor,
                                            hasChildren,
                                            isExpanded: isInstitutionExpanded,
                                            childrenCount,
                                            onToggleExpand: toggleNodeExpansion
                                        }
                                    });

                                    allEdges.push(createEdge(municipalityNodeId, institutionNodeId, institutionColor));

                                    // Level 4: Employees
                                    if (isInstitutionExpanded) {
                                        const institutionEmployees = filteredUsers.filter(user => {
                                            const userInstId = getUserInstitutionId(user);
                                            const belongsToInstitution = userInstId === institution.uuid;
                                            const isEmployee = user.roles === UserRoles.employee;
                                            return belongsToInstitution && isEmployee;
                                        });

                                        institutionEmployees.forEach((employee) => {
                                            let avatarUrl = '';
                                            if (employee.avatar && employee.avatar.id) {
                                                avatarUrl = FileStorageService.getFileUrl(employee.avatar.id);
                                            }

                                            const employeeNodeId = `employee-${employee.uuid}`;
                                            treeNodes.push({
                                                id: employeeNodeId,
                                                level: 4,
                                                parentId: institutionNodeId,
                                                type: 'userNode',
                                                data: {
                                                    name: employee.name,
                                                    lastName: employee.lastName,
                                                    roles: employee.roles,
                                                    institutionName: institution.name,
                                                    institutionColor,
                                                    avatarUrl,
                                                }
                                            });

                                            allEdges.push(createEdge(institutionNodeId, employeeNodeId, institutionColor));
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

        // Calculate tree positions
        const positions = calculateTreePositions(treeNodes);

        // Convert tree nodes to ReactFlow nodes
        treeNodes.forEach(treeNode => {
            const position = positions.get(treeNode.id) || { x: 0, y: 0 };
            allNodes.push({
                id: treeNode.id,
                type: treeNode.type,
                position,
                data: treeNode.data
            });
        });

        setNodes(allNodes);
        setEdges(allEdges);

        setTimeout(() => fitView({ duration: 800, padding: 0.1 }), 100);
    }, [
        loading,
        expandedNodes,
        filteredUsers,
        institutions,
        countries,
        provinces,
        municipalities,
        setNodes,
        setEdges,
        fitView,
        toggleNodeExpansion,
        hasDirectChildren,
        getDirectChildrenCount,
        createEdge,
        getInstitutionColor,
        provinceHasUsers,
        municipalityHasUsers,
        institutionHasUsers
    ]);

    // Reset and expand functions
    const resetExpansions = useCallback(() => {
        setExpandedNodes(new Set());
    }, []);

    const expandAllCountries = useCallback(() => {
        const countriesWithUsers = countries.filter(country =>
            provinces.some(p => p.country === country.name && provinceHasUsers(p.name))
        );
        setExpandedNodes(new Set(countriesWithUsers.map(c => `country-${c.uuid}`)));
    }, [countries, provinces, provinceHasUsers]);

    // Export functions
    const exportAsImage = useCallback(() => {
        const flowElement = document.querySelector('.react-flow');
        if (!flowElement) return;

        html2canvas(flowElement as HTMLElement, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `organigrama_${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        });
    }, []);

    const exportAsPDF = useCallback(() => {
        const flowElement = document.querySelector('.react-flow');
        if (!flowElement) return;

        html2canvas(flowElement as HTMLElement, {
            backgroundColor: '#ffffff',
            scale: 1.5
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a3'
            });

            const imgWidth = 400;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`organigrama_${new Date().toISOString().split('T')[0]}.pdf`);
        });
    }, []);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
            defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        >
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
            <MiniMap
                nodeColor={(node: Node) => {
                    if (node.type === 'geographicNode') return '#e0e0e0';
                    return node.data?.institutionColor || '#2196F3';
                }}
                maskColor="rgba(240, 240, 240, 0.8)"
            />
            <Panel position="top-right">
                <div className="flex flex-column gap-2">
                    <Button
                        icon="pi pi-refresh"
                        label="Resetear"
                        onClick={resetExpansions}
                        className="p-button-sm p-button-secondary"
                        tooltip="Contraer todos los nodos"
                    />
                    <Button
                        icon="pi pi-plus-circle"
                        label="Expandir"
                        onClick={expandAllCountries}
                        className="p-button-sm p-button-info"
                        tooltip="Expandir países"
                    />
                    <div style={{ borderTop: '1px solid #dee2e6', margin: '4px 0' }} />
                    <Button
                        icon="pi pi-image"
                        label="PNG"
                        onClick={exportAsImage}
                        className="p-button-sm p-button-success"
                        tooltip="Exportar como imagen PNG"
                    />
                    <Button
                        icon="pi pi-file-pdf"
                        label="PDF"
                        onClick={exportAsPDF}
                        className="p-button-sm p-button-danger"
                        tooltip="Exportar como PDF"
                    />
                </div>
            </Panel>
        </ReactFlow>
    );
};

// Componente principal
export const OrganizationalChart = ({ users }: { users: UsersDatum[] }) => {
    const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);
    const [countries, setCountries] = useState<CountryResponse[]>([]);
    const [provinces, setProvinces] = useState<ProvinceResponse[]>([]);
    const [municipalities, setMunicipalities] = useState<MunicipalityResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [authUser, setAuthUser] = useState<UsersDatum | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<UsersDatum[]>([]);

    useEffect(() => {
        try {
            const authUserStr = localStorage.getItem('authUser');
            if (authUserStr) {
                const user = JSON.parse(authUserStr) as UsersDatum;
                setAuthUser(user);
            }
        } catch (error) {
            console.error('Error getting authenticated user:', error);
        }
    }, []);

    useEffect(() => {
        if (!authUser) return;

        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const institutionsData = await InstitutionService.getInstitutions({});
                setInstitutions(institutionsData);

                switch (authUser.roles) {
                    case UserRoles.superAdmin:
                        const countriesData = await CountryService.getCountries({});
                        setCountries(countriesData);
                        const allProvinces = await ProvinceService.getProvinces({});
                        setProvinces(allProvinces);
                        const allMunicipalities = await MunicipalityService.getMunicipalities({});
                        setMunicipalities(allMunicipalities);
                        setFilteredUsers(users);
                        break;

                    case UserRoles.administrator:
                        if (authUser.nationality) {
                            const countryData = await CountryService.getCountries({ name: authUser.nationality });
                            setCountries(countryData);
                            if (authUser.province) {
                                const provinceData = await ProvinceService.getProvinces({ name: authUser.province });
                                setProvinces(provinceData);
                                const municipalitiesData = await MunicipalityService.getMunicipalities({ name: authUser.province });
                                setMunicipalities(municipalitiesData);
                            }
                        }
                        setFilteredUsers(users.filter(user =>
                            user.nationality === authUser.nationality &&
                            user.province === authUser.province
                        ));
                        break;

                    case UserRoles.manager:
                        if (authUser.nationality && authUser.province && authUser.municipal) {
                            const countryData = await CountryService.getCountries({ name: authUser.nationality });
                            setCountries(countryData);
                            const provinceData = await ProvinceService.getProvinces({ name: authUser.province });
                            setProvinces(provinceData);
                            const municipalityData = await MunicipalityService.getMunicipalities({ name: authUser.municipal });
                            setMunicipalities(municipalityData);
                        }
                        setFilteredUsers(users.filter(user =>
                            user.nationality === authUser.nationality &&
                            user.province === authUser.province &&
                            user.municipal === authUser.municipal
                        ));
                        break;

                    case UserRoles.employee:
                        if (authUser.institutionId || authUser.institution) {
                            const authInstitution = authUser.institutionId || authUser.institution;
                            setFilteredUsers(users.filter(user =>
                                (user.institutionId || user.institution) === authInstitution ||
                                user.uuid === authUser.uuid
                            ));
                        } else {
                            setFilteredUsers(users.filter(user => user.uuid === authUser.uuid));
                        }
                        break;

                    default:
                        setFilteredUsers(users);
                        break;
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [authUser, users]);

    return (
        <div style={{ width: '100%', height: '80vh' }}>
            {loading ? (
                <div className="flex align-items-center justify-content-center h-full">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                    <span className="ml-2">Cargando organigrama...</span>
                </div>
            ) : (
                <ReactFlowProvider>
                    <OrganizationalChartFlow
                        users={users}
                        institutions={institutions}
                        countries={countries}
                        provinces={provinces}
                        municipalities={municipalities}
                        filteredUsers={filteredUsers}
                        loading={loading}
                    />
                </ReactFlowProvider>
            )}
        </div>
    );
};
