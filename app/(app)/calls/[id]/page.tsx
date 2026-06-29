import Link from "next/link";
import { ArrowLeft } from "@gravity-ui/icons";
import { calls, getCall } from "@/components/app/calls/data";

export function generateStaticParams() {
  return calls.map((c) => ({ id: c.id }));
}

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const call = getCall(id);

  return (
    <div className="flex flex-col gap-6 p-6">
      <Link
        href="/calls"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6b7280] transition-colors hover:text-[#000102]"
      >
        <ArrowLeft className="size-4" />
        Back to calls
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#000102]">
          {call ? call.prospect : `Call #${id}`}
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          {call ? `${call.closer} · ${call.date} · ${call.duration}` : "Call not found"}
        </p>
      </div>

      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 text-sm text-[#6b7280]">
        Call detail — coming next (Phase 2)
      </div>
    </div>
  );
}
