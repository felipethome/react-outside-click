var React = require('react');
var ReactDOM = require('react-dom');
var OutsideClick = require('../src/OutsideClick');

var Demo = React.createClass({
  displayName: 'Demo',

  getInitialState: function () {
    return {
      useCapture: false,
      disable: false,
    };
  },

  _handleOutsideClick: function (event) {
    console.log('click happened outside', ', eventPhase:', event.eventPhase);
  },

  _handleuseCapture: function () {
    this.setState(function (previousState) {
      return {
        useCapture: !previousState.useCapture,
      };
    });
  },

  _handleDisable: function () {
    this.setState(function (previousState) {
      return {
        disable: !previousState.disable,
      };
    });
  },

  render: function () {
    var styles = {
      container: {
        width: '100%',
        height: '100%',
      },

      messageContainer: {
        height: '20px',
        backgroundColor: '#FFF',
        border: '1px solid #81C784',
        borderRadius: '2px',
        marginBottom: '30px',
        padding: '5px 5px 5px 5px',
      },

      elem: {
        width: '100%',
        height: '50px',
        borderRadius: '2px',
        backgroundColor: '#81C784',
        marginBottom: '30px',
        padding: '10px',
        boxSizing: 'border-box',
      },

      button: {
        cursor: 'pointer',
        border: 'none',
        borderRadius: '2px',
        backgroundColor: '#039BE5',
        padding: '10px 15px',
        color: '#FFF',
        fontFamily: '"Roboto", sans-serif',
        textDecoration: 'none',
        textTransform: 'uppercase',
        margin: '0px 15px 15px 0',
        outline: 'none',
      },
    };
    return (
      <div style={styles.container}>
        <div style={styles.messageContainer}>
          {'Use Capture: ' + this.state.useCapture + ', Disabled: '
            + this.state.disable}
        </div>
        <OutsideClick
          component="div"
          disableHandler={this.state.disable}
          useuseCapture={this.state.useCapture}
          onOutsideClick={this._handleOutsideClick}
        >
          <div style={styles.elem}>
            Element you want to track outside clicks. Check your console
          </div>
        </OutsideClick>
        <button onClick={this._handleuseCapture} style={styles.button}>
          Toggle useCapture
        </button>
        <button onClick={this._handleDisable} style={styles.button}>
          Toggle disable
        </button>
      </div>
    );
  },
});

ReactDOM.render(
  <Demo />,
  document.getElementById('app')
);