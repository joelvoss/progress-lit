import { useCallback, useMemo } from 'react';
// NOTE(joel): Shim to support React 17 and below.
import { useSyncExternalStore } from 'use-sync-external-store/shim';

////////////////////////////////////////////////////////////////////////////////

export interface ProgressStateProps {
	interval?: number;
}

export interface ProgressState {
	value: number | null;
	set: (value: number | null) => void;
	start: () => void;
	done: () => void;
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Provides state management for a progress instance. A progress instance
 * handles the state of a progress bar, e.g. automatically incrementing it
 * when a task is started and stopping it when the task is done.
 */
export function useProgressState(props: ProgressStateProps = {}) {
	const { interval = 200 } = props;
	const progress = useMemo(() => new Progress({ interval }), [interval]);
	return useProgress(progress);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Subscribes to a provided progress instance and provides methods to update it.
 */
export function useProgress(progress: Progress): ProgressState {
	const subscribe = useCallback(
		(fn: () => void) => progress.subscribe(fn),
		[progress],
	);
	const getSnapshot = useCallback(() => progress.value, [progress]);
	const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

	return {
		value,
		set: (value: number | null) => progress.set(value),
		start: () => progress.start(),
		done: () => progress.done(),
	};
}

////////////////////////////////////////////////////////////////////////////////

/**
 * A progress instance handles the state of a progress bar, e.g. automatically
 * incrementing it when a task is started and stopping it when the task is done.
 */
export class Progress {
	private tickleId: NodeJS.Timeout | null = null;
	private subscriptions: Set<() => void> = new Set();
	private interval: number;
	value: number | null = null;

	constructor(options?: ProgressStateProps) {
		this.interval = options?.interval ?? 200;
	}

	subscribe(fn: () => void) {
		this.subscriptions.add(fn);
		return () => this.subscriptions.delete(fn);
	}

	set(value: number | null) {
		this.value = value != null ? Math.min(Math.max(value, 0), 1) : null;
		for (let fn of this.subscriptions) {
			fn();
		}
	}

	start() {
		this.set(0);
		this.trickle();
	}

	done() {
		if (this.tickleId) clearTimeout(this.tickleId);
		this.set(1);
		// NOTE(joel): Reset to `null` after `this.speed` ms.
		this.tickleId = setTimeout(() => {
			this.set(null);
		}, this.interval);
	}

	private trickle() {
		this.tickleId = setTimeout(() => {
			if (this.value == null || this.value > 1) return;

			let step = 0;
			if (this.value >= 0 && this.value < 0.2) {
				step = 0.1;
			} else if (this.value >= 0.2 && this.value < 0.5) {
				step = 0.04;
			} else if (this.value >= 0.5 && this.value < 0.8) {
				step = 0.02;
			} else if (this.value >= 0.8 && this.value < 0.99) {
				step = 0.005;
			}
			// NOTE(joel): Don't go over 99,4%
			this.set(Math.min(this.value + step, 0.994));
			this.trickle();
		}, this.interval);
	}
}
