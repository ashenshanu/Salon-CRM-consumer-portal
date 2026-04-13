'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ME } from '@/lib/graphql/queries';
import { UPDATE_PROFILE, SET_PASSWORD } from '@/lib/graphql/mutations';
import FormError from '@/components/ui/FormError';
import { useToast } from '@/components/ui/Toast';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  county: string | null;
  gender: string | null;
  ageGroup: string | null;
  birthday: string | null;
  loyaltyScore: number;
}

interface ProfileForm {
  address: string;
  city: string;
  county: string;
  gender: string;
  ageGroup: string;
  birthday: string;
}

type Section = 'personal' | 'security';

// ── SVG icons ──────────────────────────────────────────────────────────────

function AccountIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-9 w-9 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h16.5a1.5 1.5 0 001.5-1.5v-6a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5z" />
    </svg>
  );
}

function IDCardIcon() {
  return (
    <svg className="h-9 w-9 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-5 w-5 text-primary mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}

// ── Input field ─────────────────────────────────────────────────────────────

function Field({
  label, value, readOnly, onChange, type = 'text', id,
}: {
  label: string; value: string; readOnly?: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; id: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-slate-700">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={[
          'w-full px-5 py-3.5 rounded-xl border text-sm font-medium transition-all focus:outline-none',
          readOnly
            ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-default'
            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-slate-300',
        ].join(' ')}
      />
    </div>
  );
}

// ── Select field ─────────────────────────────────────────────────────────────

