var nodeConfigBar = true;
var clickedNodeType = "global"; // default value "global"
var clickedNodeId = null;
var token = localStorage.getItem("token");
var userData = JSON.parse(localStorage.getItem("userData"));
var initialNodes = [
  {
    id: "7",
    position: { x: 275, y: 200 },
    type: "callBegin",
  },
];
var initialEdges = [];
var squadConfigBar = false;
var createAgentType = "multi";
var allWorkspaces = [];

const initialState = {
  nodeConfigBar: nodeConfigBar,
  clickedNodeType: clickedNodeType,
  clickedNodeId: clickedNodeId,
  initialNodes: initialNodes,
  initialEdges: initialEdges,
  squadConfigBar: squadConfigBar,
  createAgentType: createAgentType,
  token: token,
  userData: userData,
  allWorkspaces: allWorkspaces,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NODE_CONFIG_BAR":
      return {
        ...state,
        nodeConfigBar: action.payload,
      };
    case "SET_CLICKED_NODE_TYPE":
      return {
        ...state,
        clickedNodeType: action.payload,
      };
    case "SET_CLICKED_NODE_ID":
      return {
        ...state,
        clickedNodeId: action.payload,
      };
    case "SET_INITIAL_NODES":
      return {
        ...state,
        initialNodes: action.payload,
      };
    case "SET_INITIAL_EDGES":
      return {
        ...state,
        initialEdges: action.payload,
      };
    case "SET_SQUAD_CONFIG_BAR":
      return {
        ...state,
        squadConfigBar: action.payload,
      };
    case "CREATE_AGENT_TYPE":
      return {
        ...state,
        createAgentType: action.payload,
      };
    case "SET_TOKEN":
      return {
        ...state,
        token: action.payload,
      };
    case "SET_USER_DATA":
      return {
        ...state,
        userData: action.payload,
      };
    case "SET_ALL_WORKSPACES":
      return {
        ...state,
        allWorkspaces: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
