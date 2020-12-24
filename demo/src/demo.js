import hhtml from "../../src/main";
const { useView, useState } = hhtml;

const appRoot = document.getElementById("root");

const listData = [1, 2, 3, 4];

const List = (props) => {
  const state = useState(props);

  const view = useView`
    <ul ref="listEl">
      ${state.map((num, i) =>
        i !== 1
          ? useView`
          <li ref="listItem${i}">
            List Item: ${num} +
            <span>${num.calc((num) => num + 1)}</span> =
            <span>${num.calc((num) => num + num + 1)}</span> 
          </li>
          `
          : useView`<li>List Item: ${num} is aight too</li>`
      )}
    </ul>`;

  const { listEl } = view.collect();

  listEl.addEventListener("click", (e) => {
    const itemIdx = Array.from(listEl.children).indexOf(e.target);
    itemIdx > -1 && (state[itemIdx] = Math.floor(Math.random() * 7));
  });

  return view;
};

const NormalList = List(listData);

setTimeout(() => {
  NormalList.viewModel[0] = 6;
  console.log("ARRRGH 🏴‍☠️", NormalList.viewModel);
}, 2000);

const sectionData = useState({
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
  return useView`<div class="module">
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

const Page = useView`
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
