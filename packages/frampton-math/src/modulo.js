import { curry } from 'frampton-utils';

// modulo :: Number -> Number -> Number
export default curry(function modulo(a, b) {
  return a % b;
});