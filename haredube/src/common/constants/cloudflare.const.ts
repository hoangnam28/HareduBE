export const CERTIFICATE_VALIDITY_DAYS = 5475;
export const TTL = {
  MAX: 86400,
  MIN: 1,
};

export const TYPE_DNS = [
  'A',
  'AAAA',
  'CAA',
  'CERT',
  'CNAME',
  'DNSKEY',
  'DS',
  'HTTPS',
  'LOC',
  'MX',
  'NAPTR',
  'NS',
  'PTR',
  'SMIMEA',
  'SRV',
  'SSHFP',
  'SVCB',
  'TLSA',
  'TXT',
  'URI',
];

export const SORT_BY_DNS = ['type', 'name', 'content', 'ttl', 'proxied'];
