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

  console.log(" [✓] RabbitMQ Connection Initialized");
};

export const getEmailTaskType = () => EmailTaskType;
export const getChannel = () => channelWrapper;
