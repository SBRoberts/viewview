import {
  findAllByDisplayValue,
  fireEvent,
  getAllByTestId,
  getByTestId,
  getByText,
  waitFor,
} from "@testing-library/dom";
import "@testing-library/jest-dom/extend-expect";

import { view, useViewModel } from "../../src";
const TEST_ID = 12345;

describe("Basic View Rendering", () => {
  beforeAll(() => {
    // global.window = global;
  });

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should render a static view with a ref", () => {
    const ref = "heading";

    const text = "Hello, world!";

    const viewModel = useViewModel({ text });

    const element = view`<h1 ref="${ref}" data-testid="${TEST_ID}">${viewModel.$text}</h1>`;
    document.body.append(element);

    const domElement = getByTestId(document.body, TEST_ID);

    expect(domElement).toBeInTheDocument();
    expect(domElement).toHaveTextContent(text);

    const newText = "This is new text";

    viewModel.text = newText;

    expect(domElement).toHaveTextContent(newText);

    const collectedElements = element.collect();

    expect(collectedElements).toHaveProperty(ref, domElement);
    expect(collectedElements[ref] instanceof HTMLHeadingElement).toBe(true);
  });

  test("should render a static view with an array argument", () => {
    const ref = "list";
    const listItemText = [`item 1`, `item 2`, `item 3`];
    const initialState = { items: listItemText };
    const viewModel = useViewModel(initialState);

    const listItemView = view`${viewModel.$items.compute((items: string[]) => {
      return items.map(
        (item) => view`<li data-testid="${TEST_ID}">${item}</li>`
      );
    })}`;

    const listView = view` 
    <ul ref="${ref}">${listItemView}</ul>`;

    document.body.append(listView);

    const assertListItemState = (itemCount: number) => {
      const listItemElements = getAllByTestId(document.body, TEST_ID);
      // console.log("listItemElements", listItemElements);
      expect(listItemElements).toHaveLength(itemCount);

      viewModel.items.forEach((item: any) => {
        const element = getByText(document.body, item);
        expect(element).toBeInTheDocument();
        expect(element.textContent).toEqual(item);
      });
    };
    assertListItemState(listItemText.length);
    viewModel.items = viewModel.items.push("item 4") && viewModel.items;
    assertListItemState(4);
  });
});
