'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ME } from '@/lib/graphql/queries';
import { UPDATE_PROFILE } from '@/lib/graphql/mutations';
import Button from '@/components/ui/Button';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
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

export default function ProfilePage() {
  const { toast } = useToast();

  const { data, loading, error } = useQuery<{ me: User }>(ME);

  const [form, setForm] = useState<ProfileForm>({
    address: '',
    city: '',
    county: '',
    gender: '',
    ageGroup: '',
    birthday: '',
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

  async function handleSubmit(e: React.FormEvent) {
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
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast(msg, 'error');
    }
  }

  function set(name: keyof ProfileForm) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [name]: e.target.value }));
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !data?.me) {
    return <p className="text-red-600 text-sm py-8">{error?.message ?? 'Failed to load profile.'}</p>;
  }

  const user = data.me;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Profile Settings</h1>

      {/* Read-only fields */}
      <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 mb-6 space-y-4">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
          Account Details
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-stone-400 mb-0.5">First name</p>
            <p className="text-stone-900 font-medium text-sm">{user.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Last name</p>
            <p className="text-stone-900 font-medium text-sm">{user.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Email</p>
            <p className="text-stone-900 font-medium text-sm">{user.email ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400 mb-0.5">Phone</p>
            <p className="text-stone-900 font-medium text-sm">{user.phone ?? '—'}</p>
          </div>
        </div>
        <p className="text-xs text-stone-400">
          To change your name, email, or phone number please contact us.
        </p>
      </div>

      {/* Editable fields */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white shadow-sm p-6 space-y-4">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
          Personal Details
        </h2>

        <div>
          <Label htmlFor="address">Address</Label>
          <input
            id="address"
            type="text"
            value={form.address}
            onChange={set('address')}
            autoComplete="street-address"
            className="block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="city">City</Label>
            <input
              id="city"
              type="text"
              value={form.city}
              onChange={set('city')}
              autoComplete="address-level2"
              className="block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            />
          </div>
          <div>
            <Label htmlFor="county">County</Label>
            <input
              id="county"
              type="text"
              value={form.county}
              onChange={set('county')}
              className="block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" value={form.gender} onChange={set('gender')}>
              <option value="">— Not specified —</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="any">Prefer not to say</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="ageGroup">Age Group</Label>
            <Select id="ageGroup" value={form.ageGroup} onChange={set('ageGroup')}>
              <option value="">— Not specified —</option>
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="birthday">Date of Birth</Label>
          <input
            id="birthday"
            type="date"
            value={form.birthday}
            onChange={set('birthday')}
            className="block w-full rounded-lg border border-stone-300 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          />
        </div>

        <Button type="submit" loading={saving} className="mt-2">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
