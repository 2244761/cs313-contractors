import { Card } from "@mantine/core";

interface ReviewProps {
  detailsData: any;
  participantsData: any;
  onEditStep: (stepIndex: number) => void;
}

const formatDate = (dateValue: any): string => {
  if (!dateValue) return "N/A";
  if (Array.isArray(dateValue)) {
    return dateValue.map((d) => formatDate(d)).join(", ");
  }
  try {
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    return isNaN(date.getTime()) ? String(dateValue) : date.toLocaleDateString();
  } catch {
    return String(dateValue);
  }
};

const Review = ({ detailsData, participantsData, onEditStep }: ReviewProps) => {
  if (!detailsData || !participantsData) {
    return <p className="text-center text-gray-600">No data to review yet.</p>;
  }

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <h2 className="text-lg font-semibold mb-3">Review Reservation Details</h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-blue-700">Details</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            <li><strong>Room:</strong> {detailsData.room_name ?? `Room ${detailsData.room_id ?? "N/A"}`}</li>
            <li><strong>Purpose:</strong> {detailsData.purpose ?? "N/A"}</li>
            <li><strong>Date:</strong> {formatDate(detailsData.date)}</li>
            <li><strong>Start Time:</strong> {detailsData.startTime ?? "N/A"}</li>
            <li><strong>End Time:</strong> {detailsData.endTime ?? "N/A"}</li>
            <li><strong>Advisor:</strong> {detailsData.advisor || "None"}</li>
          </ul>
          <button
            onClick={() => onEditStep(0)}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            ✏️ Edit Details
          </button>
        </div>

        <div>
          <h3 className="font-medium text-blue-700">Participants</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {Array.isArray(participantsData.participants) &&
            participantsData.participants.length > 0 ? (
              participantsData.participants.map((p: string, idx: number) => (
                <li key={idx}>{p}</li>
              ))
            ) : (
              <li>No participants listed.</li>
            )}
          </ul>

          <div className="mt-3">
            <h4 className="font-medium text-blue-700">Equipment</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {Array.isArray(participantsData.equipment) &&
              participantsData.equipment.length > 0 ? (
                participantsData.equipment.map((eq: string, idx: number) => (
                  <li key={idx}>{eq}</li>
                ))
              ) : (
                <li>No equipment listed.</li>
              )}
            </ul>
          </div>

          <button
            onClick={() => onEditStep(1)}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            ✏️ Edit Participants
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Review;
