# React Outside Click

React component to track clicks that happened outside it. You just wrap the components you want to track if a click happened outside of them and ReactOutsideClick will execute a callback that you defined.

## How to install

    npm install react-outside-click

## How to use

Import the component to your project and then wrap the nodes you want to track if an outside click happened. Example:

    var React = require('react');
    var OutsideClick = require('react-outside-click');

    React.createClass({
      onOutsideClick: function (event) {
        console.log('click happened outside', event);
      },

      render: function () {
        var styles = {
          elem: {
            width: '100px',
            height: '50px',
            backgroundColor: '#F00',
          },
        };
        return (
          <div>
            <OutsideClick onOutsideClick={this._handleOutsideClick}>
              <div style={styles.elem}>Click here</div>
            </OutsideClick>
          </div>
        );
      }
    });

### Properties

Property name | Description
------------- | -----------
component | String. The component that will wrap all the children. Default: div
onOutsideClick | Function. Callback that will be called with the event object when an outside click happened.
useCapture | Boolean. If true, the internal logic of this component will use the capture phase. Default: false

## LICENSE

BSD-3