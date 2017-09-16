const net = require('net');
const GameClient = require('../game/GameClient');
const Logger = require('../logging/Logger');
const config = require('../../config/Config');
const Constants = require('../util/Constants');

class TCPServer {
  constructor() {
    /**
     * Configuration settings
     * @type {JSON}
     * @public
     */
    this.config = config;

    /**
     * The Server connection
     * @type {?net.Server}
     * @private
     */
    this._server = null;

    /**
     * Stores connected clients
     * @type {Array<GameClient>}
     * @public
     */
    this.clients = [];
  }

  /**
   * Create socket and begin listening for new connections
   * @public
   */
  listen() {
    if (this._server) throw new Error(Constants.Error.SERVER_INSTANTIATED);

    this.server = net.createServer(socket => {
      socket.session = new GameClient(this, socket);
      socket.setEncoding('binary');
    });

    this.server.on('error', err => {
      throw err;
    });

    this.server.maxConnections = this.config.Server.maxConnections;

    this.server.listen({
      port: 6113,
      backlog: 10,
      exclusive: false,
    }, () => Logger.debug(`Currently listening server on port ::${this.server.address().port}`));
  }
}

module.exports = new TCPServer().listen();
