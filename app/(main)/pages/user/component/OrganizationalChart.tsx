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
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from 'primereact/button';
import { UsersDatum } from '@/app/service/UserService';
import { InstitutionResponse, InstitutionService } from '@/app/service/InstitutionService';
import { FileStorageService } from '@/app/service/FileStorageService';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Custom node component to display user information with avatar
const UserNode = ({ data }) => {
  const avatarUrl = data.avatarUrl || '/layout/images/avatar.png'; // Default avatar if none exists

  return (
    <div className="user-node p-3 border-round shadow-2" style={{
      background: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      width: '220px',
      textAlign: 'center'
    }}>
      <div className="mb-2">
        <img
          src={avatarUrl}
          alt={data.name}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${data.institutionColor || '#2196F3'}`
          }}
        />
      </div>
      <div className="font-bold text-lg">{data.name} {data.lastName}</div>
      <div className="text-color-secondary">{data.roles}</div>
      {data.institutionName && (
        <div className="mt-2 p-1 text-sm" style={{
          backgroundColor: data.institutionColor || '#2196F3',
          color: 'white',
          borderRadius: '4px'
        }}>
          {data.institutionName}
        </div>
      )}
    </div>
  );
};

// Node types definition
const nodeTypes = {
  userNode: UserNode,
};

// Main component
export const OrganizationalChart = ({ users }: { users: UsersDatum[] }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [institutions, setInstitutions] = useState<InstitutionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate a color based on institution ID
  const getInstitutionColor = (institutionId: string) => {
    // List of colors for different institutions
    const colors = [
      '#2196F3', // Blue
      '#4CAF50', // Green
      '#FFC107', // Amber
      '#9C27B0', // Purple
      '#F44336', // Red
      '#009688', // Teal
      '#673AB7', // Deep Purple
      '#FF5722', // Deep Orange
      '#795548', // Brown
      '#607D8B', // Blue Grey
    ];

    // Use the institution ID to deterministically select a color
    if (!institutionId) return colors[0];

    // Simple hash function to convert institutionId to a number
    const hash = institutionId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return colors[hash % colors.length];
  };

  // Load institutions
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const institutionsData = await InstitutionService.getInstitutions({});
        setInstitutions(institutionsData);
      } catch (error) {
        console.error('Error fetching institutions:', error);
      }
    };

    fetchInstitutions();
  }, []);

  // Process users and create nodes and edges
  useEffect(() => {
    const processUsers = async () => {
      if (!users.length || !institutions.length) return;

      setLoading(true);

      try {
        // Create nodes for institutions (parent nodes)
        const institutionNodes: Node[] = [];
        const userNodes: Node[] = [];
        const connectionEdges: Edge[] = [];

        // Map to track institution positions
        const institutionPositions = new Map();

        // Group users by institution
        const usersByInstitution = users.reduce((acc, user) => {
          const institutionId = user.institutionId || 'no-institution';
          if (!acc[institutionId]) {
            acc[institutionId] = [];
          }
          acc[institutionId].push(user);
          return acc;
        }, {});

        // Calculate positions for institutions
        let institutionX = 0;
        const institutionY = 0;
        const institutionSpacing = 400;

        // Create institution nodes
        for (const institutionId in usersByInstitution) {
          if (institutionId === 'no-institution') {
            // Skip creating a node for users without institution
            institutionPositions.set(institutionId, { x: institutionX, y: institutionY });
            institutionX += institutionSpacing;
            continue;
          }

          const institution = institutions.find(inst => inst.uuid === institutionId);
          if (!institution) continue;

          const institutionColor = getInstitutionColor(institutionId);

          // Create institution node
          const institutionNode: Node = {
            id: `institution-${institutionId}`,
            type: 'userNode',
            position: { x: institutionX, y: institutionY },
            data: {
              name: institution.name,
              institutionName: 'Institución',
              institutionColor: institutionColor,
              avatarUrl: '/layout/images/institution.png' // Default institution icon
            }
          };

          institutionNodes.push(institutionNode);
          institutionPositions.set(institutionId, { x: institutionX, y: institutionY });
          institutionX += institutionSpacing;
        }

        // Process users and create user nodes
        for (const institutionId in usersByInstitution) {
          const usersInInstitution = usersByInstitution[institutionId];
          const institutionPos = institutionPositions.get(institutionId);

          if (!institutionPos) continue;

          // Calculate positions for users in this institution
          const userSpacing = 250;
          const usersPerRow = 3;

          usersInInstitution.forEach((user, index) => {
            const row = Math.floor(index / usersPerRow);
            const col = index % usersPerRow;

            const xPos = institutionPos.x - userSpacing + (col * userSpacing);
            const yPos = institutionPos.y + 200 + (row * 200);

            // Get institution details
            const institution = institutions.find(inst => inst.uuid === user.institutionId);
            const institutionName = institution ? institution.name : 'Sin institución';
            const institutionColor = getInstitutionColor(user.institutionId || '');

            // Get avatar URL
            let avatarUrl = '/layout/images/avatar.png';
            if (user.avatar && user.avatar.id) {
              avatarUrl = FileStorageService.getFileUrl(user.avatar.id);
            }

            // Create user node
            const userNode: Node = {
              id: `user-${user.uuid}`,
              type: 'userNode',
              position: { x: xPos, y: yPos },
              data: {
                name: user.name,
                lastName: user.lastName,
                roles: user.roles,
                institutionName,
                institutionColor,
                avatarUrl
              }
            };

            userNodes.push(userNode);

            // Create edge connecting user to institution
            if (institutionId !== 'no-institution') {
              const edge: Edge = {
                id: `edge-${institutionId}-${user.uuid}`,
                source: `institution-${institutionId}`,
                target: `user-${user.uuid}`,
                type: 'smoothstep',
                animated: false,
                style: { stroke: institutionColor }
              };

              connectionEdges.push(edge);
            }
          });
        }

        // Set nodes and edges
        setNodes([...institutionNodes, ...userNodes]);
        setEdges(connectionEdges);
      } catch (error) {
        console.error('Error processing users for organizational chart:', error);
      } finally {
        setLoading(false);
      }
    };

    processUsers();
  }, [users, institutions, setNodes, setEdges]);

  // Export chart as image
  const exportAsImage = useCallback(() => {
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return;

    html2canvas(flowElement as HTMLElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'organigrama.png';
      link.click();
    });
  }, []);

  // Export chart as PDF
  const exportAsPDF = useCallback(() => {
    const flowElement = document.querySelector('.react-flow');
    if (!flowElement) return;

    html2canvas(flowElement as HTMLElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
      });

      // Calculate dimensions to fit the image in the PDF
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('organigrama.pdf');
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '70vh' }}>
      {loading ? (
        <div className="flex align-items-center justify-content-center h-full">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <span className="ml-2">Cargando organigrama...</span>
        </div>
      ) : (
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <Background />
            <Panel position="top-right">
              <div className="flex gap-2">
                <Button
                  icon="pi pi-image"
                  label="Exportar PNG"
                  onClick={exportAsImage}
                  className="p-button-sm"
                />
                <Button
                  icon="pi pi-file-pdf"
                  label="Exportar PDF"
                  onClick={exportAsPDF}
                  className="p-button-sm p-button-danger"
                />
              </div>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>
      )}
    </div>
  );
};
