import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/components/pages/Dashboard";
import AgentsLayout from "@/components/pages/agents/AgentsLayout";
import AgentsList from "@/components/pages/agents/AgentsList";
import ConversationsFlow from "@/components/pages/agents/ConversationsFlow";
//import KnowledgeBase from "./components/pages/KnowledgeBase";
import PhoneNumber from "./components/pages/PhoneNumber";
import CallHistory from "./components/pages/CallHistory";
import Billing from "./components/pages/Billing";
import Members from "./components/pages/Members";
import ProviderKeys from "./components/pages/ProviderKeys";
import Squads from "./components/pages/Squads";
import PhoneNumberRetell from "./components/pages/PhoneNumberRetell";
import BatchCall from "./components/pages/BatchCalls";
import Signup from "./components/pages/Signup";
import Signin from "./components/pages/Signin";
import { useSelector } from "react-redux";
import Reactflow from "./components/custom/ReactFlow/Reactflow";
// import CustomLLM from "@/components/pages/agents/CustomLLM";

export function AppRoutes() {
  const token = useSelector((state) => state.app.token);
  return (
    <Routes>
      {/* Redirect root to agents/list */}
      <Route path="/" element={<Navigate to="/list" replace />} />
      <Route path="/sign-up" element={<Signup />} />
      <Route path="/sign-in" element={<Signin />} />
      {token &&
        token !== "undefined" &&
        token !== undefined &&
        token !== null && (
          <Route path="/" element={<Dashboard />}>
            {/* Agents Routes */}
            {/* <Route path="agents" element={<AgentsLayout />}> */}
            <Route path="list" element={<AgentsList />} />
            <Route path="conversations-flow" element={<ConversationsFlow />} />
            <Route path="react-flow" element={<Reactflow />} />
            <Route path="squads" element={<Squads />} />
            <Route path="phone-numbers" element={<PhoneNumber />} />
            <Route path="number" element={<PhoneNumberRetell />} />
            <Route path="batch-calls" element={<BatchCall />} />
            <Route path="call-history" element={<CallHistory />} />
            <Route path="billing" element={<Billing />} />
            <Route path="keys" element={<ProviderKeys />} />
            {/* 
          <Route path="custom-llm" element={<CustomLLM />} /> */}
            {/* </Route> */}
            <Route path="members" element={<Members />} />

            {/* Models Routes */}
            {/* <Route path="models" element={<ModelsLayout />}>
          <Route path="genesis" element={<Genesis />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="quantum" element={<Quantum />} />
        </Route> */}
          </Route>
        )}

      {/* Catch-all route to redirect to /sign-in */}
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
