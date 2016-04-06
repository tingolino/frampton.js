import succeed from 'frampton-data/task/succeed';

QUnit.module('Frampton.Data.Task.succeed');

QUnit.test('Should create a task that always succeeds', function(assert) {

  const done = assert.async();
  const task = succeed('test value');

  task.run((err) => {
    ok(false, 'should always succeed');
    done();
  }, (val) => {
    equal(val, 'test value');
    done();
  });
});