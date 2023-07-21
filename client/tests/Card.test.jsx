import { render, screen, fireEvent } from "@testing-library/react";

import ProposalCard from "../Card";

describe("ProposalCard", () => {
  // Mock callbacks
  const onDelete = () => {};
  const onUpdate = () => {};
  const onEdit = () => {};
  const handleCreateProposalClick = () => {};
  const handleViewPresentation = () => {};

  // Mock data for the component props
  const mockData = {
    Title: "Sample Proposal",
    onDelete,
    onUpdate,
    onEdit,
    Amount: 1000,
    Date: "2023-06-02",
    PositionNumber: "123",
    subSection: [
      { text: "Personal Info", status: "Done" },
      { text: "Background", status: "InProgress" },
      // ... add more sections as required
    ],
    presentationBtn: "create",
    presentationBtnMsg: "Creating...",
    handleCreateProposalClick,
    handleViewPresentation,
  };

  it("renders without crashing", () => {
    render(<ProposalCard {...mockData} />);

    const titleElement = screen.getByText(/sample proposal/i);
    const positionElement = screen.getByText(/123/i);

    expect(titleElement).toBeVisible();
    expect(positionElement).toBeVisible();
  });

  it("renders the correct button based on the presentationBtn prop", () => {
    render(<ProposalCard {...mockData} />);

    const createPresentationButton = screen.getByRole("button", {
      name: /create presentation/i,
    });
    expect(createPresentationButton).toBeVisible();
  });

  it("renders the correct subheader based on the Amount and Date prop", () => {
    render(<ProposalCard {...mockData} />);

    const subheaderElement = screen.getByText(
      /Close Date: 2023-06-02 Amount: AU\$1,000/i
    );
    expect(subheaderElement).toBeVisible();
  });

  it("renders the correct section statuses", () => {
    render(<ProposalCard {...mockData} />);

    const personalInfoSection = screen.getByText(/Personal Info/i);
    const backgroundSection = screen.getByText(/Background/i);

    expect(personalInfoSection).toBeVisible();
    expect(backgroundSection).toBeVisible();
  });
});
