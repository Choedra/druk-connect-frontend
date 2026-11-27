"use client";

import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Camera, Mail, Phone, Shield, UserRound } from "lucide-react";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { ProfileAvatar } from "@/src/features/profile/ProfileAvatar";
import { getProfile, saveProfile, uploadPhoto, removePhoto, savePrivacy, startContactChange, verifyContactChange, type Profile, type ContactChallenge } from "@/src/features/profile/api";
import { PageHeader } from "./PageHeader";

const input = "mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none focus:border-sky focus:ring-2 focus:ring-sky/15 disabled:bg-canvas";
const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sky px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const secondary = "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-sm font-semibold text-ink hover:bg-canvas disabled:opacity-50";
function ErrorMessage({ error }: { error: Error | null }) {
  return error ? <p role="alert" className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error.message}</p> : null;
}
function useProfile() {
  const id = useAuthStore(state => state.user?.id);
  return useQuery({ queryKey: ["my-profile", id], queryFn: getProfile, enabled: !!id, staleTime: 0 });
}
function useSavedProfile() {
  const client = useQueryClient();
  const id = useAuthStore(state => state.user?.id);
  return (profile: Profile) => {
    client.setQueryData(["my-profile", id], profile);
    // Contact visibility and profile photos also appear on listings and vouch cards.
    void client.invalidateQueries({ predicate: query => query.queryKey[0] !== "my-profile" });
  };
}

export function AccountProfilePage({ roleLabel }: { roleLabel: string }) {
  const profile = useProfile();
  return <div className="w-full max-w-3xl space-y-6">
    <PageHeader title="Profile" description="Update your photo and personal details." />
    {profile.isPending && <p role="status" className="text-muted">Loading your profile…</p>}
    <ErrorMessage error={profile.error} />
    {profile.isError && <button type="button" className={secondary} onClick={() => void profile.refetch()}>Try again</button>}
    {profile.data && <ProfileEditor key={profile.data.id} profile={profile.data} roleLabel={roleLabel} />}
  </div>;
}

