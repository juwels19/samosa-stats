import { Card, CardHeader, CardBody } from "@nextui-org/card";
import moment from "moment";
import { useRouter } from "next/router";

export default function EventCard(props) {
  const {
    name,
    startDate,
    endDate,
    isSubmissionClosed,
    eventCode,
    isAdminCard,
    isComplete,
  } = props;

  const router = useRouter();

  const onCardClick = () => {
    // Logic in here to push the user to the form they clicked with eventCode
    if (isAdminCard) {
      router.push(`/event/${eventCode}/setup`);
    } else {
      router.push(`/event/${eventCode}`);
    }
  };

  return (
    <Card isHoverable isPressable className="w-full" onPress={onCardClick}>
      <CardHeader className="font-semibold text-xl justify-center">
        {name}
      </CardHeader>
      <CardBody className="flex flex-col justify-end text-sm md:text-lg">
        <p className="font-bold">
          Event Dates:{" "}
          <span className="font-normal">
            {moment(startDate).format("MMMM Do")} to{" "}
            {moment(endDate).format("MMMM Do")}
          </span>
        </p>
        <p className="font-bold">
          Picks Due:{" "}
          <span className="font-normal">
            {moment(startDate)
              .subtract(1, "day")
              .endOf("day")
              .format("MMMM Do, h:mm:ss a")}
          </span>
        </p>
      </CardBody>
    </Card>
  );
}
