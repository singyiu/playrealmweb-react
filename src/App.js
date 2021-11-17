import logo from "./logo.svg";
import "./App.css";

import * as Realm from "realm-web";

async function playRealm() {
  console.log("playRealm starting");

  const app = new Realm.App({ id: "ordereventssandbox-klfci" });
  const credentials = Realm.Credentials.apiKey("XXX");
  try {
    const user = await app.logIn(credentials);
  } catch (err) {
    console.error("Failed to log in", err);
  }

  const mongodb = app.currentUser.mongoClient("mongodb-atlas");
  const orders = mongodb.db("strapi").collection("order");

  //https://docs.mongodb.com/realm/web/mongodb/#std-label-web-mongodb-watch
  for await (const change of orders.watch()) {
    switch (change.operationType) {
      case "insert": {
        const { documentKey, fullDocument } = change;
        console.log(`new document: ${documentKey}`, fullDocument);
        break;
      }
      case "update": {
        const { documentKey, fullDocument } = change;
        console.log(`updated document: ${documentKey}`, fullDocument);
        break;
      }
      case "replace": {
        const { documentKey, fullDocument } = change;
        console.log(`replaced document: ${documentKey}`, fullDocument);
        break;
      }
      case "delete": {
        const { documentKey } = change;
        console.log(`deleted document: ${documentKey}`);
        break;
      }
      default:
    }
  }
}

playRealm();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