function ProfileEditor({ profile, roleLabel }: { profile: Profile; roleLabel: string }) {
  const saved = useSavedProfile();
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [bio, setBio] = useState(profile.bio || "");
  const [location, setLocation] = useState(profile.location || "");
  const [photoError, setPhotoError] = useState<Error | null>(null);
  const [photoMessage, setPhotoMessage] = useState("");
  const [contact, setContact] = useState<"EMAIL" | "PHONE" | null>(null);
  const details = useMutation({ mutationFn: saveProfile, onSuccess: saved });
  const photo = useMutation({ mutationFn: uploadPhoto, onSuccess: value => { saved(value); setPhotoMessage("Profile photo updated."); } });
  const remove = useMutation({ mutationFn: removePhoto, onSuccess: value => { saved(value); setPhotoMessage("Profile photo removed."); } });
  const name = `${profile.firstName} ${profile.lastName}`;
  const busy = photo.isPending || remove.isPending;
  async function selectPhoto(file?: File) {
    if (!file) return;
    setPhotoMessage(""); setPhotoError(null); photo.reset(); remove.reset();
    if (!["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setPhotoError(new Error("Choose a JPG or PNG photo no larger than 5 MB.")); return;
    }
    photo.mutate(file);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    details.mutate({ firstName: firstName.trim(), lastName: lastName.trim(), bio: bio.trim(), location: location.trim() });
  }
  return <>
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-5">
        <ProfileAvatar name={name} imageUrl={profile.profileImageUrl} className="h-24 w-24 text-2xl" />
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-ink">{name}</h2>
          <p className="flex items-center gap-1.5 text-sm text-muted"><UserRound className="h-4 w-4" />{roleLabel}</p>
          <div className="flex flex-wrap gap-2">
            <label className={`${secondary} cursor-pointer ${busy ? "pointer-events-none opacity-50" : ""}`}>
              <Camera className="mr-2 h-4 w-4" />{photo.isPending ? "Uploading…" : "Upload photo"}
              <input aria-label="Upload profile photo" type="file" accept="image/jpeg,image/png" className="sr-only" disabled={busy} onChange={event => { void selectPhoto(event.target.files?.[0]); event.target.value = ""; }} />
            </label>
            {profile.profileImageUrl && <button type="button" className={secondary} disabled={busy} onClick={() => { setPhotoMessage(""); setPhotoError(null); photo.reset(); remove.mutate(); }}>{remove.isPending ? "Removing…" : "Remove photo"}</button>}
          </div>
          <p className="text-xs text-muted">JPG or PNG, up to 5 MB and 16 megapixels.</p>
        </div>
      </div>
      <div className="mt-4 space-y-2"><ErrorMessage error={photoError || photo.error || remove.error} />{photoMessage && <p role="status" className="text-sm text-sky">{photoMessage}</p>}</div>
      <form onSubmit={submit} className="mt-6 space-y-5 border-t border-line pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-ink">First name<input className={input} required maxLength={100} value={firstName} onChange={event => { setFirstName(event.target.value); details.reset(); }} /></label>
          <label className="text-sm font-medium text-ink">Last name<input className={input} required maxLength={100} value={lastName} onChange={event => { setLastName(event.target.value); details.reset(); }} /></label>
        </div>
        <label className="block text-sm font-medium text-ink">Location<input className={input} maxLength={180} placeholder="City or suburb" value={location} onChange={event => { setLocation(event.target.value); details.reset(); }} /></label>
        <label className="block text-sm font-medium text-ink">About you<textarea className={input} rows={4} maxLength={1000} placeholder="Tell the community a little about yourself" value={bio} onChange={event => { setBio(event.target.value); details.reset(); }} /></label>
        <ErrorMessage error={details.error} />
        <div className="flex flex-wrap items-center gap-4"><button className={button} disabled={details.isPending || !firstName.trim() || !lastName.trim()}>{details.isPending ? "Saving…" : "Save profile"}</button>{details.isSuccess && <p role="status" className="text-sm text-sky">Profile saved.</p>}</div>
      </form>
    </section>
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 className="text-lg font-bold text-ink">Contact details</h2>
      <p className="mt-1 text-sm leading-6 text-muted">Changes require your current password and a code sent to your new email or phone. Manage who can see these details in Settings.</p>
      {([ ["EMAIL", "Email", profile.email, Mail], ["PHONE", "Phone number", profile.phoneNumber, Phone] ] as const).map(([channel, label, value, Icon]) => <div key={channel} className="flex flex-wrap items-center gap-3 border-b border-line py-5 last:border-0">
        <Icon className="h-5 w-5 text-muted" /><div className="min-w-0 flex-1"><p className="text-xs text-muted">{label}</p><p className="break-all text-sm font-medium text-ink">{value}</p></div><button type="button" className={secondary} onClick={() => setContact(channel)}>Change</button>
      </div>)}
      {contact && <ContactEditor key={contact} channel={contact} onCancel={() => setContact(null)} onSaved={value => { saved(value); setContact(null); }} />}
    </section>
  </>;
}

function ContactEditor({ channel, onCancel, onSaved }: { channel: "EMAIL" | "PHONE"; onCancel: () => void; onSaved: (profile: Profile) => void }) {
  const [destination, setDestination] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [challenge, setChallenge] = useState<ContactChallenge | null>(null);
  const start = useMutation({ mutationFn: () => startContactChange(channel, destination.trim(), password), onSuccess: value => { setChallenge(value); setPassword(""); } });
  const verify = useMutation({ mutationFn: () => verifyContactChange(challenge!.challengeId, otp), onSuccess: onSaved });
  return <form className="mt-4 space-y-4 rounded-xl bg-canvas p-5" onSubmit={event => { event.preventDefault(); if (challenge) verify.mutate(); else start.mutate(); }}>
    <h3 className="font-semibold text-ink">Change {channel === "EMAIL" ? "email" : "phone number"}</h3>
    {challenge ? <>
      <p className="text-sm leading-6 text-muted">Enter the six-digit code sent to {challenge.maskedDestination}. Your current contact stays active until verification succeeds.</p>
      <label className="block text-sm font-medium">Verification code<input className={input} required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ""))} /></label>
      <button type="button" className="text-sm font-semibold text-sky underline" disabled={verify.isPending} onClick={() => { setChallenge(null); setOtp(""); start.reset(); verify.reset(); }}>Use another contact or request a new code</button>
    </> : <>
      <label className="block text-sm font-medium">New {channel === "EMAIL" ? "email" : "phone number"}<input className={input} required type={channel === "EMAIL" ? "email" : "tel"} autoComplete={channel === "EMAIL" ? "email" : "tel"} maxLength={channel === "EMAIL" ? 254 : 20} placeholder={channel === "PHONE" ? "+61412345678" : "you@example.com"} value={destination} onChange={event => setDestination(event.target.value)} /></label>
      <label className="block text-sm font-medium">Current password<input className={input} required type="password" autoComplete="current-password" maxLength={256} value={password} onChange={event => setPassword(event.target.value)} /></label>
    </>}
    <ErrorMessage error={start.error || verify.error} />
    <div className="flex flex-wrap gap-3"><button className={button} disabled={start.isPending || verify.isPending}>{start.isPending || verify.isPending ? "Please wait…" : challenge ? "Verify and update" : "Send verification code"}</button><button type="button" className={secondary} disabled={start.isPending || verify.isPending} onClick={onCancel}>Cancel</button></div>
  </form>;
}

