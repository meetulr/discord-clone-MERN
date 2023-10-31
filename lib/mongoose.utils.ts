import mongoose from "mongoose";

export const transformFunction = (doc: any, ret: any, options: any) => {
  for (let prop in ret) {
    if (ret[prop] instanceof mongoose.Types.ObjectId) {
      ret[prop] = ret[prop].toString();
    } else if (typeof ret[prop] === 'object') {
      transformFunction(doc, ret[prop], options);
    }
  }
}
