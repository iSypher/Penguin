class NullDelimiter {
  constructor(reference) {
    /**
     * The class reference that instantiated this NullDelimiter
     * @type {GameClient|Proxy}
     * @private
     */
    this._reference = reference;

    /**
     * Stores the socket buffer temporary
     * @type {string}
     * @private
     */
    this._buffer = '';
  }

  /**
   * Handles all incoming packets and splits the delimiter
   * @param {Buffer} buf
   * @public
   */
  write(buf) {
    this._buffer += buf;

    if (this._buffer[this._buffer.length - 1] !== '\x00') return;
    let packets = this._buffer.split('\x00');

    for (let i = 0; i < packets.length - 1; i++) this._reference.onData(packets[i]);
    this._buffer = '';
  }
}

module.exports = NullDelimiter;
