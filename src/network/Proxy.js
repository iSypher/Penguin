const net = require('net');
const NullDelimiter = require('.././network/delimiter/NullDelimiter');
const Logger = require('../logging/Logger');

class Proxy {
  constructor(client) {
    /**
     * The client that instantiated this Connection
     * @type {GameClient}
     * @private
     */
    this._client = client;

    /**
     * The server
     * @type {TCPServer}
     * @private
     */
    this._server = client.server;

    /**
     * Packet delimiter
     * @type {NullDelimiter}
     * @private
     */
    this._delimiter = new NullDelimiter(this);

    /**
     * The Proxy connection
     * @type {net.Server}
     * @public
     */
    this._socket = net.createConnection({
      host: this._server.config.Game.Host,
      port: this._server.config.Game.Port,
    }, () => this._client.events());

    /**
     * Socket encoding
     * @private
     */
    this._socket.setEncoding('utf-8');

    /**
     * The Proxy connection of this client
     * @type {Proxy}
     * @private
     */
    this._events();
  }

  get socket() {
    return this._socket;
  }

  _events() {
    this._socket.on('close', () => this._client.onClose());
    this._socket.on('data', data => this._delimiter.write(data));
  }

  onData(data) {
    Logger.silly(`[Sending to Client]: ${data}`);
    this._client.socket.write(`${data}\x00`);
  }

  /**
   * Closes the connection
   */
  close() {
    // Todo: Close connection
  }
}

module.exports = Proxy;