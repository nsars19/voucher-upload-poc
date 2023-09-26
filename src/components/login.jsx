export default function Login({ url }) {
  return (
    <span
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
      className="App-header"
    >
      <a
        href={url}
        style={{
          color: "lightblue",
        }}
      >
        Login
      </a>
    </span>
  );
}
