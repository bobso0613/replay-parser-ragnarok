const ErrorDetails = ({ retryOnClick }: { retryOnClick: () => void }) => {
  return (
    <div className="border border-dashed border-red-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 min-h-60">
      <div className="text-center text-2xl font-semibold text-red-200">
        An error occurred while parsing the replay.
      </div>
      <button
        type="button"
        onClick={retryOnClick}
        className="text-center text-3xl font-semibold underline text-red-100 cursor-pointer"
      >
        Click me to retry
      </button>
      <div className="text-center text-2xl font-semibold text-red-200">
        or choose another replay file to parse.
      </div>
    </div>
  );
};

export default ErrorDetails;
