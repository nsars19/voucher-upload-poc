import "./App.css";
import Content from "./components/content";
import Login from "./components/login";
import SigningIn from "./components/signingIn";
import { useAuth } from "./hooks/useAuth";

function App() {
  const auth = useAuth();

  if (auth.isLoggedIn) {
    return <Content />;
  } else if (auth.isAuthenticating) {
    return <SigningIn />;
  } else {
    return <Login url={auth.authenticateURL} />;
  }
}

export default App;
