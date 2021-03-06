import closest from 'frampton-style/closest';

QUnit.module('Frampton.Style.closest', {
  beforeEach() {
    this.div1 = document.createElement('div');
    this.div2 = document.createElement('div');
    this.container = document.getElementById('qunit-fixture');
    this.container.appendChild(this.div1);
    this.div1.appendChild(this.div2);
  },
  afterEach() {
    this.container.removeChild(this.div1);
    this.div1 = null;
    this.div2 = null;
    this.container = null;
  }
});

QUnit.test('returns closest element matching selector', function(assert) {
  this.div1.classList.add('blue');
  assert.equal(closest('.blue', this.div2), this.div1, 'correctly gets element');
});

QUnit.test('returns null if no match', function(assert) {
  this.div1.classList.add('blue');
  assert.equal(closest('#blue', this.div2), null, 'correctly gets element');
});
