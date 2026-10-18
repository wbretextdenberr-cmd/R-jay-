import { User } from '../types';
import { makeAvatar } from './helpers';

/**
 * طبقة الحسابات.
 *
 * النسخة الحالية محلية: الحسابات تُحفظ في متصفح الجهاز فقط (كلمة المرور مُشفَّرة بـ PBKDF2 مع ملح عشوائي).
 * لا تتزامن بين الأجهزة. الواجهة العامة (auth.*) مصممة ليُستبدل جسمها لاحقاً بـ Supabase Auth دون تغيير الشاشات.
 */

export type AuthErrorCode =
  | 'NAME_INVALID'
  | 'PHONE_INVALID'
  | 'EMAIL_INVALID'
  | 'PASSWORD_WEAK'
  | 'ROLE_INVALID'
  | 'WILAYA_REQUIRED'
  | 'PHONE_EXISTS'
  | 'BAD_CREDENTIALS'
  | 'NO_CRYPTO'
  | 'STORAGE'
  | 'NOT_FOUND';

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
  }
}

export interface SignUpInput {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: 'client' | 'driver';
  wilaya: string;
}

interface StoredAccount {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'client' | 'driver';
  wilaya: string;
  isPremium?: boolean;
  premiumPlan?: string;
  createdAt: string;
  salt: string;
  hash: string;
}

const ACCOUNTS_KEY = 'rayeh_accounts_v1';
const SESSION_KEY = 'rayeh_session_v1';
const PBKDF2_ITERATIONS = 120000;

// ---------------------------------------------------------------
// أدوات
// ---------------------------------------------------------------

/** يعيد الرقم بالصيغة المحلية 0XXXXXXXXX أو null إن لم يكن هاتفاً جزائرياً محمولاً صالحاً (05 / 06 / 07) */
export function normalizePhone(input: string): string | null {
  let d = (input || '').replace(/[\s\-().]/g, '');
  if (d.startsWith('+213')) d = '0' + d.slice(4);
  else if (d.startsWith('00213')) d = '0' + d.slice(5);
  else if (d.startsWith('213') && d.length === 12) d = '0' + d.slice(3);
  return /^0[567]\d{8}$/.test(d) ? d : null;
}

function bytesToHex(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
  return out;
}

function hexToBytes(hex: string) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function derive(password: string, saltHex: string): Promise<string> {
  const subtle = globalThis.crypto && globalThis.crypto.subtle;
  if (!subtle) throw new AuthError('NO_CRYPTO');
  const key = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBytes(saltHex), iterations: PBKDF2_ITERATIONS },
    key,
    256
  );
  return bytesToHex(new Uint8Array(bits));
}

function newSalt(): string {
  if (!globalThis.crypto || !globalThis.crypto.getRandomValues) throw new AuthError('NO_CRYPTO');
  return bytesToHex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
}

function readAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeAccounts(list: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch (_) {
    throw new AuthError('STORAGE');
  }
}

function toUser(a: StoredAccount): User {
  return {
    id: a.id,
    name: a.name,
    phone: a.phone,
    email: a.email,
    role: a.role,
    avatar: makeAvatar(a.name),
    wilaya: a.wilaya,
    isPremium: a.isPremium,
    premiumPlan: a.premiumPlan,
    createdAt: a.createdAt
  };
}

function setSession(userId: string): void {
  try {
    localStorage.setItem(SESSION_KEY, userId);
  } catch (_) {
    throw new AuthError('STORAGE');
  }
}

// ---------------------------------------------------------------
// الواجهة العامة
// ---------------------------------------------------------------

export const auth = {
  async getSession(): Promise<User | null> {
    try {
      const id = localStorage.getItem(SESSION_KEY);
      if (!id) return null;
      const acc = readAccounts().find(a => a.id === id);
      return acc ? toUser(acc) : null;
    } catch (_) {
      return null;
    }
  },

  async signUp(input: SignUpInput): Promise<User> {
    const name = (input.name || '').trim();
    if (name.length < 3) throw new AuthError('NAME_INVALID');

    const phone = normalizePhone(input.phone);
    if (!phone) throw new AuthError('PHONE_INVALID');

    const email = (input.email || '').trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) throw new AuthError('EMAIL_INVALID');

    if ((input.password || '').length < 8) throw new AuthError('PASSWORD_WEAK');
    if (input.role !== 'client' && input.role !== 'driver') throw new AuthError('ROLE_INVALID');
    if (!input.wilaya) throw new AuthError('WILAYA_REQUIRED');

    const accounts = readAccounts();
    if (accounts.some(a => a.phone === phone)) throw new AuthError('PHONE_EXISTS');

    const salt = newSalt();
    const hash = await derive(input.password, salt);
    const account: StoredAccount = {
      id: `usr_${Date.now().toString(36)}${bytesToHex(globalThis.crypto.getRandomValues(new Uint8Array(4)))}`,
      name,
      phone,
      email,
      role: input.role,
      wilaya: input.wilaya,
      createdAt: new Date().toISOString(),
      salt,
      hash
    };
    writeAccounts([...accounts, account]);
    setSession(account.id);
    return toUser(account);
  },

  async signIn(phoneInput: string, password: string): Promise<User> {
    const phone = normalizePhone(phoneInput);
    if (!phone) throw new AuthError('PHONE_INVALID');
    const acc = readAccounts().find(a => a.phone === phone);
    // نفس الرسالة لرقم غير مسجل أو كلمة مرور خاطئة (لا نكشف وجود الحساب)
    if (!acc) throw new AuthError('BAD_CREDENTIALS');
    const hash = await derive(password || '', acc.salt);
    if (hash !== acc.hash) throw new AuthError('BAD_CREDENTIALS');
    setSession(acc.id);
    return toUser(acc);
  },

  async signOut(): Promise<void> {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  },

  async updateProfile(
    userId: string,
    patch: Partial<Pick<User, 'name' | 'wilaya' | 'email' | 'isPremium' | 'premiumPlan'>>
  ): Promise<User> {
    const accounts = readAccounts();
    const idx = accounts.findIndex(a => a.id === userId);
    if (idx === -1) throw new AuthError('NOT_FOUND');
    const cur = accounts[idx];
    const next: StoredAccount = {
      ...cur,
      name: patch.name !== undefined ? patch.name.trim() || cur.name : cur.name,
      wilaya: patch.wilaya !== undefined ? patch.wilaya : cur.wilaya,
      email: patch.email !== undefined ? patch.email : cur.email,
      isPremium: patch.isPremium !== undefined ? patch.isPremium : cur.isPremium,
      premiumPlan: patch.premiumPlan !== undefined ? patch.premiumPlan : cur.premiumPlan
    };
    accounts[idx] = next;
    writeAccounts(accounts);
    return toUser(next);
  },

  /** يحذف الحساب نهائياً بعد التحقق من كلمة المرور. حذف بيانات المستخدم (الرحلات...) يتم عبر api.deleteUserData */
  async deleteAccount(userId: string, password: string): Promise<void> {
    const accounts = readAccounts();
    const acc = accounts.find(a => a.id === userId);
    if (!acc) throw new AuthError('NOT_FOUND');
    const hash = await derive(password || '', acc.salt);
    if (hash !== acc.hash) throw new AuthError('BAD_CREDENTIALS');
    writeAccounts(accounts.filter(a => a.id !== userId));
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  }
};
