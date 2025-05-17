import { IResponseHospitalityData } from "@/interfaces/hospitalityData.interface";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useDeleteMutation } from "@/store/services/hospitality-data";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { toast } from "react-toastify";

export interface ModalDangerProps {
  id: number;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  data: IResponseHospitalityData;
}

export function ModalDanger({id, data, isOpen, onOpenChange}: ModalDangerProps) {
    const [fetch] = useDeleteMutation()

    const handleSubmit = async () => {
        try {
            await fetch({id})
            toast.success("update data success!");
            onOpenChange(false);
        } catch (error) {
            const errorMessage = getErroMessage(error);
            toast.error(JSON.stringify(errorMessage));
        }
    }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                <p>
                    Are you sure you want to delete this data? <br />
                </p>
                <div className="flex flex-col">
                    <p className="text-medium font-bold text-danger-500"> {data.name} </p>
                    <p className="text-sm text-default-400"> {data.alias} </p>
                </div>
                </ModalBody>
                <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                    Close
                </Button>
                <Button color="danger" onPress={handleSubmit}>
                    Delete
                </Button>
                </ModalFooter>
            </>
            )}
        </ModalContent>
    </Modal>
  );
}
