export default class KeyMap {
  [keyCode: string]: boolean | ((keyCode: string) => void);

  onKeyDown(keyCode: string) {
    this[keyCode] = true;
  }
  onKeyUp(keyCode: string) {
    delete this[keyCode];
  }
}
