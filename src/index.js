var React = require('react');
var isAncestor = require('../utils/is-ancestor');

var OutsideClick = React.createClass({
  displayName: 'OutsideClick',

  propTypes: {
    children: React.PropTypes.any,
    component: React.PropTypes.string,
    onOutsideClick: React.PropTypes.func,
    style: React.PropTypes.object,
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
    return React.createElement(
      this.props.component,
      {
        ref: function (elem) {
          this._elem = elem;
        }.bind(this),
        style: this.props.style,
      },
      this.props.children
    );
  },

});

module.exports = OutsideClick;