import curry from 'frampton-utils/curry';

/**
 * @name divide
 * @method
 * @memberof Frampton.Math
 * @param {Number} left
 * @param {Number} right
 * @returns {Number}
 */
export default curry(function divide(left, right) {
  return (left / right);
});
