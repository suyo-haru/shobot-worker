import { ShobotMessage } from "./shobot/ShobotMessage";

export class ShobotMessageToHTMLTransformStream
  extends TransformStream<ShobotMessage, string> {
  constructor() {
    super({
      transform(chunk, controller) {
        switch(chunk.type) {
          case "text": 
            controller.enqueue(chunk.text + "\n");
            break;
          case "image": 
            controller.enqueue(`<img src="${chunk.url}">`);
            break;
          case "anchor": 
            controller.enqueue(`<a href="${chunk.href}">${chunk.anchorName}</a>`);
            break;
          case "push":
            controller.enqueue("<br />");
            break;
          default: 
            controller.enqueue(JSON.stringify(chunk) + "\n");
        }
      },
    });
  }
}