import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Badge,
  Image,
} from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { FaPersonShelter, FaPersonBreastfeeding } from "react-icons/fa6";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // console.log(userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApiCall] = useLogoutMutation();
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  // admin
  const renderAdminLinks = () => {
    if (userInfo && userInfo.role === "admin") {
      return (
        <>
          {/* active={location.pathname === "/all-agent-companies"} */}
          <NavDropdown title="List of Agent & Agent Company">
            <LinkContainer to="/all-agents">
              <NavDropdown.Item>Agent List</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/all-agent-companies">
              <NavDropdown.Item>Agent Company List</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/all-money-lending">
              <NavDropdown.Item>Money Lending Entities List</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/all-banned-entities">
              <NavDropdown.Item>Banned Entities List</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown title="Fraud & Attempt Fraud List">
            <LinkContainer to="/fraud-list-agents">
              <NavDropdown.Item>Fraud Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/fraud-list-agent-companies">
              <NavDropdown.Item>Fraud Agent Companies</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/attempt-fraud-list-agents">
              <NavDropdown.Item>Attempt Fraud Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/attempt-fraud-list-agent-companies">
              <NavDropdown.Item>Attempt Fraud Agent Companies</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown title="Banned">
            <LinkContainer to="/banned-agent/:id">
              <NavDropdown.Item>Banned Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/banned-agentcompany/:id">
              <NavDropdown.Item>Banned Agent Company</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
        </>
      );
    }
  };
  // agent company
  const renderAgentCompanyLinks = () => {
    if (userInfo && userInfo.role === "agentCompany") {
      return (
        <>
          <LinkContainer to="/myagents">
            <Nav.Link active={location.pathname === "/myagents"}>
              My Agents
            </Nav.Link>
          </LinkContainer>
          <LinkContainer to="/add-agent">
            <Nav.Link>Add Agent</Nav.Link>
          </LinkContainer>
          <NavDropdown title="Fraud & Attempt Fraud List">
            <LinkContainer to="/fraud-list-agents">
              <NavDropdown.Item>Fraud Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/fraud-list-agent-companies">
              <NavDropdown.Item>Fraud Agent Companies</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/attempt-fraud-list-agents">
              <NavDropdown.Item>Attempt Fraud Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/attempt-fraud-list-agent-companies">
              <NavDropdown.Item>Attempt Fraud Agent Companies</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
          <LinkContainer to={`/subscription/${userInfo._id}`}>
            <Nav.Link>Subscripton</Nav.Link>
          </LinkContainer>
        </>
      );
    }
  };
  // users
  const renderMoneyLendingLinks = () => {
    if (
      userInfo &&
      (userInfo.role === "msbCompany" ||
        userInfo.role === "msbIndividual")
    ) {
      return (
        <>
          <NavDropdown title="Report">
            <LinkContainer to="/reportAgent/:id">
              <NavDropdown.Item>Report Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/reportAgentCompany/:id">
              <NavDropdown.Item>Report Agent Company</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
          <NavDropdown title="Fraud & Attempt Fraud List">
            <LinkContainer to="/fraud-list-agents">
              <NavDropdown.Item>Fraud Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/fraud-list-agent-companies">
              <NavDropdown.Item>Fraud Agent Companies</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/attempt-fraud-list-agents">
              <NavDropdown.Item>Attempt Fraud Agent</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/attempt-fraud-list-agent-companies">
              <NavDropdown.Item>Attempt Fraud Agent Companies</NavDropdown.Item>
            </LinkContainer>
          </NavDropdown>
          <LinkContainer to={`/subscription/${userInfo._id}`}>
            <Nav.Link>Subscripton</Nav.Link>
          </LinkContainer>
        </>
      );
    }
  };
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Fraudalart</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  {renderAdminLinks()}
                  {renderAgentCompanyLinks()}
                  {renderMoneyLendingLinks()}
                  <NavDropdown
                    title={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {userInfo.avatar ? (
                          <Image
                            src={userInfo.avatar}
                            rounded
                            style={{
                              width: "30px",
                              height: "30px",
                              marginRight: "5px",
                            }}
                          />
                        ) : (
                          <FaPersonShelter style={{ marginRight: "5px" }} />
                        )}
                        {`${userInfo.name} - ${userInfo.role}`}
                      </div>
                    }
                    id="username"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
