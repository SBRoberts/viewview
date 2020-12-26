# HHTML
## Hyper-Hypertext Markup Language
**A JavaScript library to create and manipulate DOM elements and to manage their state**

✨ *0 dependencies* ✨<br>
✨ *Safe from XSS attacks* ✨<br>
✨ *TypeScript Support (WIP)* ✨<br>
✨ *Thoroughly Unit Tested (WIP)* ✨<br>


## Features
- Create DOM Elements using `useView`.
- Easy view model/state management using `useViewModel`
- Add refs to specific DOM elements to collect and use later `example.collect()`

####  Example:

```javascript
import { useView, useViewModel } from 'hhtml'

// Allow your view to react to changes in your data by using useViewModel
const greetingData = useViewModel({name: 'world 🌎'})

// Create the actual DOM element
const greetingElement = useView`
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
### useView
`TODO`
#### collect
`TODO`
### useViewModel
`TODO`

### Examples
```javascript
// TODO

// Simple example

// Example w/ View Model

// Creating reusable components

// Creating a form
```