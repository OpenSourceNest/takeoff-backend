import amqp, { Channel, ChannelWrapper } from "amqp-connection-manager";
import protobuf from "protobufjs";
import path from "path";

let channelWrapper: ChannelWrapper;
let EmailTaskType: protobuf.Type;

export const REGISTRATION_QUEUE_NAME = "email_queue";
const DLX_EXCHANGE_NAME = "email_dlx";
const DLX_ROUTING_KEY = "email_failed_key";
const QUARANTINE_QUEUE_NAME = "email_failed_queue";

export const initMessenger = async () => {
  const PROTO_PATH = path.join(__dirname, "../proto/email.proto");
  const root = await protobuf.load(PROTO_PATH);
  EmailTaskType = root.lookupType("email_system.EmailTask");

  const rabbitURL = process.env.RABBITMQ_URL || "amqp://localhost";
  const connection = amqp.connect([rabbitURL]);

  channelWrapper = connection.createChannel({
    setup: async (channel: Channel) => {
      await channel.assertExchange(DLX_EXCHANGE_NAME, "direct", {
        durable: true,
      });

      await channel.assertQueue(QUARANTINE_QUEUE_NAME, { durable: true });

      await channel.bindQueue(
        QUARANTINE_QUEUE_NAME,
        DLX_EXCHANGE_NAME,
        DLX_ROUTING_KEY,
      );

      return channel.assertQueue(REGISTRATION_QUEUE_NAME, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": DLX_EXCHANGE_NAME,
          "x-dead-letter-routing-key": DLX_ROUTING_KEY,
        },
      });
    },
  });

  connection.on("connect", () => {
    console.log("✅ RabbitMQ Connected successfully!");
  });

  connection.on("disconnect", (params: { err: Error }) => {
    console.log("❌ RabbitMQ Disconnected: ", params.err.message);
    process.exit(1);
  });

  connection.on("connectFailed", (err: Error) => {
    console.error("❌ RabbitMQ Connection error: ", err);
    process.exit(1);
  });
};

export const getEmailTaskType = () => EmailTaskType;
export const getChannel = () => channelWrapper;
