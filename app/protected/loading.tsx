export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-dvh flex-1">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
}
