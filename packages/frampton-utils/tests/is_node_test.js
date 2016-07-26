import isNode from 'frampton-utils/is_node';

QUnit.module('Frampton.Utils.isNode');

QUnit.test('Should return true for dom nodes', function(assert) {
  const div = document.createElement('div');
  const ul = document.createElement('ul');
  const span = document.createElement('span');
  assert.ok(isNode(div));
  assert.ok(isNode(ul));
  assert.ok(isNode(span));
});

QUnit.test('Should return false for null', function(assert) {
  const temp = null;
  assert.notOk(isNode(temp));
});

QUnit.test('Should return false for undefined', function(assert) {
  var temp;
  assert.notOk(isNode(temp));
});

QUnit.test('Should return false for strings', function(assert) {
  const temp = 'test';
  assert.notOk(isNode(temp));
});

QUnit.test('Should return false for numbers', function(assert) {
  const temp = 10;
  assert.notOk(isNode(temp));
});

QUnit.test('Should return false for booleans', function(assert) {
  const temp = false;
  const temp2 = true;
  assert.notOk(isNode(temp));
  assert.notOk(isNode(temp2));
});

QUnit.test('Should return false for objects', function(assert) {
  const temp = {};
  assert.notOk(isNode(temp));
});
