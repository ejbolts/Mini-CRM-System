import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import { useCustomState } from "../App";

describe("Create Proposal Button", () => {
  it("Renders the Create Proposal button and title", () => {
    render(<App />);

    const proposalButtonElement = screen.getByRole("button", {
      name: /create proposal/i,
    });
    const proposalTextElement = screen.getByRole("heading", {
      name: /proposals/i,
    });

    expect(proposalTextElement).toBeVisible();
    expect(proposalButtonElement).toBeVisible();
  });
});

function TestComponent() {
  const [state, handleStateChange] = useCustomState("");

  return (
    <div>
      <span data-testid="stateValue">{state}</span>
      <button
        data-testid="stateChanger"
        onClick={(event) => handleStateChange(event, "New State")}
      >
        Update State
      </button>
    </div>
  );
}

describe("useCustomState custom hook", () => {
  it("initializes with the correct initial state", () => {
    const { getByTestId } = render(<TestComponent />);
    const stateValue = getByTestId("stateValue");
    expect(stateValue.textContent).to.equal("");
  });

  it("updates the state correctly when handleStateChange is called", () => {
    const { getByTestId } = render(<TestComponent />);
    const stateChangerButton = getByTestId("stateChanger");
    const stateValue = getByTestId("stateValue");

    fireEvent.click(stateChangerButton);
    expect(stateValue.textContent).to.equal("New State");
  });

  it("calls event.stopPropagation if event is passed to handleStateChange", () => {
    const { getByTestId } = render(<TestComponent />);
    const stateChangerButton = getByTestId("stateChanger");

    let stopPropagationCalled = false;

    const customEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      button: 0,
    });

    customEvent.stopPropagation = () => {
      stopPropagationCalled = true;
    };

    fireEvent(stateChangerButton, customEvent);
    expect(stopPropagationCalled).toBeTruthy();
  });
});
