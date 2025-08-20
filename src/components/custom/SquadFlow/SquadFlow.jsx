import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import React, { useCallback } from "react";
import CustomEdge from "../ReactFlow/CustomEdge";
import CustomNode from "./CustomNode";
import SelectFlow from "./SelectFlow";
import SquadEdit from "./SquadEdit";
import { useDispatch, useSelector } from "react-redux";
import { FileUp, RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dagre from "dagre";

const nodeTypes = {
  squads: CustomNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const initialNodes = [];

// Utility function for auto layout
const getLayoutedElements = (nodes, edges, direction = "LR") => {
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

const SquadFlow = () => {
  const dispatch = useDispatch();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const squadConfigBar = useSelector((state) => state.app.squadConfigBar);

  // Function to export essential node data
  const exportSquadData = () => {
    const essentialData = nodes.map(node => ({
      id: node.id,
      name: node.data?.label || '',
      description: node.data?.description || '',
      agentId: node.data?.agentId || ''
    }));

    // Get all valid node IDs
    const nodeIds = new Set(nodes.map(node => node.id));

    // Filter out edges that connect to non-existent nodes
    const validEdges = edges.filter(edge => 
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    console.log("Exported Squad Data:", {
      nodes: essentialData,
      edges: validEdges
    });
  };

  // remove any edge connections
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

  return (
    <div className="h-full w-full">
      <ReactFlow
        className="text-black font-bold"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        onClick={(event) => {
          // Only set to global if clicking directly on the canvas
          if (event.target.classList.contains("react-flow__pane")) {
            dispatch({ type: "SET_SQUAD_CONFIG_BAR", payload: false });
          }
        }}
      >
        <Panel
          position="top-left"
          className="bg-slate-900 text-white rounded-lg shadow-lg p-2"
        >
          <SelectFlow />
        </Panel>
        {squadConfigBar && (
          <Panel
            position="bottom-right"
            className="bg-slate-900 text-white rounded-lg shadow-lg p-2 font-normal"
          >
            <SquadEdit />
          </Panel>
        )}
        <Panel position="bottom-center">
          <div className="flex gap-2 bg-zinc-800 p-3 rounded-md">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={"cursor-pointer"}
                    onClick={exportSquadData}
                  >
                    <FileUp />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export to JSON</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className={"cursor-pointer"}
                    onClick={() => onLayout("LR")}
                  >
                    <RefreshCcwDot />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset Diagram</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Panel>
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </div>
  );
};

export default SquadFlow;
