import React, { useCallback } from "react";
import dagre from "dagre";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
// import { initialEdges, initialNodes } from "./workflow.constants";
import CustomEdge from "./CustomEdge";
import CallBegin from "./customFeatures/CallBegin";
import Conversation from "./customFeatures/Conversation";
import Function from "./customFeatures/Function";
import TransferCall from "./TransferCall";
import CallEnd from "./customFeatures/CallEnd";
import ConversationOptions from "./ConversationOptions";
import CallTransfer from "./customFeatures/CallTransfer";
import PressDigit from "./customFeatures/PressDigit";
import NodeConfig from "./NodeConfig";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
// import DatabaseSchemaDemo from "./Retail/DatabaseSchemaDemo";

// Utility function for auto layout
const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 300;
  const nodeHeight = 150;

  // Set graph direction and other settings
  dagreGraph.setGraph({
    rankdir: direction,
    ranker: "network-simplex",
    align: "UL",
  });

  // Add nodes to the graph
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Apply layout
  dagre.layout(dagreGraph);

  // Get new node positions
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const nodeType = {
  callBegin: CallBegin,
  callEnd: CallEnd,
  conversation: Conversation,
  function: Function,
  transferCall: TransferCall,
  callTransfer: CallTransfer,
  pressDigit: PressDigit,
};

const edgeType = {
  customEdge: CustomEdge,
};

const Reactflow = () => {
  const dispatch = useDispatch();

  const nodeConfigBar = useSelector((state) => state.app.nodeConfigBar);
  const initialNodes = useSelector((state) => state.app.initialNodes);
  const initialEdges = useSelector((state) => state.app.initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `e${connection.source}-${connection.target}`,
        type: "customEdge",
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const flow = document.querySelector(".react-flow");
          if (flow) {
            flow.fitView?.();
          }
        });
      });
    },
    [nodes, edges, setNodes, setEdges]
  );

  // Function to handle updates from child nodes (e.g., Conversation)
  const handleNodeUpdate = (nodeId, updatedData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updatedData } }
          : node
      )
    );
  };

  // Map all nodes to include the onUpdate handler
  const nodesWithHandlers = nodes.map((node) => {
    // Add the onUpdate handler to conversation nodes
    if (node.type === "conversation") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    // Add the onUpdate handler to pressDigit nodes
    if (node.type === "pressDigit") {
      return {
        ...node,
        data: {
          ...node.data,
          onUpdate: (updatedData) => handleNodeUpdate(node.id, updatedData),
        },
      };
    }
    return node;
  });

  // Enhanced function to export flow data with sub-nodes
  const exportFlowData = () => {
    console.log("nodes:", nodes);

    // Create a mapping of all sub-node handles for reference
    const subNodeHandleMap = {};

    nodes.forEach((node) => {
      // Store the sub-node handle ID for each "conversation" node
      if (node.type === "conversation" && node.data?.inputs) {
        node.data.inputs.forEach((input) => {
          // Store the sub-node handle ID
          subNodeHandleMap[`source-${input.id}`] = {
            parentNodeId: node.id,
            subNodeId: input.id,
          };
        });
      }
      // Store the sub-node handle ID for each "pressDigit" node
      if (node.type === "pressDigit" && node.data?.inputs) {
        node.data.inputs.forEach((input) => {
          // Store the sub-node handle ID
          subNodeHandleMap[`source-${input.id}`] = {
            parentNodeId: node.id,
            subNodeId: input.id,
          };
        });
      }

      // Also handle dynamically added field connections
      if (node.data?.fields) {
        node.data.fields.forEach((field) => {
          subNodeHandleMap[`source-${field.id}`] = {
            parentNodeId: node.id,
            subNodeId: field.id,
          };
        });
      }
    });

    const formattedNodes = nodes.map((node) => {
      // Collect all inputs and dynamically added fields as sub-nodes
      const subNodes = [];

      // Add inputs as sub-nodes if they exist
      if (node.data?.inputs) {
        node.data.inputs.forEach((input) => {
          subNodes.push({
            id: input.id,
            parentId: node.id,
            label: input.label,
            type: input.type,
            handleId: `source-${input.id}`,
          });
        });
      }

      // Add fields as sub-nodes if they exist (for conversation node)
      if (node.type === "conversation" && node.data?.fields) {
        node.data.fields.forEach((field) => {
          subNodes.push({
            id: field.id,
            parentId: node.id,
            value: field.value,
            handleId: `source-${field.id}`,
          });
        });
      }
      // Add fields as sub-nodes if they exist (for pressDigit node)
      if (node.type === "pressDigit" && node.data?.fields) {
        node.data.fields.forEach((field) => {
          subNodes.push({
            id: field.id,
            parentId: node.id,
            value: field.value,
            handleId: `source-${field.id}`,
          });
        });
      }

      return {
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          ...node.data,
          subNodes, // Include sub-node details
        },
      };
    });

    const formattedEdges = edges.map((edge) => {
      // Check if the source handle is from a sub-node
      const sourceInfo =
        edge.sourceHandle && subNodeHandleMap[edge.sourceHandle];

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        animated: edge.animated,
        // Add sub-node information if this edge connects from a sub-node
        subNodeConnection: sourceInfo
          ? {
              parentNodeId: sourceInfo.parentNodeId,
              subNodeId: sourceInfo.subNodeId,
            }
          : null,
      };
    });

    const flowData = {
      nodes: formattedNodes,
      edges: formattedEdges,
    };

    console.log("Exported Flow Data with Sub-Nodes:", flowData);
  };

  return (
    // <div className="w-full h-9/10">
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodesWithHandlers}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="text-black font-bold"
        nodeTypes={nodeType}
        edgeTypes={edgeType}
        fitView
        onClick={(event) => {
          // Only set to global if clicking directly on the canvas
          if (event.target.classList.contains("react-flow__pane")) {
            dispatch({ type: "SET_CLICKED_NODE_TYPE", payload: "global" });
            dispatch({ type: "SET_NODE_CONFIG_BAR", payload: true });
            dispatch({ type: "SET_CLICKED_NODE_ID", payload: null });
          }
        }}
      >
        <Panel
          position="top-left"
          className=" bg-slate-900 text-white rounded-lg shadow-lg p-4"
        >
          <div className="flex flex-col gap-4">
            <ConversationOptions />
            <div className="flex flex-col gap-2">
              <button
                onClick={exportFlowData}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Export Flow Data
              </button>
              <button
                onClick={() => onLayout("LR")}
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Auto Layout
              </button>
            </div>
          </div>
        </Panel>
        {nodeConfigBar && (
          <Panel
            position="bottom-right"
            className=" bg-slate-900 text-slate-100 rounded-lg shadow-lg p-2"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-end items-center mb-2">
                <Button
                  className="text-gray-700 hover:bg-gray-100 hover:text-gray-400 cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    dispatch({ type: "SET_NODE_CONFIG_BAR", payload: false })
                  }
                >
                  <CircleX />
                </Button>
              </div>
              <NodeConfig />
            </div>
          </Panel>
        )}
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
};

export default Reactflow;
