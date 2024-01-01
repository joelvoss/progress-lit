import * as React from 'react';
import { useProgressState, type ProgressState } from '../../src';

// 1️⃣ Create progress instance provider component
function ProgressProvider({ children }) {
	let state = useProgressState({ interval: 200 });

	return (
		<>
			{/* 2️⃣ Pass the progress state to the provider children. This could
			       also be passed using React Context */}
			{children(state)}

			{/* 3️⃣ Render changes of the progress value */}
			{state.value != null ? (
				<>
					<p>
						Progress: <code>{Math.round(state.value * 100)}%</code>
					</p>
					<progress value={state.value} />
				</>
			) : (
				<p>
					Progress: <code>null</code>
				</p>
			)}
		</>
	);
}

export function Example() {
	return (
		<div>
			<h1>Basic example:</h1>
			<ProgressProvider>
				{/* 4️⃣ Use the progress state passed down from the provider to
				       call methods on the progress instance. */}
				{(state: ProgressState) => (
					<>
						<button onClick={() => state.start()}>Start</button>
						<button onClick={() => state.done()}>Done</button>
						<button onClick={() => state.set(0)}>Set 0%</button>
						<button onClick={() => state.set(0.5)}>Set 50%</button>
						<button onClick={() => state.set(null)}>
							Set <code>null</code>
						</button>
					</>
				)}
			</ProgressProvider>
		</div>
	);
}
