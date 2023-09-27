import { useCallback, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import useToken from "../hooks/useToken";

export default function Content() {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const auth = useAuth();
  const { idToken } = useToken();
  const userFirstname = idToken.payload["custom:givenname"];
  const userSurname = idToken.payload["custom:sn"];

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    setData([]);
    const res = await fetch(
      "https://pwsz5aju5f.execute-api.us-east-1.amazonaws.com/dev/data",
      {
        method: "get",
        headers: { Authorization: "Bearer " + idToken.token },
      }
    );

    const json = await res.json();
    const lambdaData = json.body.data;

    setData(Array.isArray(lambdaData) ? lambdaData : [lambdaData]);
    setIsFetching(false);
  }, [idToken.token]);

  const clearData = useCallback(() => {
    setData([]);
    setIsFetching(false);
  }, []);

  return (
    <div
      style={{ background: "#282c34", color: "white", margin: "15px 10px " }}
    >
      <span
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {userFirstname ? (
          <div style={{ margin: "0" }}>
            <p>
              Signed in as: {userFirstname} {userSurname}
            </p>
          </div>
        ) : (
          <></>
        )}
        <button
          style={{
            padding: 8,
            borderRadius: 4,
            border: "none",
            height: 60,
            width: 120,
            fontSize: "16px",
            color: "#eee",
            cursor: "pointer",
            background: "linear-gradient(120deg, lightskyblue, purple)",
          }}
          onClick={() => auth.signOut()}
        >
          Log Out
        </button>
        <button
          onClick={fetchData}
          disabled={isFetching}
          style={{
            padding: 8,
            borderRadius: 4,
            border: "none",
            height: 60,
            width: 120,
            fontSize: "16px",
            color: "#eee",
            cursor: "pointer",
            background: `linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
            linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
            linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)`,
          }}
        >
          Get a cat fact
        </button>
        <button
          onClick={clearData}
          style={{
            background: "linear-gradient(#e66465, #9198e5)",
            padding: 8,
            borderRadius: 4,
            border: "none",
            height: 60,
            width: 120,
            fontSize: "16px",
            color: "#eee",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </span>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          inset: "0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
          fontSize: "2em",
          flexDirection: "column",
        }}
      >
        {isFetching ? <p>Refreshing data...</p> : <></>}
        {data.length ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "1em",
                maxWidth: "1000px",
              }}
            >
              {data.map((x) => (
                <p key={x}>{x}</p>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
