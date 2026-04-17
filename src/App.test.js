import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// jest.mock is hoisted before variable declarations — define mocks inside the factory
jest.mock("./hooks/useSocket", () => {
  const emit = jest.fn();
  const on   = jest.fn().mockReturnValue(() => {});
  return {
    useSocket: () => ({
      socket: { id: "mock-socket-id", connected: false },
      connected: false,
      error: null,
      emit,
      on,
    }),
    __emit: emit,
    __on:   on,
  };
});

import App from "./App";
import * as socketHook from "./hooks/useSocket";

beforeEach(() => {
  socketHook.__emit.mockClear();
  socketHook.__on.mockClear();
  socketHook.__on.mockReturnValue(() => {});
});

describe("App smoke tests", () => {
  test("renders splash screen on load", () => {
    render(<App />);
    expect(screen.getByText(/BLINDSPOT/i)).toBeInTheDocument();
  });

  test("Create Game button is disabled when name is empty", () => {
    render(<App />);
    expect(screen.getByText("Create Game")).toBeDisabled();
  });

  test("Create Game button enables after entering a name", () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Your name..."), {
      target: { value: "Hugo" },
    });
    expect(screen.getByText("Create Game")).not.toBeDisabled();
  });

  test("clicking Create Game emits CREATE_ROOM with the entered name", () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Your name..."), {
      target: { value: "Hugo" },
    });
    fireEvent.click(screen.getByText("Create Game"));
    expect(socketHook.__emit).toHaveBeenCalledWith(
      "CREATE_ROOM",
      expect.objectContaining({ name: "Hugo" })
    );
  });

  test("clicking Join with code shows the join screen", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Join with code"));
    expect(screen.getByText(/ENTER ROOM CODE/i)).toBeInTheDocument();
  });
});
