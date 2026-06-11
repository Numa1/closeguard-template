export default function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium text-[#000102]">{title}</h1>
      <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/60 text-sm text-[#6b7280]">
        Contenu à venir
      </div>
    </div>
  );
}
