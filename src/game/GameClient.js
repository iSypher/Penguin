const NullDelimiter = require('../network/delimiter/NullDelimiter');
const Proxy = require('../network/Proxy');
const Logger = require('../logging/Logger');

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
    Logger.silly(`[Sending to Game]: ${data}`);
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
