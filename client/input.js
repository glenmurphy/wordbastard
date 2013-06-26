/**
 * A field that represents a single textfield. Emits a 'changed' event when
 * the field has changed.
 *
 * @param {String} className
 */
var InputField = function(className) {};
InputField = GMBase.DOMObject.Constructor('input');

InputField.prototype.constructor_ = function(className, value) {
  if (className)
    this.classList.add(className);

  this.type = 'search';
  if (!value) value = '';
  this.incremental = true;

  this.value = value;
  this.focused_ = false;
  this.editing_ = false;
  this.real_value_ = value;
  this.addEventListener('focus', this.handleFocus.bind(this), false);
  this.addEventListener('search', this.handleSearch.bind(this), false);
  this.addEventListener('blur', this.handleBlur.bind(this), false);
  this.addEventListener('keyup', this.handleKeyPress.bind(this), false);
};

InputField.prototype.setPlaceholder = function(text) {
  this.placeholder = text;
};

InputField.prototype.setValue = function(value) {
  this.value = value;
  this.real_value_ = value;
};

InputField.prototype.setType = function(type) {
  this.type = type;
};

InputField.prototype.handleFocus = function() {
  window.console.log('focus');
  this.real_value_ = this.value;
  this.focused_ = true;
};

InputField.prototype.handleSearch = function() {
  this.notifyListeners('search', this.value);
  this.editing_ = (this.value != this.real_value_);
};

InputField.prototype.handleBlur = function() {
  window.console.log('blur');
  this.editing_ = false;
  this.focused_ = false;
  this.notifyListeners('blur', this.value);
};

InputField.prototype.handleKeyPress = function(e) {
  window.console.log('keypress');
  if (e.keyCode == 13) {
    e.preventDefault();
    this.notifyListeners('submit', this.value);
    this.editing_ = false;
    return;
  } else {
    this.notifyListeners('changed', this.value);
  }
  this.editing_ = (this.value != this.real_value_);
};