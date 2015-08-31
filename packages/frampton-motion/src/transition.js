import assert from 'frampton-utils/assert';
import immediate from 'frampton-utils/immediate';
import isSomething from 'frampton-utils/is_something';
import isString from 'frampton-utils/is_string';
import isObject from 'frampton-utils/is_object';
import guid from 'frampton-utils/guid';
import noop from 'frampton-utils/noop';
import notImplemented from 'frampton-utils/not_implemented';
import add from 'frampton-list/add';
import remove from 'frampton-list/remove';
import reverse from 'frampton-list/reverse';
import copy from 'frampton-object/copy';
import merge from 'frampton-object/merge';
import applyStyles from 'frampton-style/apply_styles';
import removeStyles from 'frampton-style/remove_styles';
import addClass from 'frampton-style/add_class';
import removeClass from 'frampton-style/remove_class';
import { addListener } from 'frampton-events/event_dispatcher';
import transitionend from 'frampton-motion/transition_end';
import reflow from 'frampton-motion/reflow';
import setState from 'frampton-motion/set_state';
import parsedTransitions from 'frampton-motion/parsed_transitions';
import parsedProps from 'frampton-motion/parsed_props';
import parsedTiming from 'frampton-motion/parsed_timing';
import updateTransform from 'frampton-motion/update_transform';

function inverseDirection(dir) {
  return ((dir === Transition.DIR_IN) ? Transition.DIR_OUT : Transition.DIR_IN);
}

function setDirection(transition, dir) {
  if (transition.element) {
    transition.element.classList.remove(inverseDirection(dir));
    transition.element.classList.add(dir);
  }
  transition.direction = dir;
}

function defaultRun(resolve) {

  this.element.setAttribute('data-transition-id', this.id);

  var unsub = addListener(transitionend, (evt) => {
    if (parseInt(evt.target.getAttribute('data-transition-id')) === this.id) {
      unsub();
      setState(this, Transition.CLEANUP);
      reflow(this.element);
      setState(this, Transition.DONE);
      immediate(() => {
        (resolve || noop)(this.element);
      });
    }
  }, this.element);

  setDirection(this, this.direction);

  if (isSomething(this.frame)) {
    applyStyles(this.element, this.config);
    reflow(this.element);
    if (this.direction === Transition.DIR_IN) {
      applyStyles(this.element, this.supported);
    } else {
      removeStyles(this.element, this.supported);
    }
  } else {
    reflow(this.element);
    if (this.direction === Transition.DIR_IN) {
      this.classList.forEach(addClass(this.element));
    } else {
      this.classList.forEach(removeClass(this.element));
    }
  }

  setState(this, Transition.RUNNING);
}

function withDefaultRun(element, frame, dir) {
  var trans = new Transition(element, frame, dir);
  trans.run = defaultRun;
  return trans;
}

function Transition(element, frame, dir) {

  assert('Browser does not support CSS transitions', isSomething(transitionend));

  this.id        = guid();
  this.element   = (element || null);
  this.direction = (dir || Transition.DIR_IN);
  this.frame     = null;
  this.config    = null;
  this.supported = null;
  this.outFrame  = null;
  this.classList = [];
  this.state     = Transition.WAITING;
  this.list      = [this];

  if (isObject(frame)) {
    this.frame = frame;
    this.supported = parsedProps(frame);
    this.config = merge(
      parsedTiming(frame),
      parsedTransitions(this.supported)
    );
  } else {
    this.classList = (isString(frame) ? frame.trim().split(' ') : []);
  }

  setState(this, this.state);
}

/**
 * Start the transition. Optionally provide a callback for when transition is complete.
 *
 * @name run
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Function} resolve Function to call when transition is complete.
 */
Transition.prototype.run = notImplemented;

/**
 * @name delay
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} time Miliseconds to delay transition
 * @returns {Transition}
 */
Transition.prototype.delay = function Transition_delay(time) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transition-delay'] = (isString(time) ? time : (time + 'ms'));
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name duration
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} time Miliseconds for transition to run
 * @returns {Transition}
 */
Transition.prototype.duration = function Transition_duration(time) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transition-duration'] = (isString(time) ? time : (time + 'ms'));
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name width
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} width
 * @returns {Transition}
 */
Transition.prototype.width = function Transition_width(width) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['width'] = (isString(width) ? width : (width + 'px'));
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name height
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} height
 * @returns {Transition}
 */
