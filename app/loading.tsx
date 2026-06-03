export default function Loading() {
  return (
    <div
      className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center"
      role="status"
      aria-label="Memuat"
    >
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand" />
    </div>
  );
}
