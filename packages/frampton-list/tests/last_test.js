import last from 'frampton-list/last';

QUnit.module('Frampton.List.last');

QUnit.test('returns last element in array', function(assert) {
  var xs = [1,2,3];
  assert.equal(last(xs), 3);
});
