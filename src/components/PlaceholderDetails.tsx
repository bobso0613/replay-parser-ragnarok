/**
 * Empty-state placeholder shown in the content area before a replay is uploaded
 * or while the parser has not yet returned results.
 *
 * Renders a dashed border card with a centred hint message.
 */
const PlaceholderDetails = () => {
  return (
    <div className="border border-dashed border-gray-400 rounded-2xl p-12 flex items-center justify-center min-h-60">
      <p className="text-center text-3xl font-semibold text-gray-600">
        Statistics will be shown in this area
      </p>
    </div>
  );
};

export default PlaceholderDetails;
