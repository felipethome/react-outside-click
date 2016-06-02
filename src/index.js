var React = require('react');
var isAncestor = require('./is-ancestor');

var OutsideClick = React.createClass({
  displayName: 'OutsideClick',

  propTypes: {
    children: React.PropTypes.any,
    component: React.PropTypes.string,
    onOutsideClick: React.PropTypes.func,
  },

  getDefaultProps: function () {
    return {
      component: 'div',
    };
  },

  componentDidMount: function () {
    if (document) {
      document.addEventListener('click', this._handleDocumentClick);
    }
  },

  componentWillUnmount: function () {
    if (document) {
      document.removeEventListener('click', this._handleDocumentClick);
    }
  },

  _handleDocumentClick: function (event) {
    if (this._elem) {
      if (!isAncestor(event.target, this._elem)) {
        this._handleOutsideClick(event);
      }
    }
  },

  _handleOutsideClick: function (event) {
    if (this.props.onOutsideClick) this.props.onOutsideClick(event);
  },

  render: function () {
    const {
      children,
      component,
      onOutsideClick,
      ...otherProps
    } = this.props;

    const props = Object.assign(otherProps, {
      ref: function (elem) { this._elem = elem; }.bind(this),
    });

    return React.createElement(component, props, children);
  },

});

module.exports = OutsideClick;