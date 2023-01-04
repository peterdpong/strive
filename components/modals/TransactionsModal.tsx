import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

export default function TransactionsModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const [name, setName] = useState("");

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const submitHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (name.length === 0) {
      alert("Please enter a name");
      return;
    }

    // const checkOverlap = props.classes.filter(
    //   (c: ClassModel) => c.name === name
    // );

    // if (checkOverlap[0]) {
    //   alert("This class already exists!");
    //   return;
    // }

    // const updatedClasses = props.classes.concat(classObject);
    // addClass(props.uid, updatedClasses);
    // setName("");
    // props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Class</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="assignment-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Class name" onChange={nameHandler} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={submitHandler}>
            Submit
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            mr={3}
            onClick={props.onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
