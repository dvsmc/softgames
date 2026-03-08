import { fireEvent, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { DEMOS } from "../consts";
import { getKeys } from "../utils/getKeys";
import { createUi } from "./Ui";

describe("Ui", () => {
    it("renders menu with all demos", () => {
        const target = document.createElement("div");
        document.body.appendChild(target);
        const destroy = createUi(target, vi.fn(), vi.fn());
        expect(screen.getByText("Softgames Assignment")).toBeInTheDocument();
        expect(screen.getByText("Pick a demo:")).toBeInTheDocument();
        for (const id of getKeys(DEMOS)) {
            expect(screen.getByText(DEMOS[id])).toBeInTheDocument();
        }
        destroy();
    });

    it("hides menu and calls onSelectDemo when a demo is clicked", () => {
        const target = document.createElement("div");
        const onSelectDemo = vi.fn();
        document.body.appendChild(target);
        const destroy = createUi(target, onSelectDemo, vi.fn());
        fireEvent.click(screen.getByText("Ace of Shadows"));
        expect(onSelectDemo).toHaveBeenCalledWith("ace-of-shadows");
        expect(screen.queryByText("Softgames Assignment")).not.toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
        destroy();
    });

    it("shows menu again and calls onBack when Back is clicked", () => {
        const target = document.createElement("div");
        const onBack = vi.fn();
        document.body.appendChild(target);
        const destroy = createUi(target, vi.fn(), onBack);
        fireEvent.click(screen.getByText("Magic Words"));
        fireEvent.click(screen.getByText("Back"));
        expect(onBack).toHaveBeenCalledOnce();
        expect(screen.getByText("Softgames Assignment")).toBeInTheDocument();
        expect(screen.queryByText("Back")).not.toBeInTheDocument();
        destroy();
    });
});
