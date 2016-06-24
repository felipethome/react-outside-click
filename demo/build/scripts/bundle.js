(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/var/www/html/react-outside-click/demo/main.js":[function(require,module,exports){
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var OutsideClick = require('../src/OutsideClick');

var Demo = React.createClass({
  displayName: 'Demo',

  getInitialState: function getInitialState() {
    return {
      useCapture: false,
      disable: false
    };
  },

  _handleOutsideClick: function _handleOutsideClick(event) {
    console.log('click happened outside', ', eventPhase:', event.eventPhase);
  },

  _handleuseCapture: function _handleuseCapture() {
    this.setState(function (previousState) {
      return {
        useCapture: !previousState.useCapture
      };
    });
  },

  _handleDisable: function _handleDisable() {
    this.setState(function (previousState) {
      return {
        disable: !previousState.disable
      };
    });
  },

  render: function render() {
    var styles = {
      container: {
        width: '100%',
        height: '100%'
      },

      messageContainer: {
        height: '20px',
        backgroundColor: '#FFF',
        border: '1px solid #81C784',
        borderRadius: '2px',
        marginBottom: '30px',
        padding: '5px 5px 5px 5px'
      },

      elem: {
        width: '100%',
        height: '50px',
        borderRadius: '2px',
        backgroundColor: '#81C784',
        marginBottom: '30px',
        padding: '10px',
        boxSizing: 'border-box'
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
        outline: 'none'
      }
    };
    return React.createElement(
      'div',
      { style: styles.container },
      React.createElement(
        'div',
        { style: styles.messageContainer },
        'Use Capture: ' + this.state.useCapture + ', Disabled: ' + this.state.disable
      ),
      React.createElement(
        OutsideClick,
        {
          component: 'div',
          disableHandler: this.state.disable,
          useuseCapture: this.state.useCapture,
          onOutsideClick: this._handleOutsideClick
        },
        React.createElement(
          'div',
          { style: styles.elem },
          'Element you want to track outside clicks. Check your console'
        )
      ),
      React.createElement(
        'button',
        { onClick: this._handleuseCapture, style: styles.button },
        'Toggle useCapture'
      ),
      React.createElement(
        'button',
        { onClick: this._handleDisable, style: styles.button },
        'Toggle disable'
      )
    );
  }
});

ReactDOM.render(React.createElement(Demo, null), document.getElementById('app'));

},{"../src/OutsideClick":"/var/www/html/react-outside-click/src/OutsideClick.js","react":"react","react-dom":"react-dom"}],"/var/www/html/react-outside-click/src/OutsideClick.js":[function(require,module,exports){
'use strict';

/**
 * Copyright Felipe Thomé.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');

var OutsideClick = React.createClass({
  displayName: 'OutsideClick',

  propTypes: {
    /**
     * The children of this component. They will be put inside of the root
     * element without any modification.
     */
    children: React.PropTypes.any,
    /**
     * The component that will wrap the children. Default: "div".
     */
    component: React.PropTypes.string,
    /**
     * If true, the handler will be removed and outside click will not be
     * be triggered. Default: false.
     */
    disableHandler: React.PropTypes.bool,
    /**
     * This is mapped just to avoid ESLint warnings. Any property passed to
     * this component that is not direct part of its logic will be placed in the
     * root element without modification.
     */
    onClick: React.PropTypes.func,
    /**
     * Callback that will be called with the event object when a click happens
     * outside of the wrap/root element.
     */
    onOutsideClick: React.PropTypes.func,
    /**
     * If true, the logic of the component will use capture events.
     * Default: false.
     */
    useCapture: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      component: 'div'
    };
  },

  componentWillMount: function componentWillMount() {
    this._wasInside = false;
  },

  componentDidMount: function componentDidMount() {
    this._addListener(this.props.useCapture);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.disableHandler !== this.props.disableHandler || nextProps.useCapture !== this.props.useCapture) {
      this._removeListener(this.props.useCapture);
      if (!nextProps.disableHandler) this._addListener(nextProps.useCapture);
    }
  },

  componentWillUnmount: function componentWillUnmount() {
    this._removeListener(this.props.useCapture);
  },

  _addListener: function _addListener(useCapture) {
    if (document) {
      document.addEventListener('click', this._handleDocumentClick, useCapture);
    }
  },

  _removeListener: function _removeListener(useCapture) {
    if (document) {
      document.removeEventListener('click', this._handleDocumentClick, useCapture);
    }
  },

  _checkForBubblePhase: function _checkForBubblePhase(event) {
    if (!this._wasInside) {
      this._handleOutsideClick(event);
    }
    this._wasInside = false;
  },

  _checkForCapturePhase: function _checkForCapturePhase(event) {
    if (this._elem && !this._elem.contains(event.target)) {
      this._handleOutsideClick(event);
    }
  },

  _handleDocumentClick: function _handleDocumentClick(event) {
    if (this.props.useCapture) {
      this._checkForCapturePhase(event);
    } else {
      this._checkForBubblePhase(event);
    }
  },

  _handleOutsideClick: function _handleOutsideClick(event) {
    if (this.props.onOutsideClick) this.props.onOutsideClick(event);
  },

  _handleWrapperClick: function _handleWrapperClick(event) {
    this._wasInside = true;
    if (this.props.onClick) this.props.onClick(event);
  },

  render: function render() {
    var newProps = Object.assign({}, this.props);
    delete newProps.children;
    delete newProps.component;
    delete newProps.onClick;
    delete newProps.onOutsideClick;
    delete newProps.useCapture;

    newProps.ref = function (elem) {
      this._elem = elem;
    }.bind(this);

    newProps.onClick = this._handleWrapperClick;

    return React.createElement(this.props.component, newProps, this.props.children);
  }

});

