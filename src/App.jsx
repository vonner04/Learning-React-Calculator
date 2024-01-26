import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  COMPUTE: "compute",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      //Prevent trailing zeroes.
      if (state.currentOperand === "0" && payload.digit === "0") return state;

      //If decimal start then format as 0.
      if (payload.digit === "." && state.currentOperand == null) {
        return { ...state, currentOperand: "0." };
      }

      //Do nothing if there is already a decimal point
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      //Add digit to calculator
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      //Do nothing if there is no previous operand and current operand.
      if (
        (state.currentOperand == null && state.previousOperand == null) ||
        state.currentOperand == null
      ) {
        return state;
      }

      //Update operation if there is no previous operand
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      //Default functionality when an operation is already chosen
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:

    case ACTIONS.COMPUTE:
      //Do nothing if there is no current operand or operation
      if (state.currentOperand == null || state.operation == null) {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  //Turn strings into numbers
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);
  if (isNaN(current) || isNaN(previous)) return "";

  let computation = "";
  //Determine operation
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
      break;
  }
  return computation.toString();
}

export default function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch}></OperationButton>
      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch}></OperationButton>
      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch}></OperationButton>
      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch}></OperationButton>
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.COMPUTE })}
      >
        =
      </button>
    </div>
  );
}
