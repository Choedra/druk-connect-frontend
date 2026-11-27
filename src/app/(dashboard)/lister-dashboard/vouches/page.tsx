"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Mail, Phone, Search, ShieldCheck, Star, X } from "lucide-react";
import { PageHeader } from "@/src/shared/dashboard/PageHeader";
import { ProfileAvatar } from "@/src/features/profile/ProfileAvatar";
import { useAuthStore } from "@/src/features/auth/store/authStore";
import { getListerDashboard } from "@/src/features/lister-dashboard/api/getListerDashboard";
import { createVouchRequest, getReceivedVouches, getSentVouchRequests, getVoucherProfile, searchVouchCandidates, type VouchPage } from "@/src/features/vouches/api/listerVouches";

const action = "inline-flex min-h-10 items-center justify-center rounded-md border border-line-strong px-4 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50";
const panel = "border border-line bg-surface p-6 sm:p-8";
function date(value: string) {
  return new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(new Date(value));
}
function ErrorNotice({ error, retry }: { error: Error | null; retry?: () => void }) {
  if (!error) return null;
  return <div role="alert" className="my-4 rounded-md border border-danger/20 bg-danger-tint p-4 text-sm text-danger"><p>{error.message}</p>{retry && <button type="button" className="mt-2 underline" onClick={retry}>Try again</button>}</div>;
}

export default function VouchesPage() {
  const userId = useAuthStore(state => state.user?.id);
  return <div className="space-y-10">
    <PageHeader title="Vouches" description="Build trust in the community by asking people you know to vouch for you and see who supports your account." />
    {userId && <ListerVouches key={userId} userId={userId} />}
  </div>;
}

