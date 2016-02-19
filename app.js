var TermlinkApp = React.createClass({
  getInitialState: function() {
    return {mode: 0, words: [], letters: 15, maxLength: 15, inputValue: '', activeWord: ''};
  },

  handleChange: function(e) {
    this.setState({inputValue: e.target.value});
  },

  handleKeyUp: function(e) {
    if (this.state.mode === 0) { // input mode
      if (e.charCode == 13) { // on enter
        if (this.state.words.length === 0) { // initial word
          this.setState({words: this.state.words.concat(this.state.inputValue), letters: this.state.inputValue.length, maxLength: this.state.inputValue.length, inputValue: ''});
        }
        else if (this.state.inputValue.length == this.state.letters) { // successive words
          if (!this.state.words.includes(this.state.inputValue))
            this.setState({words: this.state.words.concat(this.state.inputValue), inputValue: ''});
        }
      }
      else if (this.state.mode === 0 & (e.charCode < 97 || e.charCode > 122)) // alphabetic only
        e.preventDefault();
    }

    else { // guess mode (v1: lazy method)
      if (e.charCode == 13 && this.state.activeWord !== '' &&
          this.state.inputValue >= 0 && this.state.inputValue < this.state.letters) { // on enter
        var guess = this.state.activeWord;
        var likeness = parseInt(this.state.inputValue, 10);
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
      else if (this.state.mode == 1 & (e.charCode < 48 || e.charCode > 57)) // numeric only
        e.preventDefault();
    }
  },

  handleBlur: function(e) {
    e.target.focus();
  },

  switchMode: function() {
    this.setState({mode: 1, maxLength: this.state.letters < 10 ? 1 : 2, inputValue: ''});
  },

  resetMode: function() {
    this.setState({mode: 0, words: [], letters: 15, maxLength: 15, inputValue: '', activeWord: ''});
  },

  setActiveWord: function(word) {
    if (this.state.mode == 1)
      if (word === this.state.activeWord)
        this.setState({activeWord: ''});
      else
        this.setState({activeWord: word});
  },

  render: function() {
    return (
      <div className="container">
        <p>Welcome to ROBCO Industries (TM) Termlink Solver</p>
        <hr />
        <p>1) Input the candidate words displayed on your Termlink (press ENTER after each one)</p>
        <p>2) Press the START button to begin guessing</p>
        <p>3) Click the word you guessed and input the Likeness score (press ENTER to confirm)</p>
        <p>4) Repeat step 3 as necessary</p>
        <hr />
        <WordList words={this.state.words} mode={this.state.mode} activeWord={this.state.activeWord} setActiveWord={this.setActiveWord} />
        <div className="word-cmdline">
          <div className="word-start">{this.state.mode == 0 ? '>' : '>Likeness='}</div>
          <input className="word-entry" type="text" value={this.state.inputValue} maxLength={this.state.maxLength} onChange={this.handleChange} onKeyUp={this.handleKeyUp} onBlur={this.handleBlur} autoFocus />
          <div className="word-caret" style={{marginLeft: (-10.5 + this.state.inputValue.length * .7) + 'em'}}>&nbsp;</div>
          <button className="mode-reset" onClick={this.resetMode}>Reset</button>
          <button className="mode-switch" onClick={this.switchMode} style={{ display: this.state.mode == 0 ? 'block' : 'none' }}>Start</button>
        </div>
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
          return <li className={word === this.props.activeWord ? 'word-guess word-guess--active' : 'word-guess'}  ={word.id} word={word} onClick={boundClick}>{word}</li>
        }, this)}
      </ul>
    );
  }
});

ReactDOM.render(
  <TermlinkApp />,
  document.body
);