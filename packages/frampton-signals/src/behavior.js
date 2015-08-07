import assert from 'frampton-utils/assert';
import guid from 'frampton-utils/guid';
import noop from 'frampton-utils/noop';
import isDefined from 'frampton-utils/is_defined';
import equal from 'frampton-utils/equal';
import contains from 'frampton-list/contains';

function Behavior(initial, seed) {
  assert('Behavior must have initial value', isDefined(initial));
  this.value = initial;
  this.listeners = [];
  this.cleanup = null;
  this.seed = seed || noop;
  this._id = guid();
}

function addListener(behavior, fn) {
  if (!contains(behavior.listeners, fn)) {
    if (behavior.listeners.length === 0) {
      let sink = behavior.update.bind(behavior);
      behavior.cleanup = behavior.seed(sink) || noop;
    }
    behavior.listeners.push(fn);
    fn(behavior.value);
  }
}

function updateListeners(behavior) {
  behavior.listeners.forEach(function(listener) {
    listener(behavior.value);
  });
}

// of :: a -> Behavior a
Behavior.of = function Behavior_of(value) {
  return new Behavior(value);
};

Behavior.prototype.of = Behavior.of;

Behavior.prototype.update = function Behavior_update(val) {
  if (!equal(val, this.value)) {
    this.value = val;
    updateListeners(this);
  }
  return this;
};

Behavior.prototype.changes = function Behavior_changes(fn) {
  addListener(this, fn);
  return this;
};

Behavior.prototype.bind = function Behavior_bind(obj, prop) {
  this.changes((val) => {
    obj[prop] = val;
  });
  return this;
};

Behavior.prototype.destroy = function Behavior_destroy() {
  this.cleanup();
  this.cleanup = null;
  this.seed = null;
  this.value = null;
  this.listeners = null;
};

export default Behavior;