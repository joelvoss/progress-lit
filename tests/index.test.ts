import { Progress } from '../src/index';

describe('Progress', () => {
  let progress: Progress;
  let interval = 200;

  beforeEach(() => {
    progress = new Progress({ interval });
  });

  describe('subscribe/unsubscribe', () => {
    test('should subscribe to changes', () => {
      let called = 0;
      progress.subscribe(() => {
        called++;
      });
      progress.set(0.5);
      expect(called).toBe(1);
    });
  
    test('should unsubscribe from changes', () => {
      let called = 0;
      const fn = () => {
        called++;
      };
      const unsubscribe = progress.subscribe(fn);
      unsubscribe();
      progress.set(0.5);
      expect(called).toBe(0);
    });
  });

  describe('set', () => {
    test('should set progress', () => {
      progress.set(0.5);
      expect(progress.value).toBe(0.5);
    });
  
    test('should not exceed maximum progress', () => {
      progress.set(1.5);
      expect(progress.value).toBe(1);
    });
  
    test('should not go below minimum progress', () => {
      progress.set(-0.5);
      expect(progress.value).toBe(0);
    });
  
    test('should set progress to null', () => {
      progress.set(null);
      expect(progress.value).toBeNull();
    });
  });

  describe('start/done', () => {
    test('should start progress', async () => {
      progress.start();
      expect(progress.value).toBe(0);
      // NOTE(joel): Wait for some time to allow the recursion to take place.
      await new Promise(resolve => setTimeout(resolve, (interval * 6) + 100));
      expect(progress.value).toBeGreaterThan(0.31);

      // NOTE(joel): Stop the progress and wait for some time until progress
      // is reset to `null`.
      progress.done();
      await new Promise(resolve => setTimeout(resolve, interval + 100));
      expect(progress.value).toBeNull();
    });
  
    test('should complete progress', async () => {
      progress.done();
      expect(progress.value).toBe(1);
      // NOTE(joel): Wait for some time to allow the recursion to take place.
      await new Promise(resolve => setTimeout(resolve, interval + 100));
      expect(progress.value).toBeNull();
    });
  });
});