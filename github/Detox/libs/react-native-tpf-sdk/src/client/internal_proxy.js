class InternalProxy {
  piple = null;
  instance = null;

  static getInstance() {
    if (this.instance == null) {
      this.instance = new InternalProxy();
    }
    return this.instance;
  }

  initProxy(ref) {
    this.piple = ref;
  }

  initSdk() {
    // init some thing
  }

  Piple() {
    return this.piple;
  }
}

export default InternalProxy.getInstance();
