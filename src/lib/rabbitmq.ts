import amqp, { Channel, ChannelWrapper } from "amqp-connection-manager";
import protobuf from "protobufjs";
import path from "path";

let channelWrapper: ChannelWrapper;
let EmailTaskType: protobuf.Type;

export const REGISTRATION_QUEUE_NAME = "email_queue";

export const initMessenger = async () => {
  const PROTO_PATH = path.join(__dirname, "../proto/email.proto");
  const root = await protobuf.load(PROTO_PATH);
  EmailTaskType = root.lookupType("email_system.EmailTask");

  const rabbitURL = process.env.RABBITMQ_URL || "amqp://localhost";
  const connection = amqp.connect([rabbitURL]);

  channelWrapper = connection.createChannel({
    setup: (channel: Channel) => {
      return channel.assertQueue(REGISTRATION_QUEUE_NAME, { durable: true });
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
