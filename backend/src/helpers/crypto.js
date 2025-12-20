import crypto from 'crypto';

export function generateEmailToken() {
  const emailToken = crypto.randomBytes(32).toString('hex');

  const hash = crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');

  return { emailToken, hash };
}

//verify emailtoken from client side 
export function hashToken(emailToken) {
  return crypto
    .createHash('sha256')
    .update(emailToken)
    .digest('hex');
}
