import "./App.css";
import Content from "./components/content";
import Login from "./components/login";
import { useAuth } from "./hooks/useAuth";

function App() {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return <Content />;
  } else {
    return <Login url={auth.authenticateURL} />;
  }
}

export default App;
