import protobuf from "protobufjs";
import amqp from "amqplib";
import path from "path";
export interface ISendMailOptions {
  to: string;
  subject: string;
  category: "Attendee_Registration_Successful" | string;
  extraArguments?: Record<string, string | number>;
}

export const SendMail = async ({
  to,
  subject,
  category,
  extraArguments,
}: ISendMailOptions) => {
  const PROTO_PATH = path.join(__dirname, "../proto/email.proto");
  const QUEUE = "email_queue";

  const root = await protobuf.load(PROTO_PATH);
  const EmailTask = root.lookupType("email_system.EmailTask");
  const rabbitURL = process.env.RABBITMQ_URL || "amqp://localhost";
  const connection = await amqp.connect(rabbitURL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  const payload = {
    ...extraArguments,

    to,
    subject,
    category,
    retryCount: 0,
    createdAt: {
      seconds: Math.floor(Date.now() / 1000),
      nanos: (Date.now() % 1000) * 1e6,
    },
  };

  // Verify and Encode to binary
  const errMsg = EmailTask.verify(payload);
  if (errMsg) throw Error(errMsg);

  const encoded = EmailTask.encode(EmailTask.create(payload)).finish();
  const buffer = Buffer.from(encoded);

  // Publish to Queue
  channel.sendToQueue(QUEUE, buffer);
  console.log(" [x] Sent binary EmailTask");

  setTimeout(() => {
    connection.close();
  }, 500);
};
