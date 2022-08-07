import Proxy from './internal_proxy';

class ClientInvoker {
  instance = null;
  eventHandlers = {};
  static getInstance() {
    if (this.instance == null) {
      this.instance = new ClientInvoker();
    }
    return this.instance;
  }

  initSdk(obj) {
    // init some thing
    Proxy.initSdk(obj);
  }
  setEventHandlers(events) {
    this.eventHandlers = events;
  }
  connect(data, event) {
    Proxy.Piple().connect(data, event);
  }
  disConnect(data, event) {
    Proxy.Piple().disConnect(data, event);
  }
  showProducts(obj) {
    Proxy.Piple().showProducts(obj);
  }

  showApplications(obj) {
    Proxy.Piple().showApplications(obj);
  }

  showHistorys(obj) {
    Proxy.Piple().showHistorys(obj);
  }

  showSupport(obj) {
    Proxy.Piple().showSupport(obj);
  }

  showBalance(obj) {
    Proxy.Piple().showBalance(obj);
  }
  showProductSuggest(obj) {
    Proxy.Piple().showProductSuggest(obj);
  }
  setUser(obj) {
    Proxy.Piple().setUser(obj);
  }
  showRefund(obj) {
    Proxy.Piple().showRefund(obj);
  }

  showDetailNotification(obj) {
    return Proxy.Piple().showDetailNotification(obj);
  }

  requestLogin(routeName, params, callBack, failure) {
    Proxy.Piple().requestLogin(routeName, params, callBack, failure);
  }
}

export default ClientInvoker.getInstance();
