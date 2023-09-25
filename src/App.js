import "./App.css";
import Content from "./components/content";
import Login from "./components/login";
import { useAuth } from "./hooks/useAuth";
import { Cognito } from "./util/cognito";

const cognito = new Cognito();

function App() {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return <Content />;
  } else {
    return <Login url={cognito.authenticateURL} />;
  }
}

export default App;
