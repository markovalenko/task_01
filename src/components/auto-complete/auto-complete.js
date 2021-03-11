import "./_auto-complete.scss";
import { Component } from "react";

class AutoComplete extends Component {
  static defaultProps = {
    dataSource: null,
    input: null,
    delay: 200,
    minLength: 2,
  };

  #input = null;
  #container = null;
  #timeout = null;

  state = {
    phrase: "",
    completed: false
  };


  set phrase(phrase) {
    try {
      clearTimeout(this.#timeout);
    } catch (err) {
      console.log(err);
    }
    try {
      this.#timeout = setTimeout(() => {
        this.setState({
          phrase: phrase,
        });
      }, this.props.delay);
    } catch (error) {}
  }

  init = () => {
    const rects = this.props.input.getClientRects()[0],
      style = `
      position: absolute;
      top: ${rects.y + rects.height}px;
      left: ${rects.x}px;
      min-width: ${rects.width}px;
      `;
    this.#container.style.cssText = style;
    this.props.input.setAttribute("autocomplete", "off");
  };

  componentDidMount() {
    this.props.input.addEventListener("keyup", (e) => {
      if (e.keyCode === 27) {
        this.setState({ phrase: '', completed: true });
        return
      }
      this.setState({completed: false})
      this.phrase = this.props.input.value;
    });

    this.props.input.addEventListener('keydown', e => {
      let key = e.keyCode,
      isArrow = key === 38 || key === 40

      if(isArrow) this.changeFocus(e, false)
    })
    setTimeout(this.init, 100);
  }

  fill = (e) => {
    console.log(e.prototype)
    let phrase = e.currentTarget ? e.currentTarget.innerText : typeof e === 'string' ? e : null;
    this.props.input.value = phrase;
    console.log(phrase, e)
    this.setState({ phrase: phrase, completed: true });
  };

  changeFocus = (e, focusedBefore) => {
    if(typeof focusedBefore === 'undefined') focusedBefore = true
    console.log(focusedBefore)
    let key = e.keyCode,
    isArrow = key === 38 || key === 40,
    arrow = key === 38 ? 'down' : 'up' ,
    isEnter = key === 13,
    isInput = e.target === this.props.input,
    container = this.#container,
    escape = key === 27

    if(escape) {
      this.setState({ phrase: '', completed: true });
      this.props.input.focus()
      return
    }

    if(isArrow) {
      e.preventDefault()
      if( container !== null && container.childElementCount > 0 ) {
        this.props.input.blur()
        let active = container.querySelectorAll(':focus'),
        all = container.querySelectorAll('div'),
        current = active.length === 1 ? active[0] : all[0],
        prev = container.firstElementChild === current ? container.lastElementChild : current.previousElementSibling,
        next = container.lastElementChild === current ? container.firstElementChild : current.nextElementSibling

        !focusedBefore ? current.focus() : arrow === 'up' && focusedBefore ? next.focus() : prev.focus()

        
      }
    } else if(isEnter && !isInput) {
      let active = container.querySelectorAll(':focus')[0]
      
      this.fill(active.innerText)
      setTimeout(() => {
        this.props.input.focus()
      },1)
      // active.
    }
  }

  getMatches = () => {
    if(this.state.phrase === null) return []
    let phrase = this.state.phrase,
      matches = [],
      { dataSource, minLength } = this.props,
      re = new RegExp(`${phrase}`, "i");
    if (phrase.length < minLength) return matches;
    matches = dataSource.filter((item) => {
      if (re.test(item)) return item;
      return false;
    });

    return matches.length === 1 &&
      matches[0].toLowerCase() === phrase.toLowerCase()
      ? []
      : matches;
  };

  set input(input) {
    this.#input = input;
  }

  render() {
    const matches = this.getMatches();
    return (
      <div
        ref={(container) => (this.#container = container)}
        className="auto-complete"
        style={{ position: "absolute" }}
        tabIndex={1}
      >
        {matches.map((match, i) => {
          return (
            <div tabIndex={(i+1)} onKeyDown={this.changeFocus} onClick={this.fill} key={i}>
              {match}
            </div>
          );
        })}
      </div>
    );
  }
}

export default AutoComplete;
