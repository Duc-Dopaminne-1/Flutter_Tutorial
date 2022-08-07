import { arrayBufferToString, convertToImage } from '@/shared/image'

ArrayBuffer.prototype.toImage = function() {
  if (!this) {
    return ''
  }

  return convertToImage(arrayBufferToString(this))
}

Array.prototype.move = function(pos1: number, pos2: number) {
  const clone = [...this]
  // local variables
  let i
  let tmp
  // cast input parameters to integers
  const _pos1 = pos1
  const _pos2 = pos2
  // if positions are different and inside array
  if (
    _pos1 !== _pos2 &&
    0 <= _pos1 &&
    _pos1 <= clone.length &&
    0 <= _pos2 &&
    _pos2 <= clone.length
  ) {
    // save element from position 1
    tmp = clone[_pos1]
    // move element down and shift other elements up
    if (_pos1 < _pos2) {
      for (i = _pos1; i < _pos2; i++) {
        clone[i] = clone[i + 1]
      }
    }
    // move element up and shift other elements down
    else {
      for (i = _pos1; i > _pos2; i--) {
        clone[i] = clone[i - 1]
      }
    }
    // put element from position 1 to destination
    clone[_pos2] = tmp
  }

  return clone
}
