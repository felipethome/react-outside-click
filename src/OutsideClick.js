/**
 * Copyright Felipe Thomé.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import PropTypes from 'prop-types';
import React from 'react';

class OutsideClick extends React.Component {
  constructor(props) {
    super(props);
    this._handleDocumentClick = this._handleDocumentClick.bind(this);
  }
  componentWillMount() {
    this._wasInside = false;
  }
  componentDidMount() {
    this._addListener(this.props.useCapture);
  }
  componentWillReceiveProps (nextProps) {
    if ((nextProps.disableHandler !== this.props.disableHandler) ||
        (nextProps.useCapture !== this.props.useCapture)) {
      this._removeListener(this.props.useCapture);
      if (!nextProps.disableHandler) this._addListener(nextProps.useCapture);
    }
  }
  componentWillUnmount () {
    this._removeListener(this.props.useCapture);
  }
  _addListener (useCapture) {
    if (document) {
      document.addEventListener(
        'click',
        this._handleDocumentClick,
        useCapture
      );
    }
  }
  _removeListener (useCapture) {
    if (document) {
      document.removeEventListener(
        'click',
        this._handleDocumentClick,
        useCapture
      );
    }
  }
  _checkForBubblePhase (event) {
    if (!this._wasInside) {
      this._handleOutsideClick(event);
    }
    this._wasInside = false;
  }
  _checkForCapturePhase (event) {
    if (this._elem && !this._elem.contains(event.target)) {
      this._handleOutsideClick(event);
    }
  }
  _handleDocumentClick (event) {
    if (this.props.useCapture) {
      this._checkForCapturePhase(event);
    }
    else {
      this._checkForBubblePhase(event);
    }
  }
  _handleOutsideClick (event) {
    if (this.props.onOutsideClick) this.props.onOutsideClick(event);
  }
  _handleWrapperClick (event) {
    this._wasInside = true;
    if (this.props.onClick) this.props.onClick(event);
  }
  render () {
    const {
      children,
      component,
      onClick,
      onOutsideClick,
      useCapture,
      ...other
    } = this.props;

    return React.createElement(component, {
      ref: (el) => { this._elem = el; },
      onClick: (e) => this._handleWrapperClick(e),
      ...other,
    }, children);
  }
};

OutsideClick.propTypes = {
  /**
   * The children of this component. They will be put inside of the root
   * element without any modification.
   */
  children: PropTypes.any,
  /**
   * The component that will wrap the children. Default: "div".
   */
  component: PropTypes.string,
  /**
   * If true, the handler will be removed and outside click will not be
   * be triggered. Default: false.
   */
  disableHandler: PropTypes.bool,
  /**
   * This is mapped just to avoid ESLint warnings. Any property passed to
   * this component that is not direct part of its logic will be placed in the
   * root element without modification.
   */
  onClick: PropTypes.func,
  /**
   * Callback that will be called with the event object when a click happens
   * outside of the wrap/root element.
   */
  onOutsideClick: PropTypes.func,
  /**
   * If true, the logic of the component will use capture events.
   * Default: false.
   */
  useCapture: PropTypes.bool,
};

OutsideClick.defaultProps = {
  component: 'div',
};

module.exports = OutsideClick;