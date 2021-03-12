import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.scss";
import ProgrammingLanguages from "./components/programming-languages";
import Countries from "./components/countries";
import SearchBlock from "./components/search-block/search-block";
import AutoComplete from "./components/auto-complete/auto-complete";
import Results from "./components/results/results";

const header = document.querySelector("#header"),
  content = document.querySelector("#content"),
  footer = document.querySelector("#footer"),
  filerItems = {
    all: "All Fields",
    users: "Users",
    location: "Location",
    programmingLanguage: "Programming Language",
  },
  results = React.createRef(),
  searchBlock = React.createRef();

ReactDOM.render(
  <React.StrictMode>
    <SearchBlock
      addFilter={true}
      items={filerItems}
      preselectIndex={2}
      results={results}
      searchDelay={100}
      compactSearch={true}
      ref={searchBlock}
    />
  </React.StrictMode>,
  header
);
ReactDOM.render(
  <React.StrictMode>
    <Results
      searchBlock={searchBlock}
      grid={true}
      perPage={100}
      ref={results}
    />
  </React.StrictMode>,
  content
);
ReactDOM.render(<React.StrictMode>footer</React.StrictMode>, footer);
ReactDOM.render(
  <React.StrictMode>
    <AutoComplete
      input={document.querySelector("#uname")}
      dataSource={
        localStorage.getItem("usernames") === null
          ? []
          : JSON.parse(localStorage.getItem("usernames"))
      }
    />
    <AutoComplete
      input={document.querySelector("#languageinput")}
      dataSource={ProgrammingLanguages}
    />
    <AutoComplete
      input={document.querySelector("#countriesinput")}
      dataSource={Countries}
    />
  </React.StrictMode>,
  document.querySelector("#completers")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
