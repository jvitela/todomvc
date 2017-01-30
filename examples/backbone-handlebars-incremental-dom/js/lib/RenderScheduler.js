/**
* Render Scheduler to re views in an animation Frame.
* ensures each render method is called only once per view.
*/
export default class RenderScheduler {
  active  = true;
  order   = 0;
  waiting = {};
  pending = [];
  frameId = null;

  /**
   * Schedule a view to be rendered, if it was scheduled before
   * the previous entry will be deleted.
   */
  addNext(key, method, args) {
    this.add(key, {
      id:     key,
      method: method,
      args:   args || [],
      order:  ++this.order
    });
  }

  addTail(key, method, args) {
    this.add(key, {
      id:     key,
      method: method,
      args:   args || []
    });
  }

  add(key, task) {
    let idx = this.waiting[key];
    // Skip if the view is already waiting to be rendered
    if (idx >= 0) { 
      this.pending[key] = task;
    } 
    else {
      // Add to the queue
      this.waiting[key] = this.pending.length;
      this.pending.push(task);
    }

    // Request an animation frame
    if (!this.frameId) {
      this.frameId = window.requestAnimationFrame(this.process.bind(this));
    }
  }

  createTask(key, method) {
    return () => {
      this.active ?
        this.addNext(key, method, arguments):
        method.apply(null, arguments);
    }
  }

  /**
   * Render all pending views
   */
  process() {
    let data;

    this.pending = this.pending.sort(function(a,b) {
      if (a.order === undefined) { return  1; }
      if (b.order === undefined) { return -1; }
      return a.order - b.order;
    });

    // console.log(' ---------- start ---------- ');
    while (this.pending.length) {
      data = this.pending.shift();
      data.args.length ? 
        data.method.apply(null, data.args):
        data.method();
      // delete this.waiting[data.id];
      this.waiting[data.id] = undefined;
    }
    // console.log(' ---------- end ---------- ');
    this.frameId = null;
  }
}