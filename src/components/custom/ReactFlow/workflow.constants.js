// export const initialNodes = [
//   {
//     id: "7",
//     position: { x: 275, y: 200 },
//     type: "callBegin",
//   },
// ];

// export const initialEdges = [];

export const initialNodes = [
  {
    id: "7",
    type: "callBegin",
    position: { x: 244.4461339958225, y: 199.0741252726007 },
    data: { subNodes: [] },
  },
  {
    id: "da884ff4-d868-408b-81c8-3f740d0d531b",
    type: "conversation",
    position: { x: 472.3274128233173, y: -45.16533645316178 },
    data: {
      label: "Conversation",
      description: "Add a conversation node",
      fields: [
        {
          id: "da84ce6a-e9e0-4771-9ed7-cf9d901dfeed",
          value: "How are you",
        },
        { id: "39da6c20-2079-4d17-b6df-f8845db002a9", value: "Hey bro" },
      ],
      subNodes: [
        {
          id: "da84ce6a-e9e0-4771-9ed7-cf9d901dfeed",
          parentId: "da884ff4-d868-408b-81c8-3f740d0d531b",
          value: "How are you",
          handleId: "source-da84ce6a-e9e0-4771-9ed7-cf9d901dfeed",
        },
        {
          id: "39da6c20-2079-4d17-b6df-f8845db002a9",
          parentId: "da884ff4-d868-408b-81c8-3f740d0d531b",
          value: "Hey bro",
          handleId: "source-39da6c20-2079-4d17-b6df-f8845db002a9",
        },
      ],
    },
  },
  {
    id: "61b2fd1a-d297-401d-a7bb-d21149285c81",
    type: "pressDigit",
    position: { x: 928.9553952148924, y: -64.58514994222159 },
    data: {
      label: "Press Digit",
      description: "Press digits option to user",
      fields: [
        { id: "19efb2c5-0503-42e1-8968-70bbb8bf719b", value: "2" },
        { id: "37f3caba-a717-4983-b345-e108ab151fc3", value: "3" },
      ],
      subNodes: [
        {
          id: "19efb2c5-0503-42e1-8968-70bbb8bf719b",
          parentId: "61b2fd1a-d297-401d-a7bb-d21149285c81",
          value: "2",
          handleId: "source-19efb2c5-0503-42e1-8968-70bbb8bf719b",
        },
        {
          id: "37f3caba-a717-4983-b345-e108ab151fc3",
          parentId: "61b2fd1a-d297-401d-a7bb-d21149285c81",
          value: "3",
          handleId: "source-37f3caba-a717-4983-b345-e108ab151fc3",
        },
      ],
    },
  },
  {
    id: "ee717a98-b948-4f8d-af49-532d0c6219bb",
    type: "callTransfer",
    position: { x: 867.4587214320055, y: 287.8950242909988 },
    data: {
      label: "Call Transfer",
      description: "Transfer the call to another agent",
      subNodes: [],
    },
  },
  {
    id: "8fabea51-0a9e-4ad6-93c1-307e3e6ceed6",
    type: "callEnd",
    position: { x: 1305.0504689325355, y: 174.3334877049646 },
    data: {
      label: "Call End",
      description: "End the call flow",
      subNodes: [],
    },
  },
  {
    id: "93152186-e6c9-4684-968e-b82a1465112a",
    type: "pressDigit",
    position: { x: 1259.464678901857, y: 393.43168160302235 },
    data: {
      label: "Press Digit",
      description: "Press digits option to user",
      fields: [{ id: "bf93046e-2c0b-425e-8509-d7db55cd1771", value: "6" }],
      subNodes: [
        {
          id: "bf93046e-2c0b-425e-8509-d7db55cd1771",
          parentId: "93152186-e6c9-4684-968e-b82a1465112a",
          value: "6",
          handleId: "source-bf93046e-2c0b-425e-8509-d7db55cd1771",
        },
      ],
    },
  },
  {
    id: "5146b56a-bcf1-4818-8c15-2403745ebb9f",
    type: "callEnd",
    position: { x: 1615.3438023047138, y: 503.3438023047137 },
    data: {
      label: "Call End",
      description: "End the call flow",
      subNodes: [],
    },
  },
  {
    id: "3cc778f2-121c-4eb9-bd15-2a992df59dea",
    type: "conversation",
    position: { x: 1368.0802011570183, y: -190.38935331057473 },
    data: {
      label: "Conversation",
      description: "Add a conversation node",
      fields: [
        { id: "5b0a97b7-822f-4209-baf4-383c5e538cd0", value: "Thank you" },
      ],
      subNodes: [
        {
          id: "5b0a97b7-822f-4209-baf4-383c5e538cd0",
          parentId: "3cc778f2-121c-4eb9-bd15-2a992df59dea",
          value: "Thank you",
          handleId: "source-5b0a97b7-822f-4209-baf4-383c5e538cd0",
        },
      ],
    },
  },
];

