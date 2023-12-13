import React from "react";
import AddAgentScreen from "./screens/Agents/AddAgentScreen";
import MyAgentScreen from "./screens/Agents/MyAgentScreen";
import { useSelector } from "react-redux";
import CustomTabs from "./screens/MoneyLending/CustomTabs";
import AgentListScreen from "./screens/MoneyLending/AgentListScreen";
import AgentCompanyListScreen from "./screens/MoneyLending/AgentCompanyListScreen";
import AllAgentCompaniesScreen from "./screens/Admin/AllAgentCompaniesScreen";
import AllAgentsScreen from "./screens/Admin/AllAgentsScreen";
import AllMoneyLendingEntitiesScreen from "./screens/Admin/AllMoneyLendingEntitiesScreen ";
import BannedAgentCompanyScreen from "./screens/Admin/BannedAgentCompanyScreen";
import BannedAgentScreen from "./screens/Admin/BannedAgentScreen";
import AllBannedEntitiesScreen from "./screens/Admin/AllBannedEntitiesScreen";
import FraudAgentCompanyScreen from "./FraudAgentCompanyScreen";
import FraudAgentScreen from "./FraudAgentScreen";
import AttemptFraudAgentScreen from "./AttemptFraudAgentScreen";
import AttemptFraudAgentCompanyScreen from "./AttemptFraudAgentCompanyScreen";
// import GetAllSubscriptions from "./screens/Admin/GetAllSubscriptions";

const Hero = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const userRole = user ? user.role : "";
  return (
    <>
      {userRole === "admin" && (
        <>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "All Agents",
                  content: <AllAgentsScreen />,
                },
                {
                  title: "All Agent Companies List",
                  content: <AllAgentCompaniesScreen />,
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                { title: "Fraud Agent List", content: <FraudAgentScreen /> },
                {
                  title: "Fraud Agent Company List",
                  content: <FraudAgentCompanyScreen />,
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "All Banned Agents",
                  content: <BannedAgentScreen />,
                },
                {
                  title: "Banned Agent Companies",
                  content: <BannedAgentCompanyScreen />,
                },
              ]}
            />
          </div>

          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "All Money Lending Entities list",
                  content: <AllMoneyLendingEntitiesScreen />,
                },
                {
                  title: "All Banned Entities list",
                  content: <AllBannedEntitiesScreen />,
                },
              ]}
            />
          </div>
          {/* <div className="mb-3">
            <GetAllSubscriptions />
          </div> */}
        </>
      )}
      {userRole === "agentCompany" && (
        <>
          <MyAgentScreen />
          <AddAgentScreen />
          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "Attempt to Fraud Agent List",
                  content: <AttemptFraudAgentScreen />,
                },
                {
                  title: "Attempt to Fraud Agent Companies List",
                  content: <AttemptFraudAgentCompanyScreen />,
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "Fraud Agent List",
                  content: <FraudAgentScreen />,
                },
                {
                  title: "Fraud Agent Companies List",
                  content: <FraudAgentCompanyScreen />,
                },
              ]}
            />
          </div>
        </>
      )}
      {(userRole === "msbCompany" || userRole === "msbIndividual") && (
        <>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                { title: "Agent List", content: <AgentListScreen /> },
                {
                  title: "Agent Company List",
                  content: <AgentCompanyListScreen />,
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "Attempt to Fraud Agent List",
                  content: <AttemptFraudAgentScreen />,
                },
                {
                  title: "Attempt to Fraud Agent Companies List",
                  content: <AttemptFraudAgentCompanyScreen />,
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <CustomTabs
              tabs={[
                {
                  title: "Fraud Agent List",
                  content: <FraudAgentScreen />,
                },
                {
                  title: "Fraud Agent Companies List",
                  content: <FraudAgentCompanyScreen />,
                },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Hero;
