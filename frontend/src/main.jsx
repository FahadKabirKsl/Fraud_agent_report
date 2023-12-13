import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import HomeScreen from "./components/screens/HomeScreen.jsx";
import LoginScreen from "./components/screens/LoginScreen.jsx";
import RegisterScreen from "./components/screens/RegisterScreen.jsx";
import ProfileScreen from "./components/screens/ProfileScreen";
import PrivateRoute from "./components/PrivateRoute";
import AddAgentScreen from "./components/screens/Agents/AddAgentScreen";
import MyAgentScreen from "./components/screens/Agents/MyAgentScreen";
import ReportAgentCompanyScreen from "./components/screens/MoneyLending/ReportAgentCompanyScreen";
import ReportAgentScreen from "./components/screens/MoneyLending/ReportAgentScreen";
import AgentCompanyListScreen from "./components/screens/MoneyLending/AgentCompanyListScreen";
import AgentListScreen from "./components/screens/MoneyLending/AgentListScreen";
import AllAgentsScreen from "./components/screens/Admin/AllAgentsScreen";
import AllAgentCompaniesScreen from "./components/screens/Admin/AllAgentCompaniesScreen";
import AllMoneyLendingEntitiesScreen from "./components/screens/Admin/AllMoneyLendingEntitiesScreen ";
import AllBannedEntitiesScreen from "./components/screens/Admin/AllBannedEntitiesScreen";
import BannedAgentScreen from "./components/screens/Admin/BannedAgentScreen";
import BannedAgentCompanyScreen from "./components/screens/Admin/BannedAgentCompanyScreen";
import CheckoutForm from "./components/CheckoutForm.jsx";
import GetAllSubscriptions from "./components/screens/Admin/GetAllSubscriptions.jsx";
import FraudAgentScreen from "./components/FraudAgentScreen.jsx";
import FraudAgentCompanyScreen from "./components/FraudAgentCompanyScreen.jsx";
import AttemptFraudAgentScreen from "./components/AttemptFraudAgentScreen.jsx";
import AttemptFraudAgentCompanyScreen from "./components/AttemptFraudAgentCompanyScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* index={true} */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/subscription/:id" element={<CheckoutForm />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/add-agent" element={<AddAgentScreen />} />
        <Route path="/myagents" element={<MyAgentScreen />} />
        <Route path="/list-agents" element={<ReportAgentScreen />} />
        <Route path="/fraud-list-agents" element={<FraudAgentScreen />} />
        <Route
          path="/fraud-list-agent-companies"
          element={<FraudAgentCompanyScreen />}
        />
        <Route
          path="/attempt-fraud-list-agents"
          element={<AttemptFraudAgentScreen />}
        />
        <Route
          path="/attempt-fraud-list-agent-companies"
          element={<AttemptFraudAgentCompanyScreen />}
        />

        <Route path="/agentCompanies" element={<ReportAgentCompanyScreen />} />
        <Route path="/reportAgent/:id" element={<AgentListScreen />} />
        <Route
          path="/reportAgentCompany/:id"
          element={<AgentCompanyListScreen />}
        />
        <Route path="/all-agents" element={<AllAgentsScreen />} />
        <Route
          path="/all-agent-companies"
          element={<AllAgentCompaniesScreen />}
        />

        <Route
          path="/all-banned-entities"
          element={<AllBannedEntitiesScreen />}
        />
        <Route path="/banned-agent/:id" element={<BannedAgentScreen />} />
        <Route
          path="/banned-agentcompany/:id"
          element={<BannedAgentCompanyScreen />}
        />
        <Route
          path="/all-money-lending"
          element={<AllMoneyLendingEntitiesScreen />}
        />
        <Route path="/list-subscriptions" element={<GetAllSubscriptions />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
