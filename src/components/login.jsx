export default function Login({ url, hasError }) {
  return (
    <span
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <a href={url}>Login</a>
      {hasError ? (
        <p style={{ fontSize: ".8em", color: "#cc1234" }}>Error signing in</p>
      ) : (
        <></>
      )}
    </span>
  );
}
