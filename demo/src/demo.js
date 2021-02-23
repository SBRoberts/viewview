import { view, useViewModel } from "../../src/main";

const appRoot = document.getElementById("root");

const pets = {
  cat: {
    name: "Stevie",
    age: 2,
    breed: {
      type: "baka",
    },
  },
  dog: {
    name: "Papapia",
    age: 3,
    breed: {
      type: "baka2",
    },
  },
  num: 3,
};

const vm = useViewModel(pets);
console.log("vm", vm);

// console.log("vm.dog.breed.type ", vm.dog.breed.type);

const element = view`
  <div>
    <h1>${vm.$num} x 2 = ${vm.$num.compute((val) => val * 2)}</h1>

    <h1>CAT</h1>
    <h2>${vm.cat.$name}</h2>
    <h2>${vm.cat.$age}</h2>
    <h2>${vm.cat.breed.$type}</h2>
    <h1>DOG</h1>
    <h2>${vm.dog.$name}</h2>
    <h2>${vm.dog.$age}</h2>
    <h2>${vm.dog.breed.$type}</h2>
    <h2>${vm.dog.breed.$type}</h2>
    </div>
    `;
vm.dog.breed.type = "good booi";
vm.num = 11;

appRoot.appendChild(element);
console.log("vm", vm);

const listData = [1, 2, 3, 4];

const List = (props) => {
  const viewModel = useViewModel(props);

  const element = view`
    <ul ref="listEl">
      ${viewModel.map((num, i) =>
        i !== 1
          ? view`
          <li ref="listItem${i}">
            List Item: ${num} +
            <span>${num.compute((val) => val + 1)}</span> =
            <span>${num.compute((val) => val + val + 1)}</span>
          </li>
          `
          : view`<li>List Item: ${num} is aight too</li>`
      )}
    </ul>`;

  const { listEl } = element.collect();

  listEl.addEventListener("click", (e) => {
    const itemIdx = Array.from(listEl.children).indexOf(e.target);
    itemIdx > -1 && (viewModel[itemIdx] = Math.floor(Math.random() * 7));
  });

  console.log("viewModel", viewModel);
  console.log("element.viewModel", element.viewModel);

  return element;
};

const NormalList = List(listData);

setTimeout(() => {
  NormalList.viewModel[0] = 6;
  console.log("ARRRGH 🏴‍☠️", NormalList.viewModel);
}, 2000);

const sectionData = useViewModel({
  top: "TOP TEXT",
  bottom: "BOTTOM TEXT",
  title: "Hello! 👋",
  titleId: "titleId",
  heading: "Old, 👴🏻",
  number: 90210,
  img:
    "https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80",
  imgAlt: "this is an alt tag",
  body:
    "I'm baby swag semiotics scenester drinking vinegar franzen lomo. Cornhole man bun hammock mustache slow-carb. Adaptogen keffiyeh 8-bit woke salvia, leggings flannel food truck echo park blog everyday carry hell of.",
});

const SectionList = List(listData);

const Section = () => {
  return view`<div class="module">
    ${sectionData.top}
    <h1 ref="title" id="${sectionData.titleId}">${sectionData.title}</h1>
    <h2 ref="heading" class="heading">${sectionData.heading}</h2>
    <p ref="content">${sectionData.body}</p>
    <div id="test">
      <h3 ref="test">${sectionData.number}</h3>
      <div>
        <img
          ref="coolImage"
          style="max-width:500px;"
          src="${sectionData.img}"
          alt="${sectionData.imgAlt}"
        />
      </div>
      </div>
      ${sectionData.bottom}
    </div>
    ${SectionList}
  `;
};

const MainSection = Section();

const Page = view`
  ${NormalList}
  ${MainSection}
`;

appRoot.appendChild(Page);

// Modify data in different ways to hot-update the dom.
MainSection.viewModel.title = `11 x 🆒`;
MainSection.viewModel.heading = "CHANGED 🥳";
MainSection.viewModel.number = 11;
MainSection.viewModel.imgAlt = "woah dude";
MainSection.viewModel.titleId = "A new title ID!";
sectionData.title = `<img src onerror="alert('XSS Hax'); console.log('Also a XSS hax')">`;
SectionList.viewModel[3] = 11;
