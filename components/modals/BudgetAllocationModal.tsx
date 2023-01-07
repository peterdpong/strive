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
  Select,
} from "@chakra-ui/react";
import { getTransactionCategoriesArray } from "../../src/models/BudgetModel";
import { useAuth } from "../../src/auth/auth";
import { addBudgetCategoryAllocation } from "../../src/firebase/UserActions";

export default function BudgetAllocationModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [allocation, setAllocation] = useState<number | null>(null);
  const transactionCategories = getTransactionCategoriesArray();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const categoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const amountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllocation(parseFloat(e.target.value));
  };

  const submitHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (category === null || allocation === null) {
      setError("A field is missing");
      return;
    }

    if (userData) {
      addBudgetCategoryAllocation(userData.uid, category, allocation);
    }

    setCategory(null);
    setAllocation(null);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add category allocation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="recurring-expense-category" isRequired>
            <FormLabel>Category</FormLabel>
            <Select onChange={categoryHandler} placeholder="Select category">
              {transactionCategories.map((category) => {
                return (
                  <option key={category.key} value={category.key}>
                    {category.value}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          <FormControl id="recurring-expense-value" isRequired>
            <FormLabel>Monthly amount</FormLabel>
            <Input type="number" placeholder="$125" onChange={amountHandler} />
          </FormControl>
          {error !== null ? <div>Error: {error}</div> : <></>}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={submitHandler}>
            Add allocation
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
