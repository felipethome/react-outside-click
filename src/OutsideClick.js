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