Transition.prototype.height = function Transition_width(height) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['height'] = (isString(height) ? height : (height + 'px'));
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name dimensions
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} width
 * @param {Number} height
 * @returns {Transition}
 */
Transition.prototype.dimensions = function Transition_width(width, height) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['width'] = (isString(width) ? width : (width + 'px'));
  frame['height'] = (isString(height) ? height : (height + 'px'));
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name top
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} position
 * @returns {Transition}
 */
Transition.prototype.top = function Transition_top(position) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['top'] = position;
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name left
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} position
 * @returns {Transition}
 */
Transition.prototype.left = function Transition_left(position) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['left'] = position;
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name opacity
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} opacity
 * @returns {Transition}
 */
Transition.prototype.opacity = function Transition_opacity(opacity) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['opacity'] = opacity;
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name translateX
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} distance
 * @returns {Transition}
 */
Transition.prototype.translateX = function Transition_translateX(distance) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transform'] = updateTransform(
    (frame['transform'] || ''),
    'translateX',
    (isString(distance) ? distance : (distance + 'px'))
  );
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name translateY
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} distance
 * @returns {Transition}
 */
Transition.prototype.translateY = function Transition_translateY(distance) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transform'] = updateTransform(
    (frame['transform'] || ''),
    'translateY',
    (isString(distance) ? distance : (distance + 'px'))
  );
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name translateZ
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} distance
 * @returns {Transition}
 */
Transition.prototype.translateZ = function Transition_translateZ(distance) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transform'] = updateTransform(
    (frame['transform'] || ''),
    'translateZ',
    (isString(distance) ? distance : (distance + 'px'))
  );
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name rotate
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} degrees
 * @returns {Transition}
 */
Transition.prototype.rotate = function Transition_translateZ(degrees) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transform'] = updateTransform(
    (frame['transform'] || ''),
    'rotate',
    (isString(degrees) ? degrees : (degrees + 'deg'))
  );
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name scale
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Number} scale
 * @returns {Transition}
 */
Transition.prototype.scale = function Transition_scale(scale) {
  var frame = (isSomething(this.frame) ? copy(this.frame) : {});
  frame['transform'] = updateTransform(
    (frame['transform'] || ''),
    'scale',
    scale
  );
  return withDefaultRun(
    this.element,
    frame,
    this.direction
  );
};

/**
 * @name addClass
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {String} name Name of class to add
 * @returns {Transition}
 */
Transition.prototype.addClass = function Transition_addClass(name) {
  return withDefaultRun(
    this.element,
    add(this.classList, name),
    this.direction
  );
};

/**
 * @name removeClass
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {String} name Name of class to remove
 * @returns {Transition}
 */
Transition.prototype.removeClass = function Transition_removeClass(name) {
  return withDefaultRun(
    this.element,
    remove(this.classList, name),
    this.direction
  );
};

/**
 * @name reverse
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @returns {Transition}
 */
Transition.prototype.reverse = function Transition_reverse() {
  return withDefaultRun(
    this.element,
    (isSomething(this.frame) ? copy(this.frame) : this.classList.join(' ')),
    inverseDirection(this.direction)
  );
};

/**
 * @name reverse
 * @memberOf Frampton.Motion.Transition
 * @instance
 * @param {Transition} transition Transition to run after this transition.
 * @returns {Transition}
 */
Transition.prototype.chain = function Transition_chain(transition) {

  var trans = new Transition();
  var saved = this.run.bind(this);

  trans.list = add(this.list, transition);

  trans.run = function chain_run(resolve) {
    saved(() => {
      transition.run(resolve);
    });
  };

  trans.reverse = function chain_reverse() {
    var list = reverse(trans.list);
    var len  = list.length;
    var i    = 1;
    var temp = list[0].reverse();
    for (;i<len;i++) {
      temp = temp.chain(list[i].reverse());
    }
    return temp;
  };

  return trans;
};

Transition.WAITING = 'waiting';
Transition.STARTED = 'started';
Transition.RUNNING = 'running';
Transition.DONE    = 'done';
Transition.CLEANUP = 'cleanup';
Transition.DIR_IN  = 'transition-in';
Transition.DIR_OUT = 'transition-out';

function transitionCreate(element, frame) {
  return withDefaultRun(element, frame);
}

export {
  Transition,
  transitionCreate as transition
};