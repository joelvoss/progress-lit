# progress-lit

A controllable react progress bar. Useful for showing the progress of a
client side route transition, e.g. when using Next.js
(either `/pages` or `/app` router).

**Bundle size:**
- **CommonJS**: 2250 B (gzip: 1047 B, brotli: 906 B)
- **ESModule (modern)**: 1189 B (gzip: 556 B , brotli: 488 B)
- **ESModule**: 2245 B (gzip: 1048 B , brotli: 912 B)


## Requirements

  - React v17+
  - React DOM v17+

## Installation

```bash
$ npm i progress-lit
# or
$ yarn add progress-lit
```

## Examples


### Basic example

```tsx
import * as React from 'react';
import { Progress, useProgress } from 'progress-lit';

// 1️⃣ Create a global progress instance, initialized lazily
let globalProgress: Progress | null = null;
function getGlobalProgress() {
	if (!globalProgress) {
		globalProgress = new Progress();
	}
	return globalProgress;
}

export function Example() {
	// 2️⃣ Subscribe to our global progress instance using the provided hook
	let state = useProgress(getGlobalProgress());

	return (
		<div>
			<h1>Basic example:</h1>
			{/* 3️⃣ Call methods on the global process class */}
			<button onClick={() => state.start()}>Start</button>
			<button onClick={() => state.done()}>Done</button>
			<button onClick={() => state.set(0)}>Set 0%</button>
			<button onClick={() => state.set(0.5)}>Set 50%</button>
			<button onClick={() => state.set(null)}>
				Set <code>null</code>
			</button>

			{/* 4️⃣ Subscribe to changes */}
			{state.status != null ? (
				<>
					<p>Progress: {Math.round(state.status * 100)}%</p>
					<progress value={state.status} />
				</>
			) : (
				<p>Progress: null</p>
			)}
		</div>
	);
}
```
> Visit [./examples](./examples) to view all usage examples.


## Additional notes

* In most cases, you want to keep the progress class outside the React
  tree so that you can call it's methods from anywhere.

* In the [basic example](#basic-example), the progress class is initialized
  lazily, so you can import it from anywhere without worrying about circular
  dependencies.<br>

* Use the `useProgress` hook to subscribe to changes in the global
  progress instance inside your React components.<br>
  `useProgress` uses `useSyncExternalStore` under the hood.


## Development

(1) Install dependencies

```bash
$ npm i
# or
$ yarn
```

(2) Run initial validation

```bash
$ ./Taskfile.sh validate
```

(3) Start developing by running the `run_examples` task.<br>
    This spins up a development server hosting the different examples located
    in the [./examples](./examples) folder on
    [http://localhost:1234](http://localhost:1234).

```bash
$ ./Taskfile run_examples
```

---

_This project was set up by @jvdx/core_
