import { Component } from "react";
import "./_results.scss";

class ResultsItem extends Component {
  render() {
    const { avatar_url, html_url, login, id, type, score } = this.props;
    return (
      <div className="results-item">
        <img src={avatar_url} alt="" />
        <div className="result">
          <a href={html_url} target="_blank" rel="noreferrer">
            <span className="login">{login}</span>
          </a>
          <div className="uid">{id}</div>
          <div className="type">{type}</div>
          <div className="score">{score}</div>
        </div>
      </div>
    );
  }
}

class Results extends Component {
  static defaultProps = {
    perPage: 100,
    grid: false,
    noResults: "No data",
  };

  #savedResults = null;
  #resultsCount = 0;
  #pages = 0;
  #resultItems = [];
  #currentPage = 1;

  state = {
    pagination: "",
    loading: false,
    perPage: 100,
  };

  constructor(props) {
    super(props);
    this.state.perPage =
      this.props.perPage && this.props.perPage > Results.defaultProps.perPage
        ? Results.defaultProps.perPage
        : this.props.perPage;

    console.log(this.props.searchBlock.current.search);
  }

  set results(val) {
    this.#savedResults = val;
    if (val.message) this.#savedResults = val.message;
    this.setState({
      loading: false,
    });
  }

  get results() {
    return this.#savedResults;
  }

  set loading(loading) {
    this.setState({ loading: loading });
  }
  get loading() {
    return this.loading;
  }

  set page (page) {
    this.#currentPage = page
  }

  generateResults = () => {
    const r = this.#savedResults;
    if (typeof r === "string") return r;
    if (r === null) return this.props.noResults;
    let items,
      namesTosave = [];
    if (r.total_count === 0) return false;
    this.#resultsCount = r.total_count;
    this.#pages = Math.ceil(r.total_count / this.props.perPage);
    items = r.items;
    this.#resultItems = [];

    items.forEach((item, i) => {
      item.key = i;
      namesTosave.push(item.login);
      this.#resultItems = [...this.#resultItems, <ResultsItem {...item} />];
    });
    this.saveUsernames(namesTosave);
    this.#resultsCount = r.total_count;
    return {
      items: this.#resultItems,
      pages: this.#pages,
    };
  };

  saveUsernames = (names) => {
    if (!Array.isArray(names)) return;
    let uNames =
      localStorage.getItem("users") === null
        ? []
        : JSON.parse(localStorage.getItem("users"));
    uNames = [...uNames, ...names].filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    localStorage.setItem("usernames", JSON.stringify(uNames));
  };

  render() {
    let pagination = [],
      grid = this.props.grid ? " grid" : "",
      results = this.generateResults(),
      isString = false

    if (typeof results === "string") {
      isString = true
    } else {
      for (let i = 0; i < results.pages; i++) {
        let p = i + 1;
        if (
          p <= 3 ||
          p === this.#currentPage ||
          p === this.#currentPage - 1 ||
          p === this.#currentPage + 1 ||
          p > results.pages - 3
        ) {
          let className = p === this.#currentPage ? 'current' : ''
          pagination.push(
            <li
              onClick={() => {
                this.props.searchBlock.current.page = p;
                this.#currentPage = p;
              }}
              key={i}
              className={className}
            >
              {i + 1}
            </li>
          );
        }
      }
    }

    return (
      <div className={`results${grid}`}>
        {(() => {
          if (this.state.loading) {
            return "Loading...";
          } else if (!results) {
            return this.props.noResults;
          } else {
            return (
              <div>
                <h2>Total results: {this.#resultsCount} / page: {this.#currentPage} out of {results.pages}</h2>
                <div className="result-items">{isString ? results : results.items}</div>
                <ul className="pagination">{pagination}</ul>
              </div>
            );
          }
        })()}
      </div>
    );
  }
}

export default Results;
