import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Form, Button, Row, Col } from "react-bootstrap";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
// import FormContainer from "../FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../Loader";
import Log from "../../assets/images/registration.jpg";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      // console.log(err?.data?.message || err.error);
    }
  };

  return (

    <>
      <Container className="mt-5">
        <h1>Log In</h1>
        <Row className="align-items-center justify-content-center">
          <Col md={6}>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="email"
                    className="form-control-custom"
                    placeholder="Enter email"
                    aria-label="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="input-group-text-custom">
                    <AiOutlineMail />
                  </div>
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="Agent Company">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="password"
                    className="form-control-custom"
                    placeholder="Password"
                    aria-label="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="input-group-text-custom">
                    <AiOutlineLock />
                  </div>
                </div>
              </Form.Group>

              {isLoading && <Loader />}
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit">
                  Log In
                </Button>
              </div>
            </Form>
            <Col className="mt-3">
              New Here?{" "}
              <Link to={`/register`} className="link">
                <span className="text">Register</span>
              </Link>
            </Col>
          </Col>
          <Col md={6}>
            <img src={Log} alt="registration-vector" className="vector" />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginScreen;
