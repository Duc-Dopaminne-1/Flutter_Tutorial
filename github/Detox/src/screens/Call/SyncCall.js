class SyncCall {
  serial;
  callId;
  callkitId;
  callCode;
  isVideoCall;

  rejected; // nguoi dung da click reject cuoc goi
  answered; // nguoi dung da click answer cuoc goi

  endedCallkit; // da end Callkit Call cho cuoc goi nay
  endedStringeeCall; // da end Stringee Call cho cuoc goi nay

  receivedStringeeCall;

  constructor() {
    this.serial = 1;
    this.callId = '';
    this.callkitId = '';
    this.callCode = 0;

    this.rejected = false;
    this.answered = false;
    this.endedCallkit = false;
    this.endedStringeeCall = false;
    this.receivedStringeeCall = false;
  }

  // Da show callkit cho cuoc goi nay chua
  showedCallkit() {
    return this.callkitId !== '';
  }

  // Cuoc goi CallkitCall dang duoc show voi uuid nay hay khong
  showedFor(uuid) {
    return this.callkitId === uuid;
  }

  // Check xem cuoc goi voi cac thong tin nay co phai chinh la minh khong
  isThisCall(callId, serial) {
    return this.callId === callId && this.serial === serial;
  }

  // Cuoc goi da duoc end ca callkit va stringecall => co the giai phong instance
  isEnded() {
    return this.endedCallkit && this.endedStringeeCall;
  }
}

export default SyncCall;
