//FIXME: やっつけすぎるのであとでなおす
export var CLAUDE = {
  key: "",
  set API_KEY(key: string) {
    this.key = key;
  },
  get API_KEY() {
    return this.key
  }
}