import { db } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/password';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function getServerSession() {
  const user = await getUser();
  if (!user) return null;
  
  return { user };
}

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  const payload = await decrypt(session);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function authenticateUser(username: string, password: string) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

export async function createUser(username: string, password: string, email?: string) {
  // Check if username already exists
  const existingUser = await db.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    throw new Error('Username already exists');
  }

  // Check if email already exists (if provided)
  if (email) {
    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  
  const user = await db.user.create({
    data: {
      username,
      password: hashedPassword,
      email: email || null,
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
}

export async function requestPasswordReset(email: string) {
  // Find user by email
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Email not found');
  }

  // Generate reset token (in a real app, this would be a secure random token)
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // In a real application, you would:
  // 1. Store the reset token in the database with an expiration time
  // 2. Send an email with the reset link
  // For now, we'll just log it to console
  console.log(`Password reset token for ${email}: ${resetToken}`);
  console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

  return { 
    success: true, 
    message: 'Password reset email sent',
    user: {
      email: user.email,
      username: user.username
    },
    token: resetToken
  };
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  // In a real application, you would:
  // 1. Validate the token from the database
  // 2. Check if it's expired
  // 3. Update the user's password
  // For now, we'll simulate this with a simple check
  
  if (!token || token.length < 10) {
    throw new Error('Invalid or expired token');
  }

  // Find user by token (in real app, you'd have a reset_tokens table)
  // For demo purposes, we'll just use the admin user
  const user = await db.user.findFirst({
    where: { email: 'admin@example.com' }, // This is just for demo
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Hash new password and update user
  const hashedPassword = await hashPassword(newPassword);
  
  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true, message: 'Password reset successfully' };
}