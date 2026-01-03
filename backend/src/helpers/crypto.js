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


//generate forget password token
export function generateForgotPasswordToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  return { resetToken, hash };
}

//verify reset token
export function hashResetToken(resetToken) {
  return crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
}