export class Validator {
  static isArrayBuffer = (value: any): boolean => {
    const hasArrayBuffer = typeof ArrayBuffer === 'function'
    const { toString } = Object.prototype

    /**
     * Check if the given value is an ArrayBuffer.
     * @param {*} value - The value to check.
     * @returns {boolean} Returns `true` if the given value is an ArrayBuffer, else `false`.
     * @example
     * isArrayBuffer(new ArrayBuffer())
     * // => true
     * isArrayBuffer([])
     * // => false
     */
    return (
      hasArrayBuffer &&
      (value instanceof ArrayBuffer ||
        toString.call(value) === '[object ArrayBuffer]')
    )
  }
}
