import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Open_Sans } from "next/font/google";
const openSans = Open_Sans({ subsets: ["latin"] });

export default function ErrorModal(props) {
  const { isOpen, onClose, headerText, bodyText } = props;
  return (
    <Modal
      size="xs"
      isOpen={isOpen}
      placement="center"
      className={`${openSans.className}`}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader>{headerText}</ModalHeader>
        <ModalBody>{bodyText}</ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
