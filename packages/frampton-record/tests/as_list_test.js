import asList from 'frampton-record/as_list';

QUnit.module('Frampton.Record.asList');

QUnit.test('returns a list of pairs for an object', function(assert) {
  const map = { one : 1, two : 2, three : 3 };
  const actual = asList(map);
  const expected = [['one',1], ['two',2], ['three',3]];
  assert.deepEqual(actual, expected);
});
