export enum Roles {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  TUTOR = 'TUTOR',
  STUDENT = 'STUDENT',
}

export enum ReportStatus {
  OPEN = 'OPEN',
  ASSIGNEE_APPROVE = 'ASSIGNEE_APPROVE',
  ASSIGNEE_REJECT = 'ASSIGNEE_REJECT',
  STAFF_APPROVE = 'STAFF_APPROVE',
  STAFF_REJECT = 'STAFF_REJECT',
}

export enum PenaltyCardType {
  YELLOW = 'YELLOW',
  RED = 'RED',
  BLACK = 'BLACK',
}

export enum ResponseType {
  Ok,
  Created,
}

export enum Locales {
  VI = 'vi',
  EN = 'en',
  JA = 'ja',
  KR = 'kr',
}

export const APP_LOCALES = [Locales.EN];

export const DEFAULT_PAGINATION = {
  size: 25,
  page: 1,
};

export const QUERY_PARAM_PARSE = {
  false: false,
  true: true,
};

export enum ErrorMessage {
  UNIQUE = 'duplicate key error collection',
  QUERY_WRONG = 'Make sure your query is correct.',
  DATE_TIME_INVALID = 'date/time field value out of range',
  FAILING_ROW = 'Failing row contains',
}
export const EXPIRES_IN = {
  ACCESS_TOKEN: 6000000000,
  REFRESH_TOKEN: 15000000000,
};

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  CONFIRM_TOKEN = 'confirm_token',
}

export const SYSTEM_NAME = {
  MIXED: 'HarEdu',
  LOWERCASE: 'haredu',
  UPPERCASE: 'HAREEDU',
};

export const DEFAULT_PASSWORD = 'kmnkmn123';

export const SORT_DIRECTION = ['asc', 'desc'];

export const SEARCH_BY = {
  ALL_USER: ['email', 'name', 'phone'],
};

export const EMAIL_FROM = `support@${SYSTEM_NAME.LOWERCASE}.online`;

export const MAIL_TEMPLATE = {
  FORGOT_PASSWORD: './forgot-password.template.hbs',
  REGISTER: './registration.template.hbs',
};

export const DEFAULT_PLACEHODER = {
  AVATAR: 'avatar/avatar-placehoder.webp',
  IDENTITY_CARD_FRONT: 'cccd/identity-card-front-placehoder.webp',
  IDENTITY_CARD_BACK: 'cccd/identity-card-back-placehoder.webp',
  VIDEO_THUMBNAIL: 'video/video-thumbnail-placeholder.webp',
};

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  REJECT = 'REJECT',
}

export enum TransactionReason {
  LEAVE_CLASS = 'Hoàn trả phí đăng ký lớp học',
  JOIN_CLASSS = 'Phí đăng ký lớp học',
  WITHDRAW = 'Rút tiền từ lớp học',
  WITHDRAW_PROFILE = 'Rút tiền từ tài khoản',
  DEPOSIT = 'Nạp tiền vào tài khoản',
  CONFIRM = 'Xác nhận thanh toán',
}
