import React, { useState } from "react";
// import { BudgetModel, Transaction } from "../models/BudgetModel";

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
import { useAuth } from "../../src/auth/auth";
import { addBudgetCategoryAllocation } from "../../src/firebase/UserActions";
import { SuggestionEngine } from "../../src/engine/SuggestionEngine";

export default function BudgetAllocationModal(props: {
  isOpen: boolean;
  onClose: () => void;
  uid: string | undefined;
}) {
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [color, setColor] = useState<string>("#FF6384");
  const [allocation, setAllocation] = useState<number>(0);
  const transactionCategories = getTransactionCategoriesArray();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const categoryHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    if (userData) {
      if (e.target.value === "LOANREPAYMENTPRINCIPAL") {
        let loanRepayPrincipal = 0;
        Object.values(userData.financialInfo.accounts.loans).map((account) => {
          loanRepayPrincipal += account.minimumPayment;
        });

        setAllocation(Number(loanRepayPrincipal.toFixed(2)));
      } else if (e.target.value === "INTEREST") {
        let loanRepayInterest = 0;
        Object.values(userData.financialInfo.accounts.loans).map((account) => {
          loanRepayInterest +=
            (account.interestRate / 100 / 12) * account.remainingAmount;
        });
        setAllocation(Number(loanRepayInterest.toFixed(2)));
      }
    }
  };

  const colorHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
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
      if (
        Object.keys(userData.budgetInfo.monthlyAllocations).includes(category)
      ) {
        setError("Category already allocated");
        return;
      }

      addBudgetCategoryAllocation(
        userData.uid,
        userData.budgetInfo.monthlyAllocations,
        category,
        color,
        allocation
      );
      SuggestionEngine.generateAllSpendingBudgetSuggestions(userData);
    }

    setCategory(null);
    setAllocation(0);
    setError(null);
    props.onClose();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add expense category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="category" isRequired>
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
          <FormControl id="category-color" isRequired>
            <FormLabel>Category Color</FormLabel>
            <Input
              type="color"
              defaultValue={"#FF6384"}
              onChange={colorHandler}
            />
          </FormControl>
          <FormControl id="category-value" isRequired>
            <FormLabel>Monthly amount</FormLabel>
            <Input
              type="number"
              placeholder="$125"
              value={allocation}
              onChange={amountHandler}
            />
          </FormControl>
          {error !== null ? <div>Error: {error}</div> : <></>}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={submitHandler}>
            Add category
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
