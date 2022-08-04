/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
export type OverloadedParameters<T> = T extends {
  (...args: infer A1): any;
  (...args: infer A2): any;
  (...args: infer A3): any;
  (...args: infer A4): any;
}
  ? A1 | A2 | A3 | A4
  : T extends {
      (...args: infer A1): any;
      (...args: infer A2): any;
      (...args: infer A3): any;
    }
  ? A1 | A2 | A3
  : T extends { (...args: infer A1): any; (...args: infer A2): any }
  ? A1 | A2
  : T extends (...args: infer A) => any
  ? A
  : any;

export class AsyncPool {
  private delay = 100;

  private readonly pool: (() => (...args: any) => any)[] = [];

  private isExecuting = false;

  constructor(delay: number = 100) {
    this.delay = delay;
  }

  async add<T extends (...args: any) => any>(
    func: T,
    ...params: OverloadedParameters<T>
  ) {
    this.pool.push(() => func(params));

    if (!this.isExecuting) {
      this.isExecuting = true;
      while (this.pool.length) {
        // eslint-disable-next-line no-await-in-loop
        this.pool[0]();

        this.pool.shift();
        await new Promise((resolve) => {
          setTimeout(() => resolve(null), this.delay);
        });
      }
      this.isExecuting = false;
    }
  }
}

export default new AsyncPool();
