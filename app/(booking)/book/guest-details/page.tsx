'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/bookingStore';
import type { RecipientDetails } from '@/lib/bookingStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import FormError from '@/components/ui/FormError';
import Select from '@/components/ui/Select';

type FormErrors = Partial<Record<keyof RecipientDetails, string>>;

export default function GuestDetailsPage() {
  const router = useRouter();
  const { isGuestFlow, recipientType, recipientDetails, setRecipient } = useBookingStore();

  const [form, setForm] = useState<RecipientDetails>(
    recipientDetails ?? {
      firstName: '',
      lastName: '',
      phone: '',
      gender: 'any',
      ageGroup: 'adult',
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isGuestFlow || recipientType !== 'other') {
      router.replace('/book/for-who');
    }
  }, [isGuestFlow, recipientType, router]);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.phone.trim() || form.phone.trim().length < 7) errs.phone = 'Valid phone number is required';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setRecipient('other', undefined, form);
    router.push('/book/services');
  }

  function field(name: keyof Pick<RecipientDetails, 'firstName' | 'lastName' | 'phone'>) {
    return {
      value: form[name],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [name]: e.target.value }));
        if (errors[name]) setErrors((er) => { const n = { ...er }; delete n[name]; return n; });
      },
      error: !!errors[name],
    };
  }

  return (
    <div className="py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">Recipient&apos;s details</h1>
        <p className="text-stone-500 text-sm">Tell us about who this appointment is for.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName" required>First name</Label>
            <Input id="firstName" autoComplete="given-name" {...field('firstName')} />
            <FormError message={errors.firstName} />
          </div>
          <div>
            <Label htmlFor="lastName" required>Last name</Label>
            <Input id="lastName" autoComplete="family-name" {...field('lastName')} />
            <FormError message={errors.lastName} />
          </div>
        </div>

        <div>
          <Label htmlFor="phone" required>Phone number</Label>
          <Input id="phone" type="tel" placeholder="+44 7700 000000" {...field('phone')} />
          <FormError message={errors.phone} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              id="gender"
              value={form.gender}
              onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
            >
              <option value="any">Any / Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="ageGroup">Age group</Label>
            <Select
              id="ageGroup"
              value={form.ageGroup}
              onChange={(e) => setForm((f) => ({ ...f, ageGroup: e.target.value }))}
            >
              <option value="adult">Adult</option>
              <option value="child">Child</option>
            </Select>
          </div>
        </div>

        <Button type="submit" fullWidth className="mt-2">
          Continue
        </Button>
      </form>
    </div>
  );
}
