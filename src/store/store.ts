export class Store {
  private subscribers: Function[];
  private reducers: { [key: string]: Function };
  private state: { [key: string]: any };

  constructor(reducers = {}, initialState = {}) {
    this.subscribers = [];
    this.reducers = reducers;
    this.state = this.reduce(initialState, {});
  }

  get value() {
    return this.state;
  }

  subscribe(fn) {
    this.subscribers = [...this.subscribers, fn];
    /*
      The new subscriber needs to receive the initial state in case nothing changed for a while.
    */
    this.notify();
    //Return a function that allows you to unsubscribe the function you just subscribed
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    };
  }

  dispatch(action) {
    this.state = this.reduce(this.state, action);
    this.notify();
  }

  private notify() {
    this.subscribers.forEach(fn => fn(this.value));
  }

  private reduce(state, action) {
    const newState = {};
    for (const prop in this.reducers) {
      //reducers[prop] is a function
      newState[prop] = this.reducers[prop](
        state[prop], //Each reducer manages its own piece of state
        action
      );
    }
    return newState;
  }
}