export const initialEdges = [
  {
    id: "e7-da884ff4-d868-408b-81c8-3f740d0d531b",
    source: "7",
    target: "da884ff4-d868-408b-81c8-3f740d0d531b",
    type: "customEdge",
    animated: true,
    subNodeConnection: null,
  },
  {
    id: "eda884ff4-d868-408b-81c8-3f740d0d531b-61b2fd1a-d297-401d-a7bb-d21149285c81",
    source: "da884ff4-d868-408b-81c8-3f740d0d531b",
    target: "61b2fd1a-d297-401d-a7bb-d21149285c81",
    sourceHandle: "source-da84ce6a-e9e0-4771-9ed7-cf9d901dfeed",
    type: "customEdge",
    animated: true,
    subNodeConnection: {
      parentNodeId: "da884ff4-d868-408b-81c8-3f740d0d531b",
      subNodeId: "da84ce6a-e9e0-4771-9ed7-cf9d901dfeed",
    },
  },
  {
    id: "eda884ff4-d868-408b-81c8-3f740d0d531b-ee717a98-b948-4f8d-af49-532d0c6219bb",
    source: "da884ff4-d868-408b-81c8-3f740d0d531b",
    target: "ee717a98-b948-4f8d-af49-532d0c6219bb",
    sourceHandle: "source-39da6c20-2079-4d17-b6df-f8845db002a9",
    type: "customEdge",
    animated: true,
    subNodeConnection: {
      parentNodeId: "da884ff4-d868-408b-81c8-3f740d0d531b",
      subNodeId: "39da6c20-2079-4d17-b6df-f8845db002a9",
    },
  },
  {
    id: "eee717a98-b948-4f8d-af49-532d0c6219bb-c146f805-a8b5-40ae-a0b1-855e1a181cc2",
    source: "ee717a98-b948-4f8d-af49-532d0c6219bb",
    target: "c146f805-a8b5-40ae-a0b1-855e1a181cc2",
    type: "customEdge",
    animated: true,
    subNodeConnection: null,
  },
  {
    id: "e61b2fd1a-d297-401d-a7bb-d21149285c81-8fabea51-0a9e-4ad6-93c1-307e3e6ceed6",
    source: "61b2fd1a-d297-401d-a7bb-d21149285c81",
    target: "8fabea51-0a9e-4ad6-93c1-307e3e6ceed6",
    sourceHandle: "source-37f3caba-a717-4983-b345-e108ab151fc3",
    type: "customEdge",
    animated: true,
    subNodeConnection: {
      parentNodeId: "61b2fd1a-d297-401d-a7bb-d21149285c81",
      subNodeId: "37f3caba-a717-4983-b345-e108ab151fc3",
    },
  },
  {
    id: "eee717a98-b948-4f8d-af49-532d0c6219bb-93152186-e6c9-4684-968e-b82a1465112a",
    source: "ee717a98-b948-4f8d-af49-532d0c6219bb",
    target: "93152186-e6c9-4684-968e-b82a1465112a",
    type: "customEdge",
    animated: true,
    subNodeConnection: null,
  },
  {
    id: "e93152186-e6c9-4684-968e-b82a1465112a-5146b56a-bcf1-4818-8c15-2403745ebb9f",
    source: "93152186-e6c9-4684-968e-b82a1465112a",
    target: "5146b56a-bcf1-4818-8c15-2403745ebb9f",
    sourceHandle: "source-bf93046e-2c0b-425e-8509-d7db55cd1771",
    type: "customEdge",
    animated: true,
    subNodeConnection: {
      parentNodeId: "93152186-e6c9-4684-968e-b82a1465112a",
      subNodeId: "bf93046e-2c0b-425e-8509-d7db55cd1771",
    },
  },
  {
    id: "e61b2fd1a-d297-401d-a7bb-d21149285c81-3cc778f2-121c-4eb9-bd15-2a992df59dea",
    source: "61b2fd1a-d297-401d-a7bb-d21149285c81",
    target: "3cc778f2-121c-4eb9-bd15-2a992df59dea",
    sourceHandle: "source-19efb2c5-0503-42e1-8968-70bbb8bf719b",
    type: "customEdge",
    animated: true,
    subNodeConnection: {
      parentNodeId: "61b2fd1a-d297-401d-a7bb-d21149285c81",
      subNodeId: "19efb2c5-0503-42e1-8968-70bbb8bf719b",
    },
  },
];
