export const QUEUE = {
  mailQueue: 'MAIL_QUEUE',
  paymentQueue: 'PAYMENT_QUEUE',
};

export const CONFIRM_REGISTRATION = 'CONFIRM_REGISTRATION';
export const CONFIRM_FORGOT_PASSWORD = 'CONFIRM_FORGOT_PASSWORD';

export const PAYMENT_QUEUE = {
  removeCachePolicy: 'REMOVE_CACHE_POLICY',
};

export const defaultJobOptions = {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: {
    age: 604800,
    count: 10,
  },
};
