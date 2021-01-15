# viewview
## Hyper-Hypertext Markup Language
**A JavaScript library to create and manipulate DOM elements and to manage their state**

✨ *0 dependencies* ✨<br>
✨ *Safe from XSS attacks* ✨<br>
✨ *TypeScript Support (WIP)* ✨<br>
✨ *Thoroughly Unit Tested (WIP)* ✨<br>


## Features
- Create DOM Elements using the `view` method.
- Easy view-model/state management using `useViewModel`
- Add refs to specific DOM elements to collect and use later `example.collect()`

####  Example:

```javascript
import { view, useViewModel } from 'viewview'

// Allow your view to react to changes in your data by using useViewModel
const greetingData = useViewModel({name: 'world 🌎'})

// Create the actual DOM element
const greetingElement = view`
    <div>
        <h1 ref="message">Hello, ${greetingData.$name}</h1>
    </div>
`

// Appends h1 w/ "Hello, world 🌎" to DOM
document.body.appendChild(greetingElement)

// Changes any text using the name property to "hotdog 🌭"
greetingData.name = "hotdog 🌭"

// Retrieve all ref elements in an object
const { message } = greetingElement.collect()

```

## API
`TODO`
### view

The `view` method works as a tagged template literal that returns a DOM node. You can also nest views!

**Example:**
```javascript
const greeting = view`<h1>Hello, world!</h1>`
```
#### view.collect()

The `collect()` method is a property on your view. Any elements that you have added a `ref` attribute to will be collected within an object that uses the the ref attribute value as the key. 

**Example:**
```javascript
const userBanner = view`
  <div>
    <h1 ref="heading">Welcome Back!</h1>
    <h2 ref="subheading">You have 3 notifications</h2>
  </div>
`;

const elements = userBanner.collect();
/*
elements = {
  heading: h1 Node,
  subheading: h2 Node
}
*/
```

### useViewModel
`useViewModel()` creates a stateful object, given an object or array as an argument. It is designed to be tightly coupled to a `view`, such that when a viewModel property is modified, your view is also modified.

#### Create a view model
```javascript
const data = { name: 'Patrick Stewart' }
const viewModel = useViewModel(data)
```
#### Use a view model
**IMPORTANT**
Prefix your view model properties with `$` when you are using them within a view. This convention allows us to use a view model property more than once within a view.


**Example**
```javascript
const data = { name: 'Patrick Stewart' }

const viewModel = useViewModel(data)

const greeting = view`<h1>Hello, ${viewModel.$name}!</h1>`
// h1 text: Hello, Patrick Stewart!

viewModel.name = "Patrick Star"
// h1 text: Hello, Patrick Star!
```

#### Modifying a view model
There are 2 ways to access and modify a view model. Both ways are perfectly valid and behave identically and are intended to provide greater flexibility with how you build and use elements.

**Example**
```javascript
const data = { name: 'Patrick Stewart' }

const viewModel = useViewModel(data)

const greeting = view`<h1>Hello, ${viewModel.$name}!</h1>`
```
**Method 1**
```javascript
// METHOD 1
viewModel.name = "Patrick Star"
```

**Method 2**
```javascript
// METHOD 2
greeting.viewModel.name = "Patrick Star"
```


#### Computed Values
In cases where you need to use a view model value to compute a new value at runtime and you want this computed value to be dynamic.

Each view model propery gains a new method `compute()` that allows us to do this

`viewModel.exampleProp.compute(val => val * 2)`


**Example**
```javascript
const numbers = [1, 3, 5];
const viewModel = useViewModel(numbers);
const listView = view`
  <ul>
    ${viewModel.map(number => view`
      <li>
        ${number} x 2 = ${number.compute((val) => val * 2)}
      </li>`
    )}
  </ul>
`;

/*
1 x 2 = 2
3 x 2 = 6
5 x 2 = 10
*/

viewModel[0] = 4
/*
4 x 2 = 8
3 x 2 = 6
5 x 2 = 10
*/
```

In the example above, we are creating a `<ul>` element, and mapping over our viewModel array of numbers to render `<li>` elements that shows the math to double each number.

We use the `compute()` method that gets added to each view model property to allow our view to recompute the output when the number it's based on changes. 


### Examples

#### Stateless View
```javascript
const userBanner = view`
  <div>
    <h1 ref="heading">Welcome Back!</h1>
    <h2 ref="subheading">You have 3 notifications</h2>
  </div>
`;

const elements = userBanner.collect();

elements.subheading.addEventListener('click', () => {
  // Do something
})
```

#### View + View Model
`TODO`
#### Nested Views (Looping w/ Arrays)
```javascript
const listData = [1, 2, 3, 4];
const viewModel = useViewModel(listData);

const element = view`
  <ul ref="listEl">
    ${viewModel.map(
      (num, i) =>
        view`
        <li ref="listItem${i}">
          List Item: ${num} +
          <span>${num.compute((val) => val + 1)}</span> =
          <span>${num.compute((val) => val + val + 1)}</span> 
        </li>
        `
    )}
  </ul>
`;

/*
List Item: 1 + 2 = 3
List Item: 2 + 3 = 5
List Item: 3 + 4 = 7
List Item: 4 + 5 = 9
*/

```
#### Reusable Components
```javascript

// Create pretend elements for the sake of this example 🤫
const PretendHeroSection = view`...this is a pretend hero section`;
const PretendProductSection = view`...this is a pretend product section`;

// Reusable jump link component
const JumpLink = ({ text, target }) => {
  const viewModel = useViewModel({ text });
  
  const element = view`
    <button ref="jumpLink">
      ${viewModel.text}
    </button>
  `;
  const { jumpLink } = element.collect();

  jumpLink.addEventListener("click", () =>  target.scrollIntoView({ behavior: "smooth" }));

  return element;
};

// Create a jump link to scroll to the product section
const ProductJumpLink = createJumpLink({
  text: "View Product",
  target: PretendProductSection,
});

// Create a jump link to scroll to the hero section
const ScrollToTop = createJumpLink({
  text: "Scroll To Top",
  target: PretendHeroSection,
});

/* Add the jump links to our pretend sections.
In reality, we would likely use `collect()` to retrieve
a specific element to append our jump link to */
PretendHeroSection.appendChild(ProductJumpLink)
PretendProductSection.appendChild(ScrollToTop)

// We can change each Jump Link's text if we want
ScrollToTop.viewModel.text = `🔝`
ProductJumpLink.viewModel.text = `Buy Now`
```
#### Creating A Form
```javascript
// TODO
```