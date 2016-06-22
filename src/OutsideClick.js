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
    capture: React.PropTypes.bool,
    children: React.PropTypes.any,
    component: React.PropTypes.string,
    onClick: React.PropTypes.func,
    onOutsideClick: React.PropTypes.func,
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
    if (document) {
      document.addEventListener(
        'click',
        this._handleDocumentClick,
        this.props.capture
      );
    }
  },

  componentWillUnmount: function () {
    if (document) {
      document.removeEventListener(
        'click',
        this._handleDocumentClick,
        this.props.capture
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
    if (this.props.capture) {
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
    delete newProps.capture;
    delete newProps.children;
    delete newProps.component;
    delete newProps.onClick;
    delete newProps.onOutsideClick;

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