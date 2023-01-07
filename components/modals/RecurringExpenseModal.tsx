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
import {
  getTransactionCategoriesArray,
  TransactionCategories,
} from "../../src/models/BudgetModel";
import { addMonthlyTransaction } from "../../src/firebase/UserActions";
import { useAuth } from "../../src/auth/auth";

export default function RecurringExpenseModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const transactionCategories = getTransactionCategoriesArray();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const categoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const dateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(new Date(e.target.value));
  };

  const amountHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseFloat(e.target.value));
  };

  const submitHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (
      name === null ||
      category === null ||
      amount === null ||
      date === null
    ) {
      setError("A field is missing");
      return;
    }

    if (userData) {
      addMonthlyTransaction(
        userData.uid,
        userData.financialInfo.monthlyTransactions,
        {
          name: name,
          date: date,
          isMonthly: true,
          category: category as TransactionCategories,
          amount: amount,
        }
      );
    }

    setName(null);
    setCategory(null);
    setDate(null);
    setAmount(null);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a monthly transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="recurring-expense-name" isRequired>
            <FormLabel>Recurring Expense Name</FormLabel>
            <Input onChange={nameHandler} />
          </FormControl>
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
          <FormControl id="recurring-expense-date" isRequired>
            <FormLabel>Expense Date</FormLabel>
            <Input type="date" onChange={dateHandler} />
          </FormControl>
          <FormControl id="recurring-expense-value" isRequired>
            <FormLabel>Monthly amount</FormLabel>
            <Input type="number" placeholder="$125" onChange={amountHandler} />
          </FormControl>
          {error !== null ? <div>Error: {error}</div> : <></>}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={submitHandler}>
            Add transaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
