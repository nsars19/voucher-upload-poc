import { useCallback, useState } from "react";
import useToken from "../hooks/useToken";

export default function Content() {
  const [data, setData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [bodyData, setBodyData] = useState("");

  const { idToken } = useToken();
  const userFirstname = idToken.payload["custom:givenname"];
  const userSurname = idToken.payload["custom:sn"];

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    const res = await fetch(
      "https://pwsz5aju5f.execute-api.us-east-1.amazonaws.com/dev/data",
      {
        method: "post",
        body: JSON.stringify({ data: bodyData }),
        headers: { "x-api-key": "EUc0IBdwvx76YcSAXBYAa2MQCRp1zI8jayfVJlJi" },
      }
    );

    const json = await res.json();
    const lambdaData = json.body.data;

    setData(Array.isArray(lambdaData) ? lambdaData : [lambdaData]);
    setIsFetching(false);
  }, [bodyData]);

  const clearData = useCallback(() => {
    setData([]);
    setIsFetching(false);
    setBodyData("");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {userFirstname ? (
          <span style={{ position: "absolute", top: "0", left: "0" }}>
            <p style={{ padding: "0 0 0 1.2em", fontSize: ".6em" }}>
              Signed in as: {userFirstname} {userSurname}
            </p>
          </span>
        ) : (
          <></>
        )}
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
              width: "300",
            }}
          >
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
          </div>
        </div>
        {isFetching ? <p>Refreshing data...</p> : <></>}
        {data.length ? (
          <>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {data.map((x) => (
                <p key={Math.random().toString()}>{x}</p>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
      </header>
    </div>
  );
}
