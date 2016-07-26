import isSomething from 'frampton-utils/is_something';

QUnit.module('Frampton.Utils.isSomething');

QUnit.test('Should return false for null', function(assert) {
  const temp = null;
  assert.notOk(isSomething(temp));
});

QUnit.test('Should return false for undefined', function(assert) {
  var temp;
  assert.notOk(isSomething(temp));
});

QUnit.test('Should return true for strings', function(assert) {
  const temp = 'test';
  assert.ok(isSomething(temp));
});

QUnit.test('Should return true for numbers', function(assert) {
  const temp = 10;
  assert.ok(isSomething(temp));
});

QUnit.test('Should return true for booleans', function(assert) {
  const temp = false;
  const temp2 = true;
  assert.ok(isSomething(temp));
  assert.ok(isSomething(temp2));
});

QUnit.test('Should return true for objects', function(assert) {
  const temp = {};
  assert.ok(isSomething(temp));
});
