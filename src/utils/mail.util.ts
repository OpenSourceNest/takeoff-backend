import {
  getChannel,
  getEmailTaskType,
  REGISTRATION_QUEUE_NAME,
} from "../lib/rabbitmq";

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
  const EmailTask = getEmailTaskType();
  const channel = getChannel();

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

  const errMsg = EmailTask.verify(payload);
  if (errMsg) throw Error(`Protobuf Verification Failed: ${errMsg}`);

  const buffer = EmailTask.encode(EmailTask.create(payload)).finish();

  await channel.sendToQueue(REGISTRATION_QUEUE_NAME, Buffer.from(buffer), {
    persistent: true,
    contentType: "application/x-protobuf",
  });

  console.log(" [x] Queued binary EmailTask");
};
