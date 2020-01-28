const amqpClient = require('amqplib/callback_api');
const config = require('../../config/config.js');

const subscriber = () => {
}

function start() {
    amqpClient.connect(config.mqtt.default.host + "?heartbeat=60", function(err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(start, 1000);
      }
      conn.on("error", function(err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function() {
        console.error("[AMQP] reconnecting");
        return setTimeout(start, 1000);
      });
  
      console.log("[AMQP] connected");
      amqpConn = conn;
  
      whenConnected();
    });
  }
  
  function whenConnected() {
    startWorker();
  }

  
  // A worker that acks messages only if processed succesfully
   function startWorker() {
    amqpConn.createChannel(function(err, ch) {
      if (closeOnErr(err)) return;
      ch.on("error", function(err) {
        console.error("[AMQP] channel error", err.message);
      });
      ch.on("close", function() {
        console.log("[AMQP] channel closed");
      });
      ch.prefetch(10);
      ch.assertQueue("location", { durable: true }, function(err, _ok) {
        if (closeOnErr(err)) return;
        ch.consume("location", processMsg, { noAck: false });
        console.log("[AMQP] Worker is started");
      });
  
      function processMsg(msg) {
        work(msg, function(ok) {
          try {
            if (ok)
              ch.ack(msg);
            else
              ch.reject(msg, true);
          } catch (e) {
            closeOnErr(e);
          }
        });
      }
    });
  }
  
  function work(msg, cb) {
    console.log("[AMQP] Got msg", msg.content.toString());
    cb(true);
  }
  
  function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
  }
  start();
  module.exports = subscriber;