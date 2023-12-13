// CustomTabs.jsx
import React, { useState } from "react";
import { Nav, Tab } from "react-bootstrap";

const CustomTabs = ({ tabs }) => {
  const [key, setKey] = useState("tab-0");

  if (!tabs || tabs.length === 0) {
    return <div>No tabs to display</div>;
  }

  return (
    <Tab.Container activeKey={key} onSelect={setKey}>
      <Nav fill variant="tabs" className="custom-nav">
        {tabs.map((tab, index) => (
          <Nav.Item key={`tab-${index}`}>
            <Nav.Link eventKey={`tab-${index}`} className="custom-link">
              {tab.title}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content className="tab-content">
        {tabs.map((tab, index) => (
          <Tab.Pane key={`tab-${index}`} eventKey={`tab-${index}`}>
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
};

export default CustomTabs;