export function AccountSettingsPage() {
  const profile = useProfile();
  const saved = useSavedProfile();
  const mutation = useMutation({ mutationFn: savePrivacy, onSuccess: saved });
  return <div className="w-full max-w-3xl space-y-6">
    <PageHeader title="Settings" description="Choose which contact details you share with the community." />
    <section className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3"><Shield className="h-5 w-5 text-sky" /><h2 className="text-lg font-bold text-ink">Contact privacy</h2></div>
      <p className="mt-3 text-sm leading-6 text-muted">Turning a detail off hides it from other members, including listers, on listings, vouch requests, and member searches. Hiding your phone also removes the WhatsApp contact link. You can still sign in and receive account messages.</p>
      {profile.isPending && <p role="status" className="mt-5 text-sm text-muted">Loading your settings…</p>}
      <ErrorMessage error={profile.error || mutation.error} />
      {profile.isError && <button className={secondary} onClick={() => void profile.refetch()}>Try again</button>}
      {profile.data && <div className="mt-3 divide-y divide-line">
        {([ ["showEmail", "Show my email", "Allow other members to see your email address."], ["showPhoneNumber", "Show my phone number", "Allow other members to see your number and contact you on WhatsApp."] ] as const).map(([key, label, description]) => <div key={key} className="flex items-center justify-between gap-5 py-5">
          <div><label htmlFor={key} className="font-semibold text-ink">{label}</label><p className="mt-1 text-sm text-muted">{description}</p></div>
          <button id={key} type="button" role="switch" aria-checked={profile.data![key]} aria-label={label} disabled={mutation.isPending} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky disabled:opacity-50 ${profile.data![key] ? "bg-sky" : "bg-slate-300"}`} onClick={() => mutation.mutate({ showEmail: profile.data!.showEmail, showPhoneNumber: profile.data!.showPhoneNumber, [key]: !profile.data![key] })}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${profile.data![key] ? "left-1 translate-x-5" : "left-1"}`} /></button>
        </div>)}
      </div>}
      <p role="status" aria-live="polite" className="mt-2 text-sm text-sky">{mutation.isPending ? "Saving preference…" : mutation.isSuccess ? "Privacy settings saved." : "Changes save automatically."}</p>
      <p className="mt-4 border-t border-line pt-4 text-xs leading-5 text-muted">People who already saved your contact details may still have a copy.</p>
    </section>
  </div>;
}
