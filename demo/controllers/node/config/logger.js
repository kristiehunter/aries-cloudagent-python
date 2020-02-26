// @ts-ignore
const winston = require("winston");


/** Get Logger
 *
 * @param {string} filename Name of file that the logging is coming from.
 * @returns {*} Returns Logger
 */
const getLogger = (filename) => {

    const customFormat = winston.format.printf((info) => {
        return `[${info.label}] ${info.message}`;
      });

    const colorLevels = {
        levels: {
          silly: 0,
          info: 1,
          debug: 2,
          error: 3
        },
        colors: {
          silly: "cyan",
          info: "green",
          debug: "yellow",
          error: "red"
        }
      };

    const logger = winston.createLogger({
        format: winston.format.combine(
          winston.format.simple()
        ),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
              winston.format.label({label: filename}),
                winston.format.timestamp(),
                winston.format.prettyPrint(),
              customFormat
            ),
            level: "error"
          })
        ],
        levels: colorLevels.levels
        });

    return logger;
};

module.exports.getLogger = getLogger;
