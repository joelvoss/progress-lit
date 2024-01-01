import * as React from 'react';
import { Progress, useProgress } from '../../src';

// 1️⃣ Create a global progress instance, initialized lazily
let globalProgress: Progress | null = null;
function getGlobalProgress() {
	if (!globalProgress) {
		globalProgress = new Progress({ interval: 200 });
	}
	return globalProgress;
}

export function Example() {
	// 2️⃣ Subscribe to our global progress instance using the provided hook
	let state = useProgress(getGlobalProgress());

	return (
		<div>
			<h1>Global Instance example:</h1>
			{/* 3️⃣ Call methods on the global process class */}
			<button onClick={() => state.start()}>Start</button>
			<button onClick={() => state.done()}>Done</button>
			<button onClick={() => state.set(0)}>Set 0%</button>
			<button onClick={() => state.set(0.5)}>Set 50%</button>
			<button onClick={() => state.set(null)}>
				Set <code>null</code>
			</button>

			{/* 4️⃣ Subscribe to changes */}
			{state.value != null ? (
				<>
					<p>Progress: {Math.round(state.value * 100)}%</p>
					<progress value={state.value} />
				</>
			) : (
				<p>Progress: null</p>
			)}
		</div>
	);
}
