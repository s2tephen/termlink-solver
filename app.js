var TermlinkApp = React.createClass({
  getInitialState: function() {
    return {mode: 0, typing: true, words: [], letters: 15, maxLength: 15, inputValue: '', activeWord: ''};
  },

  handleChange: function(e) {
    this.setState({inputValue: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    e.target.childNodes[2].focus();

    if (this.state.mode === 0) { // input mode
      var sanitizedWord = this.state.inputValue.replace(/[^A-Za-z]/g, '').toLowerCase();

      if (this.state.words.length === 0) { // initial word
        this.setState({words: this.state.words.concat(sanitizedWord), letters: sanitizedWord.length, maxLength: sanitizedWord.length, inputValue: ''});
      }
      else if (sanitizedWord.length == this.state.letters) { // successive words
        if (!this.state.words.includes(sanitizedWord))
          this.setState({words: this.state.words.concat(sanitizedWord), inputValue: ''});
      }
    }

    else { // guess mode (v1: lazy method)
      var sanitizedLikeness = parseInt(this.state.inputValue.replace(/[^0-9]/g, ''), 10);

      if (this.state.activeWord !== '' && sanitizedLikeness >= 0 &&
          sanitizedLikeness < this.state.letters) { // on enter
        var guess = this.state.activeWord;
        var likeness = sanitizedLikeness;
        var words = this.state.words;
        words.splice(words.indexOf(guess), 1);

        var new_words = [];
        for (var i = 0; i < words.length; i++) {
          var word = words[i];
          var like = 0;
          for (var j = 0; j < this.state.letters; j++) {
            if (word[j] === guess[j]) {
              like += 1;
              if (like > likeness)
                break;
            }
          }
          if (like === likeness) {
            new_words.push(word);
          }
        }

        this.setState({words: new_words, inputValue: '', activeWord: ''});
      }
    }
  },

  handleFocus: function(e) {
    this.setState({typing: true});
  },

  handleBlur: function() {
    this.setState({typing: false});
  },

  switchMode: function(e) {
    this.setState({mode: 1, maxLength: this.state.letters < 10 ? 1 : 2, inputValue: ''});
    e.target.parentNode.previousSibling.previousSibling.focus();
  },

  resetMode: function(e) {
    this.setState({mode: 0, typing: true, words: [], letters: 15, maxLength: 15, inputValue: '', activeWord: ''});
    e.target.parentNode.previousSibling.previousSibling.focus();
  },

  setActiveWord: function(word, e) {
    if (this.state.mode == 1)
      if (word === this.state.activeWord)
        this.setState({activeWord: ''});
      else
        this.setState({activeWord: word});
    e.target.parentNode.parentNode.nextSibling.childNodes[2].focus();
  },

  render: function() {
    return (
      <div class="container">
        <div class="content">
          <p>Welcome to ROBCO Industries (TM) Termlink Solver for Fallout 3/NV/4</p>
          <p>
            by <a className="meta-byline" href="//twitter.com/s2tephen">@s2tephen</a>
            <a className="meta-social" href="#">LIKE</a>
            <a className="meta-social" href="#">TWEET</a>
          </p>
          <hr />
          <p>1) Input the candidate words displayed on your Termlink (press ENTER after each one)</p>
          <p>2) Press the START button to begin guessing</p>
          <p>3) Click the word you guessed and input the Likeness score (press ENTER to confirm)</p>
          <p>4) Repeat step 3 as necessary</p>
          <hr />
          <WordList words={this.state.words} mode={this.state.mode} activeWord={this.state.activeWord} setActiveWord={this.setActiveWord} />
        </div>
        <form className="word-cmdline" onSubmit={this.handleSubmit}>
          <hr />
          <div className="word-start">{this.state.mode == 0 ? '>' : '>Likeness='}</div>
          <input className="word-entry" type="text" value={this.state.inputValue} maxLength={this.state.maxLength} onChange={this.handleChange} onKeyUp={this.handleKeyUp} onFocus={this.handleFocus} onBlur={this.handleBlur} autoFocus />
          <div className="word-caret" style={{marginLeft: (-10.5 + this.state.inputValue.length * .7) + 'em', display: this.state.typing ? 'block' : 'none'}}>&nbsp;</div>
          <div className="word-buttons">  
            <button type="submit">Enter</button>
            <button onClick={this.switchMode} style={{ display: this.state.mode == 0 ? 'block' : 'none' }}>Start</button>
            <button onClick={this.resetMode}>Reset</button>
          </div>
        </form>
      </div>
    );
  }
});

var WordList = React.createClass({
  render: function() {
    return (
      <ul className={this.props.mode == 1 ? 'word-list word-list--guess' : 'word-list'}>
        <li>Candidate Words:</li>
        {this.props.words.map(function(word) {
          var boundClick = this.props.setActiveWord.bind(this, word);
          return <li className={word === this.props.activeWord ? 'word-guess word-guess--active' : 'word-guess'} key={word.id} word={word} onClick={boundClick}>{word}</li>
        }, this)}
      </ul>
    );
  }
});

ReactDOM.render(
  <TermlinkApp />,
  document.getElementById('container')
);