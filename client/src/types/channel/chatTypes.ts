export type SendMessageProps = {
  accessToken: string;
  channelId?: string;
  email: string;
  message: string;
  fileUrl: string[];
  fileNames: string[];
};

export type SendDMProps = {
  accessToken: string;
  channelId?: string;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  fileUrl: string[];
  fileNames: string[];
};

export type DMInfoType = {
  profileImage?: string;
  receiveName: string;
  channelId: string;
  notificationRead: boolean;
};