function SelectField({
  label, id, value, onChange, children,
}: {
  label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-bold text-slate-700">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-slate-300 transition-all"
      >
        {children}
      </select>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<Section>('personal');

  const { data, loading, error } = useQuery<{ me: User }>(ME);

  const [form, setForm] = useState<ProfileForm>({
    address: '', city: '', county: '', gender: '', ageGroup: '', birthday: '',
  });

  useEffect(() => {
    if (data?.me) {
      const u = data.me;
      setForm({
        address: u.address ?? '',
        city: u.city ?? '',
        county: u.county ?? '',
        gender: u.gender ?? '',
        ageGroup: u.ageGroup ?? '',
        birthday: u.birthday ?? '',
      });
    }
  }, [data]);

  const [updateProfile, { loading: saving }] = useMutation<{ updateProfile: User }>(UPDATE_PROFILE, {
    refetchQueries: [{ query: ME }],
  });

  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});
  const [setPassword, { loading: savingPw }] = useMutation(SET_PASSWORD);

  function validatePw() {
    const errs: Record<string, string> = {};
    if (pwForm.password.length < 8) errs.password = 'At least 8 characters required';
    else if (!/[A-Z]/.test(pwForm.password)) errs.password = 'Must contain an uppercase letter';
    else if (!/[a-z]/.test(pwForm.password)) errs.password = 'Must contain a lowercase letter';
    else if (!/[0-9]/.test(pwForm.password)) errs.password = 'Must contain a number';
    if (pwForm.confirm !== pwForm.password) errs.confirm = 'Passwords do not match';
    return errs;
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validatePw();
    if (Object.keys(errs).length > 0) { setPwErrors(errs); return; }
    setPwErrors({});
    try {
      await setPassword({ variables: { password: pwForm.password } });
      toast('Password updated successfully.', 'success');
      setPwForm({ password: '', confirm: '' });
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Failed to update password.', 'error');
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: Partial<ProfileForm> = {};
    if (form.address) input.address = form.address;
    if (form.city) input.city = form.city;
    if (form.county) input.county = form.county;
    if (form.gender) input.gender = form.gender;
    if (form.ageGroup) input.ageGroup = form.ageGroup;
    if (form.birthday) input.birthday = form.birthday;
    try {
      await updateProfile({ variables: { input } });
      toast('Profile updated successfully.', 'success');
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Failed to update profile.', 'error');
    }
  }

  function setField(name: keyof ProfileForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [name]: e.target.value }));
  }

  function setSelect(name: keyof ProfileForm) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, [name]: e.target.value }));
  }

  if (loading) {
    return (
      <>
        <section className="hero-gradient text-white pt-12 pb-32">
          <div className="mx-auto max-w-7xl px-8 text-center">
            <div className="h-14 w-80 bg-white/20 animate-pulse rounded-xl mx-auto mb-4" />
            <div className="h-5 w-96 bg-white/20 animate-pulse rounded-lg mx-auto" />
          </div>
        </section>
        <div className="mx-auto max-w-7xl px-8 -mt-20 pb-20 w-full">
          <div className="h-96 bg-white/60 rounded-3xl animate-pulse" />
        </div>
      </>
    );
  }

  if (error || !data?.me) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-20">
        <p className="text-red-600 text-sm">{error?.message ?? 'Failed to load profile.'}</p>
      </div>
    );
  }

  const user = data.me;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const fullName = `${user.firstName} ${user.lastName}`;
  const loyaltyLabel = user.loyaltyScore >= 500 ? 'Gold Member' : user.loyaltyScore >= 200 ? 'Silver Member' : 'Member';

  const MENU_ITEMS = [
    { key: 'personal' as Section, Icon: AccountIcon, label: 'Personal Details' },
    { key: 'security' as Section, Icon: ShieldIcon, label: 'Security' },
    { key: null, Icon: BellIcon, label: 'Notifications' },
    { key: null, Icon: BadgeIcon, label: 'Billing & Payment' },
  ];

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="hero-gradient text-white pt-12 pb-32">
        <div className="mx-auto max-w-7xl px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-4 font-headline">Account Settings</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Manage your personal information and security preferences to ensure your salon experience is always seamless.
          </p>
        </div>
      </section>

      {/* ── Main content (overlaps hero) ─────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-8 -mt-20 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left sidebar (4-col) ───────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Avatar & menu card */}
            <section className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex flex-col items-center text-center mb-8">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
                    <span className="text-3xl font-extrabold text-primary font-headline">{initials}</span>
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
                    aria-label="Edit photo"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  </button>
                </div>
                <h3 className="text-2xl font-bold text-on-surface font-headline">{fullName}</h3>
                <p className="text-on-surface-variant text-sm mt-1">{loyaltyLabel} · {user.loyaltyScore} pts</p>
              </div>

              {/* Navigation menu */}
              <div className="space-y-1">
                {MENU_ITEMS.map(({ key, Icon, label }) => {
                  const isActive = key === activeSection;
                  const isDisabled = key === null;
                  return (
                    <button
                      key={label}
                      onClick={() => key && setActiveSection(key)}
                      disabled={isDisabled}
                      className={[
                        'w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-medium text-sm transition-all text-left',
                        isActive
                          ? 'bg-primary text-white font-semibold shadow-md'
                          : isDisabled
                          ? 'text-slate-300 cursor-not-allowed'
                          : 'text-on-surface-variant hover:bg-slate-50',
                      ].join(' ')}
                    >
                      <Icon />
                      {label}
                      {isDisabled && (
                        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">
                          Soon
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Verified badge */}
            <div className="bg-secondary-light/40 border border-secondary-light/60 rounded-3xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center shrink-0">
                <CheckBadgeIcon />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Account Verified</h4>
                <p className="text-xs text-secondary/70 mt-0.5">Your profile is active.</p>
              </div>
            </div>
          </div>

          {/* ── Right column (8-col) ──────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-8">

            {/* Personal Details section */}
            {activeSection === 'personal' && (
              <>
                <section className="bg-white rounded-3xl shadow-xl p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 font-headline">Personal Details</h2>
                      <p className="text-slate-500 text-sm mt-1">Update your information to stay connected.</p>
                    </div>
                    <IDCardIcon />
                  </div>

                  {/* Read-only account fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Field id="firstName" label="First Name" value={user.firstName} readOnly />
                    <Field id="lastName" label="Last Name" value={user.lastName} readOnly />
                    <Field id="email" label="Email Address" value={user.email ?? '—'} readOnly type="email" />
                    <Field id="phone" label="Phone Number" value={user.phone ?? '—'} readOnly />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100 mb-8">
                    <InfoIcon />
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      To change your name, email, or phone number please contact us directly.
                    </p>
                  </div>

                  {/* Editable fields */}
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Additional Details</h3>

                    <Field id="address" label="Address" value={form.address} onChange={setField('address')} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field id="city" label="City" value={form.city} onChange={setField('city')} />
                      <Field id="county" label="County" value={form.county} onChange={setField('county')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField id="gender" label="Gender" value={form.gender} onChange={setSelect('gender')}>
                        <option value="">— Not specified —</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="other">Other</option>
                        <option value="any">Prefer not to say</option>
                      </SelectField>
                      <SelectField id="ageGroup" label="Age Group" value={form.ageGroup} onChange={setSelect('ageGroup')}>
                        <option value="">— Not specified —</option>
                        <option value="adult">Adult</option>
                        <option value="child">Child</option>
                      </SelectField>
                    </div>

                    <Field id="birthday" label="Date of Birth" value={form.birthday} onChange={setField('birthday')} type="date" />

                    <div className="flex justify-end items-center gap-5 pt-4 border-t border-slate-100">
                      <button type="button" className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-10 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 text-sm"
                      >
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </section>
              </>
            )}

            {/* Security section */}
            {activeSection === 'security' && (
              <>
                <section className="bg-white rounded-3xl shadow-xl p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 font-headline">Security</h2>
                      <p className="text-slate-500 text-sm mt-1">Manage your password and account protection.</p>
                    </div>
                    <LockIcon />
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-2 max-w-md">
                      <label htmlFor="new-password" className="block text-sm font-bold text-slate-700">
                        New Password <span className="text-tertiary">*</span>
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        autoComplete="new-password"
                        value={pwForm.password}
                        onChange={(e) => {
                          setPwForm((f) => ({ ...f, password: e.target.value }));
                          if (pwErrors.password) setPwErrors((er) => { const n = { ...er }; delete n.password; return n; });
                        }}
                        placeholder="Create a strong password"
                        className={[
                          'w-full px-5 py-3.5 bg-slate-50 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                          pwErrors.password ? 'border-red-400' : 'border-slate-200 focus:border-primary hover:border-slate-300',
                        ].join(' ')}
                      />
                      <FormError message={pwErrors.password} />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Min. 8 chars · uppercase · lowercase · number
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-700">
                          Confirm New Password <span className="text-tertiary">*</span>
                        </label>
                        <input
                          id="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={pwForm.confirm}
                          onChange={(e) => {
                            setPwForm((f) => ({ ...f, confirm: e.target.value }));
                            if (pwErrors.confirm) setPwErrors((er) => { const n = { ...er }; delete n.confirm; return n; });
                          }}
                          placeholder="Re-type new password"
                          className={[
                            'w-full px-5 py-3.5 bg-slate-50 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
                            pwErrors.confirm ? 'border-red-400' : 'border-slate-200 focus:border-primary hover:border-slate-300',
                          ].join(' ')}
                        />
                        <FormError message={pwErrors.confirm} />
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl flex items-start gap-4 border border-slate-100">
                      <InfoIcon />
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        Changing your password will log you out from all other devices except this one.
                        Make sure you have access to your recovery email.
                      </p>
                    </div>

                    <div className="flex justify-end items-center gap-5 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setPwForm({ password: '', confirm: '' })}
                        className="text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingPw}
                        className="px-10 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-60 text-sm"
                      >
                        {savingPw ? 'Updating…' : 'Update Security'}
                      </button>
                    </div>
                  </form>
                </section>

                {/* Danger zone */}
                <div className="bg-red-50/50 border border-red-100 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-red-900 font-headline">Deactivate Account</h3>
                    <p className="text-sm text-red-600/80 font-medium mt-1">
                      Temporarily disable your account. You can reactivate it anytime.
                    </p>
                  </div>
                  <button className="px-10 py-3.5 border-2 border-red-500 text-red-500 rounded-xl font-bold text-sm hover:bg-red-500 hover:text-white transition-all shrink-0">
                    Deactivate
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
