import nodemailer from 'nodemailer';
import { emailConfig } from '../config/email.config';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: emailConfig.smtp.host,
    port: emailConfig.smtp.port,
    secure: emailConfig.smtp.secure,
    ...(emailConfig.smtp.auth && {
      auth: {
        user: emailConfig.smtp.auth.user,
        pass: emailConfig.smtp.auth.pass,
      },
    }),
  });

  /**
   * Send an email
   */
  static async send(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `${emailConfig.fromName} <${emailConfig.from}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
    } catch (error) {
      console.error('Email send error:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send verification email
   */
  static async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    await this.send({
      to: email,
      subject: 'Verify Your Email - Hire Mind',
      html: `
        <h1>Welcome to Hire Mind!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `,
      text: `Welcome to Hire Mind! Please verify your email by visiting: ${verificationUrl}`,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    await this.send({
      to: email,
      subject: 'Reset Your Password - Hire Mind',
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
      text: `Reset your password by visiting: ${resetUrl}`,
    });
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.send({
      to: email,
      subject: 'Welcome to Hire Mind!',
      html: `
        <h1>Welcome to Hire Mind, ${name}!</h1>
        <p>We're excited to have you on board.</p>
        <p>Start exploring job opportunities or post your first job listing today!</p>
      `,
      text: `Welcome to Hire Mind, ${name}! We're excited to have you on board.`,
    });
  }
}
