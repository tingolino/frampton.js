# Frampton

[![Build Status](https://semaphoreci.com/api/v1/beatniklarry/frampton-js/branches/master/badge.svg)](https://semaphoreci.com/beatniklarry/frampton-js)

Frampton is a library to assist writing JavaScript in a functional manner. Frampton supplies an observable implementation (Frampton.Signal). Frampton is inspired largely by the Elm community thus we use similar naming conventions (Signal vs EventStream). Frampton also provides a number of utilities for dealing with common JavaScript types in a more functional manner.

### Currying

Almost all functions exported by Frampton are curried. If a function takes more than one argument it can be partially applied to create a new function that waits on the remaining arguments.

### Tutorial

[Frampton Comes Alive: Event-Driven Functional Programming in JavaScript](https://www.linkedin.com/pulse/frampton-comes-alive-event-driven-functional-kevin-greene)


## Frampton.Signal

A Signal is a value that changes over time. Signals provide methods to alter their values or to be alerted to the changing state of those values.

```
const Signal = Frampton.Signal.create;

// create a new signal
const sig = Signal();

// create a signal with an initial value
const sig2 = Signal(5);

// Respond to values of the signal
// the value method will immediately log '5' and then log any updates
// to the signal
sig2.value((val) => {
  console.log('value = ' + val);
});

// the next method will not log 5, it will wait for the next value and update
// on each value after.
sig2.next((val) => {
  console.log('next = ' + val);
});

// the changes method works like the value method except it filters out repeated
// values. It will log 5 and then wait for the next value on the signal that is
// not a 5.
sig2.changes((val) => {
  console.log('changes = ' + val);
});

// Push a new value onto a signal
sig2.push(6);

// Get the current value of a signal
sig2.get();

// Modify a signal
// All methods return new signals
// Filter values
const greaterThanFive = sig2.filter((val) => val > 5);

// You can also compare the current value against the next to decide if you want
// the signal to update. How changes is implemented
const changes = sig2.filterPrevious((prevValue, nextValue) => {
  return prevValue !== nextValue;
});

// Map values
const plusOne = sig2.map((val) => val + 1);

// Filter with another signal.
// This signal will only continue if sig has a truthy value.
const conditionMet = sig2.and(sig);

// This signal will only continue if sig has a falsy value.
const notCondition = sig2.not(sig);

// When sig2 updates this signal will grab the value of sig
const replace = sig2.sample(sig);

// Merge signals
const bothSignals = sig2.merge(sig);

// Zip signals. The resulting signal's value will be a tuple of the current
// values of each of its parents'
const tupleSignal = sig2.zip(sig);

// Reduce a signal with a function. Like Array.prototype.reduce
// This counts how many times sig2 is called
const counter = sig2.fold((acc, next) => {
  return acc + 1;
}, 0);

```


## Frampton.Events

Events are central to any browser application. This module provides a number of functions to make dealing with events easier.

```
const Events = Frampton.Events;

// Create a signal from DOM events
// These events are attached to the document element.
const clicks = Events.onEvent('click');
const inputs = Events.onEvent('input');

// Create a signal from DOM events scoped to a given element.
// These events are also attached to the document, but are filtered based on
// the event target. All DOM events handled by Frampton are delegated. Most
// are delegated off of the document. No mater how many clicks you listen for
// in your code only one listener for click is ever attached to the DOM.
const divClicks = Events.onEvent('click', document.querySelector('div'));

// Listen for clicks on elements with a given selector
// Again event listeners are attached to the document and delegated.
const itemClicks = Events.onSelector('click', '.list-item');

// Get signal of event targets
const eventTargets = clicks.map(Events.eventTarget);

// Get the value of event targets (event.target.value)
const eventValues = inputs.map(Events.eventValue);

// Does the target of the event have a given selector
const matchingTargets = clicks.filter(Events.hasSelector('.test'));

// Is the target of the event inside an element with the given selector
const containedIn = clicks.filter(Events.selectorContains('.test'));

// Does the target of the event contain an element with the given selector
const doesContain = clicks.filter(Events.containsSelector('.test'));

// Does the target of the event contain a given element
const node = document.querySelector('div');
const doesContainElement = clicks.filter(Events.contains(node));

// Get the position of an event as a tuple [x,y]
const position = clicks.map(Events.getPosition);

// Get the position of an event relative to a node
const node = document.querySelector('div');
const relativePostion = clicks.map(Events.getPositionRelative(node));
```


## Frampton.Data

Frampton.Data module exposes a few abstract data types that make working functionally a little easier.

### Frampton.Data.Result

A Result is used to represent values that can be the result of successful or failed computations. It is analogous to Either in some functional programming languages. Result has two subclasses, Success and Failure.

```
const { Success, Failure } = Frampton.Data.Result;
const fromThrowable = Frampton.Data.Result.fromThrowable;

const success = Success(5);
const failure = Failure(8);

// map successful values
const mapping = (val) => val + 5;
const mappedSuccess = success.map(mapping); // -> 'Success(10)'
const mappedFailure = failure.map(mapping); // -> 'Failure(8)'

// map failed values
const mapping = (val) => val + 3;
const mappedSuccess = success.mapFailure(mapping); // -> 'Success(5)'
const mappedFailure = failure.mapFailure(mapping); // -> 'Failure(11)'

// filter Successes. Successes become Failures if the fail the predicate.
// Failures are unaltered.
const predicate = (val) => val > 10;
const filteredSuccess = success.filter(predicate); // -> 'Failure(5)'
const filteredFailure = failure.filter(predicate); // -> 'Failure(8)'

// Run a callback based on success or failure.
const onSuccess = (val) => val + 3;
const onFailure = (val) => val + 10;
const successResult = success.fork(onSuccess, onFailure); // -> 8
const failureResult = failure.fork(onSuccess, onFailure); // -> 18

// Create Result from function that may throw
const wrappedFn = fromThrowable((num) => {
  if (num > 5) {
    return num;
  } else {
    throw new Error('Too small');
  }
});

wrappedFn(10); // -> 'Success(10)'
wrappedFn(2); // -> 'Failure(Too small)'

// fromThrowable returns a curried function
const testValues = fromThrowable((first, second) => {
  if (first > second) {
    throw new Error('Second too small');
  } else {
    return second;
  }
});

const testSix = testValues(6);
testSix(8); // -> 'Success(8)';
testSix(2); // -> 'Failure(Second too small)'
```

### Frampton.Data.Maybe

A Maybe is used to represent a value that may be null or undefined. This gives you an interface for dealing with such values without having to constantly do null checks.

In Frampton Maybes are essentially abstract classes that have two subclass Just and Nothing. Here we're using Haskell naming conventions. A Just represents a value and a Nothing is a missing value.

```
const Maybe = Frampton.Data.Maybe.create;

const maybeOne = Maybe(1); // -> 'Just(1)'
const maybeNothing = Maybe(null); // -> 'Nothing'

// change the value of a Maybe
const mapping = (val) => val + 2;
const updatedOne = maybeOne.map(mapping); // -> 'Just(3)'
const updatedNothing = maybeNothing.map(mapping); // 'Nothing'

// filter the value of a Maybe
const predicate = (val) => val > 2;
const filteredOne = maybeOne.filter(predicate); // -> 'Nothing'
const filteredUpdatedOne = updatedOne.filter(predicate); // -> 'Just(3)'
const filteredNothing = updatedNothing.filter(predicate); // -> 'Nothing'

// flatten a nested Maybe
const nested = Maybe(Mabye(5)); // -> 'Just(Just(5))'
cosnt flattened = nested.join(); // -> 'Just(5)'

// join only removes one level of nesting
const doubleNested = Maybe(Maybe(Mabye(5))); // -> 'Just(Just(Just(5)))'
cosnt doubleFlattened = doubleNested.join(); // -> 'Just(Just(5))'

// get the value from a Maybe
const one = maybeOne.get(); // -> 1
const nothing = maybeNothing.get(); // -> Error: can't get value of Nothing

// safely get the value of a Maybe
const safeOne = maybeOne.getOrElse(5); // -> 1
const safeNothing = maybeNothing.getOrElse(5); // -> 5
```

### Frampton.Data.Record

Records in functional languages are often types that are similar to object literals in JavaScript. The difference is they are immutable and updating a key returns a new Record with the updated key/value.

Frampton provides a simple type that gives you an immutable object that when updated returns a new object.

```
const Record = Frampton.Data.Record.create;

const bob = Record({
  name : 'Bob',
  age : 32
});

// Records are immutable
bob.age = 40;
console.log(bob.age); // -> 32

const olderBob = bob.update({ age : 40});
console.log(olderBob.age); // -> 40
console.log(bob.age); // -> 32

// You can't add keys during an update
// In dev mode a warning is logged when trying to add keys during update
const jim = bob.update({ name : 'Jim', eyes : 'blue' });
console.log(jim.eyes); // -> undefined
console.log(jim.name); // -> 'Jim'

// Get an object literal representation of the Record
const data = bob.data(); // -> { name : 'Bob', age : 32 }
```

### Frampton.Data.Task

A Task is essentially an IO monad. Use it to wrap IO operations that may fail. Tasks are particularly good for wrapping async operations. Much like promises.

Tasks are lazy. A task can be described without being run.

```
const Task = Frampton.Data.Task.create;

// A task takes a function to run. When the function is run it will receive
// an object with callbacks for different events in the life of the task.
const waitTwoSeconds = Task((sinks) => {
  setTimeout(() => {
    sinks.resolve('2 seconds passes');
  }, 2000);
});

// This just describes the task. To run it...
waitTwoSeconds.run({
  resolve : (msg) => console.log(msg),
  reject : (err) => console.log('err: ', err)
});

// To filter the results of a task (a resolve becomes a reject)
const random = Task((sinks) => {
  sinks.resolve(Math.random() * 100);
});

const randomOverFifty = random.filter((val) => val > 50);

// To map a result to another value...
// After 2 seconds emits a 5.
const delayedFive = waitTwoSeconds.map(5);

// Map can also take a function
const delayedFunc = waitTwoSeconds.map((msg) => {
  return msg.toUpperCase();
});

// To recover from an error. A reject becomes a resolve.
const httpGet = (url) => {
  return Task((sinks) => {
    $.get(url).then((res) => {
      sinks.resolve(res);
    }, (err) => {
      sinks.reject(err);
    });
  });
});

const neverFailRequest = httpGet('http://fake.com/api/posts').recover((err) => {
  // on failure return an empty array.
  return [];
});

// Or, just supply a default value for failure
const neverFailRequest = httpGet('http://fake.com/api/posts').default([]);

// Run tasks in parallel...
Frampton.Data.Task.when(/* tasks to run */).run(...);

// Run tasks in sequence...
Frampton.Data.Task.sequence(/* tasks to run */).run(...);

```

### Frampton.Data.Union

In many functional languages there is a very useful data construct called a Union Type. It is used for modeling data types with a finite set of predefined values. The easiest example is a boolean. It can be either true or false. Union types allow you to create such constructs yourself. These constructs are usually accompanied by pattern matching. You can also associate data with unions.

```
const Union = Frampton.Data.Union.create;

// This creates type constructors
const Colors = Union({
  Red : [],
  Green : [],
  Blue : []
});

// Create types
const red = Colors.Red();

// Pattern match against the instance
const hexColor = Colors.match({
  Red : () => '#FF0000',
  Green : () => '#00FF00',
  Blue : () => '#0000FF'
}, red);

console.log(hexColor); // #FF0000

// Associate data with unions
const Person = Union({
  Man : ['name', 'age'],
  Woman : ['name', 'age']
});

const john = Person.Man('John', 45);
const jane = Person.Woman('Jane', 43);

// Access values
console.log(john.name); // 'John'
console.log(jane.age); // 43

// Match with values, curried function
const age = Person.match({
  Man : (name, age) => age,
  Woman : (name, age) => age
});

console.log(age(john)); // 45
console.log(age(jane)); // 43
```


## Native JavaScript Types

In addition to the Frampton.Data classes Frampton exports a number of functions for working with normal JavaScript objects in a more functional manner.

### Frampton.List

Frampton.List exports functions for working with JavaScript Arrays in a functional manner. All functions that modify an Array return a new Array leaving the original Array unaltered. All functions are curried if they take more than one parameter.

```
const List = Frampton.List;
const arr = [1,2,3];

// Add item to Array if it doesn't already exist in Array.
const added = List.add(arr, 4);
console.log(added); // -> [1,2,3,4];
console.log(arr); // -> [1,2,3];
const dup = List.add(arr, 3);
console.log(dup); // -> [1,2,3];

// Append item to Array
const appended = List.append(arr, 3);
console.log(appended); // -> [1,2,3,3];

// Prepend item to Array
const prepended = List.prepend(arr, 2);
console.log(prepended); // -> [2,1,2,3]

// Get item at index
const elm = List.at(1, arr);
console.log(elm); // -> 2

// Test if Array contains item
const test = List.contains(arr, 2);
console.log(test); // -> true

// Find the diff between two lists. Returns Array of item that
// are in the first array but not the second
const diff = List.diff(arr, [0,2,4,6]);
console.log(diff); // -> [1,3]

// Find max value in Array
const max = List.max(arr);
console.log(max); // -> 3

// Find min value in Array
const min = List.min(arr);
console.log(min); // -> 1

// All elements but the last
const init = List.init(arr);
console.log(init); // -> [1,2]

// All elements but the first
const tail = List.tail(arr);
console.log(tail); // -> [2,3]

// The first element in Array
const first = List.first(arr);
console.log(first); // -> 1

// The second element in Array
const second = List.first(second);
console.log(second); // -> 2

// The last element in Array
const last = List.last(arr);
console.log(arr); // -> 3

// Reverse an Array
const reverse = List.reverse(arr);
console.log(reverse); // -> [3,2,1]

// Zip the values of two Arrays into an Array of pairs
const zipped = List.zip(arr, [5,6,7,8,9]);
console.log(zipped); // -> [[1,5], [2,6], [3,7]]

// Split Array into two Arrays at index
const split = List.split(2, arr);
console.log(split); // -> [[1,2], [3]]

// Drop the first n items in Array
const dropped = List.drop(2, arr);
console.log(dropped); // -> [3]
```

### Frampton.Object

Frampton.Object doesn't have as many methods, but they may be a little more interesting. Similarly, the goal here is to work with native JavaScript Objects in a functional manner.

Functions return new Objects. They do not modify the original Object.

```
const Obj = Frampton.Object;
const basicObject = { foo : 1, bar : 2 };
const nestedObject = {
  one : 1,
  two : 2,
  sub : {
    three : 3,
    four : 4
  }
};

// Get a property from an Object
Obj.get('foo', basicObject); // -> 1

// Get a nested property from an Object
Obj.get('sub.four', nestedObject); // -> 4
Obj.get('sub.five', nestedObject); // -> null

// Set a value and return a new Object
const updated = Obj.set('foo', 5, basicObject);
console.log(updated); // -> { foo : 5, bar : 2 }

// Set the value of a nested object
const updated = Obj.set('foo.three', 5, nestedObject);
console.log(updated); // -> { one : 1, two : 2, sub : { three : 5, four : 4 } }

// Update many key/value pairs on an Object
const updated = Obj.update(obj, { foo : 6, bar : 8 });
console.log(updated); // -> { foo : 6, bar : 8 };

// Turn an Object into an Array of key/value pairs
const list = Obj.asList(basicObject);
console.log(obj); // -> [['foo', 1], ['bar', 2]]

// Filter keys in an Object
const filtered =
  Obj.filter((value, key) => {
    return value < 2;
  }, basicObject);
console.log(filtered); // -> { foo : 1 }
console.log(basicObject); // -> { foo : 1, bar : 2 }

// Map the values of an Object
const mapped =
  Obj.map((value, key) => {
    return value + 2;
  }, basicObject);
console.log(mapped); // -> { foo : 3, bar : 4 }

// Reduce a Object to a value
const reduced =
  Obj.reduce((acc, value, key) => {
    return acc + value;
  }, 0, basicObject);
console.log(reduced); // -> 3
```


## Frampton.Style

Frampton.Style exports functions for dealing with CSS styles and classes.

```
const Style = Frampton.Style;

// Does an element match a selector
const node = document.querySelector('div');
const isButton = Style.matches('button'); // curried funciton
isButton(node); // -> false

// Get the element closest parent of this node that matches the given selector
const node = document.querySelector('.test');
const matchingNode = Style.closest('.test-parent', node);

// Does the element or one of its children match the selector
const node = document.querySelector('.test');
const doesMatch = Style.contains('.test-child');
```

## Frampton.Utils

Frampton.Utils exports a host of utility functions. Here are a few.

```
const Utils = Frampton.Utils;

// Curry a function
function add(a, b) {
  return a + b;
}

const curriedAdd = Utils.curry(add);
const addOne = curriedAdd(1);
addOne(3); // -> 4
addOne(5); // -> 6


// Compose functions
const addFour = curriedAdd(4);
const addFive = Utils.compose(addFour, addOne);
addFive(5); // -> 10

// Identity function
Utils.identity(5); // -> 5

// Boolean tests
Utils.isArray({}); // -> false
Utils.isObject([]); // -> false
Utils.isString('test'); // -> true
Utils.isBoolean(false); // -> true
Utils.isDefined(undefined); // -> false
Utils.isUndefined(undefined); // -> true
Utils.isNull(null); // -> true
Utils.isEmpty([]); // -> true
Utils.isEmpty(''); // -> true
Utils.isTrue(true); // -> true
Utils.isFalse(false); // -> true
Utils.isFunction(() => {}); // -> true;
Utils.isNothing(null); // -> true
Utils.isNothing(undefined); // -> true
Utils.isSomething(null); // -> false
Utils.isSomething(undefined); // -> false
const isFive = Utils.isValue(5);
isFive(5); // -> true

// A function that always returns the given values
const fives = Utils.ofValue(5);
fives(); // -> 5
fives(7); // -> 5
```