module.exports = OutsideClick;

},{"react":"react"}]},{},["/var/www/html/react-outside-click/demo/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkZW1vL21haW4uanMiLCJzcmMvT3V0c2lkZUNsaWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJLFdBQVcsUUFBUSxXQUFSLENBQWY7QUFDQSxJQUFJLGVBQWUsUUFBUSxxQkFBUixDQUFuQjs7QUFFQSxJQUFJLE9BQU8sTUFBTSxXQUFOLENBQWtCO0FBQzNCLGVBQWEsTUFEYzs7QUFHM0IsbUJBQWlCLDJCQUFZO0FBQzNCLFdBQU87QUFDTCxrQkFBWSxLQURQO0FBRUwsZUFBUztBQUZKLEtBQVA7QUFJRCxHQVIwQjs7QUFVM0IsdUJBQXFCLDZCQUFVLEtBQVYsRUFBaUI7QUFDcEMsWUFBUSxHQUFSLENBQVksd0JBQVosRUFBc0MsZUFBdEMsRUFBdUQsTUFBTSxVQUE3RDtBQUNELEdBWjBCOztBQWMzQixxQkFBbUIsNkJBQVk7QUFDN0IsU0FBSyxRQUFMLENBQWMsVUFBVSxhQUFWLEVBQXlCO0FBQ3JDLGFBQU87QUFDTCxvQkFBWSxDQUFDLGNBQWM7QUFEdEIsT0FBUDtBQUdELEtBSkQ7QUFLRCxHQXBCMEI7O0FBc0IzQixrQkFBZ0IsMEJBQVk7QUFDMUIsU0FBSyxRQUFMLENBQWMsVUFBVSxhQUFWLEVBQXlCO0FBQ3JDLGFBQU87QUFDTCxpQkFBUyxDQUFDLGNBQWM7QUFEbkIsT0FBUDtBQUdELEtBSkQ7QUFLRCxHQTVCMEI7O0FBOEIzQixVQUFRLGtCQUFZO0FBQ2xCLFFBQUksU0FBUztBQUNYLGlCQUFXO0FBQ1QsZUFBTyxNQURFO0FBRVQsZ0JBQVE7QUFGQyxPQURBOztBQU1YLHdCQUFrQjtBQUNoQixnQkFBUSxNQURRO0FBRWhCLHlCQUFpQixNQUZEO0FBR2hCLGdCQUFRLG1CQUhRO0FBSWhCLHNCQUFjLEtBSkU7QUFLaEIsc0JBQWMsTUFMRTtBQU1oQixpQkFBUztBQU5PLE9BTlA7O0FB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QUFtQixLQUFuQjtBQUN6QixHQS9Ha0M7O0FBaUhuQyxVQUFRLGtCQUFZO0FBQ2xCLFFBQUksV0FBVyxPQUFPLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUssS0FBdkIsQ0FBZjtBQUNBLFdBQU8sU0FBUyxRQUFoQjtBQUNBLFdBQU8sU0FBUyxTQUFoQjtBQUNBLFdBQU8sU0FBUyxPQUFoQjtBQUNBLFdBQU8sU0FBUyxjQUFoQjtBQUNBLFdBQU8sU0FBUyxVQUFoQjs7QUFFQSxhQUFTLEdBQVQsR0FBZSxVQUFVLElBQVYsRUFBZ0I7QUFDN0IsV0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNELEtBRmMsQ0FFYixJQUZhLENBRVIsSUFGUSxDQUFmOztBQUlBLGFBQVMsT0FBVCxHQUFtQixLQUFLLG1CQUF4Qjs7QUFFQSxXQUFPLE1BQU0sYUFBTixDQUNMLEtBQUssS0FBTCxDQUFXLFNBRE4sRUFFTCxRQUZLLEVBR0wsS0FBSyxLQUFMLENBQVcsUUFITixDQUFQO0FBS0Q7O0FBcElrQyxDQUFsQixDQUFuQjs7QUF3SUEsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUmVhY3RET00gPSByZXF1aXJlKCdyZWFjdC1kb20nKTtcbnZhciBPdXRzaWRlQ2xpY2sgPSByZXF1aXJlKCcuLi9zcmMvT3V0c2lkZUNsaWNrJyk7XG5cbnZhciBEZW1vID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNwbGF5TmFtZTogJ0RlbW8nLFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VDYXB0dXJlOiBmYWxzZSxcbiAgICAgIGRpc2FibGU6IGZhbHNlLFxuICAgIH07XG4gIH0sXG5cbiAgX2hhbmRsZU91dHNpZGVDbGljazogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWNrIGhhcHBlbmVkIG91dHNpZGUnLCAnLCBldmVudFBoYXNlOicsIGV2ZW50LmV2ZW50UGhhc2UpO1xuICB9LFxuXG4gIF9oYW5kbGV1c2VDYXB0dXJlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShmdW5jdGlvbiAocHJldmlvdXNTdGF0ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdXNlQ2FwdHVyZTogIXByZXZpb3VzU3RhdGUudXNlQ2FwdHVyZSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH0sXG5cbiAgX2hhbmRsZURpc2FibGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKGZ1bmN0aW9uIChwcmV2aW91c1N0YXRlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBkaXNhYmxlOiAhcHJldmlvdXNTdGF0ZS5kaXNhYmxlLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3R5bGVzID0ge1xuICAgICAgY29udGFpbmVyOiB7XG4gICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgfSxcblxuICAgICAgbWVzc2FnZUNvbnRhaW5lcjoge1xuICAgICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0ZGRicsXG4gICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjODFDNzg0JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICAgICAgbWFyZ2luQm90dG9tOiAnMzBweCcsXG4gICAgICAgIHBhZGRpbmc6ICc1cHggNXB4IDVweCA1cHgnLFxuICAgICAgfSxcblxuICAgICAgZWxlbToge1xuICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICBoZWlnaHQ6ICc1MHB4JyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzgxQzc4NCcsXG4gICAgICAgIG1hcmdpbkJvdHRvbTogJzMwcHgnLFxuICAgICAgICBwYWRkaW5nOiAnMTBweCcsXG4gICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICAgfSxcblxuICAgICAgYnV0dG9uOiB7XG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAzOUJFNScsXG4gICAgICAgIHBhZGRpbmc6ICcxMHB4IDE1cHgnLFxuICAgICAgICBjb2xvcjogJyNGRkYnLFxuICAgICAgICBmb250RmFtaWx5OiAnXCJSb2JvdG9cIiwgc2Fucy1zZXJpZicsXG4gICAgICAgIHRleHREZWNvcmF0aW9uOiAnbm9uZScsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICBtYXJnaW46ICcwcHggMTVweCAxNXB4IDAnLFxuICAgICAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgICB9LFxuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5jb250YWluZXJ9PlxuICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMubWVzc2FnZUNvbnRhaW5lcn0+XG4gICAgICAgICAgeydVc2UgQ2FwdHVyZTogJyArIHRoaXMuc3RhdGUudXNlQ2FwdHVyZSArICcsIERpc2FibGVkOiAnXG4gICAgICAgICAgICArIHRoaXMuc3RhdGUuZGlzYWJsZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxPdXRzaWRlQ2xpY2tcbiAgICAgICAgICBjb21wb25lbnQ9XCJkaXZcIlxuICAgICAgICAgIGRpc2FibGVIYW5kbGVyPXt0aGlzLnN0YXRlLmRpc2FibGV9XG4gICAgICAgICAgdXNldXNlQ2FwdHVyZT17dGhpcy5zdGF0ZS51c2VDYXB0dXJlfVxuICAgICAgICAgIG9uT3V0c2lkZUNsaWNrPXt0aGlzLl9oYW5kbGVPdXRzaWRlQ2xpY2t9XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuZWxlbX0+XG4gICAgICAgICAgICBFbGVtZW50IHlvdSB3YW50IHRvIHRyYWNrIG91dHNpZGUgY2xpY2tzLiBDaGVjayB5b3VyIGNvbnNvbGVcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9PdXRzaWRlQ2xpY2s+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5faGFuZGxldXNlQ2FwdHVyZX0gc3R5bGU9e3N0eWxlcy5idXR0b259PlxuICAgICAgICAgIFRvZ2dsZSB1c2VDYXB0dXJlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuX2hhbmRsZURpc2FibGV9IHN0eWxlPXtzdHlsZXMuYnV0dG9ufT5cbiAgICAgICAgICBUb2dnbGUgZGlzYWJsZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH0sXG59KTtcblxuUmVhY3RET00ucmVuZGVyKFxuICA8RGVtbyAvPixcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpXG4pOyIsIi8qKlxuICogQ29weXJpZ2h0IEZlbGlwZSBUaG9tw6kuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBPdXRzaWRlQ2xpY2sgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGRpc3BsYXlOYW1lOiAnT3V0c2lkZUNsaWNrJyxcblxuICBwcm9wVHlwZXM6IHtcbiAgICAvKipcbiAgICAgKiBUaGUgY2hpbGRyZW4gb2YgdGhpcyBjb21wb25lbnQuIFRoZXkgd2lsbCBiZSBwdXQgaW5zaWRlIG9mIHRoZSByb290XG4gICAgICogZWxlbWVudCB3aXRob3V0IGFueSBtb2RpZmljYXRpb24uXG4gICAgICovXG4gICAgY2hpbGRyZW46IFJlYWN0LlByb3BUeXBlcy5hbnksXG4gICAgLyoqXG4gICAgICogVGhlIGNvbXBvbmVudCB0aGF0IHdpbGwgd3JhcCB0aGUgY2hpbGRyZW4uIERlZmF1bHQ6IFwiZGl2XCIuXG4gICAgICovXG4gICAgY29tcG9uZW50OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIC8qKlxuICAgICAqIElmIHRydWUsIHRoZSBoYW5kbGVyIHdpbGwgYmUgcmVtb3ZlZCBhbmQgb3V0c2lkZSBjbGljayB3aWxsIG5vdCBiZVxuICAgICAqIGJlIHRyaWdnZXJlZC4gRGVmYXVsdDogZmFsc2UuXG4gICAgICovXG4gICAgZGlzYWJsZUhhbmRsZXI6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgbWFwcGVkIGp1c3QgdG8gYXZvaWQgRVNMaW50IHdhcm5pbmdzLiBBbnkgcHJvcGVydHkgcGFzc2VkIHRvXG4gICAgICogdGhpcyBjb21wb25lbnQgdGhhdCBpcyBub3QgZGlyZWN0IHBhcnQgb2YgaXRzIGxvZ2ljIHdpbGwgYmUgcGxhY2VkIGluIHRoZVxuICAgICAqIHJvb3QgZWxlbWVudCB3aXRob3V0IG1vZGlmaWNhdGlvbi5cbiAgICAgKi9cbiAgICBvbkNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAvKipcbiAgICAgKiBDYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGV2ZW50IG9iamVjdCB3aGVuIGEgY2xpY2sgaGFwcGVuc1xuICAgICAqIG91dHNpZGUgb2YgdGhlIHdyYXAvcm9vdCBlbGVtZW50LlxuICAgICAqL1xuICAgIG9uT3V0c2lkZUNsaWNrOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICAvKipcbiAgICAgKiBJZiB0cnVlLCB0aGUgbG9naWMgb2YgdGhlIGNvbXBvbmVudCB3aWxsIHVzZSBjYXB0dXJlIGV2ZW50cy5cbiAgICAgKiBEZWZhdWx0OiBmYWxzZS5cbiAgICAgKi9cbiAgICB1c2VDYXB0dXJlOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29tcG9uZW50OiAnZGl2JyxcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuX3dhc0luc2lkZSA9IGZhbHNlO1xuICB9LFxuXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fYWRkTGlzdGVuZXIodGhpcy5wcm9wcy51c2VDYXB0dXJlKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbiAobmV4dFByb3BzKSB7XG4gICAgaWYgKChuZXh0UHJvcHMuZGlzYWJsZUhhbmRsZXIgIT09IHRoaXMucHJvcHMuZGlzYWJsZUhhbmRsZXIpIHx8XG4gICAgICAgIChuZXh0UHJvcHMudXNlQ2FwdHVyZSAhPT0gdGhpcy5wcm9wcy51c2VDYXB0dXJlKSkge1xuICAgICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIodGhpcy5wcm9wcy51c2VDYXB0dXJlKTtcbiAgICAgIGlmICghbmV4dFByb3BzLmRpc2FibGVIYW5kbGVyKSB0aGlzLl9hZGRMaXN0ZW5lcihuZXh0UHJvcHMudXNlQ2FwdHVyZSk7XG4gICAgfVxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5fcmVtb3ZlTGlzdGVuZXIodGhpcy5wcm9wcy51c2VDYXB0dXJlKTtcbiAgfSxcblxuICBfYWRkTGlzdGVuZXI6IGZ1bmN0aW9uICh1c2VDYXB0dXJlKSB7XG4gICAgaWYgKGRvY3VtZW50KSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAnY2xpY2snLFxuICAgICAgICB0aGlzLl9oYW5kbGVEb2N1bWVudENsaWNrLFxuICAgICAgICB1c2VDYXB0dXJlXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBfcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uICh1c2VDYXB0dXJlKSB7XG4gICAgaWYgKGRvY3VtZW50KSB7XG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAnY2xpY2snLFxuICAgICAgICB0aGlzLl9oYW5kbGVEb2N1bWVudENsaWNrLFxuICAgICAgICB1c2VDYXB0dXJlXG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBfY2hlY2tGb3JCdWJibGVQaGFzZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLl93YXNJbnNpZGUpIHtcbiAgICAgIHRoaXMuX2hhbmRsZU91dHNpZGVDbGljayhldmVudCk7XG4gICAgfVxuICAgIHRoaXMuX3dhc0luc2lkZSA9IGZhbHNlO1xuICB9LFxuXG4gIF9jaGVja0ZvckNhcHR1cmVQaGFzZTogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX2VsZW0gJiYgIXRoaXMuX2VsZW0uY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5faGFuZGxlT3V0c2lkZUNsaWNrKGV2ZW50KTtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZURvY3VtZW50Q2xpY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmICh0aGlzLnByb3BzLnVzZUNhcHR1cmUpIHtcbiAgICAgIHRoaXMuX2NoZWNrRm9yQ2FwdHVyZVBoYXNlKGV2ZW50KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9jaGVja0ZvckJ1YmJsZVBoYXNlKGV2ZW50KTtcbiAgICB9XG4gIH0sXG5cbiAgX2hhbmRsZU91dHNpZGVDbGljazogZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKHRoaXMucHJvcHMub25PdXRzaWRlQ2xpY2spIHRoaXMucHJvcHMub25PdXRzaWRlQ2xpY2soZXZlbnQpO1xuICB9LFxuXG4gIF9oYW5kbGVXcmFwcGVyQ2xpY2s6IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHRoaXMuX3dhc0luc2lkZSA9IHRydWU7XG4gICAgaWYgKHRoaXMucHJvcHMub25DbGljaykgdGhpcy5wcm9wcy5vbkNsaWNrKGV2ZW50KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmV3UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzKTtcbiAgICBkZWxldGUgbmV3UHJvcHMuY2hpbGRyZW47XG4gICAgZGVsZXRlIG5ld1Byb3BzLmNvbXBvbmVudDtcbiAgICBkZWxldGUgbmV3UHJvcHMub25DbGljaztcbiAgICBkZWxldGUgbmV3UHJvcHMub25PdXRzaWRlQ2xpY2s7XG4gICAgZGVsZXRlIG5ld1Byb3BzLnVzZUNhcHR1cmU7XG5cbiAgICBuZXdQcm9wcy5yZWYgPSBmdW5jdGlvbiAoZWxlbSkge1xuICAgICAgdGhpcy5fZWxlbSA9IGVsZW07XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgbmV3UHJvcHMub25DbGljayA9IHRoaXMuX2hhbmRsZVdyYXBwZXJDbGljaztcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgdGhpcy5wcm9wcy5jb21wb25lbnQsXG4gICAgICBuZXdQcm9wcyxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9LFxuXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPdXRzaWRlQ2xpY2s7Il19
