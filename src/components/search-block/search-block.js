import "./_search-block.scss";
import { Component } from "react";

class SearchBlock extends Component {
  static defaultProps = {
    useAutocomplete: true,
    placeholder: "Value...",
    searchDelay: 250,
    addFilter: false,
    results: null,
    compactSearch: true,
  };

  #queryUpdated = false;
  #inputFields = {
    user: null,
    location: null,
    language: null,
  };
  #languageAutoComplete = null;

  state = {
    query: "",
    page: 1,
    perPage: 100
  };

  setQuery = (e) => {
    e.preventDefault();

    let q = (() => {
      let str = [];
      Object.entries(this.#inputFields).forEach((entry) => {
        str =
          entry[1].value !== ""
            ? [...str, entry[0] === 'user' ? entry[1].value : `${entry[0]}:${entry[1].value}`]
            : str;
      });
      return str;
    })().join("+");
    this.#queryUpdated = true;
    this.props.results.current.page = 1
    this.setState({ query: q, page: 1 });
  };

  componentDidUpdate() {
    // precaution in case other state is added or changed
    if (this.#queryUpdated) {
      this.#queryUpdated = false;
      this.search();
    }
  }

  set perPage (value) {
    this.setState({
      perPage:value,
      query: this.state.query,
      page:this.state.page
    }, this.search)
  }

  set page (value) {
    this.setState({
      perPage:this.state.perPage,
      query: this.state.query,
      page:value
    }, this.search)

  }

  search = (e) => {
    this.props.results.current.loading = true;
    if (e) e.preventDefault();
    fetch(
      `https://api.github.com/search/users?q=${this.state.query}&per_page=${this.state.perPage}&page=${this.state.page}`
    )
      .then((response) => response.json())
      .then((jsn) => {
        this.props.results.current.results = jsn;
      });
  };

  render() {
    return (
      <div ref={this.props.results} className="search-block">
        <form action="/" onSubmit={this.setQuery}>
          <div>
            <label htmlFor="q">
              <span>Search</span>
              <input
                ref={(input) => {
                  this.#inputFields.user = input;
                }}
                id="uname"
                name="username"
                type="serach"
                placeholder="Username..."
              />
            </label>
            <label htmlFor="location">
              <span>And / Or</span>
              <input
                id="countriesinput"
                ref={(input) => {
                  this.#inputFields.location = input;
                }}
                name="location"
                type="serach"
                placeholder="Location..."
              />
            </label>
            <label htmlFor="language">
              <span>And / Or</span>
              <input
                id="languageinput"
                ref={(input) => {
                  this.#inputFields.language = input;
                }}
                onKeyUp={this.autoComplete}
                name="language"
                type="serach"
                placeholder="Programming Language..."
              />
            </label>
            <button type="submit">Search</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBlock;
