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
    children: React.PropTypes.any,
    component: React.PropTypes.string,
    disableHandler: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onOutsideClick: React.PropTypes.func,
    useCapture: React.PropTypes.bool,
  },

  getDefaultProps: function () {
    return {
      component: 'div',
    };
  },

  componentWillMount: function () {
    this._wasInside = false;
  },

  componentDidMount: function () {
    this._addListener(this.props.useCapture);
  },

  componentWillReceiveProps: function (nextProps) {
    if ((nextProps.disableHandler !== this.props.disableHandler) ||
        (nextProps.useCapture !== this.props.useCapture)) {
      this._removeListener(this.props.useCapture);
      if (!nextProps.disableHandler) this._addListener(nextProps.useCapture);
    }
  },

  componentWillUnmount: function () {
    this._removeListener(this.props.useCapture);
  },

  _addListener: function (useCapture) {
    if (document) {
      document.addEventListener(
        'click',
        this._handleDocumentClick,
        useCapture
      );
    }
  },

  _removeListener: function (useCapture) {
    if (document) {
      document.removeEventListener(
        'click',
        this._handleDocumentClick,
        useCapture
      );
    }
  },

  _checkForBubblePhase: function (event) {
    if (!this._wasInside) {
      this._handleOutsideClick(event);
    }
    this._wasInside = false;
  },

  _checkForCapturePhase: function (event) {
    if (this._elem && !this._elem.contains(event.target)) {
      this._handleOutsideClick(event);
    }
  },

  _handleDocumentClick: function (event) {
    if (this.props.useCapture) {
      this._checkForCapturePhase(event);
    }
    else {
      this._checkForBubblePhase(event);
    }
  },

  _handleOutsideClick: function (event) {
    if (this.props.onOutsideClick) this.props.onOutsideClick(event);
  },

  _handleWrapperClick: function (event) {
    this._wasInside = true;
    if (this.props.onClick) this.props.onClick(event);
  },

  render: function () {
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

    return React.createElement(
      this.props.component,
      newProps,
      this.props.children
    );
  },

});

module.exports = OutsideClick;