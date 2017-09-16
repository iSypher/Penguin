const NullDelimiter = require('../network/delimiter/NullDelimiter');
const Proxy = require('../network/Proxy');
const Logger = require('../logging/Logger');
const PacketManager = require('../network/packets/PacketManager');

class GameClient {
  constructor(server, socket) {
    /**
     * The server that instantiated this Client
     * @type {Server}
     * @private
     */
    this._server = server;

    /**
     * The server that instantiated this Client
     * @type {net.Socket}
     * @private
     */
    this._socket = socket;

    /**
     * Packet delimiter
     * @type {NullDelimiter}
     * @private
     */
    this._delimiter = new NullDelimiter(this);

    /**
     * The Proxy connection of this Client
     * @type {Proxy}
     * @private
     */
    this._proxy = new Proxy(this);
  }

  get server() {
    return this._server;
  }

  get socket() {
    return this._socket;
  }

  events() {
    this._socket.on('close', () => this.onClose());
    this._socket.on('data', data => this._delimiter.write(data));
  }

  onData(data) {
    let type = PacketManager.check(data);

    switch (type) {
      case PacketManager.packetType.XML:
        this.write(data);
        break;

      case PacketManager.packetType.XT:
        this.write(data);
        break;

      case PacketManager.packetType.UNDEFINED:
        // Todo: close connection
        break;
    }
  }

  write(data) {
    this._proxy.socket.write(`${data}\x00`);
  }

  /**
   * Closes the connection
   */
  onClose() {
    // Todo: Close connection
  }
}

module.exports = GameClient;
