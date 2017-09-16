const Constants = require('../../util/Constants');

class PacketManager {
  constructor() {
    throw new Error(Constants.Error.CANNOT_BE_INSTANTIATED(this.constructor.name));
  }

  /**
   * Packet types
   * @returns {Object}
   */
  static get packetType() {
    return {
      XML: 0,
      XT: 1,
      UNDEFINED: 2,
    };
  }

  /**
   * Checks to see if the packet type is valid
   * @param {string} data
   * @returns {number}
   * @public
   */
  static check(data) {
    let firstChar = data[0];
    let lastChar = data[data.length - 1];

    return this._checkPacketType(firstChar, lastChar);
  }

  /**
   * Checks the packet type
   * @param {string} firstChar
   * @param {string} lastChar
   * @returns {number}
   * @private
   */
  static _checkPacketType(firstChar, lastChar) {
    if (firstChar === '<' && lastChar === '>') {
      return PacketManager.packetType.XML;
    }
    if (firstChar === '%' && lastChar === '%') {
      return PacketManager.packetType.XT;
    }
    return PacketManager.packetType.UNDEFINED;
  }
}

module.exports = PacketManager;
