import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import DropdownMenu from "../DropDown";

describe("DropdownMenu", () => {
  afterEach(cleanup);

  it("renders the dropdown menu", async () => {
    render(<DropdownMenu />);

    const dropdownElement = screen.getByRole("button", {
      name: /select a category/i,
    });
    expect(dropdownElement).toBeTruthy();
  });
});