function ListerVouches({ userId }: { userId: string }) {
  const client = useQueryClient();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("You know me in the community. Would you please vouch for my account?");
  const [receivedPage, setReceivedPage] = useState(0);
  const [requestsPage, setRequestsPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);
  const summary = useQuery({ queryKey: ["lister-vouches", userId, "summary"], queryFn: getListerDashboard, refetchInterval: 30000 });
  const received = useQuery({ queryKey: ["lister-vouches", userId, "received", receivedPage], queryFn: () => getReceivedVouches(receivedPage), refetchInterval: 30000 });
  const requests = useQuery({ queryKey: ["lister-vouches", userId, "requests", requestsPage], queryFn: () => getSentVouchRequests(requestsPage), refetchInterval: 30000 });
  const members = useQuery({ queryKey: ["lister-vouches", userId, "search", query], queryFn: ({ signal }) => searchVouchCandidates(query, signal), enabled: query.length >= 2, staleTime: 0 });
  const send = useMutation({
    mutationFn: (targetUserId: string) => createVouchRequest(targetUserId, message.trim()),
    onSuccess: () => {
      setRequestsPage(0);
      void client.invalidateQueries({ queryKey: ["lister-vouches", userId] });
    },
  });
  const stats = summary.data;
  return <>
    <section className={panel}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">Build your reputation</p>
      <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink">Ask someone to vouch for you</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Search for a Buyer who knows you by name or shared email. Private email addresses cannot be searched.</p>
      <label className="relative mt-6 block max-w-2xl"><span className="sr-only">Search community members</span><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" /><input type="search" value={search} maxLength={100} onChange={event => { setSearch(event.target.value); send.reset(); }} placeholder="Search by name or shared email…" className="h-11 w-full rounded-md border border-line bg-background pl-10 pr-4 text-sm text-ink outline-none focus:border-brand" /></label>
      {search.trim().length === 1 && <p className="mt-2 text-xs text-muted">Enter at least two characters.</p>}
      {query.length >= 2 && search.trim() === query && <div className="mt-5 max-w-2xl">
        <label className="block text-sm font-medium text-ink">Your message<textarea value={message} onChange={event => setMessage(event.target.value)} maxLength={500} rows={3} className="mt-2 w-full rounded-md border border-line bg-background p-3 text-sm outline-none focus:border-brand" /></label>
        {members.isPending && <p role="status" className="py-5 text-sm text-muted">Searching members…</p>}
        <ErrorNotice error={members.error} retry={() => void members.refetch()} />
        <ErrorNotice error={send.error} />
        {send.isSuccess && <p role="status" className="mt-4 text-sm text-jade">Your vouch request was sent.</p>}
        {members.data?.map(member => <div key={member.userId} className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-4 last:border-0">
          <div className="flex min-w-0 items-center gap-3"><ProfileAvatar name={member.name} imageUrl={member.profileImageUrl} className="h-10 w-10 text-sm" /><div className="min-w-0"><p className="font-semibold text-ink">{member.name}</p><p className="mt-1 break-all text-xs text-muted">{[member.location, member.email].filter(Boolean).join(" · ") || "Community member · Email private"}</p></div></div>
          <button type="button" className={action} disabled={send.isPending || member.alreadyVouched || member.requestPending || !message.trim() || (send.isSuccess && send.variables === member.userId)} onClick={() => send.mutate(member.userId)}>{member.alreadyVouched ? "Already vouched" : member.requestPending || (send.isSuccess && send.variables === member.userId) ? "Requested" : send.isPending && send.variables === member.userId ? "Sending…" : "Ask to vouch"}</button>
        </div>)}
        {members.isSuccess && members.data.length === 0 && <p className="py-6 text-sm text-muted">No members found. Try another name or shared email.</p>}
      </div>}
    </section>

    <section aria-label="Community reputation">
      <ErrorNotice error={summary.error} retry={() => void summary.refetch()} />
      {summary.isPending && <p role="status" className="text-sm text-muted">Loading your reputation…</p>}
      {stats && <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="border border-line bg-panel p-6 text-panel-fg sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-panel-muted">Community reputation</p><div className="mt-4 flex items-end gap-3"><span className="font-serif text-5xl font-medium">{stats.averageRating == null ? "—" : stats.averageRating.toFixed(1)}</span><span className="pb-2 text-sm text-panel-muted">{stats.averageRating == null ? "No reviews yet" : "out of 5"}</span></div>
          {stats.averageRating != null && <div className="mt-3 flex gap-1" aria-label={`${stats.averageRating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className={`h-4 w-4 ${index < Math.round(stats.averageRating) ? "fill-current text-brand" : "text-panel-muted"}`} />)}</div>}
          <p className="mt-3 text-sm text-panel-muted">Based on {stats.approvedReviewCount} approved reviews and {stats.activeVouchCount} active community vouches</p>
          <div className="mt-6 flex items-center gap-3 border-t border-panel-line pt-5"><ShieldCheck className="h-6 w-6" /><p className="text-sm">{stats.activeVouchCount} members currently vouch for you</p></div>
        </div>
        <div className={panel}><p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-faint"><Eye className="h-4 w-4" />Total listing views</p><p className="mt-5 font-serif text-4xl font-medium text-ink">{stats.totalListingViews.toLocaleString()}</p><p className="mt-3 text-xs leading-5 text-muted">Total recorded views across your current listings. Repeat visits count as views; this is not a count of unique people.</p></div>
      </div>}
    </section>

    <section><SectionHeading eyebrow="Your requests" title="Vouch requests" />
      <ErrorNotice error={requests.error} retry={() => void requests.refetch()} />
      <div className="mt-5 border border-line bg-surface">
        {requests.isPending && <p role="status" className="p-6 text-sm text-muted">Loading your requests…</p>}
        {requests.data?.items.map(request => <div key={request.requestId} className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5 last:border-0"><div className="flex items-center gap-3"><ProfileAvatar name={request.memberName} imageUrl={request.profileImageUrl} className="h-10 w-10 text-sm" /><div><p className="text-sm font-semibold text-ink">{request.memberName}</p><p className="mt-1 text-xs text-muted">Requested {date(request.requestedAt)}</p></div></div><span className={`rounded-md px-3 py-1.5 text-xs font-semibold ${request.status === "ACCEPTED" ? "bg-jade-tint text-jade" : request.status === "DECLINED" ? "bg-danger-tint text-danger" : "bg-background text-muted"}`}>{request.status.toLowerCase()}</span></div>)}
        {requests.data?.items.length === 0 && <p className="p-8 text-center text-sm text-muted">No requests yet. Search above to ask someone you know.</p>}
      </div>
      {requests.data && <Pagination data={requests.data} onPage={setRequestsPage} />}
    </section>

    <HowVouchesWork />

    <section><SectionHeading eyebrow="Community trust" title="Your vouches" />
      <ErrorNotice error={received.error} retry={() => void received.refetch()} />
      <div className="mt-5 border border-line bg-surface">
        {received.isPending && <p role="status" className="p-6 text-sm text-muted">Loading your vouches…</p>}
        {received.data?.items.map(vouch => <article key={vouch.vouchId} className="border-b border-line p-6 last:border-0 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-4"><ProfileAvatar name={vouch.member.name} imageUrl={vouch.member.profileImageUrl} className="h-12 w-12 text-sm" /><div><h3 className="text-sm font-semibold text-ink">{vouch.member.name}</h3><p className="mt-1 text-xs text-muted">{vouch.member.location || "Community member"}</p><p className="mt-2 text-xs text-faint">Vouched on {date(vouch.vouchedAt)}</p></div></div><button type="button" className={action} aria-expanded={selected === vouch.member.userId} onClick={() => setSelected(selected === vouch.member.userId ? null : vouch.member.userId)}>{selected === vouch.member.userId ? "Hide profile" : "View profile"}</button></div>
          {selected === vouch.member.userId && <VoucherDetails userId={userId} memberId={vouch.member.userId} onClose={() => setSelected(null)} />}
        </article>)}
        {received.data?.items.length === 0 && <p className="p-8 text-center text-sm text-muted">No active vouches yet. Accepted vouches will appear here.</p>}
      </div>
      {received.data && <Pagination data={received.data} onPage={page => { setSelected(null); setReceivedPage(page); }} />}
    </section>
  </>;
}

function VoucherDetails({ userId, memberId, onClose }: { userId: string; memberId: string; onClose: () => void }) {
  const profile = useQuery({ queryKey: ["lister-vouches", userId, "profile", memberId], queryFn: () => getVoucherProfile(memberId), staleTime: 0, gcTime: 0, refetchOnMount: "always", refetchInterval: 15000 });
  return <section aria-label="Member profile" className="mt-5 rounded-md border border-line bg-background p-5">
    <div className="flex justify-between gap-4"><h4 className="font-semibold text-ink">Member profile</h4><button type="button" aria-label="Close member profile" onClick={onClose}><X className="h-4 w-4" /></button></div>
    {profile.isFetching && <p role="status" className="mt-3 text-sm text-muted">Checking current profile visibility…</p>}
    <ErrorNotice error={profile.error} retry={() => void profile.refetch()} />
    {profile.data && !profile.isFetching && !profile.isError && <div className="mt-4 space-y-4">
      <div className="flex items-center gap-3"><ProfileAvatar name={profile.data.name} imageUrl={profile.data.profileImageUrl} className="h-12 w-12" /><div><p className="font-semibold text-ink">{profile.data.name}</p>{profile.data.location && <p className="mt-1 text-sm text-muted">{profile.data.location}</p>}</div></div>
      {profile.data.bio && <p className="whitespace-pre-wrap break-words text-sm leading-6 text-muted">{profile.data.bio}</p>}
      <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 shrink-0 text-muted" />{profile.data.email ? <a href={`mailto:${profile.data.email}`} className="break-all text-brand underline">{profile.data.email}</a> : <span className="text-muted">Email private</span>}</div>
      <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 shrink-0 text-muted" />{profile.data.phoneNumber ? <a href={`tel:${profile.data.phoneNumber}`} className="break-all text-brand underline">{profile.data.phoneNumber}</a> : <span className="text-muted">Phone number private</span>}</div>
      <p className="border-t border-line pt-3 text-xs leading-5 text-muted">Members control their contact visibility in Settings. Private details are not shared.</p>
    </div>}
  </section>;
}

function Pagination({ data, onPage }: { data: VouchPage<unknown>; onPage: (page: number) => void }) {
  if (data.totalPages <= 1) return null;
  return <nav aria-label="Results pages" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted"><span>Page {data.currentPage + 1} of {data.totalPages} · {data.totalElements} total</span><div className="flex gap-2"><button type="button" className={action} disabled={!data.hasPrevious} onClick={() => onPage(data.currentPage - 1)}>Previous</button><button type="button" className={action} disabled={!data.hasNext} onClick={() => onPage(data.currentPage + 1)}>Next</button></div></nav>;
}
function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-faint">{eyebrow}</p><h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink">{title}</h2></div>;
}
function HowVouchesWork() {
  return (
    <section className="border border-line bg-surface p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-faint">
          How it works
        </p>

        <h2 className="mt-2 font-serif text-2xl font-medium tracking-tight text-ink">
          Vouches help people trust you
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          A vouch is a recommendation from another member of the Bhutanese
          community. It helps people feel more confident when choosing your
          services.
        </p>
      </div>

      <div className="mt-7 grid gap-6 border-t border-line pt-7 sm:grid-cols-3">
        <VouchStep
          number="01"
          title="Build connections"
          description="Connect with people in the community through your services and interactions."
        />

        <VouchStep
          number="02"
          title="Ask for a vouch"
          description="Find someone who knows you and send them a request from your dashboard."
        />

        <VouchStep
          number="03"
          title="Grow your reputation"
          description="Accepted vouches become part of your public reputation on Bhutanese Marketplace."
        />
      </div>
    </section>
  );
}


function VouchStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <span className="text-xs font-semibold tracking-[0.1em] text-brand">
        {number}
      </span>

      <h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